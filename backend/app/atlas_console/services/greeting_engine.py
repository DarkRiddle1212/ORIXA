from datetime import datetime

class GreetingEngine:
    """
    Generates time-of-day and context-appropriate greetings.
    Strictly professional, objective, and SRE-styled.
    """
    
    def generate_greeting(self, hour: int, after_long_inactivity: bool = False) -> str:
        if after_long_inactivity:
            return "Welcome back. One automated database sandbox investigation completed during your absence."
            
        if 5 <= hour < 12:
            greeting_prefix = "Good morning."
        elif 12 <= hour < 17:
            greeting_prefix = "Good afternoon."
        elif 17 <= hour < 22:
            greeting_prefix = "Good evening."
        else:
            greeting_prefix = "System monitoring active."

        return f"{greeting_prefix} Atlas has completed the latest enterprise health assessment. All system paths stable."
