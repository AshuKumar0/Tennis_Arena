import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  createRoom, joinRoom, chooseServe, chooseReturn, chooseShot,
  getRoomState, connectRoomSocket
} from './services/api';
import RoomLobby from './components/RoomLobby';
import Scoreboard from './components/Scoreboard';
import TennisCourt from './components/TennisCourt';
import ActionDeck from './components/ActionDeck';
import CommentaryLog from './components/CommentaryLog';
import MatchOverModal from './components/MatchOverModal';
import { Trophy, RefreshCw, Wifi, WifiOff, Users } from 'lucide-react';

export default function App() {
  const [roomCode, setRoomCode]       = useState(null);
  const [playerRole, setPlayerRole]   = useState(null); // 'player1' | 'player2'
  const [playerName, setPlayerName]   = useState('');
  const [gameState, setGameState]     = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  const disconnectWs = useRef(null);
  const pollRef      = useRef(null);

  // ---- WebSocket connection ----
  const connectWs = useCallback((code) => {
    if (disconnectWs.current) disconnectWs.current();

    const disconnect = connectRoomSocket(
      code,
      (state) => {
        setGameState(state);
        setWsConnected(true);
      },
      () => setWsConnected(false)
    );
    disconnectWs.current = disconnect;
  }, []);

  // ---- HTTP polling fallback (fires every 2.5s if game is live) ----
  const startPolling = useCallback((code) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const state = await getRoomState(code);
        setGameState(state);
      } catch (_) {}
    }, 2500);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // When WS is connected, no need to poll
  useEffect(() => {
    if (wsConnected) stopPolling();
  }, [wsConnected, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
      if (disconnectWs.current) disconnectWs.current();
    };
  }, [stopPolling]);

  // ---- CREATE ROOM ----
  const handleCreateRoom = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createRoom(name);
      setRoomCode(res.room_code);
      setPlayerRole('player1');
      setPlayerName(name);
      setGameState(res.state);
      connectWs(res.room_code);
      startPolling(res.room_code);
    } catch (err) {
      setError(err.message || 'Failed to create room. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // ---- JOIN ROOM ----
  const handleJoinRoom = async (code, name) => {
    setLoading(true);
    setError(null);
    try {
      const res = await joinRoom(code, name);
      setRoomCode(res.room_code);
      setPlayerRole('player2');
      setPlayerName(name);
      setGameState(res.state);
      connectWs(res.room_code);
      startPolling(res.room_code);
    } catch (err) {
      setError(err.message || 'Failed to join room. Check the room code.');
    } finally {
      setLoading(false);
    }
  };

  // ---- SERVE ----
  const handleServe = async (serve) => {
    if (!roomCode) return;
    setLoading(true);
    try {
      const state = await chooseServe(roomCode, playerRole, serve);
      setGameState(state);
    } catch (err) {
      setError(err.message || 'Error choosing serve.');
    } finally {
      setLoading(false);
    }
  };

  // ---- RETURN ----
  const handleReturn = async (returnChoice, placement = 'crosscourt') => {
    if (!roomCode) return;
    setLoading(true);
    try {
      const state = await chooseReturn(roomCode, playerRole, returnChoice, placement);
      setGameState(state);
    } catch (err) {
      setError(err.message || 'Error choosing return.');
    } finally {
      setLoading(false);
    }
  };

  // ---- SHOT ----
  const handleShot = async (shot, placement = 'crosscourt') => {
    if (!roomCode) return;
    setLoading(true);
    try {
      const state = await chooseShot(roomCode, playerRole, shot, placement);
      setGameState(state);
    } catch (err) {
      setError(err.message || 'Error choosing shot.');
    } finally {
      setLoading(false);
    }
  };

  // ---- RESET ----
  const handleReset = () => {
    stopPolling();
    if (disconnectWs.current) disconnectWs.current();
    setRoomCode(null);
    setPlayerRole(null);
    setPlayerName('');
    setGameState(null);
    setError(null);
    setWsConnected(false);
  };

  const isInMatch = roomCode && gameState && gameState.phase !== 'waiting_for_player2';
  const isWaiting = roomCode && gameState && gameState.phase === 'waiting_for_player2';

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">🎾</div>
          <div>
            <div className="brand-title">TENNIS ARENA</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Real-Time 1v1 Multiplayer Tennis
            </div>
          </div>
        </div>

        {roomCode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* WS Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              {wsConnected
                ? <Wifi size={14} color="#10b981" />
                : <WifiOff size={14} color="#f59e0b" />}
              <span style={{ color: wsConnected ? '#10b981' : '#f59e0b' }}>
                {wsConnected ? 'Live Sync' : 'Polling'}
              </span>
            </div>

            {/* Room Code badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '0.3rem 0.7rem' }}>
              <Users size={13} color="#a78bfa" />
              <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem', color: '#a78bfa', letterSpacing: '1px' }}>
                {roomCode}
              </span>
            </div>

            {/* Player badge */}
            <div className="header-status">
              <div className="status-dot" style={{ background: playerRole === 'player1' ? '#10b981' : '#3b82f6' }} />
              <span style={{ fontSize: '0.8rem' }}>{playerName} ({playerRole === 'player1' ? 'P1' : 'P2'})</span>
            </div>

            <button
              onClick={handleReset}
              className="preset-chip"
              style={{ padding: '0.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RefreshCw size={14} />
              <span>Leave</span>
            </button>
          </div>
        )}
      </header>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#f87171',
          padding: '0.8rem 1rem',
          borderRadius: '12px',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          ⚠️ {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
        </div>
      )}

      {/* LOBBY / WAITING */}
      {!isInMatch && (
        <RoomLobby
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          roomCode={roomCode}
          gameState={gameState}
          loading={loading}
        />
      )}

      {/* IN MATCH */}
      {isInMatch && (
        <div className="arena-grid">
          <div className="main-column">
            <Scoreboard gameState={gameState} playerRole={playerRole} playerName={playerName} />
            <TennisCourt gameState={gameState} playerRole={playerRole} />
            <ActionDeck
              gameState={gameState}
              onServe={handleServe}
              onReturn={handleReturn}
              onShot={handleShot}
              loading={loading}
              playerRole={playerRole}
            />
          </div>
          <div className="side-column">
            <CommentaryLog events={gameState.events} />
          </div>
        </div>
      )}

      {/* Match Over Modal */}
      <MatchOverModal gameState={gameState} onNewMatch={handleReset} />
    </div>
  );
}
