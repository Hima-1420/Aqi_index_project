"use client"

import { useState } from "react"
import { Cpu, RefreshCw } from "lucide-react"

export default function IoTDevicesPage() {
  const [refreshing, setRefreshing] = useState(false)

  const refreshData = () => {
    setRefreshing(true)
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      
      <div className="container mx-auto px-4 max-w-6xl pt-24 pb-8">
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-6 transform transition-all hover:shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">IoT Devices Management</h1>
            </div>
            <button 
              onClick={refreshData} 
              className="text-gray-400 hover:text-blue-400 transition-colors"
              disabled={refreshing}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Device Cards */}
            <div className="bg-gray-700/50 rounded-xl p-6 hover:bg-gray-700/70 transition-all hover:scale-[1.02]">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-blue-900/30 mr-3">
                  <Cpu className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Air Quality Monitor</h2>
              </div>
              <p className="text-gray-300 mb-4">Real-time indoor air quality tracking with PM2.5 and CO2 sensors</p>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Status: <span className="text-green-400">Connected</span></span>
                <span>Last update: 2 min ago</span>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-xl p-6 hover:bg-gray-700/70 transition-all hover:scale-[1.02]">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-purple-900/30 mr-3">
                  <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Smart Air Purifier</h2>
              </div>
              <p className="text-gray-300 mb-4">Automatically adjusts fan speed based on air quality readings</p>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Status: <span className="text-green-400">Active</span></span>
                <span>Filter: 85% remaining</span>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-xl p-6 hover:bg-gray-700/70 transition-all hover:scale-[1.02]">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-green-900/30 mr-3">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Portable Sensor</h2>
              </div>
              <p className="text-gray-300 mb-4">Wearable air quality tracker with real-time alerts</p>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Status: <span className="text-yellow-400">Battery Low</span></span>
                <span>Battery: 12% remaining</span>
              </div>
            </div>
          </div>

          {/* Device Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Device Connectivity</h3>
              <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Connectivity chart would be displayed here</p>
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                {[
                  { id: 1, device: "Air Quality Monitor", alert: "High PM2.5 detected", time: "10 minutes ago", level: "high" },
                  { id: 2, device: "Smart Air Purifier", alert: "Filter replacement needed", time: "2 hours ago", level: "medium" },
                  { id: 3, device: "Portable Sensor", alert: "Low battery", time: "5 hours ago", level: "low" },
                ].map((alert) => (
                  <div key={alert.id} className="bg-gray-800/50 rounded-lg p-4 flex items-start">
                    <div className={`w-3 h-3 rounded-full mt-1 mr-3 ${
                      alert.level === 'high' ? 'bg-red-500' : 
                      alert.level === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-white">{alert.device}</p>
                      <p className="text-gray-300">{alert.alert}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}