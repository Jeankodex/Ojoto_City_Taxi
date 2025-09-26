
from flask import Blueprint

auth_bp = Blueprint("auth", __name__)
trips_bp = Blueprint("trips", __name__)
contact_bp = Blueprint("contact", __name__)

from . import auth, trips, contact

