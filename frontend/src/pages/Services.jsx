
// src/pages/Services.jsx
import React from "react"
import { Link } from "react-router-dom"

// Images
import cityRidesImg from "../assets/images/services/city-rides.jpg"
import intercityTripsImg from "../assets/images/services/intercity-trips.jpg"
import corporateServicesImg from "../assets/images/services/corporate-services.jpg"
import parcelDeliveryImg from "../assets/images/services/parcel-delivery.jpg"
import emergencyDropsImg from "../assets/images/services/emergency-drops.jpg"
import fullCharterImg from "../assets/images/services/full-charter.jpg"
import deliveriesImg from "../assets/images/services/deliveries.jpg"

// Service Card
const ServiceCard = ({ icon, title, text, img }) => (
  <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition max-w-sm mx-auto">
    <div className="text-4xl mb-3">{icon}</div>
    <h4 className="text-lg font-semibold mb-2 text-gray-900">{title}</h4>
    <p className="text-sm text-gray-600 mb-4">{text}</p>
    {img && (
      <img
        src={img}
        alt={title}
        className="rounded-lg mx-auto max-h-44 w-full object-cover"
      />
    )}
  </div>
)

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-indigo-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">Our Services</h1>
          <p className="mt-4 max-w-2xl mx-auto text-indigo-100 text-sm md:text-base">
            Reliable rides and more — built for Ojoto and beyond.
          </p>
          <div className="mt-6 flex justify-center">
            <img
              src={cityRidesImg}
              alt="Ojoto Taxi Services"
              className="rounded-xl shadow-lg w-full max-w-md md:max-w-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="container mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">
          Core Services
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            icon="🏙️"
            title="City Rides"
            text="Quick, safe rides across Ojoto town."
            img={cityRidesImg}
          />
          <ServiceCard
            icon="🛣️"
            title="Intercity Trips"
            text="Affordable long-distance travel to nearby towns."
            img={intercityTripsImg}
          />
          <ServiceCard
            icon="💼"
            title="Corporate Services"
            text="Business ride packages, staff transport solutions."
            img={corporateServicesImg}
          />
        </div>
      </section>

      {/* Special Services */}
      <section className="bg-indigo-50 py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">
            Special Services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              icon="🚑"
              title="Emergency Drops"
              text="Urgent late-night or medical rides when you need them most."
              img={emergencyDropsImg}
            />
            <ServiceCard
              icon="🚌"
              title="Full Charter"
              text="Hire a cab for the whole day or special events."
              img={fullCharterImg}
            />
            <ServiceCard
              icon="📦"
              title="Deliveries"
              text="Bulk deliveries and parcels, safe and quick."
              img={deliveriesImg}
            />
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="container mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
          Coming Soon
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg shadow p-6">🚖 Ride Tracking</div>
          <div className="bg-white rounded-lg shadow p-6">👥 Ride Sharing</div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h4 className="text-2xl font-bold">Ready to book your ride?</h4>
          <p className="mt-3 text-indigo-100 max-w-xl mx-auto text-sm md:text-base">
            Sign up today and enjoy safe, affordable, and reliable services.
          </p>
          <div className="mt-6">
            <Link
              to="/register"
              className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:opacity-95 transition"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
