class Player:

    def __init__(
        self,
        name,
        serve,
        forehand,
        backhand,
        speed,
        return_skill,
        stamina,
        mental
    ):

        self.name = name

        self.serve = serve
        self.forehand = forehand
        self.backhand = backhand
        self.speed = speed

        self.return_skill = return_skill
        self.mental = mental
        self.stamina = stamina
        self.current_stamina = stamina

    def display_stats(self):

        print(f"\n{self.name}")

        print(f"Serve: {self.serve}")
        print(f"Forehand: {self.forehand}")
        print(f"Backhand: {self.backhand}")
        print(f"Speed: {self.speed}")

        print(f"Return: {self.return_skill}")
        print(f"Mental: {self.mental}")
        print(f"Current Stamina: {self.current_stamina}")