// In production, set VITE_API_URL to your hosted backend URL (e.g. https://your-api.onrender.com)
// In development it falls back to localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_BASE_URL  = (import.meta.env.VITE_API_URL || 'http://localhost:8000')
  .replace(/^http/, 'ws');

export async function createRoom(player1) {
  const response = await fetch(`${API_BASE_URL}/room/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player1 }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Failed to create room' }));
    throw new Error(err.detail || 'Failed to create room');
  }
  return response.json();
}

export async function joinRoom(roomCode, player2) {
  const response = await fetch(`${API_BASE_URL}/room/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room_code: roomCode, player2 }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Room code not found' }));
    throw new Error(err.detail || 'Room code not found');
  }
  return response.json();
}

export async function getRoomState(roomCode) {
  const response = await fetch(`${API_BASE_URL}/room/${roomCode}`);
  if (!response.ok) {
    throw new Error(`Error fetching room state: ${response.statusText}`);
  }
  return response.json();
}

export async function chooseServe(roomCode, playerRole, serve) {
  const response = await fetch(`${API_BASE_URL}/serve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room_code: roomCode, player_role: playerRole, serve }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Error choosing serve' }));
    throw new Error(err.detail || 'Error choosing serve');
  }
  return response.json();
}

export async function chooseReturn(roomCode, playerRole, returnChoice, placement = 'crosscourt') {
  const response = await fetch(`${API_BASE_URL}/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room_code: roomCode, player_role: playerRole, return_choice: returnChoice, placement }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Error choosing return' }));
    throw new Error(err.detail || 'Error choosing return');
  }
  return response.json();
}

export async function chooseShot(roomCode, playerRole, shot, placement = 'crosscourt') {
  const response = await fetch(`${API_BASE_URL}/shot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room_code: roomCode, player_role: playerRole, shot, placement }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Error choosing shot' }));
    throw new Error(err.detail || 'Error choosing shot');
  }
  return response.json();
}

export function connectRoomSocket(roomCode, onStateUpdate, onError) {
  const url = `${WS_BASE_URL}/ws/${roomCode.toUpperCase()}`;
  let ws = null;
  let isClosed = false;

  const connect = () => {
    ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.phase) {
          onStateUpdate(data);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (err) => {
      if (onError) onError(err);
    };

    ws.onclose = () => {
      if (!isClosed) {
        // Retry connection after 1 second
        setTimeout(connect, 1000);
      }
    };
  };

  connect();

  return () => {
    isClosed = true;
    if (ws) ws.close();
  };
}

