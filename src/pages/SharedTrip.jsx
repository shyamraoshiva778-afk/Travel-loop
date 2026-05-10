import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { MapPin, Calendar, DollarSign, Share2, Plane, ArrowRight, Copy, Check, Mail, Heart, Star } from 'lucide-react'
import { formatDate, calculateDays, formatCurrency } from '../lib/helpers'
import Logo from '../components/ui/Logo'
import FloatingLines from '../components/effects/FloatingLines'

const categoryIcons = { Food: '🍽️', Adventure: '🎯', Sightseeing: '📸', Relaxation: '🧘', Shopping: '🛍️' }

export default function SharedTrip() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const [copied, setCopied] = useState(false)
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [subscribeMsg, setSubscribeMsg] = useState('')
  const [tripLiked, setTripLiked] = useState(false)

  useEffect(() => { fetchData() }, [id])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (subscribeEmail) {
      setSubscribeMsg('Thanks for your interest! Sign up to create your own trip.')
      setSubscribeEmail('')
    }
  }

  const handleLike = () => {
    setTripLiked(!tripLiked)
  }

  const fetchData = async () => {
    const { data: tripData } = await supabase.from('trips').select('*').eq('id', id).single()
    const { data: stopsData } = await supabase.from('trip_stops').select('*').eq('trip_id', id).order('position')
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
  if (!trip) return <div className="min-h-screen map-bg flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-white mb-2">Trip not found</h2><Link to="/" className="text-yellow-400">Go Home</Link></div></div>

  const totalCost = activities.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0)

  return (
    <div className="min-h-screen map-bg">
      <header className="border-b-2 border-slate-700/50 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-xl font-bold"><span className="text-white">TRAVEL</span><span className="text-yellow-400">OOP</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={copyLink} className="flex items-center gap-2 px-4 py-2 border-2 border-yellow-400/30 rounded-full hover:bg-yellow-400/10 transition-all">
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-yellow-400" />}
              <span className="text-yellow-400 text-sm font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-yellow-400/30 rounded-full">
              <Share2 size={16} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Shared Trip</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero Card */}
          <motion.div className="bg-slate-800/80 border-2 border-slate-700 rounded-3xl p-8 mb-8 relative overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-5xl font-bold text-white">{trip.trip_name}</h1>
                <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${tripLiked ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400'}`}>
                  <Heart size={20} className={tripLiked ? 'fill-red-400' : ''} />
                  <span>{tripLiked ? 'Liked!' : 'Like'}</span>
                </button>
              </div>
              <p className="text-xl text-slate-300 mb-8">{trip.description || 'An amazing adventure awaits!'}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                  <Calendar className="text-yellow-400" size={20} />
                  <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                  <MapPin className="text-yellow-400" size={20} />
                  <span>{stops.length} cities</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                  <DollarSign className="text-yellow-400" size={20} />
                  <span>{formatCurrency(totalCost)} estimated</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Itinerary */}
          {stops.length > 0 && (
            <motion.div className="space-y-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold text-white mb-6">Itinerary</h2>
              {stops.map((stop, index) => {
                const stopActivities = activities.filter(a => a.stop_id === stop.id)
                return (
                  <motion.div key={stop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">{index + 1}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2"><MapPin size={20} className="text-yellow-400" />{stop.city_name}, {stop.country}</h3>
                        <p className="text-slate-400">{formatDate(stop.start_date)} - {formatDate(stop.end_date)}</p>
                      </div>
                    </div>
                    {stopActivities.length > 0 && (
                      <div className="ml-16 space-y-2">
                        {stopActivities.map(a => (
                          <div key={a.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{categoryIcons[a.category] || '📌'}</span>
                              <span className="text-white">{a.activity_name}</span>
                              <span className="text-slate-500 text-sm">({a.category})</span>
                            </div>
                            <span className="text-yellow-400 font-bold">{formatCurrency(a.cost)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* Subscribe Form */}
          <motion.div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-8 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="text-yellow-400" /> Get Notified About This Trip
            </h3>
            {subscribeMsg ? (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400">{subscribeMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-yellow-400"
                  />
                </div>
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 flex items-center gap-2">
                  <Mail size={18} /> Notify Me
                </button>
              </form>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Link to="/" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-2xl hover:shadow-xl hover:shadow-yellow-400/30 transition-all">
              <Plane size={20} /> Create Your Own Trip <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}