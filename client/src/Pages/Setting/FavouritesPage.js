function FavouritesPage() {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const favouritesContent = document.createElement('div');
    favouritesContent.className = 'favourites-container';
    const favouritesTitle = document.createElement('p');
    favouritesTitle.className = 'favourites-title';
    favouritesTitle.textContent = 'Favourites';
    favouritesContent.appendChild(favouritesTitle);
    content.appendChild(favouritesContent);
}
export default FavouritesPage;