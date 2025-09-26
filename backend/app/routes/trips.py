
# backend/app/routes/trips.py
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Trip
from ..extensions import db
from ..utils.fare import calculate_fare
from . import trips_bp

@trips_bp.route("", methods=["POST"])
@jwt_required()
def create_trip():
    data = request.get_json() or {}
    required = ["destination_address", "date", "time", "distance_km"]
    for f in required:
        if not data.get(f) and data.get(f) != 0:
            return jsonify({"error": f"{f} is required"}), 400

    try:
        distance = float(data["distance_km"])
        if distance <= 0:
            return jsonify({"error": "distance_km must be a positive number"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "distance_km must be a number"}), 400

    user_id = get_jwt_identity()
    fare = calculate_fare(distance)

    trip = Trip(
        destination_address=data["destination_address"].strip(),
        date=data["date"],
        time=data["time"],
        distance_km=distance,
        fare=fare,
        user_id=user_id,
    )
    db.session.add(trip)
    db.session.commit()

    return jsonify({
        "msg": "Trip created",
        "trip": {
            "id": trip.id,
            "destination_address": trip.destination_address,
            "date": trip.date,
            "time": trip.time,
            "distance_km": trip.distance_km,
            "fare": trip.fare
        }
    }), 201


@trips_bp.route("", methods=["GET"])
@jwt_required()
def list_trips():
    user_id = get_jwt_identity()
    trips = Trip.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            "id": t.id,
            "destination_address": t.destination_address,
            "date": t.date,
            "time": t.time,
            "distance_km": t.distance_km,
            "fare": t.fare
        } for t in trips
    ])



@trips_bp.route("/<int:trip_id>", methods=["PUT"])
@jwt_required()
def update_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()

    if not trip:
        return jsonify({"msg": "Trip not found"}), 404

    data = request.get_json()
    trip.destination_address = data.get("destination_address", trip.destination_address)
    trip.date = data.get("date", trip.date)
    trip.time = data.get("time", trip.time)
    trip.distance_km = float(data.get("distance_km", trip.distance_km))
    trip.fare = calculate_fare(trip.distance_km)

    db.session.commit()

    return jsonify({
        "trip": {
            "id": trip.id,
            "destination_address": trip.destination_address,
            "date": trip.date,
            "time": trip.time,
            "distance_km": trip.distance_km,
            "fare": trip.fare
        }
    }), 200



@trips_bp.route("/<int:trip_id>", methods=["DELETE"])
@jwt_required()
def delete_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()

    if not trip:
        return jsonify({"msg": "Trip not found"}), 404

    db.session.delete(trip)
    db.session.commit()
    return jsonify({"msg": "Trip deleted successfully"}), 200
