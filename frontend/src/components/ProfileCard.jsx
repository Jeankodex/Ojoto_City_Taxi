import React, { useState, useEffect } from "react";
import { fetchProfile, updateProfile } from "../api";

export default function ProfileCard({ user: initialUserProp }) {
  const [user, setUser] = useState(initialUserProp || null);
  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialUserProp) {
      setUser(initialUserProp);
      setFullname(initialUserProp.fullname || "");
      setEmail(initialUserProp.email || "");
      setPhone(initialUserProp.phone_number || "");
      setAddress(initialUserProp.address || "");
      setPreview(
        initialUserProp.profile_image
          ? `http://localhost:5000/static/uploads/${initialUserProp.profile_image}`
          : null
      );
    } else {
      (async () => {
        try {
          const res = await fetchProfile();
          setUser(res.data);
          setFullname(res.data.fullname || "");
          setEmail(res.data.email || "");
          setPhone(res.data.phone_number || "");
          setAddress(res.data.address || "");
          setPreview(
            res.data.profile_image
              ? `http://localhost:5000/static/uploads/${res.data.profile_image}`
              : null
          );
        } catch (err) {
          console.error("Failed to load profile", err);
        }
      })();
    }
  }, [initialUserProp]);

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }, [file]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("fullname", fullname);
      fd.append("email", email);
      fd.append("phone_number", phone);
      fd.append("address", address);
      if (file) fd.append("file", file);

      const res = await updateProfile(fd);
      setUser(res.data.user || res.data);
      setEditing(false);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Profile save error", err);
      setMessage("❌ Failed to update profile");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFile(null);
    setFullname(user?.fullname || "");
    setEmail(user?.email || "");
    setPhone(user?.phone_number || "");
    setAddress(user?.address || "");
    setPreview(
      user?.profile_image
        ? `http://localhost:5000/static/uploads/${user.profile_image}`
        : null
    );
  };

  const avatarUrl =
    preview ||
    (user?.profile_image
      ? `http://localhost:5000/static/uploads/${user.profile_image}`
      : "/images/default-avatar.png");

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all max-w-lg mx-auto p-6 border border-indigo-50">
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-100 shadow-sm"
          />
          {editing && (
            <div className="mt-3 text-center">
              <label className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          {user?.fullname || "Your Name"}
        </h2>
        <p className="text-sm text-gray-500">{user?.email || "—"}</p>
      </div>

      {/* Info Fields */}
      <div className="space-y-3">
        {[
          { label: "Full Name", value: fullname, setValue: setFullname },
          { label: "Email", value: email, setValue: setEmail },
          { label: "Phone Number", value: phone, setValue: setPhone },
          { label: "Address", value: address, setValue: setAddress },
        ].map((field, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-semibold text-indigo-700 w-full sm:w-1/3 mb-1 sm:mb-0">
              {field.label}
            </label>
            {!editing ? (
              <span className="text-gray-800 w-full sm:w-2/3 truncate">
                {field.value || "—"}
              </span>
            ) : (
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                className="w-full sm:w-2/3 border border-indigo-200 rounded-md px-3 py-1.5 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
            message.includes("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
