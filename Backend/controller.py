import uuid
import random
import string

from engine.player import Player
from engine.match import Match
from game_controller import GameController

class MatchController:

    def __init__(self):
        self.matches = {}
        self.rooms = {}

    def generate_room_code(self):
        while True:
            code = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
            if code not in self.rooms:
                return code

    # ---------------- CREATE ROOM ----------------

    def create_room(self, player1_name):
        player1 = Player(player1_name, 80, 75, 70, 78, 74, 85, 80)
        player2 = Player("Waiting for Opponent...", 75, 72, 68, 80, 76, 82, 78)

        match = Match(player1, player2)
        match.game_controller = GameController(match, is_multiplayer=True)

        room_code = self.generate_room_code()
        self.rooms[room_code] = match

        return {
            "room_code": room_code,
            "player_id": "player1",
            "state": match.game_controller.get_state()
        }

    # ---------------- JOIN ROOM ----------------

    def join_room(self, room_code, player2_name):
        room_code = room_code.strip().upper()
        match = self.rooms.get(room_code)

        if match is None:
            return None

        match.game_controller.join_player2(player2_name)

        return {
            "room_code": room_code,
            "player_id": "player2",
            "state": match.game_controller.get_state()
        }

    # ---------------- GET STATE ----------------

    def get_room(self, room_code):
        return self.rooms.get(room_code.strip().upper())

    def get_state(self, room_code):
        match = self.get_room(room_code)
        if match is None:
            return None
        return match.game_controller.get_state()

    # ---------------- STORE SERVE ----------------

    def choose_serve(self, room_code, player_role, serve):
        match = self.get_room(room_code)
        if match is None:
            return None, "Room not found"

        success, msg = match.game_controller.choose_serve(player_role, serve)
        return self.get_state(room_code), msg

    # ---------------- STORE RETURN ----------------

    def choose_return(self, room_code, player_role, return_choice, placement="crosscourt"):
        match = self.get_room(room_code)
        if match is None:
            return None, "Room not found"

        success, msg = match.game_controller.choose_return(player_role, return_choice, placement)
        return self.get_state(room_code), msg

    # ---------------- STORE SHOT ----------------

    def choose_shot(self, room_code, player_role, shot, placement="crosscourt"):
        match = self.get_room(room_code)
        if match is None:
            return None, "Room not found"

        success, msg = match.game_controller.choose_shot(player_role, shot, placement)
        return self.get_state(room_code), msg