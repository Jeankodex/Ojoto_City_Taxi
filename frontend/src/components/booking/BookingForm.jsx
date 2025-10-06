
import React, { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

export default function BookingForm({ onTripReady }) {
  const originRef = useRef(null);
  const destRef = useRef(null);

  // Calculate distance, duration, fare
  const calculateDistance = () => {
    if (!originRef.current || !destRef.current) return;

    const originPlace = originRef.current.getPlace();
    const destPlace = destRef.current.getPlace();

    if (!originPlace || !destPlace) return;

    const originCoords = originPlace.geometry.location;
    const destCoords = destPlace.geometry.location;

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [originCoords],
        destinations: [destCoords],
        travelMode: "DRIVING",
      },
      (response, status) => {
        if (status === "OK") {
          const result = response.rows[0].elements[0];
          const distanceKm = result.distance.value / 1000; // meters → km
          const durationText = result.duration.text;

          // Simple fare logic
          const baseFare = 500; // ₦500
          const perKmRate = 200; // ₦200 per km
          const totalFare = baseFare + perKmRate * distanceKm;

          // Send all trip data back to parent
          onTripReady({
            origin: originPlace.formatted_address,
            destination: destPlace.formatted_address,
            originCoords: { lat: originCoords.lat(), lng: originCoords.lng() },
            destCoords: { lat: destCoords.lat(), lng: destCoords.lng() },
            distance: distanceKm.toFixed(2),
            duration: durationText,
            fare: totalFare.toFixed(2),
          });
        }
      }
    );
  };

  // Use browser location for origin
  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;

        // Set origin manually without autocomplete
        onTripReady({
          origin: "My Current Location",
          originCoords: { lat: latitude, lng: longitude },
          destination: null,
          destCoords: null,
          distance: null,
          duration: null,
          fare: null,
        });
      });
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Book a Trip</h2>

      {/* Origin input */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Pickup Location</label>
        <Autocomplete onLoad={(ref) => (originRef.current = ref)}>
          <input
            type="text"
            placeholder="Enter pickup location"
            className="w-full border p-2 rounded-md"
          />
        </Autocomplete>
        <button
          onClick={useMyLocation}
          className="mt-2 text-sm bg-blue-500 text-white px-3 py-1 rounded-md"
        >
          Use My Location
        </button>
      </div>

      {/* Destination input */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Destination</label>
        <Autocomplete onLoad={(ref) => (destRef.current = ref)}>
          <input
            type="text"
            placeholder="Enter destination"
            className="w-full border p-2 rounded-md"
          />
        </Autocomplete>
      </div>

      {/* Button */}
      <button
        onClick={calculateDistance}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-colors"
      >
        Calculate Fare
      </button>
    </div>
  );
}
