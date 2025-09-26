
# backend/app/routes/auth.py
from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User
from ..extensions import db
from . import auth_bp
import re

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    # required fields
    required = ["fullname", "address", "phone_number", "email", "password"]
    for f in required:
        if not data.get(f):
            return jsonify({"error": f"{f} is required"}), 400

    email = data.get("email", "").strip()
    phone = data.get("phone_number", "").strip()
    password = data.get("password", "")

    if not EMAIL_RE.match(email):
        return jsonify({"error": "Invalid email address"}), 400
    if not phone.isdigit() and not phone.startswith("+"):
        # allow +country...
        cleaned = phone.replace("+", "")
        if not cleaned.isdigit():
            return jsonify({"error": "Invalid phone number"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    user = User(
        fullname=data["fullname"].strip(),
        address=data["address"].strip(),
        phone_number=phone,
        email=email,
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))

    return jsonify({"msg": "User registered successfully", "access_token": token}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data["email"].strip()).first()
    if user and user.check_password(data["password"]):
        token = create_access_token(identity=str(user.id))
        return jsonify({"msg": "Login successful", "access_token": token}), 200
    return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = int (get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify({
        "fullname": user.fullname,
        "address": user.address,
        "phone_number": user.phone_number,
        "email": user.email
    })
