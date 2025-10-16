

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("ojoto_token");
      if (!token) return;

      const res = await fetch("http://localhost:5000/api/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setTrips(data);
      } else {
        setMessage("❌ Failed to load trips.");
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      setMessage("❌ Server error. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const token = localStorage.getItem("ojoto_token");
      if (!token) return;

      const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMessage("✅ Trip deleted successfully!");
        setTrips((prev) => prev.filter((t) => t.id !== id));

        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to delete trip.");
      }
    } catch (err) {
      console.error("Delete trip error:", err);
      setMessage("❌ Server error. Please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/booking?edit=${id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Trips</h2>

      {message && (
        <div
          className={`p-3 rounded text-center mb-4 transition-all ${
            message.includes("✅")
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {trips.length === 0 ? (
        <p className="text-gray-500">No trips found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 border-b text-left">Origin</th>
                <th className="py-3 px-4 border-b text-left">Destination</th>
                <th className="py-3 px-4 border-b text-left">Date</th>
                <th className="py-3 px-4 border-b text-left">Time</th>
                <th className="py-3 px-4 border-b text-left">Fare (₦)</th>
                <th className="py-3 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{trip.origin_address}</td>
                  <td className="py-3 px-4 border-b">{trip.dest_address}</td>
                  <td className="py-3 px-4 border-b">{trip.trip_date}</td>
                  <td className="py-3 px-4 border-b">{trip.trip_time}</td>
                  <td className="py-3 px-4 border-b">{trip.fare}</td>
                  <td className="py-3 px-4 border-b text-center space-x-2">
                    <button
                      onClick={() => handleEdit(trip)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                     ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
