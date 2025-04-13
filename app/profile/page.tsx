"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, MapPin, Save, AlertTriangle, Edit } from "lucide-react"
import Link from "next/link"

interface UserData {
  id: string
  name: string
  email: string
  latitude?: number | null
  longitude?: number | null
}

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    latitude: "",
    longitude: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser: UserData = JSON.parse(userData)
    setUser(parsedUser)
    setFormData({
      name: parsedUser.name || "",
      email: parsedUser.email || "",
      latitude: parsedUser.latitude?.toString() || "",
      longitude: parsedUser.longitude?.toString() || "",
    })
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }))
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
          setError("Failed to get your location. Please try again or enter coordinates manually.")
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!formData.name || !formData.email) {
      setError("Name and email are required")
      setIsLoading(false)
      return
    }

    if (!user) return

    const updatedUser: UserData = {
      ...user,
      name: formData.name,
      email: formData.email,
      latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u: UserData) => {
      if (u.id === user.id) {
        return updatedUser
      }
      return u
    })
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    setUser(updatedUser)
    setIsEditing(false)
    setSuccess("Profile updated successfully")
    setIsLoading(false)

    setTimeout(() => {
      setSuccess("")
    }, 3000)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 pt-8">
          <div className="flex justify-center items-center h-64">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          <Link 
            href="/dashboard2" 
            className="text-gray-300 hover:text-green-400 transition-colors flex items-center"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-6 transform transition-all hover:shadow-2xl">
          {error && (
            <div className="bg-red-900/30 border border-red-800/50 text-red-300 p-4 rounded-lg mb-6 flex items-start backdrop-blur-sm">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-900/30 border border-green-800/50 text-green-300 p-4 rounded-lg mb-6 backdrop-blur-sm">
              {success}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center md:w-1/3">
              <div className="bg-gray-700 rounded-full p-6 mb-4">
                <User className="h-16 w-16 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-1">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>

            <div className="md:w-2/3">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white ${
                      isEditing ? "focus:ring-green-500 focus:border-green-500" : "bg-gray-700/50"
                    }`}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white ${
                      isEditing ? "focus:ring-green-500 focus:border-green-500" : "bg-gray-700/50"
                    }`}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Location</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="latitude" className="block text-xs text-gray-400 mb-1">
                        Latitude
                      </label>
                      <input
                        type="text"
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white ${
                          isEditing ? "focus:ring-green-500 focus:border-green-500" : "bg-gray-700/50"
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="longitude" className="block text-xs text-gray-400 mb-1">
                        Longitude
                      </label>
                      <input
                        type="text"
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white ${
                          isEditing ? "focus:ring-green-500 focus:border-green-500" : "bg-gray-700/50"
                        }`}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={getLocation}
                      className="mt-2 flex items-center text-sm text-green-400 hover:text-green-300 transition-colors"
                      disabled={isGettingLocation}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      {isGettingLocation ? "Getting location..." : "Get my current location"}
                    </button>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            name: user.name || "",
                            email: user.email || "",
                            latitude: user.latitude?.toString() || "",
                            longitude: user.longitude?.toString() || "",
                          })
                        }}
                        className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <Save className="h-5 w-5 mr-2" />
                        )}
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                    >
                      <Edit className="h-5 w-5 mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}