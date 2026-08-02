import React, { useState } from 'react';
import { Target, ShieldAlert, Flame, MapPin, Lock } from 'lucide-react';

const SERVE_OPTIONS = [
  { id: 'wide',  name: 'Wide Slice',    desc: 'Pulls receiver out wide off the court',   power: 75, accuracy: 85, risk: 10 },
  { id: 'body',  name: 'Body Jammer',   desc: 'Jams receiver with pace into their body',  power: 80, accuracy: 80, risk: 12 },
  { id: 't',     name: 'Flat T-Bomb',   desc: 'Blistering flat serve down center line',   power: 95, accuracy: 65, risk: 22 },
  { id: 'kick',  name: 'Heavy Kick',    desc: 'High topspin bounce, extremely reliable',  power: 65, accuracy: 95, risk: 5  },
];

const RETURN_OPTIONS = [
  { id: 'crosscourt',    name: 'Crosscourt Return',   desc: 'Safe, deep crosscourt over low net point',    defense: 80, attack: 70, risk: 12 },
  { id: 'downline',      name: 'Down-The-Line Drive', desc: 'Aggressive line return to catch server out',  defense: 65, attack: 85, risk: 28 },
  { id: 'chip_charge',   name: 'Chip & Charge',       desc: 'Underspin return + immediate net rush',       defense: 60, attack: 80, risk: 32 },
  { id: 'defensive_lob', name: 'Defensive Lob',       desc: 'High arching return for recovery time',      defense: 90, attack: 40, risk: 8  },
  { id: 'drop_return',   name: 'Surprise Drop Return',desc: 'Feather touch return landing just over net',  defense: 50, attack: 90, risk: 42 },
  { id: 'block',         name: 'Compact Block',       desc: 'Absorbs pace with steady baseline return',   defense: 85, attack: 55, risk: 10 },
];

const SHOT_OPTIONS = [
  { id: 'forehand',   name: 'Topspin Forehand',   desc: 'Heavy baseline topspin drive',            attack: 85, risk: 15 },
  { id: 'backhand',   name: 'Backhand Drive',      desc: 'Clean, directional backhand stroke',      attack: 78, risk: 12 },
  { id: 'inside_out', name: 'Inside-Out FH',       desc: 'Step around backhand for big forehand',   attack: 90, risk: 25 },
  { id: 'slice',      name: 'Underspin Slice',     desc: 'Skidding slice that stays low off bounce',attack: 65, risk: 8  },
  { id: 'dropshot',   name: 'Touch Dropshot',      desc: 'Soft touch drop shot right over net',     attack: 92, risk: 38 },
  { id: 'lob',        name: 'Topspin Lob',         desc: 'Deep arching lob over net charger',       attack: 70, risk: 18 },
  { id: 'volley',     name: 'Punch Volley',         desc: 'Aggressive net finish / smash',           attack: 88, risk: 22 },
];

const PLACEMENT_OPTIONS = [
  { id: 'crosscourt', name: 'Crosscourt',    icon: '↗', desc: 'Safest margin, lowest risk',     riskMod: 0,   color: '#10b981' },
  { id: 'downline',   name: 'Down The Line', icon: '↑', desc: 'High difficulty, high pressure', riskMod: +10, color: '#f59e0b' },
  { id: 'center',     name: 'Deep Center',   icon: '↕', desc: 'Jams opponent footwork',         riskMod: -5,  color: '#3b82f6' },
  { id: 'angle',      name: 'Sharp Angle',   icon: '⤢', desc: 'Extreme angle, biggest risk',    riskMod: +15, color: '#ef4444' },
];

const getRiskColor = (risk) => {
  if (risk <= 12) return '#10b981';
  if (risk <= 25) return '#f59e0b';
  return '#ef4444';
};

function StatBar({ label, value, max = 100, color = '#10b981' }) {
  return (
    <div className="bar-row">
      <span>{label}</span>
      <div className="bar-bg">
        <div className="bar-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span style={{ minWidth: 26, color, fontSize: '0.7rem', fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function PlacementSelector({ selected, onChange }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
        <MapPin size={14} color="#a78bfa" />
        TARGET PLACEMENT
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
        {PLACEMENT_OPTIONS.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            title={p.desc}
            style={{
              padding: '0.5rem 0.3rem',
              borderRadius: '8px',
              border: selected === p.id ? `2px solid ${p.color}` : '2px solid rgba(255,255,255,0.08)',
              background: selected === p.id ? `${p.color}22` : 'rgba(15,23,42,0.6)',
              color: selected === p.id ? p.color : 'var(--text-muted)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.18s ease',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.15rem',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{p.icon}</span>
            <span>{p.name}</span>
            {p.riskMod !== 0 && (
              <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>
                RISK {p.riskMod > 0 ? `+${p.riskMod}` : p.riskMod}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ActionDeck({ gameState, onServe, onReturn, onShot, loading, playerRole }) {
  const [selectedPlacement, setSelectedPlacement] = useState('crosscourt');
  const [selectedShot, setSelectedShot] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  if (!gameState) return null;

  const { phase, server, receiver, current_turn, current_hitter } = gameState;

  if (phase === 'match_over') return null;

  // Determine if it's this player's turn
  const isMyTurn = !playerRole || current_turn === playerRole;
  const waitingPlayerName =
    current_turn === 'player1' ? gameState.player1 : gameState.player2;

  // Determine what role is supposed to be playing right now
  const servePhase   = phase === 'waiting_for_serve';
  const returnPhase  = phase === 'waiting_for_return';
  const rallyPhase   = phase === 'rally';

  // "Not your turn" overlay
  const showWaitingOverlay = playerRole && !isMyTurn && phase !== 'waiting_for_player2';

  const handleReturn = (id) => {
    setSelectedReturn(id);
    onReturn(id, selectedPlacement);
  };

  const handleShot = (id) => {
    setSelectedShot(id);
    onShot(id, selectedPlacement);
  };

  return (
    <div className="controls-card" style={{ position: 'relative' }}>

      {/* Waiting Overlay */}
      {showWaitingOverlay && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: 'rgba(3, 7, 18, 0.88)',
          borderRadius: '16px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '1rem', backdropFilter: 'blur(4px)',
        }}>
          <Lock size={36} color="#6366f1" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.3rem' }}>
              WAITING FOR OPPONENT
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {waitingPlayerName}'s turn to play...
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#6366f1',
                animation: `pulse 1.2s ease-in-out ${i * 0.4}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* SERVE PHASE */}
      {servePhase && (
        <>
          <div className="section-title">
            <Target color="#10b981" size={20} />
            <span>SELECT SERVE — <span style={{ color: '#10b981' }}>{server}</span></span>
          </div>
          <div className="cards-grid">
            {SERVE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className="action-btn"
                onClick={() => onServe(opt.id)}
                disabled={loading || showWaitingOverlay}
              >
                <div className="action-title">{opt.name}</div>
                <div className="action-sub">{opt.desc}</div>
                <div className="stat-bars">
                  <StatBar label="PWR" value={opt.power} color="#a78bfa" />
                  <StatBar label="ACC" value={opt.accuracy} color="#10b981" />
                  <StatBar label="RISK" value={opt.risk} color={getRiskColor(opt.risk)} />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* RETURN PHASE */}
      {returnPhase && (
        <>
          <div className="section-title">
            <ShieldAlert color="#f59e0b" size={20} />
            <span>SELECT RETURN — <span style={{ color: '#f59e0b' }}>{receiver}</span></span>
          </div>
          <PlacementSelector selected={selectedPlacement} onChange={setSelectedPlacement} />
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {RETURN_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className="action-btn"
                onClick={() => handleReturn(opt.id)}
                disabled={loading || showWaitingOverlay}
                style={{
                  borderColor: selectedReturn === opt.id ? '#f59e0b' : undefined,
                  background: selectedReturn === opt.id ? 'rgba(245,158,11,0.12)' : undefined,
                }}
              >
                <div className="action-title">{opt.name}</div>
                <div className="action-sub">{opt.desc}</div>
                <div className="stat-bars">
                  <StatBar label="DEF" value={opt.defense} color="#10b981" />
                  <StatBar label="ATK" value={opt.attack} color="#a78bfa" />
                  <StatBar label="RISK" value={opt.risk} color={getRiskColor(opt.risk)} />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* RALLY PHASE */}
      {rallyPhase && (
        <>
          <div className="section-title">
            <Flame color="#ef4444" size={20} />
            <span>SELECT SHOT — <span style={{ color: '#ef4444' }}>{current_hitter || server}</span></span>
          </div>
          <PlacementSelector selected={selectedPlacement} onChange={setSelectedPlacement} />
          <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {SHOT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className="action-btn"
                onClick={() => handleShot(opt.id)}
                disabled={loading || showWaitingOverlay}
                style={{
                  borderColor: selectedShot === opt.id ? '#ef4444' : undefined,
                  background: selectedShot === opt.id ? 'rgba(239,68,68,0.12)' : undefined,
                }}
              >
                <div className="action-title">{opt.name}</div>
                <div className="action-sub">{opt.desc}</div>
                <div className="stat-bars">
                  <StatBar label="ATK" value={opt.attack} color="#a78bfa" />
                  <StatBar label="RISK" value={opt.risk} color={getRiskColor(opt.risk)} />
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
