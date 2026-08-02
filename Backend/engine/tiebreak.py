from engine.point import play_point
from engine.rally import play_rally
from engine.pressure import get_pressure_level


def play_tiebreak(
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

    p1 = 0
    p2 = 0

    total_points = 0

    print("\n========== TIEBREAK ==========")

    while True:

        pressure = get_pressure_level(
            p1,
            p2
        )

        print(f"\nServer: {server.name}")

        # ---------------- SERVE ----------------

        print(f"\n{server.name}'s Serve")

        serve_choice = serve_provider(server)

        # ---------------- RETURN ----------------

        print(f"\n{receiver.name}'s Return")

        return_choice = return_provider(receiver)

        # ---------------- PLAY POINT ----------------

        point_result = play_point(
            server,
            receiver,
            serve_choice,
            return_choice,
            pressure
        )

        rally_length = 0
        rally_result = None

        # ---------------- DETERMINE POINT WINNER ----------------

        if point_result == "double_fault":

            point_winner = receiver

            if server == match.player1:
                match.stats.double_faults_p1 += 1
            else:
                match.stats.double_faults_p2 += 1

        elif point_result == "ace":

            point_winner = server
            match.stats.aces += 1

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

        # ---------------- UPDATE STATS ----------------

        match.stats.longest_rally = max(
            match.stats.longest_rally,
            rally_length
        )

        if point_winner == match.player1:

            p1 += 1
            match.stats.points_p1 += 1

        else:

            p2 += 1
            match.stats.points_p2 += 1

        # ---------------- DISPLAY SCORE ----------------

        print("\nTIEBREAK SCORE")

        print(
            f"{match.player1.name} {p1} - {p2} {match.player2.name}"
        )

        # ---------------- SERVER ROTATION ----------------

        total_points += 1

        # First point
        if total_points == 1:

            server, receiver = receiver, server

        # Then every two points
        elif total_points > 1 and total_points % 2 == 1:

            server, receiver = receiver, server

        # ---------------- WINNER ----------------

        if p1 >= 7 and p1 - p2 >= 2:

            print(
                f"\nTIEBREAK WON BY {match.player1.name}"
            )

            return match.player1

        if p2 >= 7 and p2 - p1 >= 2:

            print(
                f"\nTIEBREAK WON BY {match.player2.name}"
            )

            return match.player2