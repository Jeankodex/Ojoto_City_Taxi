// src/pages/Contact.jsx
import React, { useState, useEffect } from "react"
import { sendMessage } from "../api"
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState("")
  const [statusType, setStatusType] = useState("success") // "success" | "error"
  const [isSending, setIsSending] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSending(true)
    setStatus("Sending message...")
    try {
      const res = await sendMessage(form)
      setStatus(res.data.message || "Message sent successfully!")
      setStatusType("success")
      setForm({ name: "", email: "", message: "" }) // reset
    } catch (err) {
      setStatus("Failed to send message. Try again.")
      setStatusType("error")
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    if (status && status !== "Sending message...") {
      const timer = setTimeout(() => setStatus(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [status])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-indigo-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">Contact Us</h1>
          <p className="mt-4 max-w-2xl mx-auto text-indigo-100 text-sm md:text-base">
            We’re here 24/7 to help you book your next ride.
          </p>
          <div className="mt-6 flex justify-center">
            <img
              src="/images/hero2.jpg"
              alt="Contact Ojoto City Taxi"
              className="rounded-xl shadow-lg w-full max-w-md md:max-w-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 md:px-6 py-12 grid md:grid-cols-2 gap-8">
        {/* Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>

          <div className="flex items-center gap-3 text-gray-700">
            <FaMapMarkerAlt className="text-indigo-600 text-xl" />
            <span className="text-sm md:text-base">
              No 34 Modebe Street, Ojoto, Anambra State, Nigeria
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <FaPhone className="text-indigo-600 text-xl" />
            <span className="text-sm md:text-base">+234 803 334 6411</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <FaEnvelope className="text-indigo-600 text-xl" />
            <span className="text-sm md:text-base">
              info@ojotocitytaxi.com
            </span>
          </div>

          {/* Socials */}
          <div className="pt-4">
            <p className="font-semibold text-gray-700 mb-2">Connect with us:</p>
            <div className="flex gap-4 text-2xl">
              <a href="#" aria-label="Facebook" className="hover:text-indigo-700 text-indigo-600">
                <FaFacebook />
              </a>
              <a href="#" aria-label="WhatsApp" className="hover:text-green-600 text-indigo-600">
                <FaWhatsapp />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-500 text-indigo-600">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Send a Message
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              rows="4"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isSending}
              className={`w-full font-semibold py-3 rounded-lg transition ${
                isSending
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isSending ? "Sending message..." : "Send Message"}
            </button>
          </form>

          {status && (
            <p
              className={`mt-4 text-center text-sm md:text-base ${
                statusType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
