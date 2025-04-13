"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, MapPin } from "lucide-react"

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  latitude: string;
  longitude: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  latitude: number | null;
  longitude: number | null;
}

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    latitude: "",
    longitude: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  useEffect(() => {
    getLocation()
  }, [])

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
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    if (users.some((user) => user.email === formData.email)) {
      setError("User with this email already exists")
      setIsLoading(false)
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("user", JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      latitude: newUser.latitude,
      longitude: newUser.longitude,
    }))

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-green-400 glow-text">Create an Account</h2>
              <p className="text-gray-400 mt-2">Sign up to monitor air quality in your area</p>
            </div>

            {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-6">{error}</div>}

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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-200"
                  placeholder="John Doe"
                  required
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
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-200"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-200"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Location</label>
                <div className="grid grid-cols-2 gap-4">
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
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-200"
                      placeholder="0.000000"
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
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-200"
                      placeholder="0.000000"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={getLocation}
                  className="mt-2 flex items-center text-sm text-green-400 hover:text-green-300"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {isGettingLocation ? "Getting location..." : "Get my current location"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex justify-center hover-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-green-400 hover:text-green-300 font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}