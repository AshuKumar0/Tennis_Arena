import React from 'react';

export default function TennisCourt({ gameState }) {
  if (!gameState) return null;

  const { player1, player2, server, phase, serve, return_choice, shot } = gameState;
  const isP1Server = server === player1;

  // Determine ball coordinates based on current phase
  let ballX = 300;
  let ballY = isP1Server ? 350 : 150;

  if (phase === 'waiting_for_return') {
    ballX = 300;
    ballY = isP1Server ? 220 : 280;
  } else if (phase === 'rally') {
    ballX = 320;
    ballY = 250;
  }

  return (
    <div className="court-card">
      <div className="court-svg-wrapper">
        <svg viewBox="0 0 600 500" className="court-svg">
          <defs>
            {/* Court Gradient */}
            <linearGradient id="courtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d5c3a" />
              <stop offset="100%" stopColor="#083d26" />
            </linearGradient>
            <linearGradient id="outArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>

            {/* Ball Glow Filter */}
            <filter id="ballGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Out of bounds area */}
          <rect x="20" y="20" width="560" height="460" rx="16" fill="url(#outArea)" />

          {/* Main Tennis Court Surface */}
          <rect x="80" y="60" width="440" height="380" fill="url(#courtGrad)" stroke="#ffffff" strokeWidth="4" />

          {/* Doubles Sidelines */}
          <line x1="120" y1="60" x2="120" y2="440" stroke="#ffffff" strokeWidth="3" />
          <line x1="480" y1="60" x2="480" y2="440" stroke="#ffffff" strokeWidth="3" />

          {/* Service Lines */}
          <line x1="120" y1="150" x2="480" y2="150" stroke="#ffffff" strokeWidth="3" />
          <line x1="120" y1="350" x2="480" y2="350" stroke="#ffffff" strokeWidth="3" />

          {/* Center Service Line */}
          <line x1="300" y1="150" x2="300" y2="350" stroke="#ffffff" strokeWidth="3" />

          {/* Center Marks */}
          <line x1="300" y1="60" x2="300" y2="72" stroke="#ffffff" strokeWidth="3" />
          <line x1="300" y1="440" x2="300" y2="428" stroke="#ffffff" strokeWidth="3" />

          {/* Net (Center Line Across) */}
          <line x1="60" y1="250" x2="540" y2="250" stroke="#f8fafc" strokeWidth="5" strokeDasharray="6 3" opacity="0.9" />
          {/* Net Posts */}
          <circle cx="60" cy="250" r="6" fill="#94a3b8" />
          <circle cx="540" cy="250" r="6" fill="#94a3b8" />

          {/* Player 2 (Top Side) */}
          <g transform="translate(300, 42)">
            <circle cx="0" cy="0" r="18" fill={server === player2 ? '#10b981' : '#3b82f6'} stroke="#fff" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">
              {player2.charAt(0).toUpperCase()}
            </text>
            <text x="0" y="-24" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="600">
              {player2} {server === player2 ? '(Server 🎾)' : ''}
            </text>
          </g>

          {/* Player 1 (Bottom Side) */}
          <g transform="translate(300, 458)">
            <circle cx="0" cy="0" r="18" fill={server === player1 ? '#10b981' : '#3b82f6'} stroke="#fff" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">
              {player1.charAt(0).toUpperCase()}
            </text>
            <text x="0" y="28" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="600">
              {player1} {server === player1 ? '(Server 🎾)' : ''}
            </text>
          </g>

          {/* Animated Tennis Ball */}
          <g transform={`translate(${ballX}, ${ballY})`} style={{ transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <circle cx="0" cy="0" r="9" fill="#ccff00" filter="url(#ballGlow)" />
            {/* Seams on ball */}
            <path d="M -5 0 Q 0 -5 5 0" stroke="#334155" strokeWidth="1.5" fill="none" />
          </g>

          {/* Action indicator tag */}
          {phase === 'waiting_for_return' && (
            <text x="300" y="275" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">
              SERVE IN FLIGHT ({serve?.toUpperCase()})
            </text>
          )}
          {phase === 'rally' && (
            <text x="300" y="275" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="bold">
              RALLY ACTIVE ({shot?.toUpperCase() || return_choice?.toUpperCase()})
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
