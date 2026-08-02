import React, { useState } from 'react';
import { PlusCircle, LogIn, Trophy, Copy, Check, Users } from 'lucide-react';

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

export default function RoomLobby({ onCreateRoom, onJoinRoom, roomCode, gameState, loading }) {
  const [mode, setMode] = useState('create'); // 'create' | 'join'
  const [name, setName] = useState('Roger Federer');
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (mode === 'create') {
      onCreateRoom(name.trim());
    } else {
      if (!inputCode.trim()) return;
      onJoinRoom(inputCode.trim().toUpperCase(), name.trim());
    }
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If waiting for Player 2 to join room
  if (roomCode && gameState && gameState.phase === 'waiting_for_player2') {
    return (
      <div className="setup-card" style={{ maxWidth: 550 }}>
        <div className="brand-icon" style={{ margin: '0 auto 1rem', width: 60, height: 60 }}>
          <Users size={30} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          WAITING FOR OPPONENT...
        </h2>
        <p className="setup-subtitle">
          Share this room code with your opponent to play 1v1 online!
        </p>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px dashed var(--accent-court)',
            padding: '1.5rem',
            borderRadius: '16px',
            margin: '1.5rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '4px', color: 'var(--accent-court)' }}>
            {roomCode}
          </span>
          <button
            onClick={handleCopyCode}
            className="preset-chip"
            style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}
          >
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <div className="status-dot" />
          <span>Waiting for Player 2 to join...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-card" style={{ maxWidth: 550 }}>
      <div className="brand-icon" style={{ margin: '0 auto 1rem', width: 56, height: 56 }}>
        <Trophy size={28} />
      </div>
      <h1 className="setup-title">TENNIS ARENA 1v1</h1>
      <p className="setup-subtitle">
        Create a multiplayer room code or join an existing game to play 1v1 turn-by-turn!
      </p>

      {/* Toggle Create / Join */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0.4rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
        }}
      >
        <button
          type="button"
          onClick={() => { setMode('create'); setName('Roger Federer'); }}
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            background: mode === 'create' ? 'var(--accent-court)' : 'transparent',
            color: mode === 'create' ? '#000' : 'var(--text-muted)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease',
          }}
        >
          <PlusCircle size={18} />
          <span>Create Room</span>
        </button>

        <button
          type="button"
          onClick={() => { setMode('join'); setName('Rafael Nadal'); }}
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            background: mode === 'join' ? 'var(--accent-court)' : 'transparent',
            color: mode === 'join' ? '#000' : 'var(--text-muted)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease',
          }}
        >
          <LogIn size={18} />
          <span>Join Room</span>
        </button>
      </div>

      <form className="setup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Your Player Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            required
          />
          <div className="presets-container">
            {POPULAR_PLAYERS.map((p) => (
              <span
                key={`name-${p}`}
                className="preset-chip"
                onClick={() => setName(p)}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {mode === 'join' && (
          <div className="input-group" style={{ marginTop: '0.75rem' }}>
            <label>6-Digit Room Code</label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. 7X9A2B"
              maxLength={6}
              required
              style={{ letterSpacing: '2px', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 700 }}
            />
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {mode === 'create' ? <PlusCircle size={20} /> : <LogIn size={20} />}
          <span>
            {loading
              ? 'Connecting...'
              : mode === 'create'
              ? 'CREATE ROOM CODE'
              : 'JOIN 1v1 MATCH'}
          </span>
        </button>
      </form>
    </div>
  );
}
