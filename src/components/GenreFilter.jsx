import './GenreFilter.css';

const GENRES = [
  { name: 'All', slug: '' },
  { name: 'Action', slug: 'action' },
  { name: 'RPG', slug: 'role-playing-games-rpg' },
  { name: 'Shooter', slug: 'shooter' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Strategy', slug: 'strategy' },
];

export default function GenreFilter({ selectedGenre, setSelectedGenre }) {
  return (
    <div className="genre-container">
      {GENRES.map((genre) => (
        <button
          key={genre.slug}
          className={`genre-btn ${selectedGenre === genre.slug ? 'active' : ''}`}
          onClick={() => setSelectedGenre(genre.slug)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}