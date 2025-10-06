import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import api, {getProfile, listTrips} from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  // Fetch trips
  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await listTrips();
      setTrips(res.data);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTrips();
  }, []);

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await api.deleteTrip(tripId);
      setMessage("✅ Trip deleted successfully!");
      fetchTrips();
    } catch (err) {
      setMessage("❌ Error deleting trip.");
    }
  };

  const handleEdit = (tripId) => navigate(`/edit-trip/${tripId}`);
  const handlePayment = (tripId) =>
    alert(`💳 Payment for Trip #${tripId} will be integrated soon!`);

  if (!user) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="p-6 space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
      {/* Profile & Welcome */}
      <div className="col-span-1 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome, {user.firstname}!
        </h2>
        <ProfileCard user={user} />
      </div>

      {/* Trips Section */}
      <div className="col-span-2 bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">My Trips</h1>
          <button
            onClick={() => navigate("/book")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            + Book New Trip
          </button>
        </div>

        {message && (
          <p className="mb-4 text-center text-green-600 font-medium">{message}</p>
        )}

        {loading ? (
          <p>Loading trips...</p>
        ) : trips.length === 0 ? (
          <p className="text-gray-600">No trips booked yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  {["#", "Origin", "Destination", "Distance (km)", "Fare (₦)", "Date", "Time", "Actions"].map((col) => (
                    <th key={col} className="p-3 border-b text-gray-700 font-semibold">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trips.map((trip, i) => (
                  <tr key={trip.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border-b">{i + 1}</td>
                    <td className="p-3 border-b">{trip.origin_address || "—"}</td>
                    <td className="p-3 border-b">{trip.destination_address || "—"}</td>
                    <td className="p-3 border-b">{trip.distance_km}</td>
                    <td className="p-3 border-b font-semibold text-green-600">₦{trip.fare}</td>
                    <td className="p-3 border-b">{trip.date || "—"}</td>
                    <td className="p-3 border-b">{trip.time || "—"}</td>
                    <td className="p-3 border-b space-x-2">
                      <button
                        onClick={() => handleEdit(trip.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handlePayment(trip.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition"
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
