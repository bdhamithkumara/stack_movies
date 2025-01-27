import { useState, useEffect } from "react";
import { getAllMovies } from "../../api/Movie_api/getAllmovie";
import "./MoviePage.css";

const MoviePage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await getAllMovies();
        console.log("Fetched movies:", movies); // Add this line
        setMovies(movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="movie-page">
      <h1>Season 1</h1>
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <img src={movie.image} alt={movie.title} />
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <div className="movie-buttons">
              <button className="play-now">Play Now</button>
              <button className="watch-trailer">Watch Trailer</button>
              <button className="watch-prime">Watch with Prime</button>
              <button className="thumbs-up">👍</button>
              <button className="thumbs-down">👎</button>
              <button className="add-to-list">+</button>
              <button className="download">⬇️</button>
              <button className="share">🔗</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviePage;