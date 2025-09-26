
// src/components/TripList.jsx
import React, { useState, useMemo } from "react";

export default function TripList({ trips, onDelete, onEditSave }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showSubmitError, setShowSubmitError] = useState(false);

  function startEdit(trip) {
    setEditingId(trip.id);
    setEditForm({
      destination_address: trip.destination_address,
      date: trip.date,
      time: trip.time,
      distance_km: trip.distance_km,
      notes: trip.notes || "",
    });
    setShowSubmitError(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
    setShowSubmitError(false);
  }

  function handleChange(e) {
    if (showSubmitError) setShowSubmitError(false);
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  const isFormValid = useMemo(() => {
    return (
      editForm.destination_address?.trim().length > 0 &&
      editForm.date &&
      editForm.time &&
      !isNaN(parseFloat(editForm.distance_km)) &&
      parseFloat(editForm.distance_km) > 0
    );
  }, [editForm]);

  async function saveEdit(id) {
    if (!isFormValid) {
      setShowSubmitError(true);
      return;
    }
    await onEditSave(id, editForm);
    setEditingId(null);
  }

  if (trips.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No trips yet. Book your first trip above.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {trips.map((t) => (
        <li
          key={t.id}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col"
        >
          {editingId === t.id ? (
            // EDIT MODE
            <div className="space-y-3">
              <input
                name="destination_address"
                value={editForm.destination_address}
                onChange={handleChange}
                placeholder="Destination"
                className="border px-3 py-2 rounded-lg w-full text-sm focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="date"
                  name="date"
                  value={editForm.date}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg flex-1 text-sm focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="time"
                  name="time"
                  value={editForm.time}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg flex-1 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <input
                type="number"
                step="0.1"
                name="distance_km"
                value={editForm.distance_km}
                onChange={handleChange}
                placeholder="Distance (km)"
                className="border px-3 py-2 rounded-lg w-full text-sm focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                name="notes"
                value={editForm.notes}
                onChange={handleChange}
                placeholder="Notes (optional)"
                className="border px-3 py-2 rounded-lg w-full text-sm focus:ring-2 focus:ring-indigo-500"
              />

              {showSubmitError && (
                <p className="text-sm text-red-600">
                  Please fill Destination, Date, Time and a valid Distance (km).
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => saveEdit(t.id)}
                  disabled={!isFormValid}
                  className={`px-4 py-2 rounded-lg text-sm text-white transition ${
                    isFormValid
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // VIEW MODE
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
              <div>
                <div className="font-semibold text-gray-700 text-lg">
                  {t.destination_address}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t.date} • {t.time}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t.distance_km} km • ₦{t.fare_estimate ?? t.fare}
                </div>
                {t.notes && (
                  <div className="text-sm text-gray-400 mt-1 italic">
                    {t.notes}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => startEdit(t)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
