from enum import Enum
import random
from engine.actions import SERVES, RETURNS, SHOTS, PLACEMENTS
from engine.rally import play_shot
from engine.pressure import get_pressure_level

class GamePhase(str, Enum):
    WAITING_FOR_PLAYER2 = "waiting_for_player2"
    WAITING_FOR_SERVE = "waiting_for_serve"
    WAITING_FOR_RETURN = "waiting_for_return"
    RALLY = "rally"
    MATCH_OVER = "match_over"


class GameController:

    def __init__(self, match, is_multiplayer=True):

        self.match = match
        self.is_multiplayer = is_multiplayer

        # Initial phase
        self.phase = GamePhase.WAITING_FOR_PLAYER2 if is_multiplayer else GamePhase.WAITING_FOR_SERVE

        # Points in current game
        self.p1_points = 0
        self.p2_points = 0

        # Current point choices
        self.serve_choice = None
        self.return_choice = None
        self.shot_choice = None
        self.placement_choice = None

        # Turn tracking: "player1" or "player2"
        self.current_turn = "player1" if self.match.server == self.match.player1 else "player2"

        # Rally shot tracking
        self.current_attacker = self.match.server
        self.current_defender = self.match.player2 if self.match.server == self.match.player1 else self.match.player1
        self.rally_count = 0

        # Commentary and stats
        self.events = []
        self.last_point_winner = None
        self.match_winner = None

    def get_role_of_player(self, player_obj):
        return "player1" if player_obj == self.match.player1 else "player2"

    def get_opponent_role(self, role):
        return "player2" if role == "player1" else "player1"

    def join_player2(self, player2_name):
        self.match.player2.name = player2_name
        self.match.current_receiver.name = player2_name
        self.phase = GamePhase.WAITING_FOR_SERVE
        self.current_turn = self.get_role_of_player(self.match.server)
        self.events.append(f"🎮 {player2_name} joined the room! Match is starting.")

    def get_score_display(self):
        p1, p2 = self.p1_points, self.p2_points
        if p1 >= 3 and p2 >= 3:
            if p1 == p2:
                return "40 - 40 (Deuce)"
            elif p1 > p2:
                return f"AD ({self.match.player1.name}) - 40"
            else:
                return f"40 - AD ({self.match.player2.name})"
        score_map = [0, 15, 30, 40]
        s1 = score_map[min(p1, 3)]
        s2 = score_map[min(p2, 3)]
        return f"{s1} - {s2}"

    # ---------------- SERVE ----------------

    def choose_serve(self, player_role, serve):

        if self.phase != GamePhase.WAITING_FOR_SERVE:
            return False, "Not in serve phase"

        expected_role = self.get_role_of_player(self.match.server)
        if player_role and player_role != expected_role:
            return False, f"Not your turn to serve! (Waiting for {self.match.server.name})"

        self.serve_choice = serve
        self.events.append(f"🎾 {self.match.server.name} delivers a {serve.upper()} serve.")

        receiver = self.match.player2 if self.match.server == self.match.player1 else self.match.player1
        receiver_role = self.get_role_of_player(receiver)

        # Check for Fault / Ace right away
        fault_risk = SERVES.get(serve, {}).get("fault_risk", 10)
        if random.randint(1, 100) <= fault_risk:
            second_fault_risk = fault_risk // 2
            if random.randint(1, 100) <= second_fault_risk:
                self.events.append("❌ DOUBLE FAULT! Point awarded to receiver.")
                self.award_point(receiver)
                return True, "Double fault"
            else:
                self.events.append("⚠️ First Serve Fault — Second Serve In.")

        # Ace check
        ace_chance = SERVES.get(serve, {}).get("ace_bonus", 1) * 6
        if random.randint(1, 100) <= ace_chance:
            self.events.append(f"🎾 ACE! Perfect {serve.upper()} serve by {self.match.server.name}!")
            self.match.stats.aces += 1
            self.award_point(self.match.server)
            return True, "Ace"

        # Serve in -> receiver's turn to return
        self.phase = GamePhase.WAITING_FOR_RETURN
        self.current_turn = receiver_role
        return True, "Serve in"

    # ---------------- RETURN ----------------

    def choose_return(self, player_role, return_choice, placement="crosscourt"):

        if self.phase != GamePhase.WAITING_FOR_RETURN:
            return False, "Not in return phase"

        receiver = self.match.player2 if self.match.server == self.match.player1 else self.match.player1
        expected_role = self.get_role_of_player(receiver)

        if player_role and player_role != expected_role:
            return False, f"Not your turn to return! (Waiting for {receiver.name})"

        self.return_choice = return_choice
        self.placement_choice = placement
        ret_info = RETURNS.get(return_choice, {"name": return_choice})
        place_info = PLACEMENTS.get(placement, {"name": placement})

        self.events.append(f"🛡️ {receiver.name} executes a {ret_info['name']} target: {place_info['name']}.")

        # Return error check
        return_risk = ret_info.get("risk", 15) + place_info.get("risk_mod", 0)
        if random.randint(1, 100) <= max(3, return_risk // 3):
            self.events.append(f"🔴 Return Error! {receiver.name}'s return lands out of bounds.")
            self.award_point(self.match.server)
            return True, "Return error"

        # Return successful -> Rally phase begins!
        self.phase = GamePhase.RALLY
        self.rally_count = 1
        self.current_attacker = self.match.server
        self.current_defender = receiver
        self.current_turn = self.get_role_of_player(self.current_attacker)
        return True, "Rally started"

    # ---------------- RALLY SHOT ----------------

    def choose_shot(self, player_role, shot, placement="crosscourt"):

        if self.phase != GamePhase.RALLY:
            return False, "Not in rally phase"

        expected_role = self.get_role_of_player(self.current_attacker)
        if player_role and player_role != expected_role:
            return False, f"Not your turn to shoot! (Waiting for {self.current_attacker.name})"

        hitter = self.current_attacker
        defender = self.current_defender
        pressure = get_pressure_level(self.p1_points, self.p2_points)

        self.shot_choice = shot
        self.placement_choice = placement
        shot_info = SHOTS.get(shot, {"name": shot})
        place_info = PLACEMENTS.get(placement, {"name": placement})

        result = play_shot(hitter, defender, shot, pressure, placement)

        if result == "continue":
            self.rally_count += 1
            self.events.append(f"⚡ {hitter.name} plays a {shot_info['name']} [{place_info['name']}]! (Rally: {self.rally_count} shots)")
            # Swap attacker and defender for next shot!
            self.current_attacker, self.current_defender = self.current_defender, self.current_attacker
            self.current_turn = self.get_role_of_player(self.current_attacker)
            return True, "Rally continue"

        elif result == "winner":
            self.events.append(f"🌟 WINNER! {hitter.name} strikes a brilliant {shot_info['name']} [{place_info['name']}] winner!")
            if hitter == self.match.player1:
                self.match.stats.winners_p1 += 1
            else:
                self.match.stats.winners_p2 += 1
            self.award_point(hitter)
            return True, "Winner"

        else: # error
            self.events.append(f"🔴 UNFORCED ERROR! {hitter.name}'s {shot_info['name']} lands out.")
            if hitter == self.match.player1:
                self.match.stats.errors_p1 += 1
            else:
                self.match.stats.errors_p2 += 1
            self.award_point(defender)
            return True, "Error"

    def award_point(self, winner):
        self.last_point_winner = winner.name
        if winner == self.match.player1:
            self.p1_points += 1
            self.match.stats.points_p1 += 1
        else:
            self.p2_points += 1
            self.match.stats.points_p2 += 1

        self.match.stats.longest_rally = max(self.match.stats.longest_rally, self.rally_count)
        self.events.append(f"🏆 Point won by {winner.name}! Score: {self.get_score_display()}")

        # Check Game Winner
        if self.p1_points >= 4 and self.p1_points - self.p2_points >= 2:
            self.win_game(self.match.player1)
        elif self.p2_points >= 4 and self.p2_points - self.p1_points >= 2:
            self.win_game(self.match.player2)
        else:
            self.reset_point_state()

    def win_game(self, winner):
        self.events.append(f"🔔 GAME WON BY {winner.name}!")
        self.match.game_won_by(winner)
        self.p1_points = 0
        self.p2_points = 0

        # Check Set Winner
        p1_g, p2_g = self.match.games_p1, self.match.games_p2
        if p1_g >= 6 and p1_g - p2_g >= 2:
            self.win_set(self.match.player1)
        elif p2_g >= 6 and p2_g - p1_g >= 2:
            self.win_set(self.match.player2)
        else:
            self.reset_point_state()

    def win_set(self, winner):
        self.events.append(f"🏅 SET WON BY {winner.name}!")
        self.match.set_won_by(winner)
        
        # Check Match Winner (Best of 3)
        if self.match.sets_p1 == 2:
            self.match_winner = self.match.player1.name
            self.phase = GamePhase.MATCH_OVER
            self.events.append(f"👑 MATCH WON BY {self.match.player1.name}!")
        elif self.match.sets_p2 == 2:
            self.match_winner = self.match.player2.name
            self.phase = GamePhase.MATCH_OVER
            self.events.append(f"👑 MATCH WON BY {self.match.player2.name}!")
        else:
            self.reset_point_state()

    def reset_point_state(self):
        self.serve_choice = None
        self.return_choice = None
        self.shot_choice = None
        self.placement_choice = None
        self.rally_count = 0
        self.phase = GamePhase.WAITING_FOR_SERVE
        self.current_turn = self.get_role_of_player(self.match.server)

    # ---------------- STATE ----------------

    def get_state(self):
        receiver = self.match.player2 if self.match.server == self.match.player1 else self.match.player1
        return {
            "phase": self.phase.value,
            "player1": self.match.player1.name,
            "player2": self.match.player2.name,
            "server": self.match.server.name,
            "receiver": receiver.name,
            "current_turn": self.current_turn,
            "current_hitter": self.current_attacker.name if self.phase == GamePhase.RALLY else None,
            "rally_count": self.rally_count,
            "sets": [self.match.sets_p1, self.match.sets_p2],
            "games": [self.match.games_p1, self.match.games_p2],
            "points": [self.p1_points, self.p2_points],
            "stamina": [self.match.player1.current_stamina, self.match.player2.current_stamina],
            "score_display": self.get_score_display(),
            "serve": self.serve_choice,
            "return": self.return_choice,
            "shot": self.shot_choice,
            "placement": self.placement_choice,
            "events": self.events[-15:],
            "last_winner": self.last_point_winner,
            "match_winner": self.match_winner
        }