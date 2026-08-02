from engine.point import play_point
from engine.rally import play_rally
from engine.pressure import get_pressure_level

# ------------------------ DISPLAY SCORE ------------------------

def display_score(p1_points, p2_points):

    score_map = [0, 15, 30, 40]

    if p1_points >= 3 and p2_points >= 3:

        if p1_points == p2_points:
            print("\nDEUCE")

        elif p1_points > p2_points:
            print("\nADVANTAGE SERVER")

        else:
            print("\nADVANTAGE RECEIVER")

    else:

        print(
            f"\nScore: "
            f"{score_map[min(p1_points,3)]}"
            f" - "
            f"{score_map[min(p2_points,3)]}"
        )


# ------------------------ PLAY GAME ------------------------

def play_game(
    match,
    serve_provider,
    return_provider,
    shot_provider
):

    server = match.server

    if server == match.player1:
        receiver = match.player2
    else:
        receiver = match.player1

    p1_points = 0
    p2_points = 0

    print("\n========== NEW GAME ==========")
    print(f"\nServer: {server.name}")

    while True:

        pressure = get_pressure_level(
            p1_points,
            p2_points
        )

        # ---------------- SERVE ----------------

        print(f"\n{server.name}'s Serve")

        serve_choice = serve_provider(server)

        # ---------------- RETURN ----------------

        print(f"\n{receiver.name}'s Return")

        return_choice = return_provider(receiver)

        # ---------------- POINT ----------------

        point_result = play_point(
            server,
            receiver,
            serve_choice,
            return_choice,
            pressure
        )

        rally_length = 0
        rally_result = None

        # ---------------- DETERMINE WINNER ----------------

        if point_result == "double_fault":

            point_winner = receiver

            if server == match.player1:
                match.stats.double_faults_p1 += 1
            else:
                match.stats.double_faults_p2 += 1

        elif point_result == "ace":

            match.stats.aces += 1
            point_winner = server

        elif point_result == "server_wins":

            point_winner = server

        else:

            point_winner, rally_length, rally_result = play_rally(
                server,
                receiver,
                pressure,
                shot_provider
            )

        # ---------------- RALLY STATS ----------------

        if rally_result == "winner":

            if point_winner == match.player1:
                match.stats.winners_p1 += 1
            else:
                match.stats.winners_p2 += 1

        elif rally_result == "error":

            if point_winner == match.player1:
                match.stats.errors_p2 += 1
            else:
                match.stats.errors_p1 += 1

        # ---------------- LONGEST RALLY ----------------

        match.stats.longest_rally = max(
            match.stats.longest_rally,
            rally_length
        )

        # ---------------- POINT STATS ----------------

        if point_winner == match.player1:
            match.stats.points_p1 += 1
        else:
            match.stats.points_p2 += 1

        # ---------------- SCORE UPDATE ----------------

        if point_winner == server:

            p1_points += 1

            print(f"\nPoint won by {server.name}")

        else:

            p2_points += 1

            print(f"\nPoint won by {receiver.name}")

        display_score(
            p1_points,
            p2_points
        )

        # ---------------- GAME WINNER ----------------

        if (
            p1_points >= 4 and
            p1_points - p2_points >= 2
        ):

            print(f"\nGAME WON BY {server.name}")

            return server

        if (
            p2_points >= 4 and
            p2_points - p1_points >= 2
        ):

            print(f"\nGAME WON BY {receiver.name}")

            return receiver