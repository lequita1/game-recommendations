// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import GameCards from "./components/GameCards";
import GameDetails from "./components/GameDetails";
import GenreFilter from "./components/GenreFilter"; 
import "./App.css";

function App() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    async function fetchGames() {
      try {
        setIsLoading(true);

        if (!API_KEY) {
          throw new Error("RAWG API key is missing.");
        }
        let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=12`;

        if (searchQuery.trim()) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        if (selectedGenre) {
          url += `&genres=${selectedGenre}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to load games from RAWG.");
        }

        const data = await response.json();
        setGames(data.results || []);
      } catch (error) {
        console.error("Failed to fetch games", error);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchGames();
    }, 300);

    return () => clearTimeout(timer);

  }, [searchQuery, selectedGenre, API_KEY]);

  return (
    <div className="app-container">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Routes>
        <Route
          path="/"
          element={
            <main className="app-main">
              <h2 className="app-title">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Games"}
              </h2>

              <GenreFilter
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
              />

              {isLoading ? (
                <p style={{ textAlign: "center", color: "#f5c518" }}>
                   Loading games...
                </p>
              ) : (
                <div className="game-grid">
                  {games.map((game) => (
                    <GameCards key={game.id} game={game} />
                  ))}
                </div>
              )}
            </main>
          }
        />
        <Route path="/game/:id" element={<GameDetails />} />
      </Routes>
    </div>
  );
}

export default App;