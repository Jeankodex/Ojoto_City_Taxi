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
    required = ["origin_address", "dest_address", "distance_km", "fare", "trip_date", "trip_time"]

    # ✅ Validate required fields
    for f in required:
        if not data.get(f) and data.get(f) != 0:
            return jsonify({"error": f"{f} is required"}), 400

    # ✅ Validate numeric fields
    try:
        distance = float(data["distance_km"])
        fare = float(data["fare"])
    except (ValueError, TypeError):
        return jsonify({"error": "distance_km and fare must be numbers"}), 400

    user_id = get_jwt_identity()

    # ✅ Create new Trip instance
    trip = Trip(
        passenger_id=user_id,
        trip_id=data.get("trip_id", ""),
        origin_address=data["origin_address"],
        dest_address=data["dest_address"],
        distance_km=distance,
        fare=fare,
        trip_date=data["trip_date"],
        trip_time=data["trip_time"],
        status="pending"
    )

    db.session.add(trip)
    db.session.commit()

    return jsonify({
        "msg": "Trip created successfully",
        "trip": trip_to_dict(trip)
    }), 201


# Helper function for consistent trip serialization
def trip_to_dict(t):
    return {
        "id": t.id,
        "origin_address": t.origin_address,
        "pickup_address": t.origin_address,
        "dest_address": t.dest_address,
        "destination_address": t.dest_address,
        "distance_km": t.distance_km,
        "fare": t.fare,
        "trip_date": getattr(t, "trip_date", None),
        "trip_time": getattr(t, "trip_time", None),
        "date": getattr(t, "trip_date", None),
        "time": getattr(t, "trip_time", None),
        "status": t.status,
        "created_at": t.created_at.strftime("%Y-%m-%d %H:%M:%S") if getattr(t, "created_at", None) else None
    }


# 🚖 List all trips for the logged-in passenger
@trips_bp.route("", methods=["GET"])
@jwt_required()
def list_trips():
    user_id = get_jwt_identity()
    trips = Trip.query.filter_by(passenger_id=user_id).all()
    return jsonify([trip_to_dict(t) for t in trips]), 200


# 🚖 Fetch a specific trip (for edit form)
@trips_bp.route("/<int:trip_id>", methods=["GET"])
@jwt_required()
def get_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, passenger_id=user_id).first()

    if not trip:
        return jsonify({"msg": "Trip not found"}), 404

    return jsonify(trip_to_dict(trip)), 200


# 🚖 Update a trip
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
    trip.trip_date = data.get("trip_date", trip.trip_date)
    trip.trip_time = data.get("trip_time", trip.trip_time)

    if "distance_km" in data:
        try:
            trip.distance_km = float(data["distance_km"])
            trip.fare = float(data.get("fare", trip.fare))
        except ValueError:
            return jsonify({"error": "distance_km and fare must be numeric"}), 400

    db.session.commit()

    return jsonify({
        "msg": "Trip updated successfully",
        "trip": trip_to_dict(trip)
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
