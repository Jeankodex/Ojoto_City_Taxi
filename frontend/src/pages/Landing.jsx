
import React from 'react'
import { Link } from 'react-router-dom'

const FeatureCard = ({icon, title, text}) => (
  <div className="bg-white rounded-lg shadow p-6 text-center">
    <div className="text-4xl mb-3">{icon}</div>
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{text}</p>
  </div>
)

const Step = ({n, title, text}) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">{n}</div>
    <div>
      <h5 className="font-semibold">{title}</h5>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  </div>
)

export default function Landing(){
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Safe, Affordable, and Reliable Rides for <span className="text-indigo-600">YOU</span>
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl">
              Book a cab in seconds. Transparent fares, trusted local drivers and a simple booking flow — ride with confidence.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register" className="inline-block bg-indigo-600 text-white px-5 py-3 rounded-lg shadow hover:bg-indigo-700">
                Book a Ride
              </Link>
              <Link to="/login" className="inline-block border border-indigo-600 text-indigo-600 px-5 py-3 rounded-lg hover:bg-indigo-50">
                Login
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <strong>Need help?</strong> Contact us at <a href="mailto:info@ojotocitytaxi.com" className="text-indigo-600">info@ojotocitytaxi.com</a>
            </div>
          </div>

          <div className="flex justify-center">
            <img src="/images/hero1.jpg" alt="cab hero" className="rounded-xl shadow-lg max-h-72 object-cover" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Why choose Ojoto City Taxi?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon="🚖" title="Affordable fares" text="Transparent pricing with base fare + per km rates."/>
          <FeatureCard icon="🔒" title="Safe & Secure" text="Verified drivers and secure ride protocols."/>
          <FeatureCard icon="⚡" title="Fast Booking" text="Quick booking flow — get a cab in minutes."/>
          <FeatureCard icon="📍" title="Future: Live tracking" text="We're building live tracking — launching soon."/>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-indigo-50">
        <div className="container mx-auto px-6 py-12">
          <h3 className="text-xl font-bold text-center mb-6">How it works</h3>
          <div className="max-w-3xl mx-auto grid gap-6">
            <Step n="1" title="Sign up" text="Create a free account using your email and phone number." />
            <Step n="2" title="Book a ride" text="Enter your destination, pick a date and time, and get an instant fare estimate." />
            <Step n="3" title="Enjoy the ride" text="Meet your driver  and enjoy a safe trip — pay via trnsfer or POS." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h4 className="text-2xl font-bold">Ready to book your next ride?</h4>
          <p className="mt-3 text-indigo-100 max-w-xl mx-auto">Sign up now and get your first ride at a discounted fare.</p>
          <div className="mt-6">
            <Link to="/register" className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:opacity-95">Get Started</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
