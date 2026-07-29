
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './GameDetails.css';

export default function GameDetails() {
  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    async function fetchGameData() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const [detailsRes, screenshotsRes] = await Promise.all([
          fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`),
          fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`)
        ]);

        if (!detailsRes.ok) {
          throw new Error('Failed to load game details.');
        }

        const detailsData = await detailsRes.json();
        const screenshotsData = await screenshotsRes.json();

        setGame(detailsData);
        setScreenshots(screenshotsData.results || []);
      } catch (error) {
        console.error('Error loading game:', error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGameData();
  }, [id, API_KEY]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', color: '#f5c518', padding: '100px 0' }}>
         Loading game details...
      </div>
    );
  }

  if (errorMessage || !game) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ color: '#ff4d4d', fontSize: '1.2rem' }}>
           {errorMessage || 'Game not found.'}
        </p>
        <Link to="/" className="back-btn">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="details-page-wrapper">
      <div 
        className="hero-backdrop" 
        style={{ backgroundImage: `url(${game.background_image})` }} 
      />
      <div className="hero-overlay" />

      <div className="details-container">
        <Link to="/" className="back-btn">← Back to Games</Link>

        <div className="details-grid">

          <div className="details-main">
            <img 
              src={game.background_image} 
              alt={game.name} 
              className="details-main-banner" 
            />

            <h2 className="section-heading">About</h2>
            <p className="description-text">
              {game.description_raw || 'No description available for this title.'}
            </p>

            {screenshots.length > 0 && (
              <>
                <h2 className="section-heading">Screenshots</h2>
                <div className="screenshots-grid">
                  {screenshots.slice(0, 6).map((shot) => (
                    <img
                      key={shot.id}
                      src={shot.image}
                      alt={`${game.name} screenshot`}
                      className="screenshot-img"
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="details-sidebar">
            <h1 className="details-title">{game.name}</h1>

            <div className="sidebar-section">
              <span className="sidebar-label">Rating</span>
              <div className="stat-value">⭐ {game.rating} / 5 ({game.ratings_count || 0} reviews)</div>
            </div>

            {game.metacritic && (
              <div className="sidebar-section">
                <span className="sidebar-label">Metacritic Score</span>
                <div className="stat-value" style={{ color: '#6cce23' }}>🎯 {game.metacritic}</div>
              </div>
            )}

            {game.genres?.length > 0 && (
              <div className="sidebar-section">
                <span className="sidebar-label">Genres</span>
                <div className="tag-badge-container">
                  {game.genres.map((g) => (
                    <span key={g.id} className="tag-badge">{g.name}</span>
                  ))}
                </div>
              </div>
            )}

            {game.platforms?.length > 0 && (
              <div className="sidebar-section">
                <span className="sidebar-label">Platforms</span>
                <div className="tag-badge-container">
                  {game.platforms.map((p) => (
                    <span key={p.platform.id} className="tag-badge">{p.platform.name}</span>
                  ))}
                </div>
              </div>
            )}

            {game.developers?.length > 0 && (
              <div className="sidebar-section">
                <span className="sidebar-label">Developer</span>
                <div className="stat-value">
                  {game.developers.map((d) => d.name).join(', ')}
                </div>
              </div>
            )}

            <div className="sidebar-section">
              <span className="sidebar-label">Release Date</span>
              <div className="stat-value">📅 {game.released || 'N/A'}</div>
            </div>

            {game.website && (
              <div className="sidebar-section">
                <span className="sidebar-label">Official Website</span>
                <a 
                  href={game.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="website-link"
                >
                  Visit Game Site ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}