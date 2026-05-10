import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, PieChart, TrendingUp, DollarSign, Wallet, CreditCard, Calendar } from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { formatDate, calculateDays, formatCurrency } from '../lib/helpers'

const COLORS = ['#facc15', '#fde047', '#fef08a', '#fbbf24', '#f59e0b']

export default function Budget() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [id])

  const fetchData = async () => {
    const { data: tripData } = await supabase.from('trips').select('*').eq('id', id).single()
    const { data: stopsData } = await supabase.from('trip_stops').select('*').eq('trip_id', id)
    if (stopsData?.length) {
      const stopIds = stopsData.map(s => s.id)
      const { data: activitiesData } = await supabase.from('activities').select('*').in('stop_id', stopIds)
      setActivities(activitiesData || [])
    }
    setTrip(tripData)
    setStops(stopsData || [])
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen map-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" /></div>

  const totalActivityCost = activities.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0)
  const days = calculateDays(trip?.start_date, trip?.end_date)
  const estimatedFood = days * 50
  const estimatedStay = days * 100
  const totalBudget = totalActivityCost + estimatedFood + estimatedStay
  const dailyAverage = days > 0 ? Math.round(totalBudget / days) : 0

  const categoryData = activities.reduce((acc, a) => { const cat = a.category || 'Other'; acc[cat] = (acc[cat] || 0) + (parseFloat(a.cost) || 0); return acc }, {})
  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value: Math.round(value) })).filter(d => d.value > 0)
  const dailyData = stops.map(s => ({ name: s.city_name, cost: activities.filter(a => a.stop_id === s.id).reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0) }))
  const budgetBreakdown = [
    { name: 'Activities', value: totalActivityCost, color: '#facc15', icon: '🎯' },
    { name: 'Food', value: estimatedFood, color: '#f59e0b', icon: '🍽️' },
    { name: 'Accommodation', value: estimatedStay, color: '#fbbf24', icon: '🏨' }
  ]

  return (
    <div className="min-h-screen map-bg">
      <header className="border-b-2 border-slate-700/50 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(`/trip/${id}`)} className="flex items-center gap-3 text-slate-400 hover:text-yellow-400 transition-colors">
            <ArrowLeft size={20} /> <span>Back to Trip</span>
          </button>
          <div className="flex items-center gap-3">
            <PieChart className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold text-white">Budget</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">{trip?.trip_name}</h1>
          <p className="text-slate-500 mb-10">Trip Budget Breakdown</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <motion.div className="bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 border-2 border-yellow-500/30 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Wallet className="w-8 h-8 text-yellow-400 mb-3" />
              <p className="text-slate-400 text-sm mb-1">Total Budget</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalBudget)}</p>
              <p className="text-yellow-400 text-sm mt-2">{formatCurrency(dailyAverage)}/day</p>
            </motion.div>
            <motion.div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <CreditCard className="w-8 h-8 text-yellow-400 mb-3" />
              <p className="text-slate-400 text-sm mb-1">Activities</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalActivityCost)}</p>
              <p className="text-slate-500 text-sm mt-2">{activities.length} activities</p>
            </motion.div>
            <motion.div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <TrendingUp className="w-8 h-8 text-yellow-400 mb-3" />
              <p className="text-slate-400 text-sm mb-1">Est. Food ({days} days)</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(estimatedFood)}</p>
            </motion.div>
            <motion.div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Calendar className="w-8 h-8 text-yellow-400 mb-3" />
              <p className="text-slate-400 text-sm mb-1">Est. Accommodation</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(estimatedStay)}</p>
            </motion.div>
          </div>

          {/* Charts */}
          {pieData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <motion.div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-xl font-bold text-white mb-6">Spending by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#171717', border: '2px solid #404040', borderRadius: '12px', color: '#fff' }} formatter={(value) => formatCurrency(value)} />
                    <Legend wrapperStyle={{ color: '#a3a3a3' }} />
                  </RechartsPie>
                </ResponsiveContainer>
              </motion.div>
              <motion.div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h3 className="text-xl font-bold text-white mb-6">Cost by City</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis stroke="#a3a3a8" />
                    <YAxis stroke="#a3a3a8" />
                    <Tooltip contentStyle={{ backgroundColor: '#171717', border: '2px solid #404040', borderRadius: '12px', color: '#fff' }} formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="cost" fill="#facc15" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          )}

          {/* Breakdown */}
          <motion.div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <h3 className="text-xl font-bold text-white mb-6">Budget Breakdown</h3>
            <div className="space-y-4">
              {budgetBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${item.color}20` }}>{item.icon}</div>
                    <div><p className="text-white font-medium">{item.name}</p></div>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}