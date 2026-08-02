# ------------------------ SERVE CHOICE ------------------------

def get_serve_choice(player=None):

    print("\nChoose your serve:")
    print("1. Wide")
    print("2. Body")
    print("3. T")
    print("4. Kick")

    choices = {
        "1": "wide",
        "2": "body",
        "3": "t",
        "4": "kick"
    }

    while True:

        choice = input("Enter choice: ")

        if choice in choices:
            return choices[choice]

        print("Invalid choice. Try again.")


# ------------------------ RETURN CHOICE ------------------------

def get_return_choice(player=None):

    print("\nChoose your return:")
    print("1. Block")
    print("2. Deep")
    print("3. Aggressive")
    print("4. Slice")

    choices = {
        "1": "block",
        "2": "deep",
        "3": "aggressive",
        "4": "slice"
    }

    while True:

        choice = input("Enter choice: ")

        if choice in choices:
            return choices[choice]

        print("Invalid choice. Try again.")


# ------------------------ USER SHOT ------------------------

def get_user_shot(player=None):

    print("\nChoose your shot:")
    print("1. Forehand")
    print("2. Backhand")
    print("3. Slice")
    print("4. Dropshot")
    print("5. Lob")
    print("6. Volley")

    choices = {
        "1": "forehand",
        "2": "backhand",
        "3": "slice",
        "4": "dropshot",
        "5": "lob",
        "6": "volley"
    }

    while True:

        choice = input("Enter choice: ")

        if choice in choices:
            return choices[choice]

        print("Invalid choice. Try again.")