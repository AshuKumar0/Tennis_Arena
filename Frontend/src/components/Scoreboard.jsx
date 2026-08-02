import React from 'react';
import { Zap, Flame, Heart } from 'lucide-react';

function StaminaBar({ value = 100, color = '#10b981' }) {
  const pct = Math.max(0, Math.min(100, value));
  const barColor = pct > 60 ? '#10b981' : pct > 30 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flex: 1 }}>
      <Heart size={10} color={barColor} />
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '3px', height: '5px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '3px', transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: '0.65rem', color: barColor, fontWeight: 700, minWidth: '24px' }}>{Math.round(pct)}</span>
    </div>
  );
}

export default function Scoreboard({ gameState, playerRole, playerName }) {
  if (!gameState) return null;

  const {
    player1,
    player2,
    server,
    sets,
    games,
    points,
    score_display,
    phase,
    current_turn,
    current_hitter,
    rally_count,
    stamina = [100, 100],
  } = gameState;

  const isMyTurn = !playerRole || current_turn === playerRole;

  const getPhaseBadge = (p) => {
    switch (p) {
      case 'waiting_for_serve':
        return <span className="phase-badge serve">⚡ Serve Phase</span>;
      case 'waiting_for_return':
        return <span className="phase-badge return">🛡️ Return Phase</span>;
      case 'rally':
        return <span className="phase-badge rally">🔥 Rally — {rally_count} Shots</span>;
      case 'match_over':
        return <span className="phase-badge">🏆 Match Over</span>;
      default:
        return <span className="phase-badge">{p?.replace(/_/g, ' ')}</span>;
    }
  };

  const scoreParts = score_display ? score_display.split(' - ') : ['0', '0'];

  return (
    <div className="scoreboard-card">
      <div className="score-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Zap size={18} color="#10b981" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>LIVE SCOREBOARD</span>
        </div>
        {getPhaseBadge(phase)}
      </div>

      {/* Turn Alert Banner */}
      {phase !== 'match_over' && phase !== 'waiting_for_player2' && playerRole && (
        <div
          style={{
            background: isMyTurn ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.10)',
            border: `1px solid ${isMyTurn ? 'rgba(16,185,129,0.35)' : 'rgba(245,158,11,0.3)'}`,
            color: isMyTurn ? '#10b981' : '#f59e0b',
            padding: '0.55rem 1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontWeight: 700,
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>
            {isMyTurn
              ? '👉 YOUR TURN — Choose your action!'
              : `⏳ Waiting for ${current_turn === 'player1' ? player1 : player2}...`}
          </span>
          {phase === 'rally' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444' }}>
              <Flame size={14} /> {rally_count} shots
            </span>
          )}
        </div>
      )}

      <table className="score-table">
        <thead>
          <tr>
            <th className="player-col">PLAYER</th>
            <th>STA</th>
            <th>SETS</th>
            <th>GAMES</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {/* Player 1 row */}
          <tr className="score-row">
            <td className="player-cell">
              {server === player1
                ? <div className="server-dot" title="Serving" />
                : <div style={{ width: 10 }} />}
              <span style={{ color: server === player1 ? '#fff' : 'var(--text-muted)', fontWeight: playerRole === 'player1' ? 800 : 500 }}>
                {player1}
                {playerRole === 'player1' && (
                  <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>YOU</span>
                )}
              </span>
            </td>
            <td>
              <StaminaBar value={stamina[0]} />
            </td>
            <td><span className="score-box">{sets[0]}</span></td>
            <td><span className="score-box">{games[0]}</span></td>
            <td>
              <span className={`score-box ${server === player1 ? 'highlight' : ''}`}>
                {scoreParts[0]}
              </span>
            </td>
          </tr>

          {/* Player 2 row */}
          <tr className="score-row">
            <td className="player-cell">
              {server === player2
                ? <div className="server-dot" title="Serving" />
                : <div style={{ width: 10 }} />}
              <span style={{ color: server === player2 ? '#fff' : 'var(--text-muted)', fontWeight: playerRole === 'player2' ? 800 : 500 }}>
                {player2}
                {playerRole === 'player2' && (
                  <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', background: 'rgba(59,130,246,0.2)', color: '#3b82f6', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>YOU</span>
                )}
              </span>
            </td>
            <td>
              <StaminaBar value={stamina[1]} />
            </td>
            <td><span className="score-box">{sets[1]}</span></td>
            <td><span className="score-box">{games[1]}</span></td>
            <td>
              <span className={`score-box ${server === player2 ? 'highlight' : ''}`}>
                {scoreParts[1]}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
