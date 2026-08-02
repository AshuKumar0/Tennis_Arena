from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import asyncio
from controller import MatchController

from schemas import (
    CreateRoomRequest,
    JoinRoomRequest,
    RoomActionResponse,
    ServeRequest,
    ReturnRequest,
    ShotRequest,
    MatchStateResponse
)

app = FastAPI(
    title="Tennis Arena 1v1 Multiplayer API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

controller = MatchController()

# ---------------- WEBSOCKET CONNECTION MANAGER ----------------

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_code: str, websocket: WebSocket):
        await websocket.accept()
        if room_code not in self.active_connections:
            self.active_connections[room_code] = []
        self.active_connections[room_code].append(websocket)

    def disconnect(self, room_code: str, websocket: WebSocket):
        if room_code in self.active_connections:
            if websocket in self.active_connections[room_code]:
                self.active_connections[room_code].remove(websocket)
            if not self.active_connections[room_code]:
                del self.active_connections[room_code]

    async def broadcast(self, room_code: str, state: dict):
        if room_code in self.active_connections:
            disconnected = []
            for connection in self.active_connections[room_code]:
                try:
                    await connection.send_json(state)
                except Exception:
                    disconnected.append(connection)
            for conn in disconnected:
                self.disconnect(room_code, conn)

manager = ConnectionManager()


@app.get("/")
def home():
    return {"message": "Welcome to Tennis Arena 1v1 Multiplayer API!"}


# ---------------- WEBSOCKET ENDPOINT ----------------

@app.websocket("/ws/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    room_code = room_code.upper()
    await manager.connect(room_code, websocket)
    # Send current state on connection
    state = controller.get_state(room_code)
    if state:
        await websocket.send_json(state)
    try:
        while True:
            # Keep connection open & listen for incoming ping or action
            data = await websocket.receive_json()
            # If client sends action over WS:
            action = data.get("action")
            if action == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(room_code, websocket)
    except Exception:
        manager.disconnect(room_code, websocket)


# ---------------- CREATE ROOM ----------------

@app.post("/room/create", response_model=RoomActionResponse)
def create_room(request: CreateRoomRequest):
    return controller.create_room(request.player1)


# ---------------- JOIN ROOM ----------------

@app.post("/room/join", response_model=RoomActionResponse)
async def join_room(request: JoinRoomRequest):
    result = controller.join_room(request.room_code, request.player2)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Room code not found"
        )
    await manager.broadcast(request.room_code.upper(), result["state"])
    return result


# ---------------- GET ROOM STATE ----------------

@app.get("/room/{room_code}")
def get_room_state(room_code: str):
    state = controller.get_state(room_code)
    if state is None:
        raise HTTPException(
            status_code=404,
            detail="Room code not found"
        )
    return state


# ---------------- CHOOSE SERVE ----------------

@app.post("/serve")
async def choose_serve(request: ServeRequest):
    state, msg = controller.choose_serve(
        request.room_code,
        request.player_role,
        request.serve
    )
    if state is None:
        raise HTTPException(
            status_code=400,
            detail=msg
        )
    await manager.broadcast(request.room_code.upper(), state)
    return state


# ---------------- CHOOSE RETURN ----------------

@app.post("/return")
async def choose_return(request: ReturnRequest):
    state, msg = controller.choose_return(
        request.room_code,
        request.player_role,
        request.return_choice,
        request.placement
    )
    if state is None:
        raise HTTPException(
            status_code=400,
            detail=msg
        )
    await manager.broadcast(request.room_code.upper(), state)
    return state


# ---------------- CHOOSE SHOT ----------------

@app.post("/shot")
async def choose_shot(request: ShotRequest):
    state, msg = controller.choose_shot(
        request.room_code,
        request.player_role,
        request.shot,
        request.placement
    )
    if state is None:
        raise HTTPException(
            status_code=400,
            detail=msg
        )
    await manager.broadcast(request.room_code.upper(), state)
    return state