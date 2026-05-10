import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  Plus, LogOut, Compass, Globe, MapPin, Calendar, Route, ChevronRight,
  Home, Plane, BarChart3, CheckSquare, FileText, User, Search, Bell,
  Menu, X, Clock, Star
} from 'lucide-react'
import { formatDate, calculateDays } from '../lib/helpers'

// New Dashboard Components
import WeatherWidget from '../components/dashboard/WeatherWidget'
import TimeZoneDisplay from '../components/dashboard/TimeZoneDisplay'
import CountdownTimer from '../components/dashboard/CountdownTimer'
import TripTemplatesGallery from '../components/dashboard/TripTemplatesGallery'
import SearchFilterBar from '../components/dashboard/SearchFilterBar'
import BudgetRangeSelector from '../components/dashboard/BudgetRangeSelector'
import ProgressTracker from '../components/dashboard/ProgressTracker'
import WeatherForDestinations from '../components/dashboard/WeatherForDestinations'
import OpenStreetMapSelector from '../components/dashboard/OpenStreetMapSelector'

const stagger = { animate: { transition: { staggerChildren: 0.1 } } }
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

// Navigation items
const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Plane, label: 'My Trips', path: '/dashboard' },
  { icon: BarChart3, label: 'Statistics', path: '/dashboard' },
  { icon: User, label: 'Profile', path: '/profile' },
]

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const location = useLocation()

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) fetchTrips(user.id)
    }
    getUser()
  }, [])

  const fetchTrips = async (userId) => {
    const { data } = await supabase.from('trips').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    setTrips(data || [])
    setFilteredTrips(data || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500 tracking-wider">Loading...</span>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.postimg.cc/s2gfQSTP/hyderabad-midnight-blue-20260510-143435.png"
          alt="Hyderabad Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Transparent Dark Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Optional: Subtle Floating Lines for effect */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.03)_0%,transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-zinc-800/50 bg-black/95 backdrop-blur-2xl sticky top-0">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/50">
            {/* Left - Logo & Search */}
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-3 group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #facc15 0%, #fde047 100%)',
                    boxShadow: '0 0 25px rgba(250, 204, 21, 0.4)'
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#0a0a0a" />
                    <circle cx="12" cy="9" r="2.5" fill="#facc15" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-white">TRAVEL</span>
                  <span className="text-yellow-400">OOP</span>
                </span>
              </Link>

              {/* Search Bar */}
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search trips, destinations..."
                  className="w-64 pl-10 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-yellow-400/50 transition-all"
                />
              </div>
            </div>

            {/* Center - Greeting */}
            <div className="hidden lg:flex items-center gap-3 px-4">
              <div className="text-right">
                <p className="text-white text-sm font-semibold">
                  {currentTime.getHours() < 12 ? 'Good Morning' : currentTime.getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler'}!
                </p>
                <p className="text-zinc-500 text-xs flex items-center gap-2">
                  <Clock size={10} />
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-yellow-400 font-bold">{trips.length}</p>
                  <p className="text-zinc-600 text-xs">Trips</p>
                </div>
                <div className="w-px h-6 bg-zinc-800" />
                <div className="text-center">
                  <p className="text-white font-bold">{trips.reduce((sum, t) => sum + calculateDays(t.start_date, t.end_date), 0)}</p>
                  <p className="text-zinc-600 text-xs">Days</p>
                </div>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Stats Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-xs font-medium">{trips.length} Adventures</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 border border-zinc-800 text-zinc-400 rounded-xl hover:text-yellow-400 hover:border-yellow-400/30 transition-all">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              </button>

              {/* Profile */}
              <Link
                to="/profile"
                className="p-2.5 border border-zinc-800 text-zinc-400 rounded-xl hover:text-yellow-400 hover:border-yellow-400/30 transition-all"
              >
                <User size={18} />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2.5 border border-zinc-800 text-zinc-400 rounded-xl"
              >
                {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="hidden md:flex items-center justify-between px-6 py-3">
            {/* Nav Links */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-yellow-400/10 text-yellow-400'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/create-trip"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 transition-all text-sm"
              >
                <Plus size={16} />
                New Trip
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 border border-zinc-700 text-zinc-400 rounded-xl hover:text-red-400 hover:border-red-400/30 transition-all"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-zinc-800/50 bg-black/95"
            >
              <div className="px-6 py-4 space-y-2">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search trips..."
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500"
                  />
                </div>

                {/* Mobile Nav Links */}
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  )
                })}

                {/* Mobile Stats */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800/50">
                  <div className="p-3 bg-zinc-900/50 rounded-xl text-center">
                    <p className="text-yellow-400 font-bold text-lg">{trips.length}</p>
                    <p className="text-zinc-500 text-xs">Total Trips</p>
                  </div>
                  <div className="p-3 bg-zinc-900/50 rounded-xl text-center">
                    <p className="text-white font-bold text-lg">{trips.reduce((sum, t) => sum + calculateDays(t.start_date, t.end_date), 0)}</p>
                    <p className="text-zinc-500 text-xs">Days Traveled</p>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="flex gap-3 pt-4">
                  <Link
                    to="/create-trip"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl"
                  >
                    <Plus size={18} />
                    New Trip
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-3 border border-zinc-700 text-zinc-400 rounded-xl hover:text-red-400"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div className="text-center mb-12" variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 border border-yellow-400/20 rounded-full mb-6">
            <Route className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-medium tracking-widest uppercase">Your Journeys</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-white">Plan Your </span>
            <span className="text-yellow-400">Next Adventure</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg text-zinc-500 max-w-xl mx-auto">
            Track your trips, plan itineraries, and map your travels with precision
          </motion.p>
        </motion.div>

        {/* Top Widgets Row - Weather, Timezone, Countdown */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8" variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeInUp}>
            <WeatherWidget />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <TimeZoneDisplay />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <CountdownTimer trips={trips} />
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8" variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeInUp} className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/30 transition-all">
            <div className="w-12 h-12 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-4">
              <Compass className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-4xl font-bold text-white">{trips.length}</p>
            <p className="text-zinc-500 text-sm mt-1 tracking-wide">Trips Planned</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/30 transition-all">
            <div className="w-12 h-12 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-4xl font-bold text-white">
              {trips.reduce((sum, t) => sum + calculateDays(t.start_date, t.end_date), 0)}
            </p>
            <p className="text-zinc-500 text-sm mt-1 tracking-wide">Days Explored</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/30 transition-all">
            <div className="w-12 h-12 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-4xl font-bold text-white">{trips.length * 3}</p>
            <p className="text-zinc-500 text-sm mt-1 tracking-wide">Destinations</p>
          </motion.div>
        </motion.div>

        {/* Trip Templates Toggle */}
        <motion.div className="mb-8" variants={stagger} initial="initial" animate="animate">
          <motion.button
            variants={fadeInUp}
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full py-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white hover:border-yellow-400/50 transition-all flex items-center justify-center gap-2"
          >
            <span className="font-medium">{showTemplates ? 'Hide' : 'Show'} Trip Templates</span>
            <ChevronRight className={`w-5 h-5 transition-transform ${showTemplates ? 'rotate-90' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <TripTemplatesGallery />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Budget & Progress Row */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8" variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeInUp}>
            <BudgetRangeSelector />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <ProgressTracker trip={trips[0]} />
          </motion.div>
        </motion.div>

        {/* Weather for Destinations */}
        <motion.div className="mb-8" variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeInUp}>
            <WeatherForDestinations />
          </motion.div>
        </motion.div>

        {/* Interactive Map */}
        <motion.div className="mb-8" variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeInUp}>
            <OpenStreetMapSelector />
          </motion.div>
        </motion.div>

        {/* Search & Filter */}
        <SearchFilterBar trips={trips} onFilteredTrips={setFilteredTrips} />

        {/* Trips Section */}
        <motion.section variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
            <h2 className="text-2xl font-semibold text-white tracking-tight">Your Trips</h2>
            <span className="text-zinc-500 text-sm ml-auto">{filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''}</span>
          </motion.div>

          {filteredTrips.length === 0 ? (
            <motion.div variants={fadeInUp} className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-16 text-center">
              <div className="w-20 h-20 border-2 border-dashed border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No trips yet</h3>
              <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                Start mapping your first adventure. Create a trip and begin exploring the world.
              </p>
              <Link
                to="/create-trip"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-xl hover:shadow-yellow-400/30 transition-all"
              >
                <Plus size={18} />
                Create Your First Trip
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {filteredTrips.map((trip, index) => (
                  <motion.div key={trip.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.1 }}>
                    <Link to={`/trip/${trip.id}`} className="block group bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400/50 transition-all h-full">
                      {/* Trip Header */}
                      <div className="h-32 bg-gradient-to-br from-zinc-800 to-zinc-900 relative overflow-hidden">
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(250,204,21,0.1) 30px, rgba(250,204,21,0.1) 32px)`
                          }}
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <div className="w-8 h-8 border border-zinc-700 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-zinc-500" />
                          </div>
                          <div className="w-8 h-8 border border-zinc-700 rounded-full flex items-center justify-center">
                            <Route className="w-4 h-4 text-zinc-500" />
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                            {trip.trip_name}
                          </h3>
                          <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-yellow-400 transition-colors flex-shrink-0" />
                        </div>

                        <p className="text-zinc-500 text-sm mb-4 line-clamp-2">
                          {trip.description || 'No description'}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-zinc-600">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-yellow-400/50" />
                            {formatDate(trip.start_date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-yellow-400/50" />
                            {calculateDays(trip.start_date, trip.end_date)} days
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  )
}