/* Optional browser QA: install Playwright externally; no production dependency. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.ISM_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (file !== root && !file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    res.setHeader('Content-Type', { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' }[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, ...(process.env.ISM_BROWSER_CHANNEL ? { channel: process.env.ISM_BROWSER_CHANNEL } : {}) });
  try {
    for (const width of [320, 360, 375, 390, 412, 430, 768, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base);
      await page.waitForFunction(() => window.ISMRealBusiness && window.ISMMyEnglish && window.ISMSpeaking);
      for (const panel of ['home', 'journey', 'practice', 'simulate', 'toolkit', 'premium']) {
        await page.evaluate(panel => { setNav(panel); show(panel); }, panel);
        const overflow = await page.evaluate(() => [...document.querySelectorAll('.panel.on *, .bottom *')].filter(el => {
          if (!el.getClientRects().length || el.closest('.coach-goals')) return false;
          const r = el.getBoundingClientRect();
          return r.left < -1 || r.right > innerWidth + 1;
        }).map(el => el.className));
        assert.deepEqual(overflow, [], `${width}px ${panel} overflow`);
      }
      await page.evaluate(() => { setNav('practice'); show('practice'); ISMRealBusiness.mount(); });
      await page.locator('.rb-question button').nth(1).click();
      await page.waitForTimeout(250);
      assert(await page.evaluate(() => window.state.realBusiness[0].ok));
      await page.reload();
      assert(await page.evaluate(() => window.state.realBusiness[0].ok), 'saved evidence after reload');
      await page.waitForFunction(() => window.ISMMyEnglish && window.ISMSpeaking);
      await page.evaluate(() => { setNav('practice'); show('practice'); ISMSpeaking.render('Professional recommendation'); });
      await page.evaluate(() => { setNav('toolkit'); show('toolkit'); ISMMyEnglish.open('mistakes'); });
      const titleClear = await page.evaluate(() => {
        const title = document.querySelector('.mbe-sheet h2').getBoundingClientRect();
        const close = document.querySelector('.mbe-close').getBoundingClientRect();
        const style = getComputedStyle(document.querySelector('.mbe-sheet h2'));
        return title.right - parseFloat(style.paddingRight) <= close.left;
      });
      assert(titleClear, 'modal heading leaves room for close button');
      await page.locator('.mbe-close').click();
      assert.equal(await page.locator('.mbe-detail.on').count(), 0);
      assert.deepEqual(errors, [], 'uncaught browser exceptions');
      console.log(`PASS ${width}px: six panels, overflow, state persistence, Speaking, modal`);
      await context.close();
    }
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
