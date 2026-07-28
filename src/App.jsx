import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import GameCards from "./components/GameCards";
import GameDetails from "./components/GameDetails";
import "./App.css";

function App() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    async function fetchPopularGames() {
      try {
        setIsLoading(true);

        if (!API_KEY) {
          throw new Error("RAWG API key is missing.");
        }

        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page_size=12`
        );

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
    fetchPopularGames();
  }, [API_KEY]);

  return (
    <div className="app-container">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Routes>
        <Route
          path="/"
          element={
            <main className="app-main">
              <h2 className="app-title">Popular Games</h2>
              {isLoading ? (
                <p style={{ textAlign: "center", color: "#f5c518" }}>
                  ⏳ Loading games...
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
