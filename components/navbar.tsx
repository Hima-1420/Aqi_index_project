"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, LogOut, Cpu, Gamepad2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  // Enhanced Dashboard Navbar for Dashboard2
  function DashboardNavbar() {
    return (
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-800/90 backdrop-blur-md shadow-xl' : 'bg-gray-800/80 backdrop-blur-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard2" className="flex items-center group">
              <span className="text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300 glow-text">
                AirQuality
              </span>
              <span className="text-xl font-bold text-green-500 group-hover:text-green-400 transition-colors duration-300 glow-text">
                Dashboard
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/dashboard2"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === "/dashboard2" 
                    ? "text-green-400 bg-gray-700/50 hover-glow" 
                    : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
                }`}
              >
                Home
              </Link>
              <Link
                href="/iot-devices"
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all duration-300 ${
                  pathname === "/iot-devices"
                    ? "text-green-400 bg-gray-700/50 hover-glow"
                    : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
                }`}
              >
                <Cpu className="h-4 w-4" />
                IoT Devices
              </Link>
              <Link
                href="/games"
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all duration-300 ${
                  pathname === "/games"
                    ? "text-green-400 bg-gray-700/50 hover-glow"
                    : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
                }`}
              >
                <Gamepad2 className="h-4 w-4" />
                Games
              </Link>
              <Link
                href="/profile"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === "/profile"
                    ? "text-green-400 bg-gray-700/50 hover-glow"
                    : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
                }`}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 text-gray-300 hover:text-red-400 hover:bg-gray-700/30 transition-all duration-300 group"
              >
                <LogOut className="h-4 w-4 group-hover:animate-pulse" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-green-400 hover:bg-gray-700/30 focus:outline-none transition-all duration-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-lg pb-4 px-4 slide-up">
            <div className="flex flex-col space-y-2 pt-2">
              <Link
                href="/dashboard2"
                className={`px-4 py-3 rounded-lg text-base font-medium flex items-center ${
                  pathname === "/dashboard2" 
                    ? "text-green-400 bg-gray-700/50 hover-glow" 
                    : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
                } transition-all duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/iot-devices"
                className={`px-4 py-3 rounded-lg text-base font-medium flex items-center gap-2 ${
                  pathname === "/iot-devices"
                    ? "text-green-400 bg-gray-700/50 hover-glow"
                    : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
                } transition-all duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Cpu className="h-4 w-4" />
                IoT Devices
              </Link>
              <Link
                href="/games"
                className={`px-4 py-3 rounded-lg text-base font-medium flex items-center gap-2 ${
                  pathname === "/games"
                    ? "text-green-400 bg-gray-700/50 hover-glow"
                    : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
                } transition-all duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Gamepad2 className="h-4 w-4" />
                Games
              </Link>
              <Link
                href="/profile"
                className={`px-4 py-3 rounded-lg text-base font-medium flex items-center ${
                  pathname === "/profile"
                    ? "text-green-400 bg-gray-700/50 hover-glow"
                    : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
                } transition-all duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="px-4 py-3 rounded-lg text-base font-medium flex items-center gap-2 text-gray-300 hover:text-red-400 hover:bg-gray-700/30 transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    )
  }

  // Return appropriate navbar based on route
  if (pathname.startsWith('/dashboard2') || 
      pathname.startsWith('/profile') || 
      pathname.startsWith('/iot-devices') || 
      pathname.startsWith('/games')) {
    return <DashboardNavbar />
  }

  // Default navbar for other pages
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-800/90 backdrop-blur-md shadow-xl' : 'bg-gray-900/50 backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300 glow-text">
              AirQuality
            </span>
            <span className="text-xl font-bold text-green-500 group-hover:text-green-400 transition-colors duration-300 glow-text">
              Monitor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                pathname === "/" 
                  ? "text-green-400 bg-gray-700/50 hover-glow" 
                  : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                pathname === "/dashboard"
                  ? "text-green-400 bg-gray-700/50 hover-glow"
                  : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                pathname === "/login"
                  ? "text-green-400 bg-gray-700/50 hover-glow"
                  : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
              }`}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-500 hover-glow transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-green-400 hover:bg-gray-700/30 focus:outline-none transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-lg pb-4 px-4 slide-up">
          <div className="flex flex-col space-y-2 pt-2">
            <Link
              href="/"
              className={`px-4 py-3 rounded-lg text-base font-medium ${
                pathname === "/" 
                  ? "text-green-400 bg-gray-700/50 hover-glow" 
                  : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
              } transition-all duration-300`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`px-4 py-3 rounded-lg text-base font-medium ${
                pathname === "/dashboard"
                  ? "text-green-400 bg-gray-700/50 hover-glow"
                  : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
              } transition-all duration-300`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className={`px-4 py-3 rounded-lg text-base font-medium ${
                pathname === "/login"
                  ? "text-green-400 bg-gray-700/50 hover-glow"
                  : "text-gray-300 hover:text-green-400 hover:bg-gray-700/30"
              } transition-all duration-300`}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-3 rounded-lg text-base font-medium bg-green-600 text-white hover:bg-green-500 hover-glow transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}