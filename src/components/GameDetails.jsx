// src/GameDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function GameDetails() {
  // 1. useParams() reads the dynamic ":id" from the browser URL bar
  // If the URL is /game/3498, then `id` equals "3498"
  const { id } = useParams();

  // State to hold this game's data, loading status, and error message
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  // 2. Fetch details for THIS specific game ID when the component loads
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
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#f5c518" }}>
        ⏳ Loading game details...
      </div>
    );
  }

  if (errorMessage || !game) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ color: "#ff4d4d" }}>
          ❌ {errorMessage || "Game not found."}
        </p>
        <Link to="/" style={{ color: "#f5c518", textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "0 20px" }}>
      <Link
        to="/"
        style={{ color: "#f5c518", textDecoration: "none", fontWeight: "bold" }}
      >
        ← Back to Games
      </Link>

      <h1 style={{ fontSize: "2.5rem", margin: "20px 0 10px 0" }}>
        {game.name}
      </h1>

      <p style={{ color: "#aaa", marginBottom: "20px" }}>
        ⭐ Rating: <strong style={{ color: "#fff" }}>{game.rating}</strong> / 5
        {game.released && ` | Released: ${game.released}`}
      </p>

      <img
        src={game.background_image}
        alt={game.name}
        style={{
          width: "100%",
          maxHeight: "420px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      <h3
        style={{
          marginTop: "30px",
          borderBottom: "1px solid #333",
          paddingBottom: "8px",
        }}
      >
        About
      </h3>

      <p
        style={{
          lineHeight: "1.6",
          color: "#ccc",
          marginTop: "12px",
          fontSize: "1.05rem",
        }}
      >
        {game.description_raw || "No description available for this game."}
      </p>
    </div>
  );
}
