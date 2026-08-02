import random
from engine.actions import SERVES, RETURNS
from engine.pressure import get_mental_multiplier

def play_point(
    server,
    receiver,
    serve_choice,
    return_choice,
    pressure
):
    
    print(f"\n{server.name} serves {serve_choice}.")
    print(f"{receiver.name} attempts a {return_choice} return.")

    # ----------------- SERVE SCORE -----------------
    fault_risk = SERVES[serve_choice]["fault_risk"]

    if random.randint(1, 100) <= fault_risk:
        print("\n❌ First Serve Fault")

        second_fault_risk = fault_risk // 2

        if random.randint(1, 100) <= second_fault_risk:
            print("❌ DOUBLE FAULT")
            return "double_fault"
        print("✅ Second Serve In")
    
    serve_score = (
        server.serve * 0.7 +
        SERVES[serve_choice]["power"] * 0.4 +
        SERVES[serve_choice]["accuracy"] * 0.2
    )
    serve_score *= get_mental_multiplier(server,pressure)
    # ----------------- RETURN SCORE -----------------

    return_score = (
        receiver.return_skill * 0.6 +
        RETURNS[return_choice]["defense"] * 0.3
    )
    return_score *= get_mental_multiplier(receiver,pressure)
    # Small randomness
    serve_score += random.randint(-5, 5)
    return_score += random.randint(-5, 5)

    print(f"Serve Score: {serve_score:.1f}")
    print(f"Return Score: {return_score:.1f}")

    # ----------------- PROBABILITY -----------------

    serve_advantage = serve_score / (
        serve_score + return_score
    )

    print(
        f"Server Advantage: "
        f"{serve_advantage*100:.1f}%"
    )

    # Random roll
    roll = random.random()

    # ----------------- ACE -----------------

    # Only possible if serve advantage is high
    ace_chance = max(2, ((serve_advantage - 0.50) * 40)) + SERVES[serve_choice]["ace_bonus"]


    if random.uniform(0, 100) < ace_chance:
        print("🎾 ACE!")
        return "ace"

    # ----------------- MAIN OUTCOME -----------------

    if roll < serve_advantage:

        weak_return_chance = 0.4

        if random.random() < weak_return_chance:
            print("Weak return. Server wins point.")
            return "server_wins"

        print("Return lands in. Rally begins.")
        return "rally"

    else:

        print("Strong return. Rally begins.")
        return "rally"
    