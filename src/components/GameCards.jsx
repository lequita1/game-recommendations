export default function GameCards({game}) {
    const yearReleased = game.released ? game.released.split('-')[0] : 'N/A ';
    return (
        <div className="game-card">
            <img src={game.background_image || 'https://via.placeholder.com/300x200'} alt={game.name} className="game-poster"/>
            <div className="game-info">
                <div className="game-rating">
                    <span className="star-icon">★</span>
                    <strong style={{color: '#fff'}}>{game.rating}</strong> / 5
                </div>
                <h3 className="game-title">{game.name}</h3>
                <span className="game-year">{yearReleased}</span>
            </div>
        </div>
    )
}