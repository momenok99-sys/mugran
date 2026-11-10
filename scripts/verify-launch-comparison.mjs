import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const output = path.join(os.tmpdir(), 'mugran-launch-qa');
await fs.mkdir(output, { recursive: true });
const tabs = await (await fetch('http://127.0.0.1:9338/json')).json();
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  message.error ? request.reject(message.error) : request.resolve(message.result);
};
const call = (method, params = {}) => new Promise((resolve, reject) => {
  pending.set(++id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  await call('Page.enable');
  if (process.argv.includes('--render-icon')) {
    await call('Emulation.setDeviceMetricsOverride', { width: 180, height: 180, deviceScaleFactor: 1, mobile: false });
    await call('Page.navigate', { url: 'http://127.0.0.1:3126/icon.svg' });
    await wait(700);
    await evaluate(`document.documentElement.style.cssText='width:170px;height:180px;display:block;margin:0 auto'`);
    const shot = await call('Page.captureScreenshot', { format: 'png' });
    await fs.writeFile('app/apple-icon.png', Buffer.from(shot.data, 'base64'));
    console.log('Rendered authentic SVG as Apple icon');
  } else {
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await call('Page.navigate', { url: 'http://127.0.0.1:3126/launch' });
    await wait(1800);
    await evaluate(`Promise.all([...document.images].map(image => {image.loading='eager';return image.decode().catch(()=>{});} ))`);
    assert.equal(await evaluate(`document.querySelector('[role=slider]').getAttribute('aria-valuenow')`), '50');
    assert.ok(await evaluate(`document.querySelector('.lf-comparison').previousElementSibling.classList.contains('lf-campaign-showcase') && document.querySelector('.lf-comparison').nextElementSibling.classList.contains('lf-campaign-pricing')`));
    for (const width of [375, 430, 768, 1024, 1440, 1920, 2560]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 768 });
      await wait(100);
      const geometry = await evaluate(`(() => {const r=s=>document.querySelector(s).getBoundingClientRect().toJSON();return {faq:r('.lf-faq'),final:r('.lf-final'),content:r('.lf-faq-layout'),slider:r('[role=slider]'),overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.querySelectorAll('.lf-comparison-layer img')].map(i=>r('.'+i.parentElement.className.split(' ').at(-1)))}})()`);
      assert.equal(geometry.overflow, false);
      assert.ok(Math.abs(geometry.faq.width - width) < 1);
      assert.ok(Math.abs(geometry.final.width - width) < 1);
      assert.ok(Math.abs(geometry.faq.x) < 1);
      assert.equal(geometry.images[0].width, geometry.images[1].width);
      await evaluate(`document.querySelector('[role=slider]').scrollIntoView({block:'center'});document.querySelector('[role=slider]').focus({preventScroll:true})`);
      await wait(150);
      const rect = await evaluate(`document.querySelector('[role=slider]').getBoundingClientRect().toJSON()`);
      await call('Input.dispatchMouseEvent', { type: 'mousePressed', x: rect.x + rect.width * .5, y: 500, button: 'left', clickCount: 1 });
      await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: rect.x + rect.width * .7, y: 500, button: 'left', buttons: 1 });
      await wait(60);
      await call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: rect.x + rect.width * .7, y: 500, button: 'left', clickCount: 1 });
      assert.equal(await evaluate(`document.querySelector('[role=slider]').getAttribute('aria-valuenow')`), '70');
      await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 });
      assert.equal(await evaluate(`document.querySelector('[role=slider]').getAttribute('aria-valuenow')`), '69');
      if (width < 768) {
        await call('Emulation.setTouchEmulationEnabled', { enabled: true });
        await call('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: rect.x + rect.width * .5, y: 500 }] });
        await call('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: rect.x + rect.width * .3, y: 500 }] });
        await wait(60);
        await call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        assert.equal(await evaluate(`document.querySelector('[role=slider]').getAttribute('aria-valuenow')`), '30');
        await call('Emulation.setTouchEmulationEnabled', { enabled: false });
      }
      const shot = await call('Page.captureScreenshot', { format: 'png' });
      await fs.writeFile(path.join(output, `comparison-${width}.png`), Buffer.from(shot.data, 'base64'));
      if (width === 2560) {
        await evaluate(`document.querySelector('.lf-final').scrollIntoView({block:'end'})`);
        await wait(150);
        const final = await call('Page.captureScreenshot', { format: 'png' });
        await fs.writeFile(path.join(output, 'full-bleed-2560.png'), Buffer.from(final.data, 'base64'));
      }
      console.log(`PASS ${width}: full bleed, no overflow, aligned layers, mouse and keyboard${width < 768 ? ', touch' : ''}`);
    }
    assert.ok(await evaluate(`!!document.querySelector('link[rel=icon][type="image/svg+xml"]')`));
  }
} finally { ws.close(); }
