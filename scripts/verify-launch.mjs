import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

// Start Next and Chrome --headless=new --hide-scrollbars --remote-debugging-port=9338.
// Handoffs are intercepted. No enquiry is sent to the business during this test.
const origin = process.env.LAUNCH_TEST_ORIGIN || 'http://127.0.0.1:3126';
const chrome = process.env.LAUNCH_CHROME_ORIGIN || 'http://127.0.0.1:9338';
const output = process.env.LAUNCH_QA_DIR || path.join(os.tmpdir(), 'mugran-launch-qa');
await fs.mkdir(output, { recursive: true });
const targets = await (await fetch(`${chrome}/json`)).json();
const ws = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let sequence = 0;
const pending = new Map();
const exceptions = [];
ws.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
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
async function evaluate(expression) {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function navigate(route = '/launch') {
  await call('Page.navigate', { url: `${origin}${route}` });
  for (let i = 0; i < 100; i++) {
    await wait(200);
    if (await evaluate(`document.readyState === 'complete' && !!document.querySelector('[data-figma-frame]')`)) break;
  }
  await evaluate('document.fonts.ready');
  for (let i=0;i<100;i++) {
    if (await evaluate(`document.querySelector('.lf-campaign-gallery')?.dataset.campaignState!=='static'`)) break;
    await wait(50);
  }
  await evaluate(`Promise.all([...document.images].map(image => { if(image.hasAttribute('loading')) image.loading = 'eager'; return image.decode().catch(() => {}); }))`);
  await wait(150);
}
async function screenshot(name, full = false) {
  const size = await evaluate('({ width: innerWidth, height: document.documentElement.scrollHeight })');
  const result = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full,
    ...(full ? { clip: { x: 0, y: 0, width: size.width, height: size.height, scale: 1 } } : {}) });
  await fs.writeFile(path.join(output, `${name}.png`), Buffer.from(result.data, 'base64'));
}
async function key(key, code, windowsVirtualKeyCode, text) {
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode, ...(text ? { text } : {}) });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode });
}

try {
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Page.bringToFront');
  await call('Page.navigate', { url: origin });
  await wait(300);
  await evaluate(`sessionStorage.setItem('mugran-intro','1')`);
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await navigate();
  const faq = await evaluate(`[...document.querySelectorAll('.lf-faq-row')].map(row=>({question:row.querySelector('h3').textContent,answer:row.querySelector('.lf-faq-answer p').textContent}))`);
  assert.deepEqual(faq.map(row=>row.question), [
    'How much does a landing page cost in Dubai?',
    'Can you build a landing page in 48 hours?',
    'What is included in the AED 599 Mini Product Campaign?',
    'Do I need professional product photos to get started?',
    'Will my landing page be mobile-friendly and SEO-ready?',
    'Are domain registration and website hosting included?',
    'Do I have to pay the full amount upfront?',
    'Can I order a landing page and product campaign together?',
  ]);
  const serverHTML = await (await fetch(`${origin}/launch`)).text();
  for (const row of faq) {
    const escaped = row.answer.replaceAll('&','&amp;').replaceAll("'",'&#x27;').replaceAll('"','&quot;');
    assert.ok(serverHTML.includes(escaped), `Answer is server-rendered: ${row.question}`);
  }
  assert.equal(await evaluate('document.title'), 'Landing Page Design & Product Campaigns in Dubai | Mugran Creative');
  assert.equal(await evaluate(`document.querySelector('meta[name="description"]').content`), 'Custom landing pages from AED 899 and five-image product campaigns from AED 599. Explore fast, premium creative services by Mugran Creative in Dubai.');
  assert.ok(!faq.some(row=>/AED (750|699)/.test(row.question+row.answer)));
  assert.equal(899 + 599 - 1299, 199);
  for (const width of [375, 430, 768, 1024, 1440, 1920, 2560]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 1024, deviceScaleFactor: 1, mobile: width < 768 });
    await evaluate(`window.scrollTo({ top: 0, behavior: 'instant' })`);
    await wait(180);
    const geometry = await evaluate(`({ width: innerWidth, scroll: document.documentElement.scrollWidth,
      height: document.querySelector('.launch-page').offsetHeight,
      frameTop: document.querySelector('.launch-page').getBoundingClientRect().top + scrollY,
      heading: document.querySelector('h1').getBoundingClientRect().toJSON(),
      title: document.title, canonical: document.querySelector('link[rel=canonical]').href,
      images: [...document.querySelectorAll('.launch-page img')].filter(i=>!i.closest('.lf-campaign-copy')).map(i => ({ src: i.getAttribute('src'), loaded: i.complete && i.naturalWidth > 0, w: i.getBoundingClientRect().width, h: i.getBoundingClientRect().height })),
      sections: [...document.querySelectorAll('[data-motion]')].map(e => ({name:e.dataset.motion,y:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight})) })`);
    assert.ok(geometry.scroll <= width, `No horizontal overflow at ${width}`);
    assert.ok(geometry.heading.right <= width, `Heading fits at ${width}`);
    assert.ok(geometry.images.every(image => image.loaded && image.w > 0 && image.h > 0), `Every image is loaded and has geometry at ${width}`);
    assert.equal(geometry.sections.length, 10);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.lf-kit-saving')).fontSize`), '16px');
    assert.equal(await evaluate(`document.querySelector('.lf-kit-saving').textContent`), 'Save 199 AED');
    if (width < 768) {
      assert.ok(await evaluate(`document.querySelector('.lf-statement-copy').getBoundingClientRect().top >= Math.max(...[...document.querySelectorAll('.lf-statement-product')].map(e=>e.getBoundingClientRect().bottom))`), 'Mobile product images do not obscure supporting copy');
    }
    assert.match(geometry.canonical, /\/launch$/);
    if (width === 1440) {
      const faqHeight = geometry.sections.find(section => section.name === 'faq').height;
      const comparisonHeight = await evaluate(`document.querySelector('.lf-comparison').getBoundingClientRect().height`);
      assert.ok(Math.abs(geometry.height - (8913 + faqHeight - 812 + comparisonHeight)) < 1, 'Only FAQ expansion and the comparison add frame height');
      assert.equal(geometry.heading.x, 54);
      assert.equal(geometry.heading.width, 579);
      assert.ok(Math.abs(geometry.heading.height - 118) < 1);
      assert.deepEqual(geometry.sections.slice(0,9).map((section, index) => section.y - geometry.frameTop - (index >= 5 ? comparisonHeight : 0)), [0,1024,1480,2501,3385,4406,5290,6332,7231]);
      assert.ok(Math.abs(geometry.sections[9].y - geometry.frameTop - 7231 - faqHeight - comparisonHeight) < 1, 'Final CTA follows natural FAQ height');
    }
    await screenshot(`launch-${width}`, width < 768);
    console.log(`PASS ${width}px: no overflow, heading fits, ${geometry.images.length} image instances loaded`);
  }
  // Every local static asset has nonempty source bytes; no temporary Figma URLs.
  const sources = await evaluate(`[...new Set([...document.querySelectorAll('.launch-page img')].map(i=>i.getAttribute('src')))]`);
  for (const source of sources) {
    assert.ok(source.startsWith('/images/launch/'));
    const local = await fs.stat(path.join(process.cwd(), 'public', source));
    assert.ok(local.size > 0, source);
  }
  assert.equal(await evaluate(`document.querySelectorAll('.agency-nav').length`), 1, 'Exactly one shared header');
  assert.equal(await evaluate(`document.querySelectorAll('.ms-footer').length`), 1, 'Exactly one shared footer');
  assert.equal(await evaluate(`document.querySelector('.desktop-nav a[href="/launch"]').textContent`), 'Offer');
  assert.equal(await evaluate(`document.querySelector('.desktop-nav a[href="/launch"]').getAttribute('aria-current')`), 'page');
  await evaluate(`sessionStorage.setItem('mugran-intro','1');history.pushState({},'', '/en/about')`);
  await wait(150);
  assert.ok(await evaluate(`!!document.querySelector('.agency-nav')`), 'Shared site chrome is restored when the pathname changes');
  await evaluate(`history.replaceState({},'', '/launch')`);
  await wait(150);
  assert.equal(await evaluate(`document.querySelectorAll('.agency-nav,.ms-footer').length`), 2, 'Shared chrome stays singular across navigation');

  for (const [label, expected] of [['Start My Landing Page','landing'], ['Start My Mini Campaign','campaign'], ['Get the Complete Kit','kit']]) {
    await evaluate(`{ const button=[...document.querySelectorAll('.lf-button')].find(b=>b.textContent.includes(${JSON.stringify(label)})); button.focus(); button.click(); }`);
    assert.equal(await evaluate(`document.querySelector('#launch-service').value`), expected);
    assert.equal(await evaluate(`document.activeElement.id`), 'launch-name');
    assert.equal(await evaluate(`document.querySelector('.lf-enquiry').open`), true);
    await key('Escape', 'Escape', 27);
    assert.equal(await evaluate(`document.querySelector('.lf-enquiry').open`), false);
    assert.ok(await evaluate(`document.activeElement.classList.contains('lf-button')`), 'Focus returns to triggering CTA');
  }
  await evaluate(`document.querySelector('.lf-final .lf-button').click()`);
  await evaluate(`document.querySelector('.lf-enquiry form').requestSubmit()`);
  assert.equal(await evaluate(`document.querySelectorAll('.lf-enquiry [aria-invalid=true]').length`), 3);
  await evaluate(`document.querySelector('#launch-name').value='QA Test';document.querySelector('#launch-brand').value='QA Brand';document.querySelector('#launch-contact').value='invalid';document.querySelector('.lf-enquiry form').requestSubmit()`);
  assert.equal(await evaluate(`document.querySelectorAll('.lf-enquiry [aria-invalid=true]').length`), 1);
  await evaluate(`window.__launchUrl='';window.open=url=>{window.__launchUrl=url;return null};document.querySelector('#launch-contact').value='qa@example.com';document.querySelector('.lf-enquiry form').requestSubmit()`);
  const handoff = await evaluate('window.__launchUrl');
  assert.match(handoff, /^https:\/\/wa.me\/971502675375\?text=/);
  assert.ok(decodeURIComponent(handoff).includes('Complete Launch Kit — AED 1,299'));
  assert.ok(decodeURIComponent(handoff).includes('QA Brand'));
  assert.match(await evaluate(`document.querySelector('.lf-handoff').textContent`), /blocked/);
  await evaluate(`document.querySelector('#launch-contact').value='+971 50 123 4567';window.open=url=>{window.__launchUrl=url;return {opener:null}};document.querySelector('.lf-enquiry form').requestSubmit()`);
  assert.match(await evaluate(`document.querySelector('.lf-handoff').textContent`), /not been sent/);
  for (let i = 0; i < 16; i++) {
    await key('Tab', 'Tab', 9);
    assert.equal(await evaluate(`document.querySelector('.lf-enquiry').contains(document.activeElement)`), true, 'Dialog focus is trapped');
  }
  await screenshot('enquiry-desktop');
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  assert.ok(await evaluate(`document.querySelector('.lf-enquiry').getBoundingClientRect().right <= innerWidth`));
  await screenshot('enquiry-mobile');
  await key('Escape', 'Escape', 27);
  assert.equal(await evaluate('document.body.style.overflow'), '');

  await evaluate(`document.querySelector('.lf-faq summary').focus()`);
  await key('Enter', 'Enter', 13, '\r');
  assert.equal(await evaluate(`document.querySelector('.lf-faq summary').getAttribute('aria-expanded')`), 'true');
  await key('Enter', 'Enter', 13, '\r');
  assert.equal(await evaluate(`document.querySelector('.lf-faq details').open`), false);

  // Run full motion at desktop and mobile; the completed frame must be unhidden.
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  for (const width of [1440, 390]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 1024, deviceScaleFactor: 1, mobile: width < 768 });
    await navigate();
    const initialHeight = await evaluate(`document.querySelector('.launch-page').offsetHeight`);
    for (let y = 0; y < initialHeight; y += 600) {
      await evaluate(`window.scrollTo({top:${y},behavior:'instant'})`);
      await wait(100);
    }
    await wait(2100);
    assert.equal(await evaluate(`document.querySelector('.launch-page').offsetHeight`), initialHeight, 'No animation layout shift');
    const hidden = await evaluate(`[...document.querySelectorAll('.lf-heading,.lf-service-header p,.lf-price,.lf-deliverables li,.lf-button,.lf-art,.lf-faq-row')].filter(e=>+getComputedStyle(e).opacity<.99).map(e=>e.className)`);
    assert.deepEqual(hidden, [], `All scroll animations complete at ${width}`);
    await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
    await wait(200);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('h1')).opacity`), '1');
    await screenshot(`motion-completed-${width}`, true);
    // FAQ height animation can be interrupted and still finishes in the right state.
    await evaluate(`document.querySelector('.lf-faq summary').click()`);
    await wait(500);
    assert.equal(await evaluate(`document.querySelector('.lf-faq details').open`), true);
    await evaluate(`document.querySelector('.lf-faq summary').click()`);
    await wait(500);
    assert.equal(await evaluate(`document.querySelector('.lf-faq details').open`), false);
  }

  // With scripts disabled the server-rendered page and static artwork remain visible.
  await call('Emulation.setScriptExecutionDisabled', { value: true });
  await call('Page.navigate', { url: `${origin}/launch` });
  await wait(1000);
  const dom = await call('DOM.getDocument');
  const html = await call('DOM.getOuterHTML', { nodeId: dom.root.nodeId });
  assert.ok(html.outerHTML.includes('Your next big move'));
  await screenshot('no-javascript');
  await call('Emulation.setScriptExecutionDisabled', { value: false });
  assert.deepEqual(exceptions, [], 'No browser runtime or hydration exceptions');
  console.log(`PASS: Figma geometry, local assets, service selection, validation, WhatsApp/email fallback, focus trap, Escape, keyboard FAQ, reduced motion, complete desktop/mobile animations, and no-JS content. Screenshots: ${output}`);
} finally {
  await call('Emulation.setScriptExecutionDisabled', { value: false });
  ws.close();
}
