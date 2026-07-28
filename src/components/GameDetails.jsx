import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./GameDetails.css";

export default function GameDetails() {

  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    async function fetchGameDetails() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${API_KEY}`,
        );

        if (!response.ok) {
          throw new Error("Game details could not be found.");
        }

        const data = await response.json();
        setGame(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGameDetails();
  }, [id, API_KEY]);

  if (isLoading) {
    return <div className="game-details-loading">Loading game details...</div>;
  }

  if (errorMessage || !game) {
    return (
      <div className="game-details-error">
        <p className="game-details-error-text">
          ❌ {errorMessage || "Game not found."}
        </p>
        <Link to="/" className="game-details-back-link">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="game-details-container">
      <Link to="/" className="game-details-back-link">
        ← Back to Games
      </Link>

      <h1 className="game-details-title">{game.name}</h1>

      <p className="game-details-meta">
        ⭐ Rating: <strong className="game-details-rating">{game.rating}</strong> / 5
        {game.released && ` | Released: ${game.released}`}
      </p>

      <img
        src={game.background_image}
        alt={game.name}
        className="game-details-image"
      />

      <h3 className="game-details-section-title">About</h3>

      <p className="game-details-description">
        {game.description_raw || "No description available for this game."}
      </p>
    </div>
  );
}
