const finder = document.querySelector('.game-finder');
const search = document.querySelector('#game-search');
const status = document.querySelector('.game-results');
const sections = Array.from(document.querySelectorAll('.game-category'), section => ({
  section,
  cards: Array.from(section.querySelectorAll('.games a'), link => ({
    link,
    text: Array.from(link.querySelectorAll('.t, .d'), item => item.textContent).join(' ').toLowerCase()
  }))
}));

function filterGames() {
  const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let count = 0;
  for (const { section, cards } of sections) {
    let visible = 0;
    for (const { link, text } of cards) {
      const match = words.every(word => text.includes(word));
      link.hidden = !match;
      visible += Number(match);
    }
    section.hidden = visible === 0;
    count += visible;
  }
  status.textContent = words.length ? (count ? `${count} ${count === 1 ? 'game' : 'games'} found` : 'No games found.') : '';
}

finder.hidden = false;
search.addEventListener('input', filterGames);
window.addEventListener('pageshow', filterGames);
filterGames();
