import "./Header.css";

export default function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className="header">
      <div className="logo">Game Vault</div>
      <input
        type="text"
        className="search-input"
        placeholder="Search for games..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </header>
  );
}
