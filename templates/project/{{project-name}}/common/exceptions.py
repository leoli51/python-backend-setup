class GreetingsException(Exception):
    """Example exception for demonstration purposes."""

    def __init__(self, name: str) -> None:
        super().__init__(f"{name} is not a valid name")
        self.name = name
