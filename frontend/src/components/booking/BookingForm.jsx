// frontend/src/components/booking/BookingForm.jsx
import React, { useState, useEffect, useRef } from "react";

/*
  Notes:
  - Replace NOMINATIM_CONTACT_EMAIL with your contact email (Nominatim polite usage).
  - For production or higher volume, switch to a paid geocoding provider (Mapbox, Google, LocationIQ).
*/
const NOMINATIM_CONTACT_EMAIL = "johnwachuks@gmail.com";
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export default function BookingForm({ onTripReady, initialData }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [tripTime, setTripTime] = useState("");

  const [originCoords, setOriginCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);

  // autocomplete state
  const [originResults, setOriginResults] = useState([]);
  const [destResults, setDestResults] = useState([]);
  const [originOpen, setOriginOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [originFocusIndex, setOriginFocusIndex] = useState(-1);
  const [destFocusIndex, setDestFocusIndex] = useState(-1);

  const hasPrefilled = useRef(false); // prevents re-prefill after typing
  const originTimer = useRef(null);
  const destTimer = useRef(null);

  useEffect(() => {
    if (!initialData || hasPrefilled.current) return;
    hasPrefilled.current = true;

    setOrigin(initialData.origin_address || initialData.origin || "");
    setDestination(initialData.dest_address || initialData.destination || "");
    setTripDate(initialData.trip_date || initialData.date || "");
    setTripTime(initialData.trip_time || initialData.time || "");

    (async () => {
      const o = initialData.origin_address || initialData.origin || "";
      const d = initialData.dest_address || initialData.destination || "";
      if (!o || !d) return;

      const [od, dd] = await Promise.all([geocodeAddress(o), geocodeAddress(d)]);
      setOriginCoords(od);
      setDestCoords(dd);

      onTripReady &&
        onTripReady({
          origin: o,
          destination: d,
          originCoords: od,
          destCoords: dd,
          distance: initialData.distance_km ?? initialData.distance ?? null,
          fare: initialData.fare ?? null,
          tripDate,
          tripTime,
          calculated: false,
        });
    })();
  }, [initialData]);

  // -------------------------
  // Geocode / Reverse helpers
  // -------------------------
  async function geocodeAddress(query) {
    if (!query) return null;
    // include &email=... to be polite to Nominatim
    const url = `${NOMINATIM_BASE}/search?format=jsonv2&q=${encodeURIComponent(
      query + ", Nigeria"
    )}&limit=8&addressdetails=1&email=${encodeURIComponent(NOMINATIM_CONTACT_EMAIL)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data?.length > 0) {
        // return first result in the same shape your app expects
        const first = data[0];
        return {
          lat: parseFloat(first.lat),
          lng: parseFloat(first.lon),
          display_name: first.display_name,
          raw: first,
        };
      }
    } catch (err) {
      console.error("Geocode error:", err);
    }
    return null;
  }

  // reverse geocode coords -> address string + coords
  async function reverseGeocode(lat, lon) {
    try {
      const url = `${NOMINATIM_BASE}/reverse?format=jsonv2&lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lon)}&addressdetails=1&email=${encodeURIComponent(
        NOMINATIM_CONTACT_EMAIL
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data) {
        return {
          lat: parseFloat(data.lat ?? lat),
          lng: parseFloat(data.lon ?? lon),
          display_name: data.display_name || "",
          raw: data,
        };
      }
    } catch (err) {
      console.error("Reverse geocode error:", err);
    }
    return null;
  }

  // -------------------------
  // Autocomplete fetchers (debounced)
  // -------------------------
  const fetchOriginSuggestions = (q) => {
    clearTimeout(originTimer.current);
    originTimer.current = setTimeout(async () => {
      if (!q || q.length < 2) {
        setOriginResults([]);
        setOriginOpen(false);
        return;
      }
      try {
        const url = `${NOMINATIM_BASE}/search?format=jsonv2&q=${encodeURIComponent(
          q + ", Nigeria"
        )}&limit=6&addressdetails=1&email=${encodeURIComponent(NOMINATIM_CONTACT_EMAIL)}`;
        const res = await fetch(url);
        const data = await res.json();
        setOriginResults(data || []);
        setOriginOpen(true);
        setOriginFocusIndex(-1);
      } catch (err) {
        console.error("Autocomplete origin error:", err);
      }
    }, 300);
  };

  const fetchDestSuggestions = (q) => {
    clearTimeout(destTimer.current);
    destTimer.current = setTimeout(async () => {
      if (!q || q.length < 2) {
        setDestResults([]);
        setDestOpen(false);
        return;
      }
      try {
        const url = `${NOMINATIM_BASE}/search?format=jsonv2&q=${encodeURIComponent(
          q + ", Nigeria"
        )}&limit=6&addressdetails=1&email=${encodeURIComponent(NOMINATIM_CONTACT_EMAIL)}`;
        const res = await fetch(url);
        const data = await res.json();
        setDestResults(data || []);
        setDestOpen(true);
        setDestFocusIndex(-1);
      } catch (err) {
        console.error("Autocomplete dest error:", err);
      }
    }, 300);
  };

  // -------------------------
  // Handlers for suggestion selection
  // -------------------------
  const selectOriginSuggestion = async (item) => {
    const coords = {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      display_name: item.display_name,
      raw: item,
    };
    setOrigin(item.display_name);
    setOriginCoords(coords);
    setOriginOpen(false);
    setOriginResults([]);
    // notify parent exactly as previous geocode did
    onTripReady &&
      onTripReady({
        origin: item.display_name,
        destination,
        originCoords: coords,
        destCoords,
        distance: null,
        fare: null,
        tripDate,
        tripTime,
        calculated: false,
      });
  };

  const selectDestSuggestion = async (item) => {
    const coords = {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      display_name: item.display_name,
      raw: item,
    };
    setDestination(item.display_name);
    setDestCoords(coords);
    setDestOpen(false);
    setDestResults([]);
    onTripReady &&
      onTripReady({
        origin,
        destination: item.display_name,
        originCoords,
        destCoords: coords,
        distance: null,
        fare: null,
        tripDate,
        tripTime,
        calculated: false,
      });
  };

  // -------------------------
  // Use my location (pickup)
  // -------------------------
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const rev = await reverseGeocode(lat, lon);
        if (rev) {
          setOrigin(rev.display_name);
          setOriginCoords(rev);
          onTripReady &&
            onTripReady({
              origin: rev.display_name,
              destination,
              originCoords: rev,
              destCoords,
              distance: null,
              fare: null,
              tripDate,
              tripTime,
              calculated: false,
            });
        } else {
          alert("Could not determine address from your location.");
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Could not get your location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // -------------------------
  // calculateDistance (unchanged logic)
  // -------------------------
  const calculateDistance = async () => {
    if (!origin || !destination) {
      alert("Please enter both pickup and destination locations");
      return;
    }
    if (!tripDate || !tripTime) {
      alert("Please select your trip date and time");
      return;
    }

    try {
      // Use existing geocoding helpers so we get consistent coords
      const [oCoords, dCoords] = await Promise.all([
        originCoords ?? geocodeAddress(origin),
        destCoords ?? geocodeAddress(destination),
      ]);

      if (!oCoords || !dCoords) {
        alert("Could not find one or both addresses.");
        return;
      }

      setOriginCoords(oCoords);
      setDestCoords(dCoords);

      // Haversine (identical logic to before)
      const R = 6371;
      const dLat = ((dCoords.lat - oCoords.lat) * Math.PI) / 180;
      const dLon = ((dCoords.lng - oCoords.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((oCoords.lat * Math.PI) / 180) *
          Math.cos((dCoords.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = (R * c).toFixed(2);

      const duration = `${Math.round(distance * 2)}-${Math.round(distance * 2 + 5)} minutes`;
      const fare = (200 + 100 * distance).toFixed(2);

      // Notify parent (same shape as before)
      onTripReady &&
        onTripReady({
          origin,
          destination,
          originCoords: oCoords,
          destCoords: dCoords,
          distance,
          duration,
          fare,
          tripDate,
          tripTime,
          calculated: true,
        });
    } catch (err) {
      console.error("Error calculating distance:", err);
      alert("Error calculating distance. Try again.");
    }
  };

  // -------------------------
  // keyboard handlers for origin/dest input lists
  // -------------------------
  const handleOriginKey = (e) => {
    if (!originOpen) return;
    if (e.key === "ArrowDown") {
      setOriginFocusIndex((idx) => Math.min(idx + 1, originResults.length - 1));
    } else if (e.key === "ArrowUp") {
      setOriginFocusIndex((idx) => Math.max(idx - 1, 0));
    } else if (e.key === "Enter") {
      if (originFocusIndex >= 0 && originResults[originFocusIndex]) {
        selectOriginSuggestion(originResults[originFocusIndex]);
      }
    } else if (e.key === "Escape") {
      setOriginOpen(false);
    }
  };

  const handleDestKey = (e) => {
    if (!destOpen) return;
    if (e.key === "ArrowDown") {
      setDestFocusIndex((idx) => Math.min(idx + 1, destResults.length - 1));
    } else if (e.key === "ArrowUp") {
      setDestFocusIndex((idx) => Math.max(idx - 1, 0));
    } else if (e.key === "Enter") {
      if (destFocusIndex >= 0 && destResults[destFocusIndex]) {
        selectDestSuggestion(destResults[destFocusIndex]);
      }
    } else if (e.key === "Escape") {
      setDestOpen(false);
    }
  };

  // -------------------------
  // Cleanup timers on unmount
  // -------------------------
  useEffect(() => {
    return () => {
      clearTimeout(originTimer.current);
      clearTimeout(destTimer.current);
    };
  }, []);

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-100 transition-all hover:shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Book / Edit Trip</h2>
      <p className="text-gray-500 mb-6">Enter pickup, destination, and schedule</p>

      <div className="space-y-4">
        {/* Origin with autocomplete + "Use my location" */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Pickup Location</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                fetchOriginSuggestions(e.target.value);
                setOriginCoords(null); // clear coords until selection/lookup
              }}
              onKeyDown={handleOriginKey}
              placeholder="Enter pickup location"
              className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              aria-autocomplete="list"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition text-sm"
            >
              Use my location
            </button>
          </div>

          {/* suggestions dropdown */}
          {originOpen && originResults.length > 0 && (
            <ul className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto">
              {originResults.map((r, idx) => (
                <li
                  key={r.place_id || r.osm_id || idx}
                  onClick={() => selectOriginSuggestion(r)}
                  className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 ${
                    idx === originFocusIndex ? "bg-indigo-50" : ""
                  }`}
                >
                  <div className="text-sm font-medium text-gray-800">{r.display_name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {r.type ? `${r.type}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination with autocomplete */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              fetchDestSuggestions(e.target.value);
              setDestCoords(null);
            }}
            onKeyDown={handleDestKey}
            placeholder="Enter destination"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
            aria-autocomplete="list"
            autoComplete="off"
          />

          {destOpen && destResults.length > 0 && (
            <ul className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto">
              {destResults.map((r, idx) => (
                <li
                  key={r.place_id || r.osm_id || idx}
                  onClick={() => selectDestSuggestion(r)}
                  className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 ${
                    idx === destFocusIndex ? "bg-indigo-50" : ""
                  }`}
                >
                  <div className="text-sm font-medium text-gray-800">{r.display_name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{r.type}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Trip Date</label>
            <input
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Trip Time</label>
            <input
              type="time"
              value={tripTime}
              onChange={(e) => setTripTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={calculateDistance}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-md"
        >
          🚗 Calculate Fare
        </button>
      </div>
    </div>
  );
}
