# backend/app/routes/trips.py
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Trip
from ..extensions import db
from . import trips_bp


# 🚖 Create a new trip
@trips_bp.route("", methods=["POST"])
@jwt_required()
def create_trip():
    data = request.get_json() or {}
    required = ["origin_address", "dest_address", "origin_lat", "origin_lng", "dest_lat", "dest_lng", "distance_km"]
    
    # Validate required fields
    for f in required:
        if not data.get(f) and data.get(f) != 0:
            return jsonify({"error": f"{f} is required"}), 400

    try:
        distance = float(data["distance_km"])
        if distance <= 0:
            return jsonify({"error": "distance_km must be positive"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "distance_km must be a number"}), 400

    user_id = get_jwt_identity()

    # 🚖 Fare calculation (simple rule: ₦500 base + ₦100 per km)
    base_fare = 500
    per_km_rate = 100
    fare = base_fare + (per_km_rate * distance)

    trip = Trip(
        passenger_id=user_id,
        origin_address=data["origin_address"].strip(),
        dest_address=data["dest_address"].strip(),
        origin_lat=data["origin_lat"],
        origin_lng=data["origin_lng"],
        dest_lat=data["dest_lat"],
        dest_lng=data["dest_lng"],
        distance_km=distance,
        fare=fare,
        status="pending"
    )

    db.session.add(trip)
    db.session.commit()

    return jsonify({
        "msg": "Trip created",
        "trip": {
            "id": trip.id,
            "origin": trip.origin_address,
            "destination": trip.dest_address,
            "distance_km": trip.distance_km,
            "fare": trip.fare,
            "status": trip.status
        }
    }), 201


# 🚖 List all trips for the logged-in passenger
@trips_bp.route("", methods=["GET"])
@jwt_required()
def list_trips():
    user_id = get_jwt_identity()
    trips = Trip.query.filter_by(passenger_id=user_id).all()
    return jsonify([
        {
            "id": t.id,
            "origin": t.origin_address,
            "destination": t.dest_address,
            "distance_km": t.distance_km,
            "fare": t.fare,
            "status": t.status
        } for t in trips
    ])


# 🚖 Update a trip (optional)
@trips_bp.route("/<int:trip_id>", methods=["PUT"])
@jwt_required()
def update_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, passenger_id=user_id).first()

    if not trip:
        return jsonify({"msg": "Trip not found"}), 404

    data = request.get_json() or {}
    trip.origin_address = data.get("origin_address", trip.origin_address)
    trip.dest_address = data.get("dest_address", trip.dest_address)
    trip.distance_km = float(data.get("distance_km", trip.distance_km))
    trip.fare = 500 + (100 * trip.distance_km)

    db.session.commit()

    return jsonify({
        "trip": {
            "id": trip.id,
            "origin": trip.origin_address,
            "destination": trip.dest_address,
            "distance_km": trip.distance_km,
            "fare": trip.fare,
            "status": trip.status
        }
    }), 200


# 🚖 Delete a trip
@trips_bp.route("/<int:trip_id>", methods=["DELETE"])
@jwt_required()
def delete_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, passenger_id=user_id).first()

    if not trip:
        return jsonify({"msg": "Trip not found"}), 404

    db.session.delete(trip)
    db.session.commit()
    return jsonify({"msg": "Trip deleted successfully"}), 200
