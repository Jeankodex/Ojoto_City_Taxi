
// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        <Outlet /> {/* Services, About, Landing, etc. will render here */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
