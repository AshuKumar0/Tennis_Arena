
# ---------------- SERVES ----------------
SERVES = {
    "wide": {
        "name": "Wide Slice Serve",
        "power": 75,
        "accuracy": 85,
        "ace_bonus": 2,
        "fault_risk": 10,
        "description": "Pulls receiver out wide off the court"
    },
    "body": {
        "name": "Body Jammer",
        "power": 80,
        "accuracy": 80,
        "ace_bonus": 1,
        "fault_risk": 12,
        "description": "Jams the receiver with high pace into body"
    },
    "t": {
        "name": "Flat T-Bomb",
        "power": 95,
        "accuracy": 65,
        "ace_bonus": 5,
        "fault_risk": 22,
        "description": "Blistering flat serve down the center line"
    },
    "kick": {
        "name": "Heavy Kick Serve",
        "power": 65,
        "accuracy": 95,
        "ace_bonus": 1,
        "fault_risk": 5,
        "description": "High top-spin bounce, extremely reliable"
    }
}

# ---------------- RETURNS ----------------
RETURNS = {
    "crosscourt": {
        "name": "Crosscourt Return",
        "defense": 80,
        "attack": 70,
        "risk": 12,
        "description": "Safe, deep crosscourt return over net low point"
    },
    "downline": {
        "name": "Down-The-Line Drive",
        "defense": 65,
        "attack": 85,
        "risk": 28,
        "description": "Aggressive line return to catch server out of position"
    },
    "chip_charge": {
        "name": "Chip & Charge",
        "defense": 60,
        "attack": 80,
        "risk": 32,
        "description": "Underspin return followed by immediate net approach"
    },
    "defensive_lob": {
        "name": "High Defensive Lob",
        "defense": 90,
        "attack": 40,
        "risk": 8,
        "description": "High arching return giving plenty of recovery time"
    },
    "drop_return": {
        "name": "Surprise Drop Return",
        "defense": 50,
        "attack": 90,
        "risk": 42,
        "description": "Feather touch return landing just over the net"
    },
    "block": {
        "name": "Compact Block",
        "defense": 85,
        "attack": 55,
        "risk": 10,
        "description": "Absorbs server pace with steady baseline return"
    }
}


# ---------------- SHOTS ----------------
SHOTS = {
    "forehand": {
        "name": "Topspin Forehand Drive",
        "attack": 85,
        "risk": 15,
        "description": "Heavy baseline topspin drive"
    },
    "backhand": {
        "name": "Backhand Drive",
        "attack": 78,
        "risk": 12,
        "description": "Clean, directional backhand stroke"
    },
    "inside_out": {
        "name": "Inside-Out Forehand",
        "attack": 90,
        "risk": 25,
        "description": "Stepping around backhand for devastating forehand angle"
    },
    "slice": {
        "name": "Low Underspin Slice",
        "attack": 65,
        "risk": 8,
        "description": "Skidding slice that stays low off the bounce"
    },
    "dropshot": {
        "name": "Touch Drop Shot",
        "attack": 92,
        "risk": 38,
        "description": "Soft touch drop shot right over net"
    },
    "lob": {
        "name": "Topspin Lob",
        "attack": 70,
        "risk": 18,
        "description": "Deep arching lob over aggressive net charger"
    },
    "volley": {
        "name": "Punch Volley / Smash",
        "attack": 88,
        "risk": 22,
        "description": "Aggressive net finish"
    }
}

# ---------------- PLACEMENTS ----------------
PLACEMENTS = {
    "crosscourt": {
        "name": "Crosscourt",
        "accuracy_bonus": 10,
        "risk_mod": 0,
        "description": "Target opposite corner (safest margin)"
    },
    "downline": {
        "name": "Down The Line",
        "accuracy_bonus": 0,
        "risk_mod": 10,
        "description": "Target straight line (high difficulty, high pressure)"
    },
    "center": {
        "name": "Deep Center",
        "accuracy_bonus": 15,
        "risk_mod": -5,
        "description": "Deep center line to jam footwork"
    },
    "angle": {
        "name": "Short Sharp Angle",
        "accuracy_bonus": -5,
        "risk_mod": 15,
        "description": "Extreme side angle to stretch opponent out of court"
    }
}