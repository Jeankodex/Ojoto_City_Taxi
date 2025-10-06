import React from "react";

export default function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-md mx-auto overflow-hidden">
      {/* Banner */}
      <div className="h-40 w-full">
        <img
          src="/images/hero1.jpg"
          alt="Ojoto City Taxi"
          className="h-full w-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="p-6 text-center md:text-left space-y-2">
        <p className="text-gray-500 uppercase text-xs">Fullname</p>
        <h3 className="text-xl font-bold text-gray-900">{user.fullname}</h3>

        <p className="text-gray-500 uppercase text-xs">Email</p>
        <p className="text-gray-700">{user.email}</p>

        <p className="text-gray-500 uppercase text-xs">Phone</p>
        <p className="text-gray-700">{user.phone_number}</p>

        <p className="text-gray-500 uppercase text-xs">Address</p>
        <p className="text-gray-700">{user.address}</p>
      </div>
    </div>
  );
}
