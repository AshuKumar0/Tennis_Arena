from engine.player import Player
from engine.match import Match
from engine.match_engine import play_match
from engine.utils import (
    get_serve_choice,
    get_return_choice,
    get_user_shot
)
player1 = Player(
    "Ankur",
    80,
    75,
    70,
    78,
    74,
    85,
    80
)

player2 = Player(
    "Virat",
    75,
    72,
    68,
    80,
    76,
    82,
    78
)

match = Match(
    player1,
    player2
)

winner = play_match(
    match,
    get_serve_choice,
    get_return_choice,
    get_user_shot
)

print(
    f"\n🏆 Champion: {winner.name}"
)