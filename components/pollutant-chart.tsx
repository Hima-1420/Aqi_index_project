"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

interface PollutantData {
  pm2_5: number
  pm10: number
  no2: number
  o3: number
  co: number
  so2: number
}

export default function PollutantChart({ data }: { data: PollutantData }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!data) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")

    // Prepare data
    const pollutants = {
      "PM2.5": data.pm2_5,
      PM10: data.pm10,
      "NO₂": data.no2,
      "O₃": data.o3,
      CO: data.co / 100, // Scale down CO for better visualization
      "SO₂": data.so2,
    }

    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(pollutants),
        datasets: [
          {
            label: "Concentration (μg/m³)",
            data: Object.values(pollutants),
            backgroundColor: [
              "rgba(52, 211, 153, 0.7)",
              "rgba(96, 165, 250, 0.7)",
              "rgba(251, 146, 60, 0.7)",
              "rgba(167, 139, 250, 0.7)",
              "rgba(248, 113, 113, 0.7)",
              "rgba(251, 191, 36, 0.7)",
            ],
            borderColor: [
              "rgb(16, 185, 129)",
              "rgb(59, 130, 246)",
              "rgb(234, 88, 12)",
              "rgb(139, 92, 246)",
              "rgb(239, 68, 68)",
              "rgb(245, 158, 11)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2) + " μg/m³"
                }
                return label
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Concentration (μg/m³)",
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="w-full h-64">
      <canvas ref={chartRef} />
    </div>
  )
}

