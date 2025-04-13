"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

interface FormData {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  latitude: number | null;
  longitude: number | null;
}

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: User) => u.email === formData.email)

    if (!user) {
      setError("User not found. Please check your email or sign up.")
      setIsLoading(false)
      return
    }

    if (user.password !== formData.password) {
      setError("Incorrect password. Please try again.")
      setIsLoading(false)
      return
    }

    localStorage.setItem("user", JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      latitude: user.latitude,
      longitude: user.longitude,
    }))

    setTimeout(() => {
      router.push("/dashboard2") // Changed to redirect to dashboard2
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-green-400 glow-text">Welcome Back</h2>
              <p className="text-gray-400 mt-2">Log in to access your air quality dashboard</p>
            </div>

            {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-6">{error}</div>}

            <form onSubmit={handleSubmit}>
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

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex justify-center hover-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-green-400 hover:text-green-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}