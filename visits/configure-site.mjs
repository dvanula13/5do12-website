import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const input = process.argv[2];
const site = resolve(import.meta.dirname, '..');
const endpoint = input ? new URL(input) : null;
if (endpoint && (endpoint.protocol !== 'https:' || !endpoint.hostname.endsWith('.workers.dev') || endpoint.port || endpoint.pathname !== '/' || endpoint.search || endpoint.hash || endpoint.username || endpoint.password)) {
  throw new Error('Use the HTTPS root URL of the deployed Cloudflare Worker.');
}

const text = {
  en: ['Traffic', 'Owner key', 'Show stats', 'Total page opens', 'Today (UTC)', 'Last 30 days', 'Countries', 'Devices', 'Comic Con QR opens'],
  de: ['Besucherstatistik', 'Zugangsschlüssel', 'Statistik anzeigen', 'Seitenaufrufe insgesamt', 'Heute (UTC)', 'Letzte 30 Tage', 'Länder', 'Geräte', 'Comic-Con-QR-Aufrufe'],
};

function footerPanel(language) {
  const [label, owner, button, total, today, period, countries, devices, qr] = text[language];
  return `<details class="visit-counter" id="traffic" data-visit-counter hidden>
  <summary>${label}</summary>
  <div class="visit-counter-panel">
    <form autocomplete="off">
      <label>${owner}<input type="password" required minlength="32" maxlength="128" autocomplete="off" spellcheck="false"></label>
      <button type="submit">${button}</button>
    </form>
    <p role="status"></p>
    <div data-visit-results hidden>
      <dl><div><dt>${total}</dt><dd data-visit-total></dd></div><div><dt>${today}</dt><dd data-visit-today></dd></div><div hidden><dt>${qr}</dt><dd data-qr-total></dd></div></dl>
      <h3>${period}</h3>
      <div class="visit-counter-breakdown">
        <section aria-label="${countries}"><h3>${countries}</h3><ul data-visit-countries role="list"></ul></section>
        <section aria-label="${devices}"><h3>${devices}</h3><ul data-visit-devices role="list"></ul></section>
      </div>
    </div>
  </div>
</details>`;
}

for (const page of ['index.html', 'de.html', 'services/index.html', 'contact/index.html', 'contact/de.html', 'games/index.html']) {
  const path = resolve(site, page);
  const rootPage = !page.includes('/');
  const base = rootPage ? '' : '../';
  const language = page === 'de.html' ? 'de' : 'en';
  let html = readFileSync(path, 'utf8');
  const script = (src = `${base}assets/visit-counter.js`) => `<script src="${src}" data-endpoint="${endpoint?.origin ?? ''}" defer></script>`;
  if (html.includes('assets/visit-counter.js')) {
    html = html.replace(/<script src="([^"\n]*assets\/visit-counter\.js(?:\?[^"\n]*)?)"[^\n]*<\/script>/, (_, src) => script(src));
  } else {
    const css = rootPage ? '<link rel="stylesheet" href="assets/visit-counter.css">\n  ' : '';
    html = html.replace('</head>', `  ${css}${script()}\n</head>`);
  }
  if (rootPage && !html.includes('data-visit-counter')) {
    html = html.replace('<div class="footer-bottom">', `${footerPanel(language)}<div class="footer-bottom">`);
  }
  html = html.replace(/connect-src (?:'none'|https:\/\/[a-z0-9.-]+\.workers\.dev);/g, `connect-src ${endpoint?.origin ?? "'none'"};`);
  writeFileSync(path, html);
}
