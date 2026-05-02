import os
from typing import List


class Config:
    """Base configuration - all sensitive data loaded from environment variables"""

    # ============================================================================
    # SECURITY SETTINGS
    # ============================================================================

    # Flask Secret Key - REQUIRED for session security
    SECRET_KEY = os.getenv("SECRET_KEY")
    if not SECRET_KEY:
        raise ValueError(
            "SECRET_KEY environment variable is required. "
            "Generate with: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
        )

    # JWT Secret Key - REQUIRED for token signing
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        raise ValueError(
            "JWT_SECRET_KEY environment variable is required. "
            "Generate with: python -c \"import secrets; print(secrets.token_hex(32))\""
        )

    # JWT Configuration
    JWT_TOKEN_LOCATION: List[str] = ["headers"]
    JWT_HEADER_TYPE: str = "Bearer"

    # ============================================================================
    # DATABASE SETTINGS
    # ============================================================================

    # Database URI - REQUIRED for database connection
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError(
            "DATABASE_URL environment variable is required. "
            "Format: postgresql://user:password@host:port/database"
        )

    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # ============================================================================
    # CORS SETTINGS
    # ============================================================================

    # Allowed Origins - REQUIRED for CORS configuration
    ALLOWED_ORIGINS_STR = os.getenv("ALLOWED_ORIGINS")
    if not ALLOWED_ORIGINS_STR:
        raise ValueError(
            "ALLOWED_ORIGINS environment variable is required. "
            "Format: https://yourdomain.com,https://www.yourdomain.com"
        )

    ALLOWED_ORIGINS: List[str] = [origin.strip() for origin in ALLOWED_ORIGINS_STR.split(",")]

    # ============================================================================
    # APPLICATION SETTINGS
    # ============================================================================

    # Taxi fare configuration
    BASE_FARE_STR = os.getenv("BASE_FARE")
    if not BASE_FARE_STR:
        raise ValueError("BASE_FARE environment variable is required (e.g., '200')")

    RATE_PER_KM_STR = os.getenv("RATE_PER_KM")
    if not RATE_PER_KM_STR:
        raise ValueError("RATE_PER_KM environment variable is required (e.g., '500')")

    try:
        BASE_FARE: int = int(BASE_FARE_STR)
        RATE_PER_KM: int = int(RATE_PER_KM_STR)
    except ValueError as e:
        raise ValueError(f"BASE_FARE and RATE_PER_KM must be valid integers: {e}")

    # ============================================================================
    # FLASK ENVIRONMENT
    # ============================================================================

    # Flask environment detection
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = FLASK_ENV == "development"

    # ============================================================================
    # FILE UPLOAD SETTINGS (Optional)
    # ============================================================================

    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", "16777216"))  # 16MB default
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "app/static/uploads")


class DevelopmentConfig(Config):
    """Development configuration with relaxed security for local development"""

    DEBUG = True

    # In development, we might allow localhost origins if not specified
    if not os.getenv("ALLOWED_ORIGINS"):
        ALLOWED_ORIGINS = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ]


class ProductionConfig(Config):
    """Production configuration with strict security requirements"""

    DEBUG = False

    # Additional production validations can be added here
    def __init__(self):
        super().__init__()
        # Validate that we're using HTTPS URLs in production
        for origin in self.ALLOWED_ORIGINS:
            if not origin.startswith("https://"):
                raise ValueError(f"Production requires HTTPS origins, got: {origin}")


# Configuration mapping
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}


def get_config(config_name: str = None) -> Config:
    """Get configuration class based on environment"""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    config_class = config.get(config_name, config["default"])
    return config_class()
