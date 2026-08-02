from engine.game import play_game
from engine.tiebreak import play_tiebreak


def play_set(
    match,
    serve_provider,
    return_provider,
    shot_provider
):

    print("\n========== NEW SET ==========\n")

    while True:

        # ---------------- PLAY GAME ----------------

        winner = play_game(
            match,
            serve_provider,
            return_provider,
            shot_provider
        )

        # ---------------- UPDATE MATCH ----------------

        match.game_won_by(
            winner
        )

        # ---------------- DISPLAY SCORE ----------------

        print("\nCURRENT SET SCORE")

        print(
            f"{match.player1.name}: "
            f"{match.games_p1}"
        )

        print(
            f"{match.player2.name}: "
            f"{match.games_p2}"
        )

        # ---------------- TIEBREAK ----------------

        if (
            match.games_p1 == 6 and
            match.games_p2 == 6
        ):

            winner = play_tiebreak(
                match,
                serve_provider,
                return_provider,
                shot_provider
            )

            if winner == match.player1:
                match.games_p1 += 1
            else:
                match.games_p2 += 1

            print(
                f"\nSET WON BY {winner.name}"
            )

            return winner

        # ---------------- CHECK SET WINNER ----------------

        if (
            match.games_p1 >= 6 and
            match.games_p1 - match.games_p2 >= 2
        ):

            print(
                f"\nSET WON BY "
                f"{match.player1.name}"
            )

            return match.player1

        if (
            match.games_p2 >= 6 and
            match.games_p2 - match.games_p1 >= 2
        ):

            print(
                f"\nSET WON BY "
                f"{match.player2.name}"
            )

            return match.player2