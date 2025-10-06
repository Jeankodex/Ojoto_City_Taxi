
from .extensions import db 
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(300), nullable=False)

    trips = db.relationship("Trip", backref="user", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    passenger_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

    # Location & Distance
    origin_lat = db.Column(db.Float)
    origin_lng = db.Column(db.Float)
    dest_lat = db.Column(db.Float)
    dest_lng = db.Column(db.Float)
    origin_address = db.Column(db.String(255))
    dest_address = db.Column(db.String(255))
    distance_km = db.Column(db.Float)

    # Fare & Status
    fare = db.Column(db.Float)
    status = db.Column(db.String(50), default="pending")


class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())