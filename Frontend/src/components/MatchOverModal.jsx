import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw } from 'lucide-react';

export default function MatchOverModal({ gameState, onNewMatch }) {
  if (!gameState || gameState.phase !== 'match_over') return null;

  const { match_winner, player1, player2, sets } = gameState;

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="trophy-icon">🏆</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          MATCH CHAMPION!
        </h2>
        <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-court)', marginBottom: '1.5rem' }}>
          {match_winner}
        </p>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            FINAL MATCH RESULT
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {player1} ({sets[0]}) — ({sets[1]}) {player2}
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={onNewMatch}>
          <RotateCcw size={20} />
          <span>START NEW MATCH</span>
        </button>
      </div>
    </div>
  );
}
