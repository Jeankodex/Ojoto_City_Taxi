
from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import ContactMessage
from . import contact_bp


@contact_bp.route("", methods=["POST"])
def save_message():
    data = request.json
    try:
        new_msg = ContactMessage(
            name=data["name"],
            email=data["email"],
            message=data["message"]
        )
        db.session.add(new_msg)
        db.session.commit()
        return jsonify({"message": "Message sent successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
