document.addEventListener('DOMContentLoaded', displayFavorites);

function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length > 0) {
        favoritesList.innerHTML = "";
        favorites.forEach(movie => {
            let favoriteItem = document.createElement('div');
            favoriteItem.dataset.id = movie.imdbID;
            favoriteItem.classList.add('favorites-item');

            favoriteItem.innerHTML = `
                <h3>${movie.title}</h3>
                <button class="remove-from-favorites-btn" onclick="removeFromFavorites('${movie.imdbID}')">Remove from Favorites</button>
            `;
            favoritesList.appendChild(favoriteItem);
        });
    } else {
        favoritesList.innerHTML = "<p>No favorites yet.</p>";
    }
}

function removeFromFavorites(imdbID) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}
