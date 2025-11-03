import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoggedIn = () => {
    const token = localStorage.getItem("ojoto_token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoggedIn();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("ojoto_token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const menuItems = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/about" },
    { name: "Our Services", to: "/services" },
    { name: "Contact Us", to: "/contact" },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/logo.jpg"
            alt="Ojoto City Cab"
            className="w-12 h-12 rounded-full shadow-md border border-indigo-200"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-3xl text-indigo-700 tracking-wide drop-shadow-sm">
              Ojoto City Taxi
            </span>
            <span className="text-sm text-gray-800 italic mt-1">
              Where Every Ride Counts...
            </span>
          </div>
        </Link>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-3xl text-indigo-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
        </button>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-3 items-center">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition font-medium ${
                  isActive
                    ? "bg-indigo-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/register"
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium"
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-full bg-indigo-700 text-white shadow-md hover:bg-indigo-800 font-semibold"
              >
                Login
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-indigo-700 text-white shadow-md hover:bg-red-500 font-semibold"
            >
              Logout
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition font-medium ${
                  isActive
                    ? "bg-indigo-700 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/register"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 inline-block font-medium"
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-full bg-indigo-700 text-white shadow-md hover:bg-indigo-800 inline-block font-semibold"
              >
                Login
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="px-4 py-2 rounded-full bg-indigo-700 text-white shadow-md hover:bg-red-500 inline-block font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
