"use client"

import { useEffect, useRef } from "react"

interface AirQualityGaugeProps {
  value: number
  maxValue?: number
}

export default function AirQualityGauge({ value, maxValue = 500 }: AirQualityGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Get color and label based on AQI value
  const getAqiLevel = () => {
    if (value <= 50) return { color: "#00E400", label: "Good" }
    if (value <= 100) return { color: "#FFFF00", label: "Moderate" }
    if (value <= 150) return { color: "#FF7E00", label: "Poor" }
    if (value <= 200) return { color: "#FF0000", label: "Unhealthy" }
    if (value <= 300) return { color: "#8F3F97", label: "Severe" }
    return { color: "#7E0023", label: "Hazardous" }
  }

  const aqiLevel = getAqiLevel()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20 // Slightly smaller radius for better spacing

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false)
    ctx.lineWidth = 24 // Thicker line for better visibility
    ctx.strokeStyle = "#f1f5f9"
    ctx.stroke()

    // Calculate angle based on AQI value
    const minAngle = Math.PI
    const maxAngle = 2 * Math.PI
    const normalizedValue = Math.min(value, maxValue)
    const angle = minAngle + (normalizedValue / maxValue) * (maxAngle - minAngle)

    // Draw value arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, angle, false)
    ctx.lineWidth = 24
    ctx.strokeStyle = aqiLevel.color
    ctx.stroke()

    // Draw center text
    ctx.font = "bold 42px Arial, sans-serif"
    ctx.fillStyle = "#1f2937"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(value.toString(), centerX, centerY - 15)

    // Draw quality label
    ctx.font = "bold 20px Arial, sans-serif"
    ctx.fillStyle = aqiLevel.color
    ctx.fillText(aqiLevel.label, centerX, centerY + 35)

    // Draw scale markers
    ctx.font = "12px Arial, sans-serif"
    ctx.fillStyle = "#6b7280"
    const markerValues = [0, 50, 100, 150, 200, 300, 400, 500]
    markerValues.forEach((markerValue) => {
      const markerAngle = Math.PI + (markerValue / maxValue) * Math.PI
      const markerX = centerX + (radius + 20) * Math.cos(markerAngle)
      const markerY = centerY + (radius + 20) * Math.sin(markerAngle)
      ctx.fillText(markerValue.toString(), markerX, markerY)
    })

  }, [value, maxValue, aqiLevel])

  return (
    <div className="aqi-gauge" style={{
      width: '340px',
      maxWidth: '100%',
      margin: '0 auto',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{
        fontSize: '26px',
        fontWeight: 'bold',
        margin: '0 0 20px 0',
        color: '#1f2937'
      }}>
        Air Quality Index
      </h2>
      
      <div style={{ 
        position: 'relative',
        marginBottom: '20px'
      }}>
        <canvas 
          ref={canvasRef} 
          width={340} 
          height={200}
          style={{
            display: 'block',
            margin: '0 auto'
          }}
        />
        
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '20px',
          fontWeight: 'bold',
          color: aqiLevel.color,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '4px 12px',
          borderRadius: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Current: {value}
        </div>
      </div>
      
      <div style={{
        fontSize: '22px',
        fontWeight: 'bold',
        color: aqiLevel.color,
        margin: '10px 0',
        padding: '8px 0',
        borderTop: `2px solid ${aqiLevel.color}`,
        borderBottom: `2px solid ${aqiLevel.color}`
      }}>
        {aqiLevel.label} Air Quality
      </div>
      
      <div style={{
        fontSize: '14px',
        color: '#6b7280',
        marginTop: '15px'
      }}>
        {value >= 200 && (
          <p style={{ color: aqiLevel.color, fontWeight: 'bold' }}>
            Warning: Consider limiting outdoor activities
          </p>
        )}
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}