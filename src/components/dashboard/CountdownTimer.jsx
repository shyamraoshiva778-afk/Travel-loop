import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Plane } from 'lucide-react'

export default function CountdownTimer({ trips }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })
  const [nextTrip, setNextTrip] = useState(null)

  useEffect(() => {
    if (!trips || trips.length === 0) return

    const findNextTrip = () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const upcoming = trips
        .filter(t => new Date(t.start_date) >= today)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
      return upcoming[0] || null
    }

    const trip = findNextTrip()
    setNextTrip(trip)

    if (!trip) return

    const calculateTimeLeft = () => {
      const now = new Date()
      const start = new Date(trip.start_date)
      const diff = start - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      setTimeLeft({ days, hours, minutes })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(timer)
  }, [trips])

  if (!nextTrip) {
    return (
      <motion.div
        className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-yellow-400" />
          <span className="text-zinc-500 text-xs uppercase tracking-wider">Next Trip</span>
        </div>
        <div className="text-center py-4">
          <Plane className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
          <p className="text-zinc-500 text-sm">No upcoming trips</p>
          <p className="text-zinc-600 text-xs">Create a trip to start countdown</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 hover:border-yellow-400/30 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-yellow-400" />
        <span className="text-zinc-500 text-xs uppercase tracking-wider">Next Trip</span>
      </div>

      <p className="text-white font-semibold text-sm mb-3 truncate">{nextTrip.trip_name}</p>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-black/30 rounded-lg p-2">
          <span className="block text-2xl font-bold text-yellow-400">{timeLeft.days}</span>
          <span className="text-zinc-600 text-xs">Days</span>
        </div>
        <div className="bg-black/30 rounded-lg p-2">
          <span className="block text-2xl font-bold text-white">{timeLeft.hours}</span>
          <span className="text-zinc-600 text-xs">Hours</span>
        </div>
        <div className="bg-black/30 rounded-lg p-2">
          <span className="block text-2xl font-bold text-white">{timeLeft.minutes}</span>
          <span className="text-zinc-600 text-xs">Min</span>
        </div>
      </div>
    </motion.div>
  )
}
