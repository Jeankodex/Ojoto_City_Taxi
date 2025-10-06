import React from "react";

export default function FareSummary({ distance, duration, fare, onConfirm }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-2xl max-w-md">
      <h2 className="text-xl font-semibold mb-3">Trip Summary</h2>

      <div className="space-y-2 text-gray-700">
        <p>
          <span className="font-medium">Distance:</span> {distance} km
        </p>
        <p>
          <span className="font-medium">Duration:</span> {duration}
        </p>
        <p className="text-lg font-bold text-green-600">
          Fare: ₦{fare}
        </p>
      </div>

      <button
        onClick={onConfirm}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition-colors"
      >
        Confirm Booking
      </button>
    </div>
  );
}
