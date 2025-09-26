
import React from "react"

export default function ProfileCard({ user, onLogout }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-md mx-auto overflow-hidden">
      {/* Company Banner */}
      <div className="h-40 w-full">
        <img
          src="/images/hero1.jpg"
          alt="Ojoto City Taxi"
          className="h-full w-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="p-6 text-center md:text-left">
        <h3 className="text-xl font-bold text-gray-900">{user?.fullname}</h3>
        <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
        <p className="text-sm text-gray-600">{user?.phone_number}</p>
        <p className="text-sm text-gray-600">{user?.address}</p>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
