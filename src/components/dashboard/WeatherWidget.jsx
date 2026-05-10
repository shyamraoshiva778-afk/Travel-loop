import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Sun, CloudRain, Snowflake, MapPin } from 'lucide-react'

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setWeather({
        temp: 28,
        condition: 'partly_cloudy',
        humidity: 65,
        city: 'New Delhi',
        icon: 'partly-cloudy'
      })
      setLoading(false)
    }
    fetchWeather()
  }, [])

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-400" />
      case 'cloudy': return <Cloud className="w-6 h-6 text-zinc-400" />
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-400" />
      case 'snowy': return <Snowflake className="w-6 h-6 text-blue-200" />
      default: return <Cloud className="w-6 h-6 text-yellow-400" />
    }
  }

  if (loading) {
    return (
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5">
        <div className="animate-pulse">
          <div className="h-4 w-20 bg-zinc-800 rounded mb-3"></div>
          <div className="h-12 w-24 bg-zinc-800 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 hover:border-yellow-400/30 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-yellow-400" />
        <span className="text-zinc-500 text-xs uppercase tracking-wider">Current Weather</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400 text-sm">{weather?.city}</p>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-white">{weather?.temp}°</span>
            <span className="text-zinc-400 text-sm">C</span>
          </div>
        </div>
        <div className="text-right">
          {getWeatherIcon(weather?.icon)}
          <p className="text-zinc-500 text-xs mt-1">Partly Cloudy</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-zinc-600 text-xs">Humidity: {weather?.humidity}%</span>
        <span className="text-yellow-400/70 text-xs">Good for travel</span>
      </div>
    </motion.div>
  )
}
