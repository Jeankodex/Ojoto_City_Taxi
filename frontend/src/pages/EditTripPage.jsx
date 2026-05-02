import React, { useEffect, useState, useRef } from "react";
import BookingForm from "../components/booking/BookingForm";
import FareSummary from "../components/booking/FareSummary";
import MapView from "../components/booking/MapView";
import { useParams, useNavigate } from "react-router-dom";

export default function EditTripPage() {
  const { tripId } = useParams(); 
  const [tripData, setTripData] = useState(null); 
  const [message, setMessage] = useState("");
  const [mapCoords, setMapCoords] = useState({ originCoords: null, destCoords: null });
  const navigate = useNavigate();

  // ✅ Add ref for trip summary
  const tripSummaryRef = useRef(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) {
        setMessage("Invalid trip id.");
        return;
      }
      try {
        const token = localStorage.getItem("ojoto_token");
        const res = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage("❌ Failed to load trip details.");
          return;
        }

        setTripData({
          id: data.id,
          origin_address: data.origin_address,
          dest_address: data.dest_address,
          distance_km: data.distance_km,
          fare: data.fare,
          trip_date: data.trip_date,
          trip_time: data.trip_time,
          origin: data.origin_address,
          destination: data.dest_address,
          date: data.date,
          time: data.time,
        });
      } catch (err) {
        console.error("Error fetching trip:", err);
        setMessage("❌ Error loading trip data.");
      }
    };

    fetchTrip();
  }, [tripId]);

  // ✅ BookingForm callback
  const handleTripReady = (payload) => {
    setTripData((prev) => ({
      ...(prev || {}),
      origin_address: payload.origin ?? prev?.origin_address,
      dest_address: payload.destination ?? prev?.dest_address,
      origin: payload.origin ?? prev?.origin,
      destination: payload.destination ?? prev?.destination,
      distance_km: payload.distance ?? prev?.distance_km,
      fare: payload.fare ?? prev?.fare,
      duration: payload.duration ?? prev?.duration,
      trip_date: payload.tripDate ?? prev?.trip_date,
      trip_time: payload.tripTime ?? prev?.trip_time,
      calculated: payload.calculated === true,
    }));

    setMapCoords({
      originCoords: payload.originCoords ?? null,
      destCoords: payload.destCoords ?? null,
    });

    // ✅ Auto scroll when fare is calculated
    if (payload.calculated === true) {
      setTimeout(() => {
        tripSummaryRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  };

  // ✅ Update trip handler
  const handleUpdate = async () => {
    if (!tripData || !tripId) return;
    try {
      const token = localStorage.getItem("ojoto_token");
      const res = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origin_address: tripData.origin_address,
          dest_address: tripData.dest_address,
          distance_km: tripData.distance_km,
          fare: tripData.fare,
          trip_date: tripData.trip_date,
          trip_time: tripData.trip_time,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Trip updated successfully!");
        setTimeout(() => {
          setMessage("");
          navigate("/dashboard");
        }, 3000);
      } else {
        setMessage(`❌ ${data.error || data.msg || "Failed to update trip"}`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ Server error while updating.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!tripData) {
    return <p className="text-center text-gray-500 mt-10">{message || "Loading..."}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit Trip</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-6">
            <BookingForm
              onTripReady={handleTripReady}
              initialData={{
                origin_address: tripData.origin_address,
                dest_address: tripData.dest_address,
                distance_km: tripData.distance_km,
                fare: tripData.fare,
                trip_date: tripData.trip_date,
                trip_time: tripData.trip_time,
                origin: tripData.origin_address,
                destination: tripData.dest_address,
                tripDate: tripData.trip_date,
                tripTime: tripData.trip_time,
              }}
            />

            {/* ✅ Smooth scroll target */}
            {tripData.calculated && (
              <div ref={tripSummaryRef}>
                <FareSummary
                  distance={tripData.distance_km}
                  duration={tripData.duration}
                  fare={tripData.fare}
                  tripDate={tripData.trip_date}
                  tripTime={tripData.trip_time}
                  onConfirm={handleUpdate}
                  isLoading={false}
                />
              </div>
            )}

            {message && (
              <div
                className={`p-4 rounded-lg text-center transition-all ${
                  message.includes("✅")
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}
          </div>

          {/* Right: Map */}
          <div className="lg:sticky lg:top-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Trip Route</h2>
              <p className="text-sm text-gray-600">
                View & edit pickup and destination on the map
              </p>
            </div>
            <div
              className="h-[500px] w-full rounded-lg border border-gray-200 shadow-lg bg-white overflow-hidden"
              style={{ position: "relative" }}
            >
              <MapView
                origin={mapCoords.originCoords}
                destination={mapCoords.destCoords}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
