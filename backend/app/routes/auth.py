
# backend/app/routes/auth.py
import time
from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User
from ..extensions import db
from . import auth_bp
import re
import os
from flask import current_app
from werkzeug.utils import secure_filename
from PIL import Image  # optional: pip install pillow

ALLOWED_EXT = {"png", "jpg", "jpeg", "webp"}
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2 MB

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




def allowed_file(filename):
    ext = filename.rsplit(".", 1)[-1].lower()
    return "." in filename and ext in ALLOWED_EXT

@auth_bp.route("/profile", methods=["GET", "PUT"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if request.method == "GET":
        return jsonify({
            "id": user.id,
            "fullname": user.fullname,
            "email": user.email,
            "phone_number": user.phone_number,
            "address": user.address,
            "profile_image": user.profile_image  # filename or None
        }), 200

    # PUT = update profile
    # Note: use multipart/form-data on frontend
    fullname = request.form.get("fullname", user.fullname)
    email = request.form.get("email", user.email)
    phone = request.form.get("phone_number", user.phone_number)
    address = request.form.get("address", user.address)

    # handle file
    file = request.files.get("file")  # 'file' key from FormData
    upload_folder = os.path.join(current_app.root_path, "static", "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    if file:
        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed"}), 400

        filename = secure_filename(file.filename)
        # to avoid collisions, prefix timestamp or user id:
        filename = f"{user.id}_{int(time.time())}_{filename}"
        filepath = os.path.join(upload_folder, filename)

        # optional size check (Flask will already hold file in memory/tmp)
        file.seek(0, os.SEEK_END)
        filesize = file.tell()
        file.seek(0)
        if filesize > MAX_FILE_SIZE:
            return jsonify({"error": "File too large"}), 400

        # Save file
        file.save(filepath)
        


        # optional: resize image to max width for storage
        try:
            img = Image.open(filepath)
            img.thumbnail((800, 800))
            img.save(filepath, optimize=True, quality=85)
        except Exception:
            # if Pillow not available or fails, ignore (file already saved)
            pass

        # delete old file if it exists
        if user.profile_image:
            old_path = os.path.join(upload_folder, user.profile_image)
            if os.path.exists(old_path):
                try:
                    import os as real_os
                    real_os.remove(old_path)
                except Exception as e:
                    current_app.logger.warning(f"Failed to delete old image: {e}")
    user.profile_image = filename

    # update textual fields
    user.fullname = fullname
    user.email = email
    user.phone_number = phone
    user.address = address

    db.session.commit()
    db.session.refresh(user)

    return jsonify({
        "msg": "Profile updated",
        "user": {
            "id": user.id,
            "fullname": user.fullname,
            "email": user.email,
            "phone_number": user.phone_number,
            "address": user.address,
            "profile_image": user.profile_image
        }
    }), 200

