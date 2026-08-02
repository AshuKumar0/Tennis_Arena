class MatchStats:

    def __init__(self):

        self.aces = 0

        self.points_p1 = 0
        self.points_p2 = 0

        self.longest_rally = 0
        
        self.winners_p1 = 0
        self.winners_p2 = 0

        self.errors_p1 = 0
        self.errors_p2 = 0
        
        self.double_faults_p1 = 0
        self.double_faults_p2 = 0

    def display(
        self,
        player1,
        player2
    ):

        print(
            "\n========== MATCH STATS =========="
        )

        print(
            f"Aces: {self.aces}"
        )

        print(
            f"\nPoints Won:"
        )

        print(
            f"{player1.name}: "
            f"{self.points_p1}"
        )

        print(
            f"{player2.name}: "
            f"{self.points_p2}"
        )

        print(
            f"\nLongest Rally: "
            f"{self.longest_rally} shots"
        )
        print("\nWINNERS")

        print(
            f"{player1.name}: "
            f"{self.winners_p1}"
        )

        print(
            f"{player2.name}: "
            f"{self.winners_p2}"
        )

        print("\nUNFORCED ERRORS")

        print(
            f"{player1.name}: "
            f"{self.errors_p1}"
        )

        print(
            f"{player2.name}: "
            f"{self.errors_p2}"
        )
        
        print("\nDOUBLE FAULTS")

        print(
            f"{player1.name}: "
            f"{self.double_faults_p1}"
        )

        print(
            f"{player2.name}: "
            f"{self.double_faults_p2}"
        )