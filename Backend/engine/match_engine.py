from engine.sets import play_set


def play_match(
    match,
    serve_provider,
    return_provider,
    shot_provider
):

    print(
        "\n========== MATCH START ==========\n"
    )

    while True:

        # ---------------- PLAY SET ----------------

        set_winner = play_set(
            match,
            serve_provider,
            return_provider,
            shot_provider
        )

        # ---------------- UPDATE MATCH ----------------

        match.set_won_by(
            set_winner
        )

        # ---------------- DISPLAY MATCH SCORE ----------------

        print(
            "\nMATCH SCORE"
        )

        print(
            f"{match.player1.name}: "
            f"{match.sets_p1} sets"
        )

        print(
            f"{match.player2.name}: "
            f"{match.sets_p2} sets"
        )

        # ---------------- CHECK MATCH WINNER ----------------

        if match.sets_p1 == 2:

            match.stats.display(
                match.player1,
                match.player2
            )

            print(
                f"\nMATCH WON BY "
                f"{match.player1.name}"
            )

            return match.player1

        if match.sets_p2 == 2:

            match.stats.display(
                match.player1,
                match.player2
            )

            print(
                f"\nMATCH WON BY "
                f"{match.player2.name}"
            )

            return match.player2

        # ---------------- RECOVER STAMINA ----------------

        match.recover_stamina()