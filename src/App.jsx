
import { useState } from 'react';
import Header from './components/Header';
import GameCards from './components/GameCards';
import './App.css';

const DUMMY_GAMES = [
  {
    id: 1,
    name: "Elden Ring",
    rating: 4.8,
    released: "2022-02-25",
    background_image: "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7be378393b1966.jpg"
  },
  {
    id: 2,
    name: "The Witcher 3: Wild Hunt",
    rating: 4.7,
    released: "2015-05-18",
    background_image: "https://media.rawg.io/media/games/618/618c47b8e30bb85777a2ed1e96378bba.jpg"
  },
  {
    id: 3,
    name: "God of War Ragnarök",
    rating: 4.9,
    released: "2022-11-09",
    background_image: "https://media.rawg.io/media/games/f24/f2493ea50f4336e3d040f7b31273390c.jpg"
  }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-container">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="app-main">
        <h2 className="app-title">
          Popular Games
        </h2>

        <div className="game-grid">
          {DUMMY_GAMES.map((game) => (
            <GameCards key={game.id} game={game} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;