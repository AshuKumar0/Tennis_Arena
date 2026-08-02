from engine.stats import MatchStats


class Match:

    def __init__(self, player1, player2):

        self.player1 = player1
        self.player2 = player2
        self.game_controller = None
        # ---------------- MATCH SCORE ----------------

        self.sets_p1 = 0
        self.sets_p2 = 0

        # ---------------- SET SCORE ----------------

        self.games_p1 = 0
        self.games_p2 = 0

        # ---------------- SERVER ----------------

        self.server = player1

        # ---------------- MATCH STATS ----------------

        self.stats = MatchStats()

        # ==================================================
        # NEW: GAME STATE (FOR API / REACT)
        # ==================================================

        self.state = "waiting_for_serve"

        self.current_server = self.server

        self.current_receiver = (
            self.player2
            if self.server == self.player1
            else self.player1
        )

        self.current_serve = None
        self.current_return = None
        self.current_shot = None

        self.point_result = None

    def display_score(self):

        print("\nMATCH SCORE:")

        print(
            f"Sets: "
            f"{self.player1.name} "
            f"{self.sets_p1}"
            f" - "
            f"{self.sets_p2} "
            f"{self.player2.name}"
        )

        print(
            f"Games: "
            f"{self.player1.name} "
            f"{self.games_p1}"
            f" - "
            f"{self.games_p2} "
            f"{self.player2.name}"
        )

    def switch_server(self):

        if self.server == self.player1:
            self.server = self.player2
        else:
            self.server = self.player1

        # Keep API state in sync
        self.current_server = self.server

        self.current_receiver = (
            self.player2
            if self.server == self.player1
            else self.player1
        )

    def game_won_by(self, winner):

        if winner == self.player1:
            self.games_p1 += 1
        else:
            self.games_p2 += 1

        self.switch_server()

    def reset_games(self):

        self.games_p1 = 0
        self.games_p2 = 0

    def set_won_by(self, winner):

        if winner == self.player1:
            self.sets_p1 += 1
        else:
            self.sets_p2 += 1

        self.reset_games()

    def recover_stamina(self):

        self.player1.current_stamina = min(
            self.player1.stamina,
            self.player1.current_stamina + 15
        )

        self.player2.current_stamina = min(
            self.player2.stamina,
            self.player2.current_stamina + 15
        )