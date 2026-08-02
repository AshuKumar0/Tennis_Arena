import React, { useState } from 'react';
import { Play, Trophy, Users } from 'lucide-react';

const POPULAR_PLAYERS = [
  'Roger Federer',
  'Rafael Nadal',
  'Novak Djokovic',
  'Carlos Alcaraz',
  'Jannik Sinner',
  'Serena Williams',
  'Iga Swiatek',
  'Coco Gauff',
];

export default function MatchSetup({ onStartMatch, loading }) {
  const [player1, setPlayer1] = useState('Roger Federer');
  const [player2, setPlayer2] = useState('Rafael Nadal');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (player1.trim() && player2.trim()) {
      onStartMatch(player1.trim(), player2.trim());
    }
  };

  return (
    <div className="setup-card">
      <div className="brand-icon" style={{ margin: '0 auto 1rem', width: 56, height: 56 }}>
        <Trophy size={28} />
      </div>
      <h1 className="setup-title">TENNIS ARENA</h1>
      <p className="setup-subtitle">
        Enter player names or choose pro presets to step onto the court.
      </p>

      <form className="setup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Player 1 (Server First)</label>
          <input
            type="text"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            placeholder="Enter Player 1 Name"
            required
          />
          <div className="presets-container">
            {POPULAR_PLAYERS.map((p) => (
              <span
                key={`p1-${p}`}
                className="preset-chip"
                onClick={() => setPlayer1(p)}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '0.5rem' }}>
          <label>Player 2 (Receiver)</label>
          <input
            type="text"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            placeholder="Enter Player 2 Name"
            required
          />
          <div className="presets-container">
            {POPULAR_PLAYERS.map((p) => (
              <span
                key={`p2-${p}`}
                className="preset-chip"
                onClick={() => setPlayer2(p)}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          <Play size={20} fill="currentColor" />
          <span>{loading ? 'Initializing Match...' : 'START MATCH'}</span>
        </button>
      </form>
    </div>
  );
}
