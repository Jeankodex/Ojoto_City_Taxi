
// frontend/src/pages/Login.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api";
import AuthForm from "../components/AuthForm";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const isFormValid = useMemo(
    () => form.email.trim().length > 0 && form.password.trim().length > 0,
    [form]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!isFormValid) {
      setError("Please provide email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiLogin(form);
      localStorage.setItem("ojoto_token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.msg ||
          err?.response?.data?.error ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-6xl">
        {/* Left side - image and intro */}
        <div className="w-full md:w-5/12 bg-indigo-600 flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-3 text-center">
            Welcome Back
          </h1>
          <p className="mb-6 text-indigo-100 text-center text-sm md:text-base leading-relaxed">
            Access your Ojoto City Taxi account and manage your rides with ease.
          </p>
          <img
            src="/images/hero2.jpg"
            alt="Login Ojoto City Taxi"
            className="rounded-lg shadow-md max-h-64 object-cover w-full md:w-10/12"
          />
        </div>

        {/* Right side - form */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex items-center">
          <div className="w-full">
            <AuthForm
              title="Login"
              error={error}
              loading={loading}
              onSubmit={handleSubmit}
              footer={
                <>
                  Don&apos;t have an account?{" "}
                  <a
                    href="/register"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Register
                  </a>
                </>
              }
            >
              <div className="mb-4 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="mb-6 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

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
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </AuthForm>
          </div>
        </div>
      </div>
    </div>
  );
}
