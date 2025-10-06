

import React, { useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import BookingForm from "../components/booking/BookingForm";
import MapView from "../components/booking/MapView";
import FareSummary from "../components/booking/FareSummary";

const libraries = ["places"]; // Needed for Google Autocomplete

export default function BookingPage() {
  const [tripData, setTripData] = useState(null);
  const [message, setMessage] = useState("");

  // Send booking to Flask backend
  const handleBooking = async () => {
    if (!tripData) return;

    try {
      const token = localStorage.getItem("access_token"); // stored after login
      const res = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          origin_address: tripData.origin,
          dest_address: tripData.destination,
          distance_km: tripData.distance,
          fare: tripData.fare,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Trip booked successfully!");
      } else {
        setMessage(`❌ Error: ${data.error || data.msg}`);
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}libraries={libraries}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {/* Left side: Form + Fare Summary */}
        <div className="space-y-4">
          <BookingForm onTripReady={setTripData} />
          {tripData && (
            <FareSummary
              distance={tripData.distance}
              duration={tripData.duration}
              fare={tripData.fare}
              onConfirm={handleBooking}
            />
          )}
          {message && <p className="mt-2 text-center">{message}</p>}
        </div>

        {/* Right side: Map */}
        <div className="h-[500px]">
          <MapView origin={tripData?.originCoords} destination={tripData?.destCoords} />
        </div>
      </div>
    </LoadScript>
  );
}
