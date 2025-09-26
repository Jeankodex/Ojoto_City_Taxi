import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://ojoto_user:ojoto_pass@localhost:5432/ojoto_city_cab"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")

    # 🚀 Add these lines
    JWT_TOKEN_LOCATION = ["headers"]   # only accept tokens in headers
    JWT_HEADER_TYPE = "Bearer"         # expect "Authorization: Bearer <token>"

    BASE_FARE = int(os.getenv("BASE_FARE", 200))
    RATE_PER_KM = int(os.getenv("RATE_PER_KM", 500))




