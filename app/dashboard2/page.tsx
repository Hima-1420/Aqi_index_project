"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Info, RefreshCw, MapPin, Activity, Clock, Cpu, Gamepad2 } from "lucide-react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Chart from "chart.js/auto"
import Link from "next/link"

// AirQualityMap component
function AirQualityMap({ latitude, longitude, aqi }: { latitude: number, longitude: number, aqi: number }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const nearbyMarkersRef = useRef<L.Marker[]>([])

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#00E400'
    if (aqi <= 100) return '#FFFF00'
    if (aqi <= 150) return '#FF7E00'
    if (aqi <= 200) return '#FF0000'
    if (aqi <= 300) return '#8F3F97'
    return '#7E0023'
  }

  const createMarker = (lat: number, lon: number, aqiValue: number, isMainLocation = false) => {
    const aqiColor = getAQIColor(aqiValue)
    const size = isMainLocation ? 30 : 24
    const fontSize = isMainLocation ? 12 : 10
    const borderWidth = isMainLocation ? 2 : 1
    
    return L.divIcon({
      className: 'aqi-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${aqiColor};
          border-radius: 50%;
          border: ${borderWidth}px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${fontSize}px;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        ">
          ${aqiValue}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    })
  }

  const fetchNearbyAQI = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.waqi.info/map/bounds/?latlng=${lat-1},${lon-1},${lat+1},${lon+1}&token=1b8317418438c9635ca986176d79907d539026b4`
      )
      const data = await response.json()
      
      if (data.status === "ok" && data.data) {
        return data.data.map((station: any) => ({
          lat: station.lat,
          lon: station.lon,
          aqi: station.aqi
        }))
      }
      return []
    } catch (err) {
      console.error("Error fetching nearby stations:", err)
      return []
    }
  }

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return

    const lat = latitude
    const lon = longitude

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        attributionControl: false
      }).setView([lat, lon], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current)

      // @ts-ignore
      new CompassControl({ position: 'topright' }).addTo(mapInstance.current)
    } else {
      mapInstance.current.setView([lat, lon], 13)
    }

    nearbyMarkersRef.current.forEach(marker => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(marker)
      }
    })
    nearbyMarkersRef.current = []

    const mainMarkerIcon = createMarker(lat, lon, aqi, true)
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]).setIcon(mainMarkerIcon)
    } else {
      markerRef.current = L.marker([lat, lon], { icon: mainMarkerIcon }).addTo(mapInstance.current)
    }

    fetchNearbyAQI(lat, lon).then(nearbyPoints => {
      nearbyPoints.forEach((point: any) => {
        const markerIcon = createMarker(point.lat, point.lon, point.aqi)
        const marker = L.marker([point.lat, point.lon], { icon: markerIcon })
        if (mapInstance.current) {
          marker.addTo(mapInstance.current)
          nearbyMarkersRef.current.push(marker)
        }
      })
    })

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [latitude, longitude, aqi])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 md:h-96 rounded-xl shadow-lg"
      style={{ position: 'relative' }}
    />
  )
}

// ActivitySuggestions component
function ActivitySuggestions({ aqi }: { aqi: number }) {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#00E400'
    if (aqi <= 100) return '#FFFF00'
    if (aqi <= 150) return '#FF7E00'
    if (aqi <= 200) return '#FF0000'
    if (aqi <= 300) return '#8F3F97'
    return '#7E0023'
  }

  const getSuggestions = () => {
    if (aqi <= 50) {
      return [
        "Perfect day for outdoor activities!",
        "Great for hiking, biking, and picnics",
        "Ideal for opening windows and ventilating your home",
        "Excellent conditions for outdoor exercise"
      ]
    } else if (aqi <= 100) {
      return [
        "Generally safe for outdoor activities",
        "Sensitive individuals may want to reduce prolonged exertion",
        "Good day for moderate outdoor exercise",
        "Consider indoor activities if you experience discomfort"
      ]
    } else if (aqi <= 150) {
      return [
        "Limit prolonged outdoor exertion",
        "Sensitive groups should reduce outdoor activities",
        "Consider indoor workouts instead",
        "Keep windows closed during peak pollution hours"
      ]
    } else if (aqi <= 200) {
      return [
        "Avoid prolonged outdoor activities",
        "Sensitive groups should stay indoors",
        "Use air purifiers if available",
        "Wear a mask if going outside is necessary"
      ]
    } else if (aqi <= 300) {
      return [
        "Stay indoors as much as possible",
        "Avoid all outdoor physical activities",
        "Use air purifiers and keep windows closed",
        "Consider wearing N95 masks if going outside"
      ]
    } else {
      return [
        "Avoid all outdoor activities",
        "Stay indoors with windows and doors closed",
        "Use air purifiers with HEPA filters",
        "Wear N95 masks if going outside is unavoidable"
      ]
    }
  }

  const aqiColor = getAQIColor(aqi)

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.01] hover:shadow-2xl">
      <div className="flex items-center mb-4">
        <Activity className="h-5 w-5 mr-2" style={{ color: aqiColor }} />
        <h2 className="text-xl font-semibold" style={{ color: aqiColor }}>Activity Suggestions</h2>
      </div>
      <div className="space-y-3">
        {getSuggestions().map((suggestion, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 mr-2" style={{ color: aqiColor }}>•</div>
            <p className="text-gray-300" style={{ color: aqiColor }}>{suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// HealthSuggestions component with disease navbar
function HealthSuggestions({ aqi }: { aqi: number }) {
  const [activeDisease, setActiveDisease] = useState('asthma');
  
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#00E400'
    if (aqi <= 100) return '#FFFF00'
    if (aqi <= 150) return '#FF7E00'
    if (aqi <= 200) return '#FF0000'
    if (aqi <= 300) return '#8F3F97'
    return '#7E0023'
  }

  const getHealthData = () => {
    const data = {
      asthma: {
        description: "Asthma is a condition in which your airways narrow and swell and may produce extra mucus. This can make breathing difficult and trigger coughing, wheezing, and shortness of breath.",
        remedies: {
          good: "Continue regular activities with normal precautions. Keep rescue inhaler accessible.",
          moderate: "Monitor for symptoms. Avoid known triggers like pollen or dust.",
          poor: "Increased risk of attacks. Limit outdoor activities and keep medications handy.",
          unhealthy: "High risk of severe attacks. Stay indoors when possible with windows closed.",
          severe: "Very high risk. Use air purifiers and wear mask if going outside.",
          hazardous: "Extreme risk. Stay indoors with HEPA filters and follow emergency plan."
        }
      },
      copd: {
        description: "Chronic Obstructive Pulmonary Disease (COPD) is a chronic inflammatory lung disease that causes obstructed airflow from the lungs.",
        remedies: {
          good: "Low risk. Maintain normal activities and medication regimen.",
          moderate: "Mild symptoms possible. Avoid smoke and pollution when possible.",
          poor: "Moderate risk. Reduce strenuous activities and monitor oxygen levels.",
          unhealthy: "High risk of exacerbations. Use supplemental oxygen if prescribed.",
          severe: "Very high risk. Avoid all outdoor exposure and conserve energy.",
          hazardous: "Critical risk. Seek medical advice if symptoms worsen significantly."
        }
      },
      heartDisease: {
        description: "Cardiovascular diseases are conditions that affect the heart or blood vessels, often related to atherosclerosis (plaque buildup in artery walls).",
        remedies: {
          good: "Low cardiovascular risk. Maintain regular exercise and healthy diet.",
          moderate: "Possible mild strain. Monitor blood pressure and avoid overexertion.",
          poor: "Increased risk of events. Limit physical exertion and stay hydrated.",
          unhealthy: "High risk. Avoid outdoor activities and monitor for chest pain.",
          severe: "Very high risk. Stay indoors and rest, avoid all physical stress.",
          hazardous: "Extreme risk. Seek immediate medical care for any symptoms."
        }
      },
      allergies: {
        description: "Allergies occur when your immune system reacts to a foreign substance such as pollen, pet dander, or certain foods.",
        remedies: {
          good: "Low allergen levels. Minimal symptoms expected.",
          moderate: "Mild symptoms possible. Take antihistamines as needed.",
          poor: "Moderate symptoms likely. Keep windows closed and use air filters.",
          unhealthy: "Severe symptoms likely. Limit outdoor exposure and shower after being outside.",
          severe: "Very severe symptoms. Stay indoors with air purifiers running.",
          hazardous: "Extreme symptoms. Use medications as prescribed and avoid all exposure."
        }
      }
    };

    return data[activeDisease as keyof typeof data];
  }

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'poor';
    if (aqi <= 200) return 'unhealthy';
    if (aqi <= 300) return 'severe';
    return 'hazardous';
  }

  const healthData = getHealthData();
  const aqiLevel = getAQILevel(aqi);
  const remedy = healthData.remedies[aqiLevel as keyof typeof healthData.remedies];
  const aqiColor = getAQIColor(aqi);

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 transform transition-all hover:scale-[1.01] hover:shadow-2xl">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-gray-700 mr-3">
          <svg className="h-5 w-5" style={{ color: aqiColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Health Recommendations</h2>
      </div>
      
      {/* Disease Navbar */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['asthma', 'copd', 'heartDisease', 'allergies'].map((disease) => (
          <button
            key={disease}
            onClick={() => setActiveDisease(disease)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeDisease === disease 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {disease.charAt(0).toUpperCase() + disease.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="font-medium text-green-400 mb-2">About {activeDisease.charAt(0).toUpperCase() + activeDisease.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
          <p className="text-gray-300">{healthData.description}</p>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="font-medium text-blue-400 mb-2">Current Air Quality Recommendations</h3>
          <p className="text-gray-300">{remedy}</p>
        </div>
      </div>
    </div>
  )
}

// HistoricalDataChart component
function HistoricalDataChart({ location }: { location: LocationData | null }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const OWM_API_KEY = "66db0c6525cad55de2b9b2f1a1266af7"

  useEffect(() => {
    if (!location) return

    const fetchHistoricalData = async () => {
      setLoading(true)
      try {
        const end = Math.floor(Date.now() / 1000)
        const start = end - 7 * 24 * 60 * 60
        
        const response = await fetch(
          `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${location.lat}&lon=${location.lon}&start=${start}&end=${end}&appid=${OWM_API_KEY}`
        )
        const data = await response.json()
        
        if (data.list && data.list.length > 0) {
          const dailyData: {[key: string]: HistoricalDataPoint[]} = {}
          
          data.list.forEach((point: HistoricalDataPoint) => {
            const date = new Date(point.dt * 1000).toLocaleDateString()
            if (!dailyData[date]) {
              dailyData[date] = []
            }
            dailyData[date].push(point)
          })
          
          const averagedData = Object.values(dailyData).map(points => {
            const avgAQI = Math.round(points.reduce((sum, point) => sum + point.main.aqi, 0) / points.length)
            return {
              ...points[0],
              main: {
                aqi: avgAQI
              }
            }
          })
          
          setHistoricalData(averagedData)
        }
      } catch (err) {
        console.error("Error fetching historical data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [location])

  useEffect(() => {
    if (!historicalData.length || !chartRef.current) return

    if (chartInstance.current) {
      // @ts-ignore
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const days = historicalData.map(point => {
      const date = new Date(point.dt * 1000)
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    })
    
    const aqiValues = historicalData.map(point => point.main.aqi)

    // @ts-ignore
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: days,
        datasets: [
          {
            label: "AQI",
            data: aqiValues,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "7-day AQI Trend",
            color: '#fff'
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(0)
                }
                return label
              },
            },
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            max: Math.max(...aqiValues) * 1.2,
            title: {
              display: true,
              text: "AQI Value",
              color: '#fff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff'
            }
          },
          x: {
            title: {
              display: true,
              text: "Day",
              color: '#fff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff'
            }
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        // @ts-ignore
        chartInstance.current.destroy()
      }
    }
  }, [historicalData])

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-6">
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-blue-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">Historical AQI Trends</h2>
      </div>
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="h-64">
            <canvas ref={chartRef} />
          </div>
          <p className="text-sm text-gray-400 mt-4">
            {location ? `7-day AQI trend for ${location.name}` : "Historical AQI data"}
          </p>
        </>
      )}
    </div>
  )
}

// CompassControl class
class CompassControl extends L.Control {
  private _container: HTMLElement | null = null

  onAdd(map: L.Map) {
    this._container = L.DomUtil.create('div', 'compass-control')
    this._container.innerHTML = `
      <div style="
        width: 36px;
        height: 36px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        cursor: pointer;
      ">
        <span style="font-size: 18px;">↑</span>
      </div>
    `
    
    this._container.onclick = () => {
      map.setView(map.getCenter(), map.getZoom(), {
        animate: true
      })
    }
    
    return this._container
  }

  onRemove() {
  }
}

// Interfaces
interface AirQualityData {
  aqi: number
  pm25: number
  pm10: number
  so2: number
  no2: number
  co: number
  o3: number
  lat: number
  lon: number
  city?: string
}

interface LocationData {
  lat: number
  lon: number
  name: string
  country: string
}

interface HistoricalDataPoint {
  dt: number
  main: {
    aqi: number
  }
  components: {
    pm2_5: number
    pm10: number
    so2: number
    no2: number
    co: number
    o3: number
  }
}

// Main Dashboard2 component
export default function Dashboard2() {
  const [airData, setAirData] = useState<AirQualityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState("")
  const WAQI_TOKEN = "1b8317418438c9635ca986176d79907d539026b4"
  const OWM_API_KEY = "66db0c6525cad55de2b9b2f1a1266af7"

  const fetchAirQualityData = async (lat: number, lon: number) => {
    setLoading(true)
    setError("")
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OWM_API_KEY}`
      )
      const geoData = await geoResponse.json()
      const cityName = geoData[0]?.name || "Current Location"

      const aqResponse = await fetch(
        `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${WAQI_TOKEN}`
      )
      const aqData = await aqResponse.json()

      if (aqData.status !== "ok") {
        throw new Error("Failed to fetch air quality data")
      }

      setAirData({
        aqi: aqData.data.aqi,
        pm25: aqData.data.iaqi?.pm25?.v || 0,
        pm10: aqData.data.iaqi?.pm10?.v || 0,
        so2: aqData.data.iaqi?.so2?.v || 0,
        no2: aqData.data.iaqi?.no2?.v || 0,
        co: aqData.data.iaqi?.co?.v || 0,
        o3: aqData.data.iaqi?.o3?.v || 0,
        lat,
        lon,
        city: cityName
      })

      setLocation({
        lat,
        lon,
        name: cityName,
        country: geoData[0]?.country || ""
      })

      setLastUpdated(new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to fetch air quality data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=1&appid=${OWM_API_KEY}`
      )
      const data = await response.json()
      
      if (data.length === 0) {
        setError("Location not found. Please try a different search term.")
        return
      }

      const { lat, lon, name, country } = data[0]
      fetchAirQualityData(lat, lon)
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to search for location. Please try again.")
    }
  }

  const refreshData = () => {
    if (!location) return
    setRefreshing(true)
    fetchAirQualityData(location.lat, location.lon)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchAirQualityData(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setError("Could not get your location. Please enable location services or search manually.")
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
    }
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getAQIDescription = (aqiValue: number) => {
    if (aqiValue <= 50) return "Good"
    if (aqiValue <= 100) return "Moderate"
    if (aqiValue <= 150) return "Poor"
    if (aqiValue <= 200) return "Unhealthy"
    if (aqiValue <= 300) return "Severe"
    return "Hazardous"
  }

  const getAQIColor = (aqiValue: number) => {
    if (aqiValue <= 50) return "#00E400"
    if (aqiValue <= 100) return "#FFFF00"
    if (aqiValue <= 150) return "#FF7E00"
    if (aqiValue <= 200) return "#FF0000"
    if (aqiValue <= 300) return "#8F3F97"
    return "#7E0023"
  }

  const getPollutantColor = (pollutant: string, value: number) => {
    const thresholds: Record<string, {good: number, moderate: number, poor: number, unhealthy: number, severe: number}> = {
      pm25: {good: 12, moderate: 35.4, poor: 55.4, unhealthy: 150.4, severe: 250.4},
      pm10: {good: 54, moderate: 154, poor: 254, unhealthy: 354, severe: 424},
      so2: {good: 35, moderate: 75, poor: 185, unhealthy: 304, severe: 604},
      no2: {good: 53, moderate: 100, poor: 360, unhealthy: 649, severe: 1249},
      co: {good: 4.4, moderate: 9.4, poor: 12.4, unhealthy: 15.4, severe: 30.4},
      o3: {good: 54, moderate: 70, poor: 85, unhealthy: 105, severe: 200}
    }

    const threshold = thresholds[pollutant] || thresholds.pm25
    
    if (value <= threshold.good) return '#00E400'
    if (value <= threshold.moderate) return '#FFFF00'
    if (value <= threshold.poor) return '#FF7E00'
    if (value <= threshold.unhealthy) return '#FF0000'
    if (value <= threshold.severe) return '#8F3F97'
    return '#7E0023'
  }

  if (loading) {
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
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-6 transform transition-all hover:scale-[1.005]">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a city..."
                className="block w-full pl-10 pr-12 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                title="Use current location"
              >
                <MapPin className="h-5 w-5 text-blue-400 hover:text-blue-300" />
              </button>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transform transition hover:scale-105"
            >
              Search
            </button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>

        {airData ? (
          <>
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-6 transform transition-all hover:shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {location?.name || "Current Location"} Air Quality Index (AQI)
                  </h1>
                  <p className="text-gray-400 text-sm mb-4">
                    Real-time PM2.5, PM10 air pollution level in {location?.country || "your area"}
                  </p>
                </div>
                <button 
                  onClick={refreshData} 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
                </button>
              </div>
              
              <div className="text-xs text-gray-500 mb-6">
                Last Updated: {lastUpdated}
              </div>

              {/* AQI Index and Major Pollutants side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* AQI Index */}
                <div className="border border-gray-700 p-6 rounded-xl backdrop-blur-sm bg-gray-700/30">
                  <h2 className="text-lg font-semibold text-gray-300 mb-4">Air Quality Index</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-bold my-2" style={{ color: getAQIColor(airData.aqi) }}>
                        {airData.aqi}
                      </div>
                      <p className="text-lg font-medium" style={{ color: getAQIColor(airData.aqi) }}>
                        {getAQIDescription(airData.aqi)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>PM10 : {airData.pm10} µg/m³</span>
                    </div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-green-400">Good</span>
                      <span className="text-yellow-400">Moderate</span>
                      <span className="text-orange-400">Poor</span>
                      <span className="text-red-400">Unhealthy</span>
                      <span className="text-purple-400">Severe</span>
                      <span className="text-red-700">Hazardous</span>
                    </div>
                    <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 via-red-500 via-purple-500 to-red-700"></div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                      <span>150</span>
                      <span>200</span>
                      <span>300</span>
                      <span>301+</span>
                    </div>
                  </div>
                </div>

                {/* Major Pollutants */}
                <div className="border border-gray-700 p-6 rounded-xl backdrop-blur-sm bg-gray-700/30">
                  <h2 className="text-lg font-semibold text-gray-300 mb-4">Major Air Pollutants</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'PM2.5', value: airData.pm25, unit: 'µg/m³', key: 'pm25' },
                      { name: 'PM10', value: airData.pm10, unit: 'µg/m³', key: 'pm10' },
                      { name: 'SO₂', value: airData.so2, unit: 'ppb', key: 'so2' },
                      { name: 'NO₂', value: airData.no2, unit: 'ppb', key: 'no2' },
                      { name: 'CO', value: airData.co, unit: 'ppb', key: 'co' },
                      { name: 'O₃', value: airData.o3, unit: 'ppb', key: 'o3' }
                    ].map((pollutant) => (
                      <div 
                        key={pollutant.key}
                        className="bg-gray-700/50 rounded-lg p-4 transform transition-all hover:scale-[1.02] hover:shadow-lg"
                      >
                        <h3 className="font-medium text-gray-300 mb-1">{pollutant.name}</h3>
                        <p 
                          className="text-2xl font-bold" 
                          style={{ color: getPollutantColor(pollutant.key, pollutant.value) }}
                        >
                          {pollutant.value} {pollutant.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/30 rounded-lg p-4 flex items-start backdrop-blur-sm border border-blue-800/50 shadow-blue-900/20 shadow-inner">
                <Info className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  The Air Quality Index is based on PM2.5 and PM10 measurements. Values above 100 may affect sensitive groups.
                </p>
              </div>
            </div>

            {/* Activity and Health Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ActivitySuggestions aqi={airData.aqi} />
              <HealthSuggestions aqi={airData.aqi} />
            </div>

            {/* Map between suggestions and historical chart */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Air Quality Map</h2>
              <div className="h-96 w-full rounded-xl overflow-hidden">
                <AirQualityMap 
                  latitude={airData.lat} 
                  longitude={airData.lon} 
                  aqi={airData.aqi} 
                />
              </div>
            </div>

            <HistoricalDataChart location={location} />
          </>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            {error ? (
              <p className="text-red-400">{error}</p>
            ) : (
              <p className="text-gray-400">No air quality data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}