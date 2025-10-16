import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BookingForm from "../components/booking/BookingForm";
import MapView from "../components/booking/MapView";
import FareSummary from "../components/booking/FareSummary";

export default function BookingPage() {
  const [tripData, setTripData] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const editTripId = queryParams.get("edit");

  useEffect(() => {
    const loadTripForEdit = async () => {
      if (!editTripId) return;
      const token = localStorage.getItem("ojoto_token");
      if (!token) return;

      try {
        const res = await fetch(`http://localhost:5000/api/trips/${editTripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setTripData({
            origin: data.origin_address,
            destination: data.dest_address,
            distance: data.distance_km,
            fare: data.fare,
            tripDate: data.trip_date,
            tripTime: data.trip_time,
            originCoords: data.origin_coords,
            destCoords: data.dest_coords,
          });
          setCurrentTrip({ id: data.id, status: data.status });
        } else {
          setMessage("❌ Failed to load trip for editing.");
        }
      } catch (err) {
        console.error("Edit trip load error:", err);
        setMessage("❌ Error loading trip data.");
      }
    };
    loadTripForEdit();
  }, [editTripId]);

  const handleTripData = (data) => {
    setTripData(data);
    setCurrentTrip(null);
    setMessage("");
  };

  const handleTripCreated = useCallback((trip) => {
    setCurrentTrip(trip);
    setTripData((prev) =>
      prev
        ? { ...prev, distance: trip.distance, duration: trip.duration, fare: trip.fare }
        : prev
    );
  }, []);

  const handleBooking = async () => {
    if (!tripData) return;
    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("ojoto_token");
      if (!token) {
        setMessage("❌ Please login first to book a trip.");
        setIsLoading(false);
        return;
      }

      const isEditMode = !!editTripId;
      const url = isEditMode
        ? `http://localhost:5000/api/trips/${editTripId}`
        : "http://localhost:5000/api/trips";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origin_address: tripData.origin,
          dest_address: tripData.destination,
          distance_km: tripData.distance ?? currentTrip?.distance,
          fare: tripData.fare ?? currentTrip?.fare,
          trip_date: tripData.tripDate,
          trip_time: tripData.tripTime,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(isEditMode ? "✅ Trip updated successfully!" : "✅ Trip booked successfully!");
        setTimeout(() => {
          setMessage("");
          navigate("/dashboard");
        }, 3000);
      } else {
        setMessage(`❌ ${data.error || data.msg || "Failed to process trip"}`);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setMessage("❌ Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            {editTripId ? "Edit Trip" : "Book Your Ride"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {editTripId
              ? "Update your trip details below."
              : "Enter your pickup and destination to get started."}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Form & Fare */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <BookingForm onTripReady={handleTripData} initialData={tripData} />
            </div>

            {tripData && (
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <FareSummary
                  distance={tripData.distance}
                  duration={tripData.duration}
                  fare={tripData.fare}
                  tripDate={tripData.tripDate}
                  tripTime={tripData.tripTime}
                  onConfirm={handleBooking}
                  isLoading={isLoading}
                  confirmLabel={editTripId ? "Update Trip" : "Confirm Booking"}
                />
              </div>
            )}

            {message && (
              <div
                className={`p-4 rounded-xl font-medium text-center transition-all duration-200 shadow-sm ${
                  message.includes("✅")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}
          </div>

          {/* Right Column - Map */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Trip Route
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                View your pickup and destination on the map
              </p>
              <div className="h-[480px] w-full rounded-lg border border-gray-200 overflow-hidden">
                <MapView
                  origin={tripData?.originCoords}
                  destination={tripData?.destCoords}
                  onTripCreated={handleTripCreated}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
