// frontend/src/components/booking/MapView.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";

// Ojoto fallback coords
const fallbackCenter = [6.0584, 6.8497];

export default function MapView({ origin, destination, onTripCreated }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const isInitializedRef = useRef(false);
  const lastTripRef = useRef(null);
  const [center, setCenter] = useState(fallbackCenter);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        () => setCenter(fallbackCenter)
      );
    }
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || isInitializedRef.current || !window.L) return;

    try {
      const L = window.L;
      if (mapRef.current._leaflet_id) return;

      const map = L.map(mapRef.current, {
        center: center,
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      mapInstanceRef.current = map;
      isInitializedRef.current = true;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 1,
        subdomains: ["a", "b", "c"],
      }).addTo(map);

      const createCustomIcon = (color, label) =>
        L.divIcon({
          className: "custom-div-icon",
          html: `
            <div style="
              background-color: ${color};
              width: 42px;
              height: 42px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 3px 10px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 15px;
              cursor: pointer;
              transition: all 0.25s ease;
            ">${label}</div>`,
          iconSize: [42, 42],
          iconAnchor: [21, 21],
        });

      mapInstanceRef.current.createCustomIcon = createCustomIcon;

      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
        mapInstanceRef.current?.setView(center, 13);
        setMapLoaded(true);
      }, 500);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [center]);

  useEffect(() => {
    const timer = setTimeout(initializeMap, 100);
    return () => clearTimeout(timer);
  }, [initializeMap]);

  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => mapInstanceRef.current.invalidateSize(), 100);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      mapInstanceRef.current &&
      mapLoaded &&
      origin &&
      destination &&
      window.L
    ) {
      const L = window.L;

      // Clear existing markers
      markersRef.current.forEach((m) =>
        mapInstanceRef.current.removeLayer(m)
      );
      markersRef.current = [];

      const originLabel = origin.display_name
        ? origin.display_name
        : `Lat: ${origin.lat.toFixed(4)}, Lng: ${origin.lng.toFixed(4)}`;
      const destLabel = destination.display_name
        ? destination.display_name
        : `Lat: ${destination.lat.toFixed(4)}, Lng: ${destination.lng.toFixed(4)}`;

      const originMarker = L.marker([origin.lat, origin.lng], {
        icon: mapInstanceRef.current.createCustomIcon("#3B82F6", "P"),
      }).addTo(mapInstanceRef.current);
      originMarker.bindPopup(
        `<div style="text-align:center;"><strong>🚗 Pickup</strong><br/><small>${originLabel}</small></div>`
      );
      markersRef.current.push(originMarker);

      const destMarker = L.marker([destination.lat, destination.lng], {
        icon: mapInstanceRef.current.createCustomIcon("#EF4444", "D"),
      }).addTo(mapInstanceRef.current);
      destMarker.bindPopup(
        `<div style="text-align:center;"><strong>🏁 Drop</strong><br/><small>${destLabel}</small></div>`
      );
      markersRef.current.push(destMarker);

      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
    }
  }, [origin, destination, mapLoaded]);

  useEffect(() => {
    if (origin && destination && onTripCreated) {
      const tripKey = `${origin.lat},${origin.lng}-${destination.lat},${destination.lng}`;
      if (lastTripRef.current === tripKey) return;
      lastTripRef.current = tripKey;

      const R = 6371;
      const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
      const dLon = ((destination.lng - origin.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((origin.lat * Math.PI) / 180) *
          Math.cos((destination.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      const duration = Math.round(distance * 2);
      
      let tripType = "local";
      let fare = 200 + 500 * distance;

      if (distance > 10) {
        tripType = "airport";
        fare = 200 + 500 * distance + 1000;
      } else if (distance > 20) {
        tripType = "intercity";
        fare = 300 + 800 * distance;
      }

      const trip = {
        id: Date.now().toString(),
        origin,
        destination,
        distance: Math.round(distance * 100) / 100,
        duration,
        type: tripType,
        fare: Math.round(fare),
        status: "pending",
        date: new Date(),
      };

      onTripCreated(trip);
    }
  }, [origin, destination, onTripCreated]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
      isInitializedRef.current = false;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-50 shadow-inner"
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm text-gray-600 font-medium text-lg">
          🗺️ Loading map...
        </div>
      )}
    </div>
  );
}
