const searchBtn = document.getElementById('open-search');
const searchBar = document.getElementById('search-bar');

if (searchBtn && searchBar) {
  searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('d-none');
  });
}