
import React from "react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        {/* Copyright */}
        <p className="text-sm md:text-base">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">Ojoto City Taxi</span>. All
          rights reserved.
        </p>

        {/* Links */}
        <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm md:text-base">
          <a href="/privacy" className="hover:text-white transition">
            Privacy
          </a>
          <a href="/terms" className="hover:text-white transition">
            Terms
          </a>
          <a href="/contact" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
