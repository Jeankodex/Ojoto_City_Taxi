
from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    fullname = fields.Str(required=True)
    address = fields.Str(required=True)
    phone_number = fields.Str(required=True)
    email = fields.Email(required=True)
