(() => {
  const tools = document.querySelector("#catalog-tools");
  const search = document.querySelector("#offer-search");
  const category = document.querySelector("#offer-category");
  const clear = document.querySelector("#clear-filters");
  const status = document.querySelector("#offer-count");
  const empty = document.querySelector("#no-offers");
  const groups = [...document.querySelectorAll("[data-category]")].map(section => ({
    section,
    offers: [...section.querySelectorAll("[data-entry]")].map(card => ({
      card,
      text: `${card.textContent} ${card.dataset.keywords} ${section.querySelector("h2").textContent}`.toLowerCase(),
    })),
  }));

  function filter() {
    const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const { section, offers } of groups) {
      const allowedCategory = !category.value || category.value === section.dataset.category;
      let sectionVisible = 0;
      for (const { card, text } of offers) {
        const matches = allowedCategory && terms.every(term => text.includes(term));
        card.hidden = !matches;
        if (matches) sectionVisible += 1;
      }
      section.hidden = sectionVisible === 0;
      visible += sectionVisible;
    }
    status.textContent = `${visible} ${visible === 1 ? "offer" : "offers"}`;
    empty.hidden = visible !== 0;
    clear.hidden = !search.value && !category.value;
  }

  search.addEventListener("input", filter);
  category.addEventListener("change", filter);
  clear.addEventListener("click", () => {
    search.value = "";
    category.value = "";
    filter();
    search.focus();
  });
  filter();
  tools.hidden = false;
})();
