// TMDb API config
const API_KEY = 'e35d5ee09e0335bc5dcc28e11151dc33'; // <-- Replace with your TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const searchInput = document.getElementById('movie-search-input');
const searchBtn = document.getElementById('search-btn');
const moviesGrid = document.getElementById('movies-grid');
const loadingIndicator = document.getElementById('loading-indicator');
const noResults = document.getElementById('no-results');
const sortSelect = document.getElementById('sort-select');

// THEME TOGGLER
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;

function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const isLight = body.classList.contains('light-theme');
    setTheme(isLight ? 'dark' : 'light');
}

// Load theme from localStorage
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
})();

themeToggleBtn.addEventListener('click', toggleTheme);
themeToggleBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
    }
});

let genres = [];
let currentMovies = [];
let currentSort = 'popularity.desc';
let currentQuery = '';

// Add clear search button functionality
const searchContainer = document.querySelector('.search-container');
let clearBtn = document.getElementById('clear-search-btn');
if (!clearBtn) {
    clearBtn = document.createElement('button');
    clearBtn.id = 'clear-search-btn';
    clearBtn.className = 'clear-search-btn';
    clearBtn.setAttribute('aria-label', 'Clear search');
    clearBtn.innerHTML = '&times;';
    clearBtn.style.display = 'none';
    // Insert clearBtn after the input and before the search button
    searchContainer.insertBefore(clearBtn, searchBtn);
}

searchInput.addEventListener('input', () => {
    clearBtn.style.display = searchInput.value ? 'block' : 'none';
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    currentQuery = '';
    fetchMovies('', currentSort);
    searchInput.focus();
});

// Focus search input on page load
window.addEventListener('DOMContentLoaded', () => {
    searchInput.focus();
});

// Fetch genres on load
async function fetchGenres() {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    genres = data.genres;
    // Populate genre options in sort dropdown
    const genreOption = document.createElement('optgroup');
    genreOption.label = 'By Genre';
    genres.forEach(g => {
        const opt = document.createElement('option');
        opt.value = `genre-${g.id}`;
        opt.textContent = g.name;
        genreOption.appendChild(opt);
    });
    sortSelect.appendChild(genreOption);
}

// Fetch movies from TMDb
async function fetchMovies(query = '', sort = 'popularity.desc', genreId = null) {
    let url;
    if (genreId) {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sort}&with_genres=${genreId}&language=en-US`;
    } else if (query) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&sort_by=${sort}&language=en-US`;
    } else {
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sort}&language=en-US`;
    }
    loadingIndicator.classList.remove('hidden');
    noResults.classList.add('hidden');
    moviesGrid.innerHTML = '';
    try {
        const res = await fetch(url);
        const data = await res.json();
        currentMovies = data.results || [];
        renderMovies(currentMovies);
    } catch (e) {
        noResults.classList.remove('hidden');
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

// Render movie cards
function renderMovies(movies) {
    moviesGrid.innerHTML = '';
    // Filter out NSFW/adult movies
    const safeMovies = movies.filter(movie => !movie.adult);
    if (!safeMovies.length) {
        noResults.classList.remove('hidden');
        return;
    }
    noResults.classList.add('hidden');
    safeMovies.forEach((movie, i) => {
        const card = createMovieCard(movie);
        moviesGrid.appendChild(card);
        setTimeout(() => {
            card.classList.add('fade-in');
        }, i * 100); // Staggered fade-in
    });
}

// Create a reusable movie card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    // Poster
    const posterDiv = document.createElement('div');
    posterDiv.className = 'movie-poster';
    const img = document.createElement('img');
    img.className = 'poster-image';
    img.src = movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x450/222/fff?text=No+Image';
    img.alt = movie.title;
    posterDiv.appendChild(img);
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'poster-overlay';
    const playBtn = document.createElement('button');
    playBtn.className = 'play-btn';
    playBtn.innerHTML = '\u25B6\uFE0F';
    playBtn.setAttribute('aria-label', 'Play trailer');
    overlay.appendChild(playBtn);
    posterDiv.appendChild(overlay);
    card.appendChild(posterDiv);

    // Info
    const info = document.createElement('div');
    info.className = 'movie-info';
    // Title
    const title = document.createElement('h3');
    title.className = 'movie-title';
    title.textContent = movie.title;
    info.appendChild(title);
    // Rating
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'movie-rating';
    const stars = document.createElement('span');
    stars.className = 'rating-stars';
    stars.innerHTML = getStars(movie.vote_average);
    ratingDiv.appendChild(stars);
    const ratingNum = document.createElement('span');
    ratingNum.className = 'rating-number';
    ratingNum.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    ratingDiv.appendChild(ratingNum);
    info.appendChild(ratingDiv);
    // Year
    const year = document.createElement('p');
    year.className = 'movie-year';
    year.textContent = movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown';
    info.appendChild(year);
    card.appendChild(info);
    return card;
}

// Convert rating to stars (out of 5)
function getStars(vote) {
    const stars = Math.round((vote || 0) / 2);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

// Handle search
searchBtn.addEventListener('click', () => {
    currentQuery = searchInput.value.trim();
    fetchMovies(currentQuery, currentSort);
});
searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        currentQuery = searchInput.value.trim();
        fetchMovies(currentQuery, currentSort);
    }
});

// Handle sorting
sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;
    if (val.startsWith('genre-')) {
        const genreId = val.split('-')[1];
        fetchMovies('', currentSort, genreId);
    } else {
        currentSort = val;
        fetchMovies(currentQuery, currentSort);
    }
});

// Initial load
fetchGenres().then(() => fetchMovies());