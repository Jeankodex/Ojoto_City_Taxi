
from flask import current_app

def calculate_fare(distance_km: float) -> float:
    base = current_app.config["BASE_FARE"]
    per_km = current_app.config["RATE_PER_KM"]
    return base + (distance_km * per_km)



