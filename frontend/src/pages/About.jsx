
// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            About <span className="text-yellow-300">Ojoto City Taxi</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-indigo-100 text-sm md:text-base">
            Safe, affordable, and reliable ride-hailing service designed for the
            people of Ojoto and beyond.
          </p>
          <div className="mt-6 flex justify-center">
            <img
              src="/images/hero1.jpg"
              alt="Ojoto City Taxi"
              className="rounded-xl shadow-lg w-full max-w-md md:max-w-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 md:px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Our mission is simple — to make transportation in Ojoto stress-free,
            safe, and accessible for everyone. We combine local knowledge,
            professional drivers, and modern technology to deliver top-notch
            taxi services.
          </p>
        </div>
        <img
          src="/images/cab.jpg"
          alt="Mission"
          className="rounded-lg shadow w-full max-h-64 object-cover"
        />
      </section>

      {/* Values Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Our Values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🚖", title: "Reliability", text: "Always on time." },
              {
                icon: "🔒",
                title: "Safety",
                text: "Vetted drivers and secure rides.",
              },
              {
                icon: "💰",
                title: "Affordability",
                text: "Pocket-friendly fares for all.",
              },
              {
                icon: "🤝",
                title: "Community",
                text: "Built by Ojoto people, for Ojoto people.",
              },
              {
                icon: "💳",
                title: "Convenience",
                text: "Easy payments via Mobile Transfer & POS.",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 rounded-lg shadow text-center"
              >
                <div className="text-2xl">{value.icon}</div>
                <h4 className="font-semibold mt-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-indigo-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Why Choose Us?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "✅ Quick and simple booking",
              "✅ Trusted local drivers",
              "✅ Clean, well-maintained vehicles",
              "✅ Strong community support",
              "✅ Affordable, transparent fares",
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow text-center text-sm md:text-base"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
