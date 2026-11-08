import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

// Browser integration checks, including two real 26-second campaign cycles.
// Run with the same Next and Chrome instances as verify-launch.mjs.
const origin = process.env.LAUNCH_TEST_ORIGIN || 'http://127.0.0.1:3126';
const chrome = process.env.LAUNCH_CHROME_ORIGIN || 'http://127.0.0.1:9338';
const output = path.join(os.tmpdir(), 'mugran-launch-qa');
const cycles = Number(process.env.LAUNCH_LOOP_CYCLES ?? 2);
assert.ok(Number.isInteger(cycles) && cycles >= 0 && cycles <= 5);
await fs.mkdir(output, { recursive: true });
const tabs = await (await fetch(`${chrome}/json`)).json();
const target = tabs.find(tab => tab.type === 'page');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let sequence = 0;
const pending = new Map();
const errors = [];
ws.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(arg => arg.value || arg.description).join(' '));
  if (!message.id) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  message.error ? request.reject(message.error) : request.resolve(message.result);
};
const call = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});
async function run(expression) {
  const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(expression, timeout = 12000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await run(expression)) return;
    await wait(100);
  }
  throw new Error(`Timed out: ${expression}`);
}
async function load(width, reduced = false) {
  await call('Emulation.setDeviceMetricsOverride', { width, height: 1024, deviceScaleFactor: 1, mobile: width < 768 });
  await call('Emulation.setTouchEmulationEnabled', { enabled: width < 768 });
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] });
  await call('Page.navigate', { url: `${origin}/launch` });
  await until(`document.readyState==='complete' && !!document.querySelector('.lf-campaign-gallery')`, 25000);
  await run('document.fonts.ready');
  await until(`document.querySelector('.lf-campaign-gallery').dataset.campaignState!=='static'`);
  await run(`Promise.all([...document.querySelectorAll('.launch-page img')].map(i=>{if(i.hasAttribute('loading'))i.loading='eager';return i.decode().catch(()=>{})}))`);
  await run(`scrollTo({top:0,behavior:'instant'})`);
  await wait(200);
}
async function scrollCampaign(fraction) {
  await run(`{ const section=document.querySelector('.lf-campaign-showcase'); const top=section.getBoundingClientRect().top+scrollY; const start=top-innerHeight*.45; const end=top-innerHeight*.08; scrollTo({top:start+(end-start)*${fraction},behavior:'instant'}); }`);
}
async function shot(name) {
  const result = await call('Page.captureScreenshot', { format: 'png' });
  await fs.writeFile(path.join(output, `${name}.png`), Buffer.from(result.data, 'base64'));
}
const sample = () => run(`({state:document.querySelector('.lf-campaign-gallery').dataset.campaignState,cycles:Number(document.querySelector('.lf-campaign-gallery').dataset.loopCycles||0),
  left:document.querySelector('.lf-campaign-window').getBoundingClientRect().left,right:document.querySelector('.lf-campaign-window').getBoundingClientRect().right,
  items:[...document.querySelectorAll('.lf-campaign-slot')].map(e=>{const r=e.querySelector('.lf-campaign-mask').getBoundingClientRect();return {index:e.dataset.campaignIndex,x:r.left,right:r.right,y:r.top,w:r.width}})})`);

try {
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Page.bringToFront');
  await call('Page.addScriptToEvaluateOnNewDocument', { source: `sessionStorage.setItem('mugran-intro','1');history.scrollRestoration='manual';` });
  await load(1440, true);
  assert.equal(await run(`document.querySelectorAll('.desktop-nav a[href="/launch"]').length`), 1);
  assert.equal(await run(`document.querySelector('.ms-footer').compareDocumentPosition(document.querySelector('.lf-final')) & Node.DOCUMENT_POSITION_PRECEDING`), 2);
  await run(`document.querySelector('.nav-project').click()`);
  assert.equal(await run(`document.querySelector('.lf-enquiry').open`), true, 'Shared navbar opens the real launch enquiry');
  await run(`document.querySelector('.lf-dialog-close').click()`);
  const baseline = await run(`[...document.querySelectorAll('.lf-campaign-visual')].map(e=>({x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight}))`);
  assert.deepEqual(baseline, [{x:0,y:235,w:240,h:240},{x:275,y:315,w:240,h:240},{x:549,y:355,w:240,h:240},{x:824,y:315,w:240,h:240},{x:1099,y:235,w:240,h:240}]);
  assert.ok(await run(`[...document.querySelectorAll('.lf-campaign-copy')].every(e=>e.hidden&&e.getAttribute('aria-hidden')==='true'&&!e.querySelector('a,button,[tabindex]'))`));

  await load(390, true);
  await run(`document.querySelector('.mobile-menu').click()`);
  assert.equal(await run(`document.querySelectorAll('.agency-drawer a[href="/launch"]').length`), 1);
  assert.equal(await run(`document.querySelector('.agency-drawer a[href="/launch"]').getAttribute('aria-current')`), 'page');
  await run(`document.querySelector('.agency-drawer a[href="/launch"]').click()`);
  await wait(400);
  assert.equal(await run('location.pathname'), '/launch');
  assert.equal(await run(`document.querySelector('.mobile-menu').getAttribute('aria-expanded')`), 'false');
  console.log('PASS shared navbar/footer, desktop/mobile Offer and enquiry integration; original reduced-motion gallery geometry');

  await load(1440);
  await scrollCampaign(0);
  await wait(650);
  const startY = await run(`new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.lf-campaign-source')).transform).m42`);
  assert.ok(startY < -115, `Source enters from above: ${startY}`);
  await scrollCampaign(.5);
  await wait(650);
  const middleY = await run(`new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.lf-campaign-source')).transform).m42`);
  assert.ok(middleY > startY + 35 && middleY < -25, 'Product descent follows scroll progress');
  await scrollCampaign(1.02);
  await until(`document.querySelector('.lf-campaign-gallery').dataset.campaignState==='running'`);
  assert.ok(Math.abs(await run(`new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.lf-campaign-source')).transform).m42`)) < 1);
  await shot('campaign-loop-desktop');

  const hoverPoint = await run(`{const r=document.querySelector('.lf-campaign-visual-two .lf-campaign-mask').getBoundingClientRect();({x:r.left+r.width/2,y:r.top+r.height/2})}`);
  await call('Input.dispatchMouseEvent', { type: 'mouseMoved', ...hoverPoint });
  await wait(650);
  assert.equal((await sample()).state, 'paused');
  const scale = await run(`new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.lf-campaign-visual-two img')).transform).a`);
  assert.ok(scale >= 1.025 && scale <= 1.041, `Image hover scale ${scale}`);
  const paused = await sample();
  await wait(350);
  assert.ok(Math.abs((await sample()).items[0].x - paused.items[0].x) < .1, 'Hover stops the loop');
  await call('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5 });
  await wait(850);
  assert.equal((await sample()).state, 'running');
  assert.ok(Math.abs((await sample()).items[0].x - paused.items[0].x) > 2, 'Pointer leave resumes without resetting');

  await run(`scrollTo({top:0,behavior:'instant'})`);
  await wait(250);
  const away = await sample();
  assert.equal(away.state, 'paused');
  await wait(350);
  assert.equal((await sample()).items[0].x, away.items[0].x, 'Offscreen loop does no work');
  await scrollCampaign(1.02);
  await wait(750);
  assert.equal((await sample()).state, 'running');

  const other = await call('Target.createTarget', { url: 'about:blank' });
  await call('Target.activateTarget', { targetId: other.targetId });
  await wait(250);
  assert.equal(await run('document.hidden'), true, 'Original tab became hidden');
  assert.equal((await sample()).state, 'paused');
  await call('Page.bringToFront');
  await call('Target.closeTarget', { targetId: other.targetId });
  await wait(750);
  assert.equal((await sample()).state, 'running');
  console.log('PASS scrubbed product arrival, staged gallery reveal, hover emphasis/pause/resume, offscreen and hidden-tab pausing');

  let previous = await sample();
  const goal = previous.cycles + cycles;
  const started = Date.now();
  let samples = 0;
  while (previous.cycles < goal && Date.now() - started < (cycles * 28000 + 6000)) {
    await wait(120);
    const current = await sample();
    const visible = current.items.filter(item => item.right > current.left + 1 && item.x < current.right - 1).sort((a,b)=>a.x-b.x);
    const intervals = visible.map(item => [Math.max(item.x,current.left),Math.min(item.right,current.right)]);
    assert.ok(intervals[0][0] - current.left < 37, 'No empty leading edge');
    assert.ok(current.right - intervals[intervals.length-1][1] < 37, 'No empty trailing edge');
    for (let i=1;i<intervals.length;i++) assert.ok(intervals[i][0]-intervals[i-1][1]<37, 'Original image spacing remains continuous');
    for (const item of visible) {
      if (item.x > current.right - 30) continue;
      const matches = previous.items.filter(old => old.index===item.index && old.right>previous.left-30 && old.x<previous.right+30);
      assert.ok(matches.some(old=>Math.abs(old.x-item.x)<30), 'No visible jump across a wrap boundary');
    }
    samples++;
    if (current.cycles > previous.cycles) console.log(`PASS seamless campaign cycle ${current.cycles}`);
    previous = current;
  }
  assert.ok(previous.cycles >= goal, `${cycles} complete real-time cycles`);
  await shot('campaign-after-two-cycles');
  console.log(cycles ? `PASS ${samples} loop continuity samples across ${cycles} cycles` : 'SKIP continuity sampling (LAUNCH_LOOP_CYCLES=0)');

  async function hoverArea(selector, layer, scale = false) {
    await run(`{const e=document.querySelector('${selector}');scrollTo({top:e.getBoundingClientRect().top+scrollY-250,behavior:'instant'})}`);
    await wait(1000);
    const point = await run(`{const r=document.querySelector('${selector}').getBoundingClientRect();({x:r.left+r.width*.72,y:r.top+r.height*.3})}`);
    await call('Input.dispatchMouseEvent', {type:'mouseMoved',...point});
    await wait(750);
    const matrix = await run(`{const m=new DOMMatrixReadOnly(getComputedStyle(document.querySelector('${layer}')).transform);({a:m.a,x:m.m13,y:m.m23})}`);
    if (scale) assert.ok(matrix.a>1.02&&matrix.a<1.04, 'Portfolio image has restrained scale');
    else assert.ok(Math.abs(matrix.x)>.001&&Math.abs(matrix.x)<.035, 'Laptop depth stays below two degrees');
    await call('Input.dispatchMouseEvent', {type:'mouseMoved',x:5,y:5});
    await wait(750);
    assert.ok(await run(`{const m=new DOMMatrixReadOnly(getComputedStyle(document.querySelector('${layer}')).transform);Math.abs(m.a-1)<.0001&&Math.abs(m.m13)<.0001&&Math.abs(m.m23)<.0001}`), 'Hover returns to original orientation');
  }
  await hoverArea('.lf-laptop-position','.lf-laptop-depth');
  await hoverArea('.lf-work-fragrance','.lf-work-fragrance img',true);
  await hoverArea('.lf-kit-art','.lf-kit-depth');
  await scrollCampaign(1.02);
  await wait(500);
  await run(`window.__oldCampaign=document.querySelector('.lf-campaign-loop');document.querySelector('.desktop-nav a[href="/en/contact"]').click()`);
  await until(`location.pathname==='/en/contact'&&!document.querySelector('.launch-page')`,25000);
  const oldStyle = await run(`window.__oldCampaign.style.transform`);
  await run(`document.dispatchEvent(new Event('visibilitychange'))`);
  await wait(350);
  assert.equal(await run(`window.__oldCampaign.style.transform`),oldStyle,'Unmounted loop stays stopped after visibility events');
  await run(`delete window.__oldCampaign;document.querySelector('.desktop-nav a[href="/launch"]').click()`);
  await until(`location.pathname==='/launch'&&!!document.querySelector('.launch-page')`,25000);
  assert.equal(await run(`document.querySelectorAll('.agency-nav').length`),1);
  console.log('PASS laptop/bundle depth, portfolio hover recovery and live route cleanup');

  await load(390);
  await scrollCampaign(1.02);
  await until(`document.querySelector('.lf-campaign-gallery').dataset.campaignState==='running'`);
  const mobile = await sample();
  await wait(1000);
  assert.ok(Math.abs((await sample()).items[0].x-mobile.items[0].x)>2, 'Mobile gallery loops');
  assert.ok(await run(`document.documentElement.scrollWidth<=innerWidth`), 'No mobile overflow during motion');
  await shot('campaign-loop-mobile');
  await call('Emulation.setEmulatedMedia', { features: [{ name:'prefers-reduced-motion',value:'reduce' }] });
  await wait(300);
  assert.equal((await sample()).state, 'reduced');
  assert.ok(await run(`[...document.querySelectorAll('.lf-campaign-copy')].every(e=>e.hidden)`));
  assert.ok(await run(`[...document.querySelectorAll('.lf-campaign-loop')].every(e=>getComputedStyle(e).transform==='none')`), 'Reduced motion restores the static composition');
  assert.deepEqual(errors.map(error=>error.split('\n').slice(0,2).join(' ')), [], 'No console or runtime errors');
  console.log('PASS mobile loop, reduced-motion reset, navigation and runtime checks');
} finally {
  ws.close();
}
