import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Ojoto fallback coords
const fallbackCenter = { lat: 6.0584, lng: 6.8497 };

export default function MapView({ origin, destination }) {
  const [center, setCenter] = useState(fallbackCenter);

  // Try to get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // If user denies location → keep fallback
          setCenter(fallbackCenter);
        }
      );
    }
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
    >
      {/* Origin Marker */}
      {origin && (
        <Marker
          position={origin}
          label="A"
        />
      )}

      {/* Destination Marker */}
      {destination && (
        <Marker
          position={destination}
          label="B"
        />
      )}
    </GoogleMap>
  );
}
