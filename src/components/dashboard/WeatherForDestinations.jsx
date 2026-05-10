import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Sun, Cloud, CloudRain, Wind } from 'lucide-react'

const destinationWeather = [
  { city: 'Goa', state: 'Goa', temp: 32, condition: 'sunny', humidity: 75 },
  { city: 'Manali', state: 'HP', temp: 18, condition: 'cloudy', humidity: 60 },
  { city: 'Kerala', state: 'Kerala', temp: 29, condition: 'rainy', humidity: 85 },
  { city: 'Jaipur', state: 'Rajasthan', temp: 38, condition: 'sunny', humidity: 35 },
  { city: 'Darjeeling', state: 'West Bengal', temp: 15, condition: 'windy', humidity: 70 }
]

export default function WeatherForDestinations() {
  const [destinations] = useState(destinationWeather)

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-4 h-4 text-yellow-400" />
      case 'cloudy': return <Cloud className="w-4 h-4 text-zinc-400" />
      case 'rainy': return <CloudRain className="w-4 h-4 text-blue-400" />
      case 'windy': return <Wind className="w-4 h-4 text-cyan-400" />
      default: return <Sun className="w-4 h-4 text-yellow-400" />
    }
  }

  const getTempColor = (temp) => {
    if (temp < 20) return 'text-blue-400'
    if (temp < 30) return 'text-green-400'
    return 'text-orange-400'
  }

  return (
    <motion.div
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-5">
        <MapPin className="w-5 h-5 text-yellow-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">Destination Weather</h3>
          <p className="text-zinc-500 text-sm">Check weather at popular destinations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {destinations.map((dest, index) => (
          <motion.div
            key={dest.city}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-black/30 border border-zinc-800 rounded-xl p-3 hover:border-yellow-400/30 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white font-medium text-sm">{dest.city}</p>
                <p className="text-zinc-600 text-xs">{dest.state}</p>
              </div>
              {getWeatherIcon(dest.condition)}
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xl font-bold ${getTempColor(dest.temp)}`}>{dest.temp}°C</span>
              <span className="text-zinc-600 text-xs">💧 {dest.humidity}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
