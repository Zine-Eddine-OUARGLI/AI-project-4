# Technical Specification: MovieSearchEngine.EXE

## Features
- Movie search with live results from TMDb API
- Sort movies by popularity, rating, title, or genre
- Filter out NSFW (adult) content
- Responsive, modern UI with dark/light theme toggle
- Animated, staggered fade-in for movie cards
- Clear search input button
- Loading indicator and no-results message
- Accessible keyboard navigation and focus management

## UI Components
- **Header**: App title with modern font and theme color
- **Theme Toggle Button**: Switches between dark and light themes, persists user preference
- **Search Bar**: Input field, clear (X) button, and search button
- **Sort Bar**: Dropdown for sorting by various criteria (popularity, rating, title, genre)
- **Movies Grid**: Responsive grid displaying movie cards
- **Movie Card**: Poster, title, rating (stars and number), release year, play button overlay
- **Loading Indicator**: Spinner and message while fetching data
- **No Results Message**: Shown when no movies match the search
- **Footer**: Copyright and branding

## External APIs Used
- **TMDb (The Movie Database) API**
  - Endpoints:
    - `/search/movie` for searching movies by query
    - `/discover/movie` for sorting and genre filtering
    - `/genre/movie/list` for fetching available genres
  - Image base URL: `https://image.tmdb.org/t/p/w500`

## Key JavaScript Functions
- `fetchGenres()`: Fetches movie genres from TMDb and populates the sort dropdown
- `fetchMovies(query, sort, genreId)`: Fetches movies from TMDb based on search, sort, and genre; updates UI
- `renderMovies(movies)`: Renders movie cards with fade-in animation, filters out NSFW content
- `createMovieCard(movie)`: Builds a movie card DOM element with poster, title, rating, and year
- `getStars(vote)`: Converts numeric rating to star icons
- Theme toggler logic: Handles theme switching, persists preference in localStorage
- Search bar logic: Handles input, clear button, and search actions
- Sorting logic: Handles sort dropdown changes and genre filtering
- Accessibility: Focus management, keyboard navigation for theme toggle and search

## File Structure
- `index.html`: Main HTML structure
- `styles.css`: All styles, including responsive and theme variables
- `script.js`: All JavaScript logic (API, UI, animation, accessibility)
- `spec.md`: This technical specification
- `README.md`: User and collaborator documentation