const searchIcon = document.querySelector('.bi-search');
const searchBar = document.getElementById('search-bar');

if (searchIcon && searchBar) {
  searchIcon.addEventListener('click', (e) => {
    e.preventDefault(); // evita que pugi amunt per l'anchor
    searchBar.classList.toggle('d-none');
  });
}