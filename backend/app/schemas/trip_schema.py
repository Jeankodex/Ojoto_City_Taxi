
from marshmallow import Schema, fields

class TripSchema(Schema):
    id = fields.Int(dump_only=True)
    destination_address = fields.Str(required=True)
    date = fields.Str(required=True)
    time = fields.Str(required=True)
    distance_km = fields.Float(required=True)
    fare = fields.Float(dump_only=True)
