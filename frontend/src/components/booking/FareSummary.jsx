// frontend/src/components/booking/FareSummary.jsx
import React from "react";

export default function FareSummary({
  distance,
  duration,
  fare,
  tripDate,
  tripTime,
  onConfirm,
  isLoading = false,
  confirmLabel = "✅ Confirm Booking",
}) {
  return (
    <div className="bg-white shadow-md p-6 rounded-2xl border border-gray-100 transition-all hover:shadow-lg">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Trip Summary</h2>
        <p className="text-gray-500">Review your trip details and confirm</p>
      </div>

      <div className="space-y-3 mb-6">
        <SummaryItem label="Distance" value={`${distance || "—"} km`} />
        <SummaryItem label="Duration" value={duration || "—"} />
        <SummaryItem label="Trip Date" value={tripDate || "—"} />
        <SummaryItem label="Trip Time" value={tripTime || "—"} />

        <div className="flex justify-between items-center py-3 px-4 bg-green-50 border border-green-100 rounded-xl shadow-sm">
          <span className="text-green-700 font-semibold text-lg">Total Fare</span>
          <span className="text-2xl font-extrabold text-green-600">
            ₦{fare || "—"}
          </span>
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={isLoading}
        className={`w-full py-3.5 rounded-lg font-semibold text-lg transition-all shadow-md ${
          isLoading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 hover:scale-[1.02] text-white active:scale-95"
        }`}
      >
        {isLoading ? "🔄 Booking..." : confirmLabel}
      </button>
    </div>
  );
}

// ✅ clean mini subcomponent for repeated summary lines
function SummaryItem({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
