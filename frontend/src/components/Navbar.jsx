
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi"; // Shopify-style icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/about" },
    { name: "Our Services", to: "/services" },
    { name: "Contact Us", to: "/contact" },
    { name: "Register", to: "/register" },
    { name: "Login", to: "/login" },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/logo.jpg"
            alt="Ojoto City Cab"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-bold text-xl text-indigo-600">
            Ojoto City Taxi
          </span>
        </Link>

        {/* Hamburger Button (Mobile only) */}
        <button
          className="lg:hidden text-3xl text-indigo-600"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
        </button>

        {/* Menu (Desktop) */}
        <nav className="hidden lg:flex gap-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)} // close menu when clicked
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
