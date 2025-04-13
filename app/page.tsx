import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Wind, Droplets, Thermometer, Activity } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4 glow-text">Monitor Air Quality in Real-Time</h1>
              <p className="text-lg text-gray-300 mb-8">
                Stay informed about the air you breathe. Our dashboard provides comprehensive insights into air quality
                data to help you make informed decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center hover-glow"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="bg-gray-800 hover:bg-gray-700 text-green-400 font-semibold py-3 px-6 rounded-lg border border-green-600 transition duration-300 flex items-center justify-center"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/image.png?height=400&width=500"
                alt="Air Quality Monitoring"
                width={500}
                height={400}
                className="rounded-lg shadow-xl border border-gray-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-400 mb-12 glow-text">Why Monitor Air Quality?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Wind className="h-10 w-10 text-green-400" />}
              title="Real-Time Data"
              description="Access up-to-date air quality information from your location and around the world."
            />
            <FeatureCard
              icon={<Droplets className="h-10 w-10 text-green-400" />}
              title="Pollution Insights"
              description="Track various pollutants including PM2.5, PM10, CO, NO₂, and O₃."
            />
            <FeatureCard
              icon={<Thermometer className="h-10 w-10 text-green-400" />}
              title="Health Recommendations"
              description="Receive personalized health advice based on current air quality levels."
            />
            <FeatureCard
              icon={<Activity className="h-10 w-10 text-green-400" />}
              title="Historical Trends"
              description="Analyze air quality patterns over time to identify trends and make predictions."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-700/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Monitor Air Quality?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Sign up now to access our comprehensive air quality dashboard and stay informed about the air you breathe.
          </p>
          <Link
            href="/signup"
            className="bg-white text-green-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-300 inline-block hover-glow"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-green-400">Air Quality Monitor</h3>
              <p className="max-w-md">
                Providing real-time air quality data to help you make informed decisions about your health and
                environment.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-green-400">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-green-400 transition">
                      About Air Quality
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-green-400 transition">
                      Health Effects
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-green-400 transition">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-green-400">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-green-400 transition">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-green-400 transition">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-green-400 transition">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-green-400">Connect</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-green-400 transition">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-green-400 transition">
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-green-400 transition">
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Air Quality Monitor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-700/50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-600 hover-glow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-green-400 mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}