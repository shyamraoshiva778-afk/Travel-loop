import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingDown, TrendingUp, Sparkles } from 'lucide-react'

const budgetRanges = [
  { id: 'budget', name: 'Budget', min: 0, max: 10000, icon: TrendingDown, color: 'text-green-400' },
  { id: 'mid', name: 'Mid-Range', min: 10000, max: 30000, icon: DollarSign, color: 'text-yellow-400' },
  { id: 'luxury', name: 'Luxury', min: 30000, max: 100000, icon: TrendingUp, color: 'text-purple-400' }
]

const smartSuggestions = {
  budget: [
    { name: 'Mysore', state: 'Karnataka', estimate: '₹4,500/day' },
    { name: 'Rishikesh', state: 'Uttarakhand', estimate: '₹3,800/day' },
    { name: 'Pondicherry', state: 'Tamil Nadu', estimate: '₹4,200/day' }
  ],
  mid: [
    { name: 'Jaipur', state: 'Rajasthan', estimate: '₹12,000/day' },
    { name: 'Udaipur', state: 'Rajasthan', estimate: '₹11,500/day' },
    { name: 'Kerala', state: 'Kerala', estimate: '₹13,000/day' }
  ],
  luxury: [
    { name: 'Ladakh', state: 'Jammu & Kashmir', estimate: '₹45,000/day' },
    { name: 'Andaman', state: 'Andaman & Nicobar', estimate: '₹50,000/day' },
    { name: 'Goa', state: 'Goa', estimate: '₹55,000/day' }
  ]
}

export default function BudgetRangeSelector({ onSelect }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (range) => {
    setSelected(range.id)
    if (onSelect) onSelect(range)
  }

  return (
    <motion.div
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-5 h-5 text-yellow-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">Budget Range</h3>
          <p className="text-zinc-500 text-sm">Select your daily budget</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {budgetRanges.map((range) => {
          const Icon = range.icon
          return (
            <motion.button
              key={range.id}
              onClick={() => handleSelect(range)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                selected === range.id
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-zinc-800 hover:border-zinc-700 bg-black/30'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${range.color}`} />
              <p className={`text-sm font-medium ${selected === range.id ? 'text-yellow-400' : 'text-white'}`}>{range.name}</p>
              <p className="text-zinc-600 text-xs mt-1">₹{range.min.toLocaleString()}+</p>
            </motion.button>
          )
        })}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Smart Suggestions</span>
          </div>
          <div className="space-y-2">
            {smartSuggestions[selected]?.map((place, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{place.name}</p>
                  <p className="text-zinc-600 text-xs">{place.state}</p>
                </div>
                <span className="text-green-400 text-sm">{place.estimate}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
