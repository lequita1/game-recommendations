import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import GameCards from "./components/GameCards";
import GameDetails from "./components/GameDetails";
import GenreFilter from "./components/GenreFilter";
import SortDropdown from "./components/SortDropdown"; 
import "./App.css";

function App() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [ordering, setOrdering] = useState("-added");
  const [page, setPage] = useState(1);                 
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  const handleOrderingChange = (newOrdering) => {
    setOrdering(newOrdering);
    setPage(1);
  };

  useEffect(() => {
    async function fetchGames() {
      try {
        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        if (!API_KEY) {
          throw new Error("RAWG API key is missing.");
        }

        let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=12&page=${page}&ordering=${ordering}`;

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

        if (page === 1) {
          setGames(data.results || []);
        } else {
          setGames((prevGames) => [...prevGames, ...(data.results || [])]);
        }

        setHasMore(Boolean(data.next));
      } catch (error) {
        console.error("Failed to fetch games", error);
        if (page === 1) setGames([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }

    const timer = setTimeout(() => {
      fetchGames();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, ordering, page, API_KEY]);

  return (
    <div className="app-container">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={(query) => {
          setSearchQuery(query);
          setPage(1);
        }} 
      />

      <Routes>
        <Route
          path="/"
          element={
            <main className="app-main">
              <h2 className="app-title">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Explore Games"}
              </h2>

              <div className="controls-bar">
                <GenreFilter
                  selectedGenre={selectedGenre}
                  setSelectedGenre={handleGenreChange}
                />
                <SortDropdown
                  ordering={ordering}
                  setOrdering={handleOrderingChange}
                />
              </div>

              {isLoading ? (
                <p style={{ textAlign: "center", color: "#f5c518", margin: "60px 0" }}>
                   Loading games...
                </p>
              ) : (
                <>
                  <div className="game-grid">
                    {games.map((game, index) => (
                      <GameCards key={`${game.id}-${index}`} game={game} />
                    ))}
                  </div>

                  {hasMore && games.length > 0 && (
                    <div className="load-more-container">
                      <button
                        className="load-more-btn"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={isLoadingMore}
                      >
                        {isLoadingMore ? " Loading..." : "Load More Games"}
                      </button>
                    </div>
                  )}
                </>
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