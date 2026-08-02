from pydantic import BaseModel
from typing import Optional, List, Dict, Any


# ---------------- ROOM ----------------

class CreateRoomRequest(BaseModel):
    player1: str


class JoinRoomRequest(BaseModel):
    room_code: str
    player2: str


class RoomActionResponse(BaseModel):
    room_code: str
    player_id: str
    state: Dict[str, Any]


# ---------------- SERVE / RETURN / SHOT ----------------

class ServeRequest(BaseModel):
    room_code: str
    player_role: Optional[str] = "player1"
    serve: str


class ReturnRequest(BaseModel):
    room_code: str
    player_role: Optional[str] = "player2"
    return_choice: str
    placement: Optional[str] = "crosscourt"


class ShotRequest(BaseModel):
    room_code: str
    player_role: Optional[str] = "player1"
    shot: str
    placement: Optional[str] = "crosscourt"


# ---------------- STATE ----------------

class MatchStateResponse(BaseModel):
    phase: str
    player1: str
    player2: str
    server: str
    receiver: str
    current_turn: Optional[str] = None
    current_hitter: Optional[str] = None
    rally_count: Optional[int] = 0
    sets: List[int]
    games: List[int]
    points: List[int]
    score_display: str
    serve: Optional[str] = None
    return_choice: Optional[str] = None
    shot: Optional[str] = None
    events: List[str] = []
    last_winner: Optional[str] = None
    match_winner: Optional[str] = None