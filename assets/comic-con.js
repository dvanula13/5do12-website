(() => {
  const start = Date.parse('2026-11-28T00:00:00+01:00');
  const end = Date.parse('2026-12-01T00:00:00+01:00');
  const theme = 'comic-con-theme';

  function updateTheme() {
    const now = Date.now();
    document.documentElement.classList.toggle(theme, now >= start && now < end);
  }

  updateTheme();

  const remaining = end - Date.now();
  if (remaining > 0 && Date.now() >= start) {
    window.setTimeout(updateTheme, remaining);
  }
  window.addEventListener('pageshow', updateTheme);
})();
