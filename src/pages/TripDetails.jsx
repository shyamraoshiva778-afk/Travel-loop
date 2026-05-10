import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  ArrowLeft, Plus, MapPin, Trash2, DollarSign, Package, FileText, Share2,
  ChevronDown, ChevronUp, Calendar
} from 'lucide-react'
import { formatDate, calculateDays, formatCurrency } from '../lib/helpers'
import OpenStreetMapSelector from '../components/dashboard/OpenStreetMapSelector'

const categoryIcons = { Food: '🍽️', Adventure: '🎯', Sightseeing: '📸', Relaxation: '🧘', Shopping: '🛍️' }

export default function TripDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddStop, setShowAddStop] = useState(false)
  const [newStop, setNewStop] = useState({ city_name: '', country: '', start_date: '', end_date: '' })
  const [expandedStops, setExpandedStops] = useState({})
  const [showMap, setShowMap] = useState(false)
  const [selectedMapLocations, setSelectedMapLocations] = useState([])
  const [editingStop, setEditingStop] = useState(null)

  useEffect(() => {
    if (id) {
      fetchTripData()
    }
  }, [id])

  const fetchTripData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch trip data
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single()

      if (tripError) {
        console.error('Error fetching trip:', tripError)
        setError('Failed to load trip data')
        setLoading(false)
        return
      }

      // Fetch stops
      const { data: stopsData, error: stopsError } = await supabase
        .from('trip_stops')
        .select('*')
        .eq('trip_id', id)
        .order('position', { ascending: true })

      if (stopsError) {
        console.error('Error fetching stops:', stopsError)
      }

      // Fetch activities if there are stops
      let activitiesData = []
      if (stopsData && stopsData.length > 0) {
        const stopIds = stopsData.map(s => s.id)
        const { data: acts } = await supabase
          .from('activities')
          .select('*')
          .in('stop_id', stopIds)
        activitiesData = acts || []
      }

      setTrip(tripData)
      setStops(stopsData || [])
      setActivities(activitiesData)
      setLoading(false)
    } catch (err) {
      console.error('Error in fetchTripData:', err)
      setError('Something went wrong')
      setLoading(false)
    }
  }

  const handleAddStop = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('trip_stops').insert({
        trip_id: id,
        city_name: newStop.city_name,
        country: newStop.country || 'India',
        start_date: newStop.start_date,
        end_date: newStop.end_date,
        position: stops.length
      })

      if (!error) {
        setNewStop({ city_name: '', country: '', start_date: '', end_date: '' })
        setShowAddStop(false)
        fetchTripData()
      } else {
        alert('Error adding stop: ' + error.message)
      }
    } catch (err) {
      console.error('Error adding stop:', err)
      alert('Failed to add stop')
    }
  }

  const handleDeleteStop = async (stopId) => {
    if (confirm('Delete this stop and all activities?')) {
      await supabase.from('trip_stops').delete().eq('id', stopId)
      fetchTripData()
    }
  }

  const handleEditStop = async (e) => {
    e.preventDefault()
    await supabase.from('trip_stops').update({
      city_name: editingStop.city_name,
      country: editingStop.country,
      start_date: editingStop.start_date,
      end_date: editingStop.end_date
    }).eq('id', editingStop.id)
    setEditingStop(null)
    fetchTripData()
  }

  const handleAddMapLocations = async () => {
    if (selectedMapLocations.length > 0) {
      const stopsToAdd = selectedMapLocations.map((loc, index) => ({
        trip_id: id,
        city_name: loc.name || loc.city_name || 'Custom Location',
        country: loc.state || 'India',
        position: stops.length + index
      }))
      await supabase.from('trip_stops').insert(stopsToAdd)
      setSelectedMapLocations([])
      setShowMap(false)
      fetchTripData()
    }
  }

  const handleDeleteTrip = async () => {
    if (confirm('Delete this trip? This cannot be undone.')) {
      await supabase.from('trips').delete().eq('id', id)
      navigate('/dashboard')
    }
  }

  const getTotalCost = () => activities.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0)

  const shareTrip = () => {
    navigator.clipboard.writeText(`${window.location.origin}/shared/${id}`)
    alert('Link copied to clipboard!')
  }

  const toggleStopExpand = (stopId) => setExpandedStops(prev => ({ ...prev, [stopId]: !prev[stopId] }))

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500 tracking-wider">Loading trip...</span>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error || !trip) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 border-2 border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-zinc-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{error || 'Trip not found'}</h2>
          <p className="text-zinc-500 mb-6">The trip you're looking for doesn't exist or you don't have access.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 text-zinc-400 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="tracking-wide">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={shareTrip}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-700 text-zinc-400 rounded-xl hover:text-yellow-400 hover:border-yellow-400 transition-all"
            >
              <Share2 size={18} />
              Share
            </button>
            <button
              onClick={handleDeleteTrip}
              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl hover:bg-red-600/30 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Trip Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-5xl font-bold text-white mb-4">{trip.trip_name}</h1>
          <p className="text-xl text-zinc-500 mb-6">{trip.description || 'No description'}</p>
          <div className="flex items-center gap-6 text-zinc-500">
            <span className="flex items-center gap-2">
              <MapPin size={18} className="text-yellow-400/50" />
              {stops.length} cities
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={18} className="text-yellow-400/50" />
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </span>
            <span className="flex items-center gap-2">
              <DollarSign size={18} className="text-yellow-400/50" />
              {formatCurrency(getTotalCost())}
            </span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            to={`/budget/${id}`}
            className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all"
          >
            <div className="w-12 h-12 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-white font-bold text-xl mb-1">Budget</h3>
            <p className="text-zinc-500 text-sm">{formatCurrency(getTotalCost())}</p>
          </Link>

          <Link
            to={`/packing/${id}`}
            className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all"
          >
            <div className="w-12 h-12 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-white font-bold text-xl mb-1">Packing</h3>
            <p className="text-zinc-500 text-sm">Checklist</p>
          </Link>

          <Link
            to={`/notes/${id}`}
            className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all"
          >
            <div className="w-12 h-12 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-white font-bold text-xl mb-1">Notes</h3>
            <p className="text-zinc-500 text-sm">Travel journal</p>
          </Link>

          <button
            onClick={() => setShowMap(!showMap)}
            className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all text-left"
          >
            <div className="w-12 h-12 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-white font-bold text-xl mb-1">{showMap ? 'Hide' : 'View'} Map</h3>
            <p className="text-zinc-500 text-sm">{stops.length} locations</p>
          </button>
        </motion.div>

        {/* Interactive Map */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
                <h2 className="text-2xl font-bold text-white">Trip Map</h2>
              </div>
              <OpenStreetMapSelector
                onLocationsSelect={setSelectedMapLocations}
                selectedLocations={selectedMapLocations}
              />
              {selectedMapLocations.length > 0 && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleAddMapLocations}
                    className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-medium rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-400/30"
                  >
                    <Plus size={18} />
                    Add {selectedMapLocations.length} Location{selectedMapLocations.length > 1 ? 's' : ''}
                  </button>
                  <button
                    onClick={() => setSelectedMapLocations([])}
                    className="px-5 py-2.5 border border-zinc-700 text-zinc-400 rounded-xl hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Itinerary Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-10 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
              <h2 className="text-2xl font-bold text-white">Itinerary</h2>
            </div>
            <button
              onClick={() => setShowAddStop(!showAddStop)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-medium rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
            >
              <Plus size={18} />
              Add City
            </button>
          </div>

          {/* Add Stop Form */}
          <AnimatePresence>
            {showAddStop && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 mb-6"
              >
                <form onSubmit={handleAddStop} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City name"
                    value={newStop.city_name}
                    onChange={(e) => setNewStop({ ...newStop, city_name: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country (default: India)"
                    value={newStop.country}
                    onChange={(e) => setNewStop({ ...newStop, country: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                  />
                  <input
                    type="date"
                    value={newStop.start_date}
                    onChange={(e) => setNewStop({ ...newStop, start_date: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-zinc-700 rounded-xl text-white focus:border-yellow-400 focus:outline-none"
                    required
                  />
                  <input
                    type="date"
                    value={newStop.end_date}
                    onChange={(e) => setNewStop({ ...newStop, end_date: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-zinc-700 rounded-xl text-white focus:border-yellow-400 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="md:col-span-2 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl"
                  >
                    Add Stop
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stops List */}
          {stops.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl">
              <MapPin className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg mb-4">No cities added yet</p>
              <button
                onClick={() => setShowAddStop(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
              >
                <Plus size={18} />
                Add Your First City
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {stops.map((stop, index) => {
                const stopActivities = activities.filter(a => a.stop_id === stop.id)
                const isExpanded = expandedStops[stop.id]

                return (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400/30 transition-all"
                  >
                    <div
                      className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-800/50"
                      onClick={() => toggleStopExpand(stop.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <MapPin size={18} className="text-yellow-400" />
                            {stop.city_name}, {stop.state || stop.country}
                          </h3>
                          <p className="text-zinc-500 text-sm">
                            {formatDate(stop.start_date)} - {formatDate(stop.end_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteStop(stop.id) }}
                          className="p-2 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                        {isExpanded ? (
                          <ChevronUp size={20} className="text-zinc-400" />
                        ) : (
                          <ChevronDown size={20} className="text-zinc-400" />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-zinc-800"
                        >
                          <StopActivities
                            stopId={stop.id}
                            activities={stopActivities}
                            refresh={fetchTripData}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  )
}

// Stop Activities Component
function StopActivities({ stopId, activities, refresh }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newActivity, setNewActivity] = useState({
    activity_name: '',
    category: 'Sightseeing',
    cost: '',
    duration: ''
  })

  const handleAdd = async (e) => {
    e.preventDefault()
    await supabase.from('activities').insert({
      stop_id: stopId,
      ...newActivity
    })
    setNewActivity({
      activity_name: '',
      category: 'Sightseeing',
      cost: '',
      duration: ''
    })
    setShowAdd(false)
    refresh()
  }

  const handleDelete = async (id) => {
    await supabase.from('activities').delete().eq('id', id)
    refresh()
  }

  const categories = ['Food', 'Adventure', 'Sightseeing', 'Relaxation', 'Shopping']

  return (
    <div className="p-6">
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="text-yellow-400 font-medium mb-4 hover:underline"
      >
        + Add Activity
      </button>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-black/30 p-4 rounded-xl mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Activity name"
            value={newActivity.activity_name}
            onChange={(e) => setNewActivity({ ...newActivity, activity_name: e.target.value })}
            className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
            required
          />
          <select
            value={newActivity.category}
            onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
            className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
          >
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            type="number"
            placeholder="Cost ($)"
            value={newActivity.cost}
            onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
            className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
          />
          <input
            type="text"
            placeholder="Duration"
            value={newActivity.duration}
            onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
            className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm"
          />
          <button
            type="submit"
            className="py-2.5 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500"
          >
            Add
          </button>
        </form>
      )}

      {activities.length > 0 && (
        <div className="space-y-2">
          {activities.map(a => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{categoryIcons[a.category] || '📌'}</span>
                <div>
                  <span className="text-white font-medium">{a.activity_name}</span>
                  <span className="text-zinc-500 text-sm ml-2">({a.category})</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-semibold">{formatCurrency(a.cost)}</span>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-1 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activities.length === 0 && !showAdd && (
        <p className="text-zinc-500 text-sm">No activities added yet</p>
      )}
    </div>
  )
}