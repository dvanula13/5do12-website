(() => {
  const service = document.querySelector("#contact-service");
  const subject = document.querySelector('input[name="_subject"]');
  const offer = new URLSearchParams(window.location.search).get("service");
  const selected = [...service.options].find(option => option.dataset.offer && option.dataset.offer === offer);
  if (selected) {
    service.value = selected.value;
    const languageLink = document.querySelector("[data-contact-language]");
    if (languageLink) {
      const alternate = new URL(languageLink.href);
      alternate.searchParams.set("service", offer);
      languageLink.href = alternate.href;
    }
  }

  function updateSubject() {
    subject.value = `5do12 project enquiry: ${service.value}`;
  }

  service.addEventListener("change", updateSubject);
  updateSubject();
})();
