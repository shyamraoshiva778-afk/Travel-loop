import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Clock, ChevronDown } from 'lucide-react'

const commonTimezones = [
  { id: 'Asia/Kolkata', name: 'India (IST)', city: 'New Delhi' },
  { id: 'America/New_York', name: 'New York (EST)', city: 'New York' },
  { id: 'Europe/London', name: 'London (GMT)', city: 'London' },
  { id: 'Asia/Dubai', name: 'Dubai (GST)', city: 'Dubai' },
  { id: 'Asia/Singapore', name: 'Singapore (SGT)', city: 'Singapore' },
  { id: 'Australia/Sydney', name: 'Sydney (AEST)', city: 'Sydney' },
  { id: 'Asia/Tokyo', name: 'Tokyo (JST)', city: 'Tokyo' }
]

export default function TimeZoneDisplay() {
  const [selectedZone, setSelectedZone] = useState(commonTimezones[0])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (timezone) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(currentTime)
  }

  const formatDate = (timezone) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(currentTime)
  }

  return (
    <motion.div
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 hover:border-yellow-400/30 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-yellow-400" />
          <span className="text-zinc-500 text-xs uppercase tracking-wider">Time Zone</span>
        </div>
        <select
          value={selectedZone.id}
          onChange={(e) => setSelectedZone(commonTimezones.find(z => z.id === e.target.value))}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-yellow-400 cursor-pointer"
        >
          {commonTimezones.map(zone => (
            <option key={zone.id} value={zone.id}>{zone.name}</option>
          ))}
        </select>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 text-zinc-500" />
          <span className="text-3xl font-bold text-white font-mono">
            {formatTime(selectedZone.id)}
          </span>
        </div>
        <p className="text-zinc-500 text-sm mt-1">{formatDate(selectedZone.id)}</p>
        <p className="text-yellow-400/70 text-xs mt-2">{selectedZone.city}</p>
      </div>
    </motion.div>
  )
}
