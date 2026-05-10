import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Package, DollarSign, MapPin, FileText } from 'lucide-react'

export default function ProgressTracker({ trip }) {
  const [progress, setProgress] = useState({
    basic: false,
    stops: 0,
    activities: 0,
    packing: 0,
    budget: false,
    notes: 0
  })

  useEffect(() => {
    if (!trip) return

    const calculateProgress = async () => {
      const { data: stops } = await fetch('/api/stops').catch(() => ({ data: [] }))
      setProgress({
        basic: trip.trip_name && trip.start_date && trip.end_date,
        stops: stops?.length || 0,
        activities: 0,
        packing: 0,
        budget: false,
        notes: 0
      })
    }

    calculateProgress()
  }, [trip])

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: CheckCircle, done: progress.basic },
    { id: 'stops', label: 'Add Stops', icon: MapPin, done: progress.stops > 0, count: progress.stops },
    { id: 'activities', label: 'Activities', icon: Circle, done: progress.activities > 0, count: progress.activities },
    { id: 'packing', label: 'Packing', icon: Package, done: progress.packing > 0, count: progress.packing },
    { id: 'budget', label: 'Budget', icon: DollarSign, done: progress.budget },
    { id: 'notes', label: 'Notes', icon: FileText, done: progress.notes > 0, count: progress.notes }
  ]

  const completedCount = steps.filter(s => s.done).length
  const percentage = Math.round((completedCount / steps.length) * 100)

  if (!trip) {
    return null
  }

  return (
    <motion.div
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Planning Progress</h3>
          <p className="text-zinc-500 text-sm">{trip.trip_name}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-yellow-400">{percentage}%</span>
          <p className="text-zinc-600 text-xs">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-center"
            >
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                step.done
                  ? 'bg-yellow-400/20 text-yellow-400'
                  : 'bg-zinc-800 text-zinc-600'
              }`}>
                {step.done ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <p className={`text-xs ${step.done ? 'text-yellow-400' : 'text-zinc-600'}`}>{step.label}</p>
              {step.count !== undefined && step.count > 0 && (
                <p className="text-zinc-700 text-xs">{step.count}</p>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
