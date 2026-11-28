(() => {
  const endpoint = document.currentScript.dataset.endpoint;
  const counter = document.querySelector('[data-visit-counter]');
  if (!endpoint) return;

  function recordOpen() {
    fetch(`${endpoint}/view`, {
      method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true,
    }).catch(() => {});
  }

  if (document.prerendering) document.addEventListener('prerenderingchange', recordOpen, { once: true });
  else recordOpen();
  if (!counter) return;

  const language = document.documentElement.lang || 'en';
  const german = language === 'de';
  const number = new Intl.NumberFormat(language);
  const countries = new Intl.DisplayNames([language], { type: 'region' });
  const devices = german
    ? { phone: 'Smartphone', tablet: 'Tablet', computer: 'Computer', other: 'Sonstige' }
    : { phone: 'Phone', tablet: 'Tablet', computer: 'Computer', other: 'Other' };
  const form = counter.querySelector('form');
  const key = form.querySelector('input');
  const button = form.querySelector('button');
  const status = counter.querySelector('[role="status"]');
  const result = counter.querySelector('[data-visit-results]');
  const qrCount = result.querySelector('[data-qr-total]');
  let request;

  function loadStats(path, ownerKey, signal) {
    return fetch(`${endpoint}${path}`, {
      credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
      headers: { Authorization: `Bearer ${ownerKey}` },
      signal,
    });
  }

  async function showQrCount(ownerKey, signal) {
    if (!qrCount) return;
    try {
      const response = await loadStats('/qr/comic-con/stats', ownerKey, signal);
      if (!response.ok) return;
      const { total } = await response.json();
      if (signal.aborted || !Number.isSafeInteger(total) || total < 0) return;
      qrCount.textContent = number.format(total);
      qrCount.parentElement.hidden = false;
    } catch {
      // The page-open totals remain available if the QR request fails.
    }
  }

  function showBreakdown(selector, rows, name) {
    const list = result.querySelector(selector);
    list.replaceChildren(...rows.map(row => {
      const item = document.createElement('li');
      const label = document.createElement('span');
      const count = document.createElement('span');
      label.textContent = name(row.label);
      count.textContent = number.format(row.opens);
      item.append(label, count);
      return item;
    }));
    if (!rows.length) {
      const item = document.createElement('li');
      item.textContent = german ? 'Noch keine Aufrufe' : 'No opens yet';
      list.append(item);
    }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const ownerKey = key.value.trim();
    key.value = '';
    result.hidden = true;
    if (qrCount) {
      qrCount.textContent = '';
      qrCount.parentElement.hidden = true;
    }
    button.disabled = true;
    status.textContent = german ? 'Statistik wird geladen …' : 'Loading stats…';
    request?.abort();
    const currentRequest = new AbortController();
    request = currentRequest;

    try {
      const response = await loadStats('/stats', ownerKey, currentRequest.signal);
      if (currentRequest.signal.aborted) return;
      if (response.status === 401) {
        status.textContent = german ? 'Der Zugangsschlüssel ist ungültig.' : 'The owner key is incorrect.';
        return;
      }
      if (!response.ok) throw new Error('Stats unavailable');
      const data = await response.json();
      if (currentRequest.signal.aborted) return;
      result.querySelector('[data-visit-total]').textContent = number.format(data.total);
      result.querySelector('[data-visit-today]').textContent = number.format(data.today);
      showBreakdown('[data-visit-countries]', data.countries, code => code === 'unknown' ? (german ? 'Unbekannt' : 'Unknown') : countries.of(code));
      showBreakdown('[data-visit-devices]', data.devices, device => devices[device]);
      result.hidden = false;
      status.textContent = german ? 'Statistik geladen.' : 'Stats loaded.';
      await showQrCount(ownerKey, currentRequest.signal);
    } catch {
      if (!currentRequest.signal.aborted) status.textContent = german ? 'Statistik gerade nicht verfügbar.' : 'Stats are temporarily unavailable.';
    } finally {
      if (request === currentRequest) {
        request = undefined;
        button.disabled = false;
      }
    }
  });

  counter.addEventListener('toggle', () => {
    if (!counter.open) {
      request?.abort();
      key.value = '';
      status.textContent = '';
      result.hidden = true;
    }
  });
  counter.hidden = false;
})();
