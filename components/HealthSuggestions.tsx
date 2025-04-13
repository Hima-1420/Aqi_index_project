function HealthSuggestions({ aqi }: { aqi: number }) {
    const getAQIColor = (aqi: number) => {
      if (aqi <= 50) return '#00E400'
      if (aqi <= 100) return '#FFFF00'
      if (aqi <= 150) return '#FF7E00'
      if (aqi <= 200) return '#FF0000'
      if (aqi <= 300) return '#8F3F97'
      return '#7E0023'
    }
  
    const getHealthSuggestions = () => {
      const suggestions = {
        asthma: {
          good: "Safe for outdoor activities with normal precautions",
          moderate: "May trigger symptoms in sensitive individuals",
          poor: "Increased risk of asthma attacks, carry rescue inhaler",
          unhealthy: "High risk of severe attacks, limit outdoor exposure",
          severe: "Very high risk, avoid outdoor activities completely",
          hazardous: "Extreme risk, stay indoors with air purifiers"
        },
        copd: {
          good: "Low risk, normal activities can continue",
          moderate: "Mild symptoms possible, monitor breathing",
          poor: "Moderate risk, reduce strenuous activities",
          unhealthy: "High risk of exacerbations, use oxygen if prescribed",
          severe: "Very high risk, avoid all outdoor exposure",
          hazardous: "Critical risk, seek medical advice if symptoms worsen"
        },
        heartDisease: {
          good: "Low cardiovascular risk",
          moderate: "Possible mild strain on cardiovascular system",
          poor: "Increased risk of cardiovascular events",
          unhealthy: "High risk, limit physical exertion",
          severe: "Very high risk, avoid outdoor activities",
          hazardous: "Extreme risk, stay indoors and monitor symptoms"
        },
        allergies: {
          good: "Low allergen levels, minimal symptoms",
          moderate: "Mild symptoms possible in sensitive individuals",
          poor: "Moderate symptoms likely, consider antihistamines",
          unhealthy: "Severe symptoms likely, limit outdoor exposure",
          severe: "Very severe symptoms, stay indoors when possible",
          hazardous: "Extreme symptoms, use air purifiers and medications"
        }
      }
  
      if (aqi <= 50) {
        return {
          title: "Health Conditions: Good Air Quality",
          suggestions: [
            { condition: "Asthma", advice: suggestions.asthma.good },
            { condition: "COPD", advice: suggestions.copd.good },
            { condition: "Heart Disease", advice: suggestions.heartDisease.good },
            { condition: "Allergies", advice: suggestions.allergies.good }
          ]
        }
      } else if (aqi <= 100) {
        return {
          title: "Health Conditions: Moderate Air Quality",
          suggestions: [
            { condition: "Asthma", advice: suggestions.asthma.moderate },
            { condition: "COPD", advice: suggestions.copd.moderate },
            { condition: "Heart Disease", advice: suggestions.heartDisease.moderate },
            { condition: "Allergies", advice: suggestions.allergies.moderate }
          ]
        }
      } else if (aqi <= 150) {
        return {
          title: "Health Conditions: Poor Air Quality",
          suggestions: [
            { condition: "Asthma", advice: suggestions.asthma.poor },
            { condition: "COPD", advice: suggestions.copd.poor },
            { condition: "Heart Disease", advice: suggestions.heartDisease.poor },
            { condition: "Allergies", advice: suggestions.allergies.poor }
          ]
        }
      } else if (aqi <= 200) {
        return {
          title: "Health Conditions: Unhealthy Air Quality",
          suggestions: [
            { condition: "Asthma", advice: suggestions.asthma.unhealthy },
            { condition: "COPD", advice: suggestions.copd.unhealthy },
            { condition: "Heart Disease", advice: suggestions.heartDisease.unhealthy },
            { condition: "Allergies", advice: suggestions.allergies.unhealthy }
          ]
        }
      } else if (aqi <= 300) {
        return {
          title: "Health Conditions: Severe Air Quality",
          suggestions: [
            { condition: "Asthma", advice: suggestions.asthma.severe },
            { condition: "COPD", advice: suggestions.copd.severe },
            { condition: "Heart Disease", advice: suggestions.heartDisease.severe },
            { condition: "Allergies", advice: suggestions.allergies.severe }
          ]
        }
      } else {
        return {
          title: "Health Conditions: Hazardous Air Quality",
          suggestions: [
            { condition: "Asthma", advice: suggestions.asthma.hazardous },
            { condition: "COPD", advice: suggestions.copd.hazardous },
            { condition: "Heart Disease", advice: suggestions.heartDisease.hazardous },
            { condition: "Allergies", advice: suggestions.allergies.hazardous }
          ]
        }
      }
    }
  
    const { title, suggestions } = getHealthSuggestions()
    const aqiColor = getAQIColor(aqi)
  
    return (
      <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-6 transform transition-all hover:scale-[1.01] hover:shadow-2xl">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-full bg-gray-700 mr-3">
            <svg className="h-5 w-5" style={{ color: aqiColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((item, index) => (
            <div key={index} className="bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-medium text-green-400 mb-2">{item.condition}</h3>
              <p className="text-gray-300">{item.advice}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }