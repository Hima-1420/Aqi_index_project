"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

export default function HistoricalChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")

    // Generate mock historical data
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date()
      hour.setHours(hour.getHours() - 23 + i)
      return hour.getHours() + ":00"
    })

    // Generate random data with some trend
    const generateTrendData = (min: number, max: number, volatility: number) => {
      let value = min + Math.random() * (max - min)
      return Array.from({ length: 24 }, () => {
        value += (Math.random() - 0.5) * volatility
        value = Math.max(min, Math.min(max, value))
        return value
      })
    }

    const aqiData = generateTrendData(1, 5, 0.5).map((v) => Math.round(v))
    const pm25Data = generateTrendData(5, 25, 3)
    const o3Data = generateTrendData(20, 40, 5)

    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: hours,
        datasets: [
          {
            label: "AQI",
            data: aqiData,
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            yAxisID: "y",
          },
          {
            label: "PM2.5",
            data: pm25Data,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            yAxisID: "y1",
          },
          {
            label: "O₃",
            data: o3Data,
            borderColor: "rgb(249, 115, 22)",
            backgroundColor: "rgba(249, 115, 22, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            yAxisID: "y2",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed.y !== null) {
                  if (label.includes("AQI")) {
                    label += context.parsed.y.toFixed(0)
                  } else if (label.includes("PM2.5")) {
                    label += context.parsed.y.toFixed(1) + " μg/m³"
                  } else {
                    label += context.parsed.y.toFixed(1) + " μg/m³"
                  }
                }
                return label
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Time (last 24 hours)",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            min: 1,
            max: 5,
            title: {
              display: true,
              text: "AQI",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            min: 0,
            max: 50,
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: "PM2.5 (μg/m³)",
            },
          },
          y2: {
            type: "linear",
            display: false,
            min: 0,
            max: 100,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="w-full h-64">
      <canvas ref={chartRef} />
    </div>
  )
}

