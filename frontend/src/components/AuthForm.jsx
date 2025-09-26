
import React from 'react'

export default function AuthForm({title, error, loading, onSubmit, children, footer}){
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {error && <div className="bg-red-100 text-red-800 p-2 rounded mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          {children}
          <button className="w-full bg-indigo-600 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Please wait...' : title}
          </button>
        </form>
      </div>
      {footer && <div className="text-center mt-4 text-sm text-gray-600">{footer}</div>}
    </div>
  )
}
