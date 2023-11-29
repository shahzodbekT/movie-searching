const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const overlay = document.querySelector('.overlay')

// Загрузка фильмов из API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
  const res = await fetch(URL);
  const data = await res.json();
  if (data.Response === "True") {
    displayMovieList(data.Search);
  }
}

// Получение фильмов при вводе текста в поле поиска
movieSearchBox.addEventListener('input', debounce(findMovies, 300));

overlay.addEventListener('click', closeOverlay)

function debounce(func, delay) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  } else {
    searchList.classList.add('hide-search-list');
  }
}

// Отображение списка фильмов
function displayMovieList(movies) {
  searchList.innerHTML = "";
  movies.forEach(movie => {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movie.imdbID;
    movieListItem.classList.add('search-list-item');
    
    let moviePoster = movie.Poster !== "N/A" ? movie.Poster : "image_not_found.png";

    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
        <img src="${moviePoster}">
      </div>
      <div class="search-item-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
      <button class="add-to-favorites-btn" onclick="addToFavorites('${movie.imdbID}', '${movie.Title}')">Add to Favorites</button>
    `;
    searchList.appendChild(movieListItem);
  });
  loadMovieDetails();
}

// Загрузка деталей фильма
async function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll('.search-list-item');
  searchListMovies.forEach(movie => {
    movie.addEventListener('click', async () => {
      overlay.classList.remove('hidden')
      movieSearchBox.value = "";
      const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

// Отображение деталей фильма
function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class="movie-poster">
      <img src="${details.Poster !== "N/A" ? details.Poster : "image_not_found.png"}" alt="Movie Poster">
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${details.Title}</h3>
      <ul class="movie-misc-info">
        <li class="year">Year: ${details.Year}</li>
        <li class="rated">Ratings: ${details.Rated}</li>
        <li class="released">Released: ${details.Released}</li>
      </ul>
      <p class="genre"><b>Genre:</b> ${details.Genre}</p>
      <p class="writer"><b>Writer:</b> ${details.Writer}</p>
      <p class="actors"><b>Actors:</b> ${details.Actors}</p>
      <p class="plot"><b>Plot:</b> ${details.Plot}</p>
      <p class="language"><b>Language:</b> ${details.Language}</p>
      <p class="awards"><b>Awards:</b> ${details.Awards}</p>
      <button id="close-modal-btn" onclick="closeOverlay()">Close</button>
      <button class="add-to-favorites-btn" onclick="addToFavorites('${details.imdbID}', '${details.Title}')">Add to Favorites</button>
    </div>
  `;
}

// Добавление фильма в избранное
function addToFavorites(imdbID, title) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    if (!favorites.some(movie => movie.imdbID === imdbID)) {
        favorites.push({ imdbID, title });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${title} added to Favorites!`);
    } else {
        alert(`${title} is already in Favorites!`);
    }
}

function closeOverlay() {
    overlay.classList.add('hidden')
}
