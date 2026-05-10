import { motion } from 'framer-motion'
import { Map, Compass, Car, Mountain, Tent, Plane } from 'lucide-react'

const templates = [
  {
    id: 1,
    name: 'Weekend Getaway',
    icon: Car,
    duration: '2-3 days',
    places: ['Mumbai → Lonavala', 'Delhi → Agra', 'Bangalore → Mysore'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 2,
    name: 'Mountain Adventure',
    icon: Mountain,
    duration: '5-7 days',
    places: ['Manali', 'Leh Ladakh', 'Darjeeling'],
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 3,
    name: 'Heritage Trail',
    icon: Compass,
    duration: '4-6 days',
    places: ['Jaipur', 'Udaipur', 'Jodhpur'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 4,
    name: 'Beach Paradise',
    icon: Map,
    duration: '3-5 days',
    places: ['Goa North', 'Goa South', 'Pondicherry'],
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 5,
    name: 'Trekking Trip',
    icon: Tent,
    duration: '4-6 days',
    places: ['Kedarnath', 'Chopta', 'Hampta Pass'],
    color: 'from-lime-500 to-green-600'
  },
  {
    id: 6,
    name: 'Golden Triangle',
    icon: Plane,
    duration: '5-7 days',
    places: ['Delhi', 'Agra', 'Jaipur'],
    color: 'from-yellow-500 to-amber-600'
  }
]

export default function TripTemplatesGallery() {
  return (
    <motion.div
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
        <div>
          <h3 className="text-xl font-semibold text-white">Trip Templates</h3>
          <p className="text-zinc-500 text-sm">Quick start with pre-made plans</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {templates.map((template, index) => {
          const Icon = template.icon
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/30 border border-zinc-800 rounded-xl p-4 hover:border-yellow-400/50 transition-all cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-white font-medium text-sm group-hover:text-yellow-400 transition-colors">{template.name}</h4>
              <p className="text-zinc-600 text-xs mt-1">{template.duration}</p>
              <div className="mt-2 space-y-1">
                {template.places.slice(0, 2).map((place, i) => (
                  <p key={i} className="text-zinc-600 text-xs truncate">• {place}</p>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
