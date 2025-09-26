
// frontend/src/pages/Register.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "../api";
import AuthForm from "../components/AuthForm";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [form, setForm] = useState({
    fullname: "",
    address: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const isFormValid = useMemo(() => {
    return (
      form.fullname.trim().length > 0 &&
      form.address.trim().length > 0 &&
      /^\+?\d{7,15}$/.test(form.phone_number.trim()) &&
      emailRegex.test(form.email.trim()) &&
      form.password.length >= 6 &&
      form.password === form.password_confirm
    );
  }, [form]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Please fill all fields correctly before submitting.");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };
      delete payload.password_confirm;
      const res = await apiRegister(payload);
      localStorage.setItem("ojoto_token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.msg ||
          err?.response?.data?.error ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-6xl">
        {/* Left panel (image + intro) */}
        <div className="w-full md:w-5/12 bg-indigo-600 flex flex-col items-center justify-center text-white p-8 md:p-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-center">
            Join Ojoto City Taxi
          </h1>
          <p className="mb-6 text-indigo-100 text-center text-sm sm:text-base max-w-xs">
            Sign up today and start booking rides with ease.
          </p>
          <img
            src="/images/hero1.jpg"
            alt="Register Ojoto City Taxi"
            className="rounded-lg shadow-md w-10/12 max-w-sm object-cover"
          />
        </div>

        {/* Right panel (form) */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex items-center">
          <div className="w-full">
            <AuthForm
              title="Create Account"
              error={error}
              loading={loading}
              onSubmit={handleSubmit}
              footer={
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Login
                  </a>
                </p>
              }
            >
              {/* Full Name */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="fullname"
                  placeholder="Enter your full name"
                  value={form.fullname}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Address */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  name="address"
                  placeholder="Enter your address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="phone_number"
                  placeholder="+2348012345678"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {!/^\+?\d{7,15}$/.test(form.phone_number) &&
                  form.phone_number.length > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      Enter a valid phone number (7–15 digits).
                    </p>
                  )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {!emailRegex.test(form.email) && form.email.length > 0 && (
                  <p className="text-xs text-red-600 mt-1">Enter a valid email.</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {form.password.length > 0 && form.password.length < 6 && (
                  <p className="text-xs text-red-600 mt-1">
                    Password must be at least 6 characters.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  name="password_confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.password_confirm}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {form.password_confirm.length > 0 &&
                  form.password !== form.password_confirm && (
                    <p className="text-xs text-red-600 mt-1">
                      Passwords do not match.
                    </p>
                  )}
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    !isFormValid || loading
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </AuthForm>
          </div>
        </div>
      </div>
    </div>
  );
}
