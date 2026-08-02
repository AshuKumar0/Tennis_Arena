# ---------------- PRESSURE LEVELS ----------------

def get_pressure_level(
    p1_points,
    p2_points
):

    # Deuce / Advantage
    if p1_points >= 3 and p2_points >= 3:
        return "high"

    # 30-30
    if p1_points == 2 and p2_points == 2:
        return "high"

    # Game Point
    if (
        (p1_points == 3 and p2_points <= 2) or
        (p2_points == 3 and p1_points <= 2)
    ):
        return "extreme"

    return "normal"


# ---------------- MENTAL MULTIPLIER ----------------

def get_mental_multiplier(
    player,
    pressure
):

    if pressure == "normal":
        return 1.0

    strength = (player.mental - 70) / 100

    if pressure == "high":
        return 1 + strength * 0.25

    if pressure == "extreme":
        return 1 + strength * 0.50

    return 1.0