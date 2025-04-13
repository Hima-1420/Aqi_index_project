"use client"

import { useState, useEffect } from "react"
import { Gamepad2, Award, BarChart2, X, Check, ChevronRight } from "lucide-react"

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState('aqiQuiz') // Default to AQI Quiz
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'EcoWarrior', score: 1250, badges: 5 },
    { rank: 2, name: 'CleanAirChamp', score: 1100, badges: 4 },
    { rank: 3, name: 'GreenThumb', score: 980, badges: 3 },
    { rank: 4, name: 'PollutionFighter', score: 850, badges: 3 },
    { rank: 5, name: 'AQIExpert', score: 720, badges: 2 },
  ])

  // Add player to leaderboard
  const addToLeaderboard = (name: string, score: number) => {
    const newEntry = { rank: 0, name, score, badges: Math.min(5, Math.floor(score / 200)) }
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }))
      .slice(0, 5)
    setLeaderboard(updated)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl pt-24 pb-8">
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 mb-6 transform transition-all hover:shadow-2xl">
          <div className="flex items-center mb-6">
            <Gamepad2 className="h-8 w-8 text-green-400 mr-3" />
            <h1 className="text-2xl font-bold text-white">Educational Games</h1>
          </div>

          {/* Game Navigation */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'aqiQuiz', name: 'AQI Quiz', icon: BarChart2 },
              { id: 'cleanAirAdventure', name: 'Clean Air Adventure', icon: Gamepad2 }
            ].map((game) => {
              const Icon = game.icon
              return (
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
                    activeGame === game.id 
                      ? 'bg-green-600 text-white hover-glow' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {game.name}
                </button>
              )
            })}
          </div>

          {/* Game Content */}
          <div className="bg-gray-700/50 rounded-xl p-6 min-h-[500px]">
            {activeGame === 'aqiQuiz' && (
              <AQIQuiz onComplete={addToLeaderboard} />
            )}

            {activeGame === 'cleanAirAdventure' && (
              <CleanAirAdventure onComplete={addToLeaderboard} />
            )}
          </div>

          {/* Leaderboard */}
          <div className="mt-6 bg-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Players</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {leaderboard.map((player) => (
                    <tr key={player.rank} className="hover:bg-gray-700/70">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{player.rank}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{player.score}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {Array.from({ length: player.badges }).map((_, i) => (
                            <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// AQI Quiz Game Component with question rotation
function AQIQuiz({ onComplete }: { onComplete: (name: string, score: number) => void }) {
  // Expanded question pool (50+ questions)
  const allQuestions = [
    {
      id: 'q1',
      question: "What does AQI stand for?",
      options: [
        "Air Quality Index",
        "Atmospheric Quantity Indicator",
        "Air Quotient Indicator",
        "Atmospheric Quality Index"
      ],
      correctAnswer: 0,
      explanation: "AQI stands for Air Quality Index, a measure of how clean or polluted the air is.",
      difficulty: "easy"
    },
    {
      id: 'q2',
      question: "Which pollutant is NOT typically included in AQI calculations?",
      options: [
        "Carbon Monoxide (CO)",
        "Ozone (O3)",
        "Carbon Dioxide (CO2)",
        "Particulate Matter (PM2.5)"
      ],
      correctAnswer: 2,
      explanation: "While CO2 is a greenhouse gas, it's not typically included in AQI which focuses on health-affecting pollutants.",
      difficulty: "medium"
    },
    {
      id: 'q3',
      question: "What is the primary source of PM2.5 in urban areas?",
      options: [
        "Natural dust",
        "Vehicle emissions",
        "Volcanic eruptions",
        "Ocean spray"
      ],
      correctAnswer: 1,
      explanation: "PM2.5 in urban areas primarily comes from vehicle emissions and industrial processes.",
      difficulty: "medium"
    },
    {
      id: 'q4',
      question: "What does a high AQI value indicate?",
      options: [
        "Good air quality",
        "Moderate air quality",
        "Unhealthy air quality",
        "Very good air quality"
      ],
      correctAnswer: 2,
      explanation: "A high AQI value indicates unhealthy air quality, which can affect sensitive groups.",
      difficulty: "easy"
    },
    {
      id: 'q5',
      question: "Which of these is a common health effect of poor air quality?",
      options: [
        "Improved lung function",
        "Increased respiratory issues",
        "Better cardiovascular health",
        "Enhanced cognitive function"
      ],
      correctAnswer: 1,
      explanation: "Poor air quality can lead to increased respiratory issues and other health problems.",
      difficulty: "medium"
    },
    {
        id: 'q6',
        question: "Which of these is NOT a common source of PM2.5?",
        options: [
          "Vehicle exhaust",
          "Wildfire smoke",
          "Ocean waves",
          "Coal power plants"
        ],
        correctAnswer: 2,
        explanation: "PM2.5 comes from combustion (vehicles, fires, industry) not natural water sources.",
        difficulty: "hard"
      },
      {
        id: 'q7',
        question: "What AQI value would trigger a 'Hazardous' air quality alert?",
        options: [
          "50-100",
          "101-150",
          "151-200",
          "301-500"
        ],
        correctAnswer: 3,
        explanation: "AQI above 300 is considered Hazardous for all population groups.",
        difficulty: "medium"
      },
      {
        id: 'q8',
        question: "Which group is most vulnerable to poor air quality?",
        options: [
          "Healthy adults",
          "Professional athletes",
          "People with asthma",
          "All groups equally"
        ],
        correctAnswer: 2,
        explanation: "People with respiratory conditions like asthma are most vulnerable to air pollution.",
        difficulty: "easy"
      },
      {
        id: 'q9',
        question: "What is the primary health concern from ground-level ozone?",
        options: [
          "Skin cancer",
          "Respiratory irritation",
          "Hearing loss",
          "Bone fractures"
        ],
        correctAnswer: 1,
        explanation: "Ground-level ozone can cause breathing problems and aggravate respiratory diseases.",
        difficulty: "medium"
      },
      {
        id: 'q10',
        question: "Which weather condition typically worsens air pollution?",
        options: [
          "Strong winds",
          "Temperature inversion",
          "Heavy rainfall",
          "Low humidity"
        ],
        correctAnswer: 1,
        explanation: "Temperature inversions trap pollutants near the ground, worsening air quality.",
        difficulty: "hard"
      },
      // Continue with 40 more unique questions...
      {
        id: 'q11',
        question: "Which of these is NOT a primary pollutant?",
        options: [
          "Sulfur dioxide (SO2)",
          "Nitrogen dioxide (NO2)",
          "Ozone (O3)",
          "Carbon monoxide (CO)"
        ],
        correctAnswer: 2,
        explanation: "Ozone is a secondary pollutant formed by chemical reactions in the atmosphere.",
        difficulty: "hard"
      },
      {
        id: 'q12',
        question: "What is the main source of sulfur dioxide pollution?",
        options: [
          "Gasoline vehicles",
          "Coal-fired power plants",
          "Natural gas heating",
          "Agricultural burning"
        ],
        correctAnswer: 1,
        explanation: "Coal combustion is the primary source of SO2 emissions.",
        difficulty: "medium"
      },
      {
        id: 'q13',
        question: "Which of these helps reduce indoor air pollution?",
        options: [
          "Air purifiers with HEPA filters",
          "Burning scented candles",
          "Using aerosol sprays",
          "Keeping windows always closed"
        ],
        correctAnswer: 0,
        explanation: "HEPA filters can effectively remove particulate matter from indoor air.",
        difficulty: "easy"
      },
      {
        id: 'q14',
        question: "Which of these is a natural source of air pollution?",
        options: [
          "Volcanic eruptions",
          "Car exhaust",
          "Factory emissions",
          "Power plants"
        ],
        correctAnswer: 0,
        explanation: "Volcanic eruptions release ash and gases naturally, while others are human-made sources.",
        difficulty: "easy"
      },
      {
        id: 'q15',
        question: "What does the Air Quality Index measure?",
        options: [
          "Only ozone levels",
          "Only particulate matter",
          "Multiple pollutants",
          "Only carbon monoxide"
        ],
        correctAnswer: 2,
        explanation: "AQI measures multiple pollutants including ozone, PM2.5, PM10, CO, SO2, and NO2.",
        difficulty: "easy"
      },
      {
        id: 'q16',
        question: "Which activity contributes most to urban air pollution?",
        options: [
          "Road traffic",
          "Home gardening",
          "Recycling programs",
          "Bicycle lanes"
        ],
        correctAnswer: 0,
        explanation: "Vehicle emissions are a major source of urban air pollution.",
        difficulty: "easy"
      },
      {
        id: 'q17',
        question: "What color represents 'Unhealthy' AQI on the scale?",
        options: [
          "Green",
          "Yellow",
          "Orange",
          "Red"
        ],
        correctAnswer: 3,
        explanation: "Red (151-200) represents Unhealthy air quality.",
        difficulty: "easy"
      },
      {
        id: 'q18',
        question: "Which pollutant causes acid rain?",
        options: [
          "Ozone",
          "Sulfur dioxide",
          "Carbon monoxide",
          "Methane"
        ],
        correctAnswer: 1,
        explanation: "SO2 reacts with water vapor to form acid rain.",
        difficulty: "medium"
      },
      {
        id: 'q19',
        question: "What's the main health risk from carbon monoxide?",
        options: [
          "Skin irritation",
          "Reduced oxygen in blood",
          "Bone degeneration",
          "Hearing loss"
        ],
        correctAnswer: 1,
        explanation: "CO binds to hemoglobin, reducing oxygen transport in blood.",
        difficulty: "medium"
      },
      {
        id: 'q20',
        question: "Which trees are best for improving urban air quality?",
        options: [
          "Pine trees",
          "Oak trees",
          "Trees with large leaves",
          "All trees equally"
        ],
        correctAnswer: 2,
        explanation: "Broad-leaf trees capture more particulates due to larger surface area.",
        difficulty: "hard"
      },
      {
        id: 'q21',
        question: "What's the primary component of smog?",
        options: [
          "Ground-level ozone",
          "Carbon dioxide",
          "Methane",
          "Water vapor"
        ],
        correctAnswer: 0,
        explanation: "Photochemical smog primarily contains ground-level ozone.",
        difficulty: "medium"
      },
      {
        id: 'q22',
        question: "Which industry contributes most to NO2 emissions?",
        options: [
          "Textile",
          "Transportation",
          "Fishing",
          "Tourism"
        ],
        correctAnswer: 1,
        explanation: "Vehicle engines are major NO2 sources through fuel combustion.",
        difficulty: "medium"
      },
      {
        id: 'q23',
        question: "What's the safest AQI range for outdoor exercise?",
        options: [
          "0-50",
          "51-100",
          "101-150",
          "Above 150"
        ],
        correctAnswer: 0,
        explanation: "0-50 (Green) is safest for strenuous outdoor activity.",
        difficulty: "easy"
      },
      {
        id: 'q24',
        question: "Which pollutant is odorless and colorless?",
        options: [
          "Sulfur dioxide",
          "Carbon monoxide",
          "Nitrogen dioxide",
          "Ozone"
        ],
        correctAnswer: 1,
        explanation: "CO is particularly dangerous because it's undetectable without instruments.",
        difficulty: "medium"
      },
      {
        id: 'q25',
        question: "What percentage of global air pollution deaths occur in cities?",
        options: [
          "About 25%",
          "About 50%",
          "About 75%",
          "Nearly 90%"
        ],
        correctAnswer: 2,
        explanation: "WHO estimates urban areas account for ~75% of pollution-related deaths.",
        difficulty: "hard"
      },
      {
        id: 'q26',
        question: "Which device measures air pollution levels?",
        options: [
          "Barometer",
          "Anemometer",
          "Air quality monitor",
          "Hygrometer"
        ],
        correctAnswer: 2,
        explanation: "Air quality monitors measure pollutant concentrations.",
        difficulty: "easy"
      },
      {
        id: 'q27',
        question: "What's the main indoor source of PM2.5?",
        options: [
          "Cooking with gas",
          "Houseplants",
          "Electric lights",
          "Hardwood floors"
        ],
        correctAnswer: 0,
        explanation: "Gas stoves release fine particulates during combustion.",
        difficulty: "medium"
      },
      {
        id: 'q28',
        question: "Which country developed the AQI system first?",
        options: [
          "United States",
          "China",
          "United Kingdom",
          "India"
        ],
        correctAnswer: 0,
        explanation: "The US EPA developed the original AQI in 1968.",
        difficulty: "hard"
      },
      {
        id: 'q29',
        question: "What's the main health effect of long-term PM2.5 exposure?",
        options: [
          "Improved lung function",
          "Cardiovascular disease",
          "Stronger bones",
          "Better eyesight"
        ],
        correctAnswer: 1,
        explanation: "Chronic PM2.5 exposure is linked to heart and lung diseases.",
        difficulty: "medium"
      },
      {
        id: 'q30',
        question: "Which weather condition helps disperse air pollution?",
        options: [
          "High pressure",
          "Wind",
          "Temperature inversion",
          "Humidity"
        ],
        correctAnswer: 1,
        explanation: "Wind helps disperse and dilute air pollutants.",
        difficulty: "easy"
      },
      {
        id: 'q31',
        question: "What's the main benefit of green roofs for air quality?",
        options: [
          "They absorb CO2",
          "They reflect sunlight",
          "They filter rainwater",
          "They reduce noise"
        ],
        correctAnswer: 0,
        explanation: "Green roofs help absorb CO2 and produce oxygen.",
        difficulty: "medium"
      },
      {
        id: 'q32',
        question: "Which pollutant contributes most to climate change?",
        options: [
          "Carbon dioxide",
          "Ozone",
          "Sulfur dioxide",
          "Particulate matter"
        ],
        correctAnswer: 0,
        explanation: "CO2 is the primary greenhouse gas driving climate change.",
        difficulty: "easy"
      },
      {
        id: 'q33',
        question: "What's the recommended action when AQI reaches 'Unhealthy'?",
        options: [
          "Continue outdoor activities",
          "Limit prolonged exertion",
          "Evacuate immediately",
          "Wear sunglasses"
        ],
        correctAnswer: 1,
        explanation: "Sensitive groups should reduce prolonged/heavy exertion.",
        difficulty: "easy"
      },
      {
        id: 'q34',
        question: "Which plant is particularly good at absorbing air pollutants?",
        options: [
          "Cactus",
          "Spider plant",
          "Venus flytrap",
          "Bamboo"
        ],
        correctAnswer: 1,
        explanation: "NASA studies found spider plants effective at removing formaldehyde.",
        difficulty: "medium"
      },
      {
        id: 'q35',
        question: "What's the main source of methane pollution?",
        options: [
          "Vehicles",
          "Agriculture",
          "Power plants",
          "Construction"
        ],
        correctAnswer: 1,
        explanation: "Livestock and rice paddies are major methane sources.",
        difficulty: "medium"
      },
      {
        id: 'q36',
        question: "Which building feature improves indoor air quality?",
        options: [
          "Carpeted floors",
          "Ventilation systems",
          "Dark curtains",
          "Fluorescent lighting"
        ],
        correctAnswer: 1,
        explanation: "Proper ventilation helps remove indoor pollutants.",
        difficulty: "easy"
      },
      {
        id: 'q37',
        question: "What percentage of the world's population breathes polluted air?",
        options: [
          "About 25%",
          "About 50%",
          "About 75%",
          "Over 90%"
        ],
        correctAnswer: 3,
        explanation: "WHO estimates 99% of people breathe polluted air exceeding guidelines.",
        difficulty: "hard"
      },
      {
        id: 'q38',
        question: "Which technology reduces power plant emissions?",
        options: [
          "Scrubbers",
          "Solar panels",
          "Wind turbines",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "All these technologies help reduce emissions in different ways.",
        difficulty: "medium"
      },
      {
        id: 'q39',
        question: "What's the main benefit of electric vehicles for air quality?",
        options: [
          "No tailpipe emissions",
          "Quieter operation",
          "Lower maintenance",
          "Faster acceleration"
        ],
        correctAnswer: 0,
        explanation: "Zero tailpipe emissions significantly improve local air quality.",
        difficulty: "easy"
      },
      {
        id: 'q40',
        question: "Which pollutant causes the 'brown cloud' over cities?",
        options: [
          "Ozone",
          "Particulate matter",
          "Carbon monoxide",
          "Sulfur dioxide"
        ],
        correctAnswer: 1,
        explanation: "PM2.5/PM10 create visible haze and brown clouds.",
        difficulty: "medium"
      },
      {
        id: 'q41',
        question: "What's the main source of indoor radon pollution?",
        options: [
          "Cooking gas",
          "Building materials",
          "Ground beneath homes",
          "Cleaning products"
        ],
        correctAnswer: 2,
        explanation: "Radon seeps from underground rock and soil.",
        difficulty: "hard"
      },
      {
        id: 'q42',
        question: "Which policy most effectively reduces urban air pollution?",
        options: [
          "More parking spaces",
          "Public transit investment",
          "Higher speed limits",
          "Diesel subsidies"
        ],
        correctAnswer: 1,
        explanation: "Quality public transit reduces vehicle emissions.",
        difficulty: "medium"
      },
      {
        id: 'q43',
        question: "What's the main health risk from ozone exposure?",
        options: [
          "Liver damage",
          "Lung inflammation",
          "Bone fractures",
          "Skin cancer"
        ],
        correctAnswer: 1,
        explanation: "Ozone irritates and damages lung tissue.",
        difficulty: "medium"
      },
      {
        id: 'q44',
        question: "Which industry is the largest source of VOCs?",
        options: [
          "Petroleum refining",
          "Textile manufacturing",
          "Food processing",
          "Pharmaceuticals"
        ],
        correctAnswer: 0,
        explanation: "Petroleum industry emits volatile organic compounds.",
        difficulty: "hard"
      },
      {
        id: 'q45',
        question: "What's the safest AQI level for school outdoor activities?",
        options: [
          "0-50",
          "51-100",
          "101-150",
          "151-200"
        ],
        correctAnswer: 0,
        explanation: "0-50 (Green) is safest for children's activities.",
        difficulty: "easy"
      },
      {
        id: 'q46',
        question: "Which pollutant contributes to eutrophication?",
        options: [
          "Nitrogen oxides",
          "Carbon monoxide",
          "Ozone",
          "Lead"
        ],
        correctAnswer: 0,
        explanation: "NOx contributes to nutrient pollution in water.",
        difficulty: "hard"
      },
      {
        id: 'q47',
        question: "What's the main benefit of urban trees for air quality?",
        options: [
          "They absorb CO2",
          "They block wind",
          "They provide shade",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "Urban trees provide multiple air quality benefits.",
        difficulty: "easy"
      },
      {
        id: 'q48',
        question: "Which measurement indicates smallest particles?",
        options: [
          "PM10",
          "PM2.5",
          "PM1",
          "PM0.1"
        ],
        correctAnswer: 3,
        explanation: "PM0.1 measures ultrafine particles (0.1 microns).",
        difficulty: "hard"
      },
      {
        id: 'q49',
        question: "What's the main source of airborne lead pollution today?",
        options: [
          "Leaded gasoline",
          "Battery recycling",
          "Paint chips",
          "Industrial emissions"
        ],
        correctAnswer: 1,
        explanation: "Battery recycling is now the main source after leaded gas phaseout.",
        difficulty: "hard"
      },
    
    // Add 48 more questions following the same format...
    {
      id: 'q50',
      question: "Which of these is NOT a common source of PM2.5?",
      options: [
        "Vehicle exhaust",
        "Wildfire smoke",
        "Ocean waves",
        "Coal power plants"
      ],
      correctAnswer: 2,
      explanation: "PM2.5 comes from combustion (vehicles, fires, industry) not natural water sources.",
      difficulty: "hard"
    }
  ];

  // Get 10 random questions, avoiding recent ones
  const getAskedQuestions = (): string[] => {
    try {
      const stored = localStorage.getItem('askedQuestions');
      if (stored) {
        return JSON.parse(stored) as string[];
      }
    } catch (e) {
      console.error("Error parsing askedQuestions", e);
    }
    return [];
  };

  const getQuestions = () => {
    const askedQuestions = getAskedQuestions();
    const availableQuestions = allQuestions.filter(q => !askedQuestions.includes(q.id));
    
    // If not enough questions, reset the asked questions
    if (availableQuestions.length < 10) {
      localStorage.setItem('askedQuestions', JSON.stringify([]));
      return allQuestions.slice(0, 10);
    }
    
    return availableQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
  };

  const [questions, setQuestions] = useState<typeof allQuestions>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Initialize questions
  useEffect(() => {
    setQuestions(getQuestions());
  }, []);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      const streakBonus = streak >= 2 ? 20 * streak : 0;
      setScore(prev => prev + 100 + streakBonus);
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
    } else {
      setStreak(0);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    // Track asked question
    const askedQuestions = getAskedQuestions();
    const updatedAskedQuestions = [...askedQuestions, questions[currentQuestion].id];
    localStorage.setItem('askedQuestions', JSON.stringify(updatedAskedQuestions));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setQuestions(getQuestions());
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizComplete(false);
    setStreak(0);
    setMaxStreak(0);
  };

  const submitScore = () => {
    onComplete(playerName || "Anonymous", score);
    restartQuiz();
  };

  if (quizComplete) {
    const badges = Math.min(5, Math.floor(score / 200));
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Quiz Complete!</h2>
        <div className="bg-gray-800 rounded-lg p-6 mb-6 max-w-md mx-auto">
          <p className="text-gray-300 mb-2">Your score: <span className="text-white font-bold">{score}</span></p>
          <p className="text-gray-300 mb-2">Correct answers: <span className="text-white">{Math.floor(score / 100)}/{questions.length}</span></p>
          <p className="text-gray-300 mb-2">Longest streak: <span className="text-white">{maxStreak}</span></p>
          <p className="text-gray-300 mb-4">Badges earned: <span className="text-yellow-400">{badges}</span></p>
          
          <div className="flex justify-center space-x-1 mb-4">
            {Array.from({ length: badges }).map((_, i) => (
              <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your name for leaderboard"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg w-full mb-4"
          />
          <button
            onClick={submitScore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors mr-2"
          >
            Submit Score
          </button>
          <button
            onClick={restartQuiz}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="inline-block p-6 bg-blue-900/20 rounded-full mb-4">
          <BarChart2 className="h-12 w-12 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Loading Quiz...</h3>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">AQI Quiz</h2>
      <p className="text-gray-300 mb-6 text-center">
        Test your knowledge about air quality (Question {currentQuestion + 1}/{questions.length})
      </p>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-white font-medium">Score: {score}</div>
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-2">Streak:</span>
            <div className="flex">
              {streak > 0 && Array.from({ length: Math.min(streak, 3) }).map((_, i) => (
                <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {streak > 3 && <span className="text-yellow-400 text-sm ml-1">+{streak - 3}</span>}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">{questions[currentQuestion].question}</h3>
        
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showExplanation && handleAnswer(index)}
              disabled={showExplanation}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                showExplanation
                  ? index === questions[currentQuestion].correctAnswer
                    ? 'bg-green-900/50 text-green-300'
                    : selectedAnswer === index
                      ? 'bg-red-900/50 text-red-300'
                      : 'bg-gray-700/50 text-gray-400'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {showExplanation && (
                <span className="mr-3">
                  {index === questions[currentQuestion].correctAnswer ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : selectedAnswer === index ? (
                    <X className="h-5 w-5 text-red-400" />
                  ) : null}
                </span>
              )}
              {option}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
            <p className="text-gray-300">{questions[currentQuestion].explanation}</p>
            <button
              onClick={nextQuestion}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center ml-auto"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Clean Air Adventure Game Component
function CleanAirAdventure({ onComplete }: { onComplete: (name: string, score: number) => void }) {
  const scenarios = [
    {
      id: "commute",
      title: "Daily Commute",
      description: "How will you get to work today? Your choice affects air quality and your health.",
      options: [
        {
          text: "Drive alone in your car",
          aqiImpact: 5,
          healthImpact: -5,
          moneyImpact: -15,
          message: "Convenient but contributes to traffic congestion and pollution."
        },
        {
          text: "Carpool with 2 colleagues",
          aqiImpact: 2,
          healthImpact: 0,
          moneyImpact: -5,
          message: "Reduces emissions by sharing the ride."
        },
        {
          text: "Take the bus",
          aqiImpact: -1,
          healthImpact: 5,
          moneyImpact: -2,
          message: "Public transport is the most eco-friendly option!"
        },
        {
          text: "Bike to work",
          aqiImpact: -2,
          healthImpact: 10,
          moneyImpact: 5,
          message: "Zero emissions and great exercise! You'll feel energized."
        }
      ]
    },
    {
      id: "lunch",
      title: "Lunch Break",
      description: "It's lunch time! How will you get your meal?",
      options: [
        {
          text: "Drive to a restaurant",
          aqiImpact: 3,
          healthImpact: 0,
          moneyImpact: -10,
          message: "Extra driving adds to local pollution."
        },
        {
          text: "Order delivery",
          aqiImpact: 4,
          healthImpact: -2,
          moneyImpact: -12,
          message: "Delivery vehicles contribute significantly to urban emissions."
        },
        {
          text: "Walk to a nearby cafe",
          aqiImpact: -1,
          healthImpact: 5,
          moneyImpact: -8,
          message: "No emissions from walking and you get some fresh air."
        },
        {
          text: "Eat packed lunch from home",
          aqiImpact: -2,
          healthImpact: 5,
          moneyImpact: 5,
          message: "Most sustainable option with no additional travel needed."
        }
      ]
    },
    {
      id: "shopping",
      title: "Weekend Shopping",
      description: "You need to buy groceries and some household items. What's your approach?",
      options: [
        {
          text: "Drive to big box store for everything",
          aqiImpact: 6,
          healthImpact: -5,
          moneyImpact: -5,
          message: "Long drive to a large store increases your carbon footprint."
        },
        {
          text: "Order everything online for delivery",
          aqiImpact: 5,
          healthImpact: -2,
          moneyImpact: -10,
          message: "Multiple delivery trips create more emissions than you might think."
        },
        {
          text: "Walk to local stores for most items",
          aqiImpact: -3,
          healthImpact: 10,
          moneyImpact: 0,
          message: "Supporting local businesses and reducing emissions - great choice!"
        },
        {
          text: "Bike to farmers market and bulk store",
          aqiImpact: -4,
          healthImpact: 15,
          moneyImpact: 5,
          message: "Minimal packaging and local produce make this the greenest option."
        }
      ]
    },
    {
      id: "home",
      title: "Home Energy",
      description: "It's a hot summer day. How will you cool your home?",
      options: [
        {
          text: "Run AC all day at 68°F",
          aqiImpact: 8,
          healthImpact: -5,
          moneyImpact: -20,
          message: "Excessive AC use strains the power grid and increases emissions."
        },
        {
          text: "Use AC moderately at 75°F with fans",
          aqiImpact: 4,
          healthImpact: 0,
          moneyImpact: -10,
          message: "Reasonable compromise between comfort and efficiency."
        },
        {
          text: "Open windows and use fans only",
          aqiImpact: -2,
          healthImpact: 5,
          moneyImpact: 5,
          message: "Natural ventilation is the most sustainable approach."
        },
        {
          text: "Install smart thermostat and solar panels",
          aqiImpact: -5,
          healthImpact: 10,
          moneyImpact: -15,
          message: "Investment in green tech pays off in the long run!"
        }
      ]
    }
  ]

  const [currentScenario, setCurrentScenario] = useState(0)
  const [gameState, setGameState] = useState({
    aqi: 60,
    health: 100,
    money: 100,
    completedScenarios: [] as number[],
    showResult: false,
    lastChoice: null as any,
    playerName: ""
  })

  const [gameComplete, setGameComplete] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const makeChoice = (choiceIndex: number) => {
    const choice = scenarios[currentScenario].options[choiceIndex]
    
    setGameState(prev => {
      const newAqi = Math.max(0, Math.min(300, prev.aqi + choice.aqiImpact))
      const newHealth = Math.max(0, Math.min(100, prev.health + choice.healthImpact))
      const newMoney = prev.money + choice.moneyImpact
      
      return {
        ...prev,
        aqi: newAqi,
        health: newHealth,
        money: newMoney,
        completedScenarios: [...prev.completedScenarios, currentScenario],
        showResult: true,
        lastChoice: choice
      }
    })
  }

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1)
      setGameState(prev => ({ ...prev, showResult: false }))
    } else {
      // Calculate final score
      const score = Math.floor(
        (300 - gameState.aqi) * 2 + // AQI component (better AQI = higher score)
        gameState.health * 3 +     // Health component
        gameState.money * 0.5      // Money component (least important)
      )
      setFinalScore(score)
      setGameComplete(true)
    }
  }

  const restartGame = () => {
    setCurrentScenario(0)
    setGameState({
      aqi: 60,
      health: 100,
      money: 100,
      completedScenarios: [],
      showResult: false,
      lastChoice: null,
      playerName: ""
    })
    setGameComplete(false)
  }

  const submitScore = () => {
    onComplete(gameState.playerName || "Anonymous", finalScore)
    restartGame()
  }

  const getAqiLevel = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "text-green-400" }
    if (aqi <= 100) return { label: "Moderate", color: "text-yellow-400" }
    if (aqi <= 150) return { label: "Unhealthy (Sensitive)", color: "text-orange-400" }
    return { label: "Unhealthy", color: "text-red-400" }
  }

  const aqiLevel = getAqiLevel(gameState.aqi)

  if (gameComplete) {
    const badges = Math.min(5, Math.floor(finalScore / 500))
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Adventure Complete!</h2>
        <div className="bg-gray-800 rounded-lg p-6 mb-6 max-w-md mx-auto">
          <p className="text-gray-300 mb-2">Your final score: <span className="text-white font-bold">{finalScore}</span></p>
          <p className="text-gray-300 mb-2">Final AQI: <span className={aqiLevel.color}>{gameState.aqi} ({aqiLevel.label})</span></p>
          <p className="text-gray-300 mb-2">Health: <span className="text-white">{gameState.health}/100</span></p>
          <p className="text-gray-300 mb-4">Money: <span className="text-white">${gameState.money}</span></p>
          <p className="text-gray-300 mb-4">Badges earned: <span className="text-yellow-400">{badges}</span></p>
          
          <div className="flex justify-center space-x-1 mb-4">
            {Array.from({ length: badges }).map((_, i) => (
              <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <input
            type="text"
            value={gameState.playerName}
            onChange={(e) => setGameState(prev => ({ ...prev, playerName: e.target.value }))}
            placeholder="Your name for leaderboard"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg w-full mb-4"
          />
          <button
            onClick={submitScore}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors mr-2"
          >
            Submit Score
          </button>
          <button
            onClick={restartGame}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    )
  }

  if (gameState.showResult) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold text-purple-400 mb-4">
          Scenario {currentScenario + 1}/{scenarios.length}: {scenarios[currentScenario].title}
        </h2>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <p className="text-gray-300 mb-4">{gameState.lastChoice.message}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-400">AQI Change</p>
              <p className={`text-lg font-semibold ${
                gameState.lastChoice.aqiImpact > 0 ? 'text-red-400' : 
                gameState.lastChoice.aqiImpact < 0 ? 'text-green-400' : 'text-gray-300'
              }`}>
                {gameState.lastChoice.aqiImpact > 0 ? '+' : ''}{gameState.lastChoice.aqiImpact}
              </p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Health Change</p>
              <p className={`text-lg font-semibold ${
                gameState.lastChoice.healthImpact > 0 ? 'text-green-400' : 
                gameState.lastChoice.healthImpact < 0 ? 'text-red-400' : 'text-gray-300'
              }`}>
                {gameState.lastChoice.healthImpact > 0 ? '+' : ''}{gameState.lastChoice.healthImpact}
              </p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Money Change</p>
              <p className={`text-lg font-semibold ${
                gameState.lastChoice.moneyImpact > 0 ? 'text-green-400' : 
                gameState.lastChoice.moneyImpact < 0 ? 'text-red-400' : 'text-gray-300'
              }`}>
                {gameState.lastChoice.moneyImpact > 0 ? '+' : ''}{gameState.lastChoice.moneyImpact}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Current AQI</p>
              <p className={`text-lg font-semibold ${aqiLevel.color}`}>
                {gameState.aqi} ({aqiLevel.label})
              </p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Health</p>
              <p className={`text-lg font-semibold ${
                gameState.health > 70 ? 'text-green-400' : 
                gameState.health > 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {gameState.health}/100
              </p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Money</p>
              <p className="text-lg font-semibold text-gray-300">
                ${gameState.money}
              </p>
            </div>
          </div>
          
          <button
            onClick={nextScenario}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
          >
            {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'See Final Results'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-purple-400 mb-4 text-center">
        Scenario {currentScenario + 1}/{scenarios.length}: {scenarios[currentScenario].title}
      </h2>
      <p className="text-gray-300 mb-6 text-center">
        {scenarios[currentScenario].description}
      </p>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios[currentScenario].options.map((option, index) => (
            <button
              key={index}
              onClick={() => makeChoice(index)}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-4 rounded-lg text-left transition-colors"
            >
              <h3 className="font-medium mb-2">{option.text}</h3>
              <div className="flex justify-between text-xs text-gray-400">
                <span>AQI: {option.aqiImpact > 0 ? '+' : ''}{option.aqiImpact}</span>
                <span>Health: {option.healthImpact > 0 ? '+' : ''}{option.healthImpact}</span>
                <span>Money: {option.moneyImpact > 0 ? '+' : ''}{option.moneyImpact}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Current AQI</p>
            <p className={`text-lg font-semibold ${aqiLevel.color}`}>
              {gameState.aqi} ({aqiLevel.label})
            </p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Health</p>
            <p className={`text-lg font-semibold ${
              gameState.health > 70 ? 'text-green-400' : 
              gameState.health > 40 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {gameState.health}/100
            </p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Money</p>
            <p className="text-lg font-semibold text-gray-300">
              ${gameState.money}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}