import random
from engine.actions import SHOTS, PLACEMENTS
from engine.pressure import get_mental_multiplier

# ------------------------ PLAY SHOT ------------------------

STAMINA_COST = {
    "forehand": 1,
    "backhand": 1,
    "inside_out": 1.5,
    "slice": 0.5,
    "volley": 1.5,
    "dropshot": 2,
    "lob": 1
}


def play_shot(
    attacker,
    defender,
    shot_choice,
    pressure,
    placement="crosscourt"
):

    shot = SHOTS.get(shot_choice, SHOTS["forehand"])
    place_mod = PLACEMENTS.get(placement, PLACEMENTS["crosscourt"])

    cost = STAMINA_COST.get(shot_choice, 1)

    # ---------------- ATTACK STAT ----------------

    if shot_choice in ["forehand", "dropshot", "volley", "inside_out"]:
        attack_stat = attacker.forehand

    elif shot_choice == "backhand":
        attack_stat = attacker.backhand

    else:
        attack_stat = (
            attacker.forehand +
            attacker.backhand
        ) / 2

    attack_score = (
        attack_stat * 0.65 +
        shot["attack"] * 0.35 +
        place_mod.get("accuracy_bonus", 0) * 0.2
    )

    attack_score *= get_mental_multiplier(
        attacker,
        pressure
    )

    stamina_factor = (
        0.7 +
        (attacker.current_stamina / 100) * 0.3
    )

    attack_score *= stamina_factor

    # ---------------- DEFENSE ----------------

    defense_score = (
        defender.speed * 0.6 +
        defender.mental * 0.4
    )

    defense_factor = (
        0.7 +
        (defender.current_stamina / 100) * 0.3
    )

    defense_score *= defense_factor

    defense_score *= get_mental_multiplier(
        defender,
        pressure
    )

    # ---------------- RANDOMNESS ----------------

    attack_score += random.randint(-8, 8)
    defense_score += random.randint(-8, 8)

    # ---------------- STAMINA ----------------

    attacker.current_stamina = max(
        20,
        attacker.current_stamina - cost
    )

    defender.current_stamina = max(
        20,
        defender.current_stamina - 0.8
    )

    # ---------------- ERROR ----------------

    adjusted_risk = (
        shot["risk"] +
        place_mod.get("risk_mod", 0) +
        (100 - attacker.current_stamina) * 0.15
    )

    mental_bonus = attacker.mental - 70

    if pressure == "high":
        adjusted_risk -= mental_bonus * 0.05

    elif pressure == "extreme":
        adjusted_risk -= mental_bonus * 0.10

    adjusted_risk = max(1, adjusted_risk)

    if random.randint(1, 100) <= adjusted_risk:
        return "error"

    # ---------------- WINNER ----------------

    if attack_score > defense_score + 7:
        return "winner"

    return "continue"



# ------------------------ PLAY RALLY ------------------------

def play_rally(
    player1,
    player2,
    pressure,
    shot_provider
):

    attacker = player1
    defender = player2

    rally_length = 0

    while True:

        shot = shot_provider(attacker)

        rally_length += 1

        result = play_shot(
            attacker,
            defender,
            shot,
            pressure
        )

        if result == "winner":

            return (
                attacker,
                rally_length,
                "winner"
            )

        if result == "error":

            return (
                defender,
                rally_length,
                "error"
            )

        attacker, defender = (
            defender,
            attacker
        )