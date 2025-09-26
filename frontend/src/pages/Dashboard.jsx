
// src/pages/Dashboard.jsx
import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, listTrips, createTrip, deleteTrip, updateTrip } from '../api'
import ProfileCard from '../components/ProfileCard'
import TripList from '../components/TripList'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showSubmitError, setShowSubmitError] = useState(false)

  // booking form
  const [form, setForm] = useState({
    destination_address: '',
    date: '',
    time: '',
    distance_km: '',
    notes: ''
  })

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('ojoto_token')
    if (!token) return navigate('/login')
    async function fetchData() {
      try {
        const [u, t] = await Promise.all([getProfile(), listTrips()])
        setUser(u.data.user || u.data)
        setTrips(t.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [navigate])

  function handleChange(e) {
    if (showSubmitError) setShowSubmitError(false)
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const isFormValid = useMemo(() => {
    return (
      form.destination_address.trim().length > 0 &&
      form.date &&
      form.time &&
      !isNaN(parseFloat(form.distance_km)) &&
      parseFloat(form.distance_km) > 0
    )
  }, [form])

  async function handleCreate(e) {
    e.preventDefault()
    if (!isFormValid) {
      setShowSubmitError(true)
      return
    }

    setCreating(true)
    try {
      const payload = { ...form, distance_km: parseFloat(form.distance_km) }
      const res = await createTrip(payload)
      setTrips(prev => [res.data.trip, ...prev])
      setForm({
        destination_address: '',
        date: '',
        time: '',
        distance_km: '',
        notes: ''
      })
      setShowSubmitError(false)
      alert(res.data.msg || 'Trip booked')
    } catch (err) {
      alert(err?.response?.data?.msg || err?.response?.data?.error || 'Failed to create trip')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this trip?')) return
    try {
      await deleteTrip(id)
      setTrips(prev => prev.filter(t => t.id !== id))
      alert("Trip deleted successfully")
    } catch (err) {
      alert('Delete failed')
    }
  }

  async function handleEditSave(id, data) {
    try {
      const res = await updateTrip(id, {
        ...data,
        distance_km: parseFloat(data.distance_km)
      })
      setTrips(prev => prev.map(t => (t.id === id ? res.data.trip : t)))
      alert("Trip updated successfully")
    } catch (err) {
      alert("Update failed")
    }
  }

  function logout() {
    localStorage.removeItem('ojoto_token')
    navigate('/login')
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Profile */}
      <div className="lg:col-span-1">
        <ProfileCard user={user} onLogout={logout} />
      </div>

      {/* Trips */}
      <div className="lg:col-span-2">
        {/* Book form */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Book Your Ride</h3>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <input
              name="destination_address"
              placeholder="Destination"
              value={form.destination_address}
              onChange={handleChange}
              className="border px-3 py-2 rounded md:col-span-2 w-full"
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              name="distance_km"
              type="number"
              step="0.1"
              placeholder="Distance (km)"
              value={form.distance_km}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
            <textarea
              name="notes"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={handleChange}
              className="border px-3 py-2 rounded md:col-span-2 w-full"
            />

            {showSubmitError && (
              <p className="md:col-span-2 text-sm text-red-600">
                Please fill Destination, Date, Time and a valid Distance (km) to
                enable booking.
              </p>
            )}

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className={`flex-1 bg-indigo-600 text-white py-2 px-4 rounded ${
                  creating
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                }`}
                disabled={creating}
              >
                {creating ? "Booking..." : "Book Ride"}
              </button>

              <button
                type="button"
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                onClick={() => alert("Pay Now flow not implemented yet")}
              >
                PAY NOW
              </button>
            </div>
          </form>
        </div>

        {/* Trip List with inline editing */}
        <TripList
          trips={trips}
          onDelete={handleDelete}
          onEditSave={handleEditSave}
        />
      </div>
    </div>
  )
}
