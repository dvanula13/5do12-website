(() => {
  const { href, search, hash } = window.location;
  const homepage = new URL('./', href);
  homepage.search = search;
  homepage.hash = hash;
  window.location.replace(homepage);
})();
