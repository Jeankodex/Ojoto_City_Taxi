import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { fetchProfile, listTrips, deleteTrip } from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [profileRes, tripsRes] = await Promise.all([
          fetchProfile(),
          listTrips(),
        ]);
        if (isMounted) {
          setUser(profileRes.data);
          setTrips(tripsRes.data);
        }
      } catch (err) {
        console.error("❌ Failed to load dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      await deleteTrip(tripId);
      setMessage("✅ Trip deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
      const res = await listTrips();
      setTrips(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting trip.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEdit = (trip) => navigate(`/edit-trip/${trip.id}`);
  const handlePayment = (tripId) =>
    alert(`💳 Payment for Trip #${tripId} will be integrated soon!`);
  const handleBookTrip = () => navigate("/book");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <p className="p-4 text-center text-red-600 font-medium">
        Failed to load profile. Please log in again.
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="col-span-1">
          <ProfileCard user={user} />
        </div>

        {/* Trips Section */}
        <div className="col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              My Trips
            </h1>
            <button
              onClick={handleBookTrip}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all duration-200"
            >
              + Book New Trip
            </button>
          </div>

          {message && (
            <p className="mb-4 text-center text-green-700 font-medium bg-green-50 py-2 rounded-lg border border-green-200">
              {message}
            </p>
          )}

          {trips.length === 0 ? (
            <p className="text-gray-600 italic text-center py-8">
              No trips booked yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="hidden md:table min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <tr>
                    {[
                      "#",
                      "Origin",
                      "Destination",
                      "Distance (km)",
                      "Fare (₦)",
                      "Date",
                      "Time",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="p-3 text-left font-semibold border-b border-gray-200"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip, i) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-indigo-50 transition duration-150"
                    >
                      <td className="p-3 border-b text-gray-700">{i + 1}</td>
                      <td className="p-3 border-b">{trip.origin_address || "—"}</td>
                      <td className="p-3 border-b">{trip.destination_address || "—"}</td>
                      <td className="p-3 border-b">{trip.distance_km}</td>
                      <td className="p-3 border-b font-semibold text-indigo-700">
                        ₦{trip.fare.toLocaleString()}
                      </td>
                      <td className="p-3 border-b">{trip.date || "—"}</td>
                      <td className="p-3 border-b">{trip.time || "—"}</td>
                      <td className="p-3 border-b">
                        <div className="flex flex-col items-stretch gap-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(trip)}
                              className="bg-yellow-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-yellow-600 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(trip.id)}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 transition"
                            >
                              Delete
                            </button>
                          </div>
                          <button
                            onClick={() => handlePayment(trip.id)}
                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700 transition"
                          >
                            Pay Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {trips.map((trip, i) => (
                  <div
                    key={trip.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-2 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-indigo-700">
                        Trip #{i + 1}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {trip.date || "—"} | {trip.time || "—"}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-medium">From:</span>{" "}
                      {trip.origin_address || "—"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">To:</span>{" "}
                      {trip.destination_address || "—"}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600 text-sm">{trip.distance_km} km</p>
                      <p className="text-indigo-700 font-semibold">
                        ₦{trip.fare.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(trip)}
                        className="bg-yellow-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handlePayment(trip.id)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition"
                      >
                        Pay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
