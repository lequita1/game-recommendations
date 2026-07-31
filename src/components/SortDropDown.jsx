import './SortDropdown.css';

const SORT_OPTIONS = [
  { label: ' Popularity', value: '-added' },
  { label: ' Highest Rated', value: '-rating' },
  { label: ' Newest Release', value: '-released' },
  { label: ' Metacritic Score', value: '-metacritic' },
  { label: ' Name (A-Z)', value: 'name' },
];

export default function SortDropdown({ ordering, setOrdering }) {
  return (
    <div className="sort-container">
      <label htmlFor="sort-select" className="sort-label">Sort:</label>
      <select
        id="sort-select"
        className="sort-select"
        value={ordering}
        onChange={(e) => setOrdering(e.target.value)}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}