import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, MapPin, Calendar, Search, Star, Plus, X, ChevronRight, Sparkles, Navigation, Upload, Image, Trash2, Wand2 } from 'lucide-react'
import { indianStates, recommendedPlaces, popularDestinations } from '../lib/places'
import FloatingLines from '../components/effects/FloatingLines'
import OpenStreetMapSelector from '../components/dashboard/OpenStreetMapSelector'

// Cover photo presets for quick selection
const coverPresets = [
  { id: 'goa', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?fm=png&q=100&w=3840', name: 'Goa' },
  { id: 'vadodara', url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?fm=png&q=100&w=3840', name: 'Vadodara' },
  { id: 'mysore', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?fm=png&q=100&w=3840', name: 'Mysore' },
  { id: 'ooty', url: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?fm=png&q=100&w=3840', name: 'Ooty' },
  { id: 'agra', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?fm=png&q=100&w=3840', name: 'Agra' },
  { id: 'rishikesh', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?fm=png&q=100&w=3840', name: 'Rishikesh' },
  { id: 'ahmedabad', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?fm=png&q=100&w=3840', name: 'Ahmedabad' },
  { id: 'srinagar', url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?fm=png&q=100&w=3840', name: 'Srinagar' },
]

export default function CreateTrip() {
  const [tripName, setTripName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(true)
  const [selectedPlaces, setSelectedPlaces] = useState([])
  const [selectedMapLocations, setSelectedMapLocations] = useState([])
  const [coverPhoto, setCoverPhoto] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) navigate('/login')
    }
    getUser()
  }, [navigate])

  // Filter recommendations based on state selected
  const filteredPlaces = useMemo(() => {
    if (!selectedState) return recommendedPlaces
    return recommendedPlaces.filter(place =>
      place.state.toLowerCase().includes(selectedState.toLowerCase()) ||
      place.name.toLowerCase().includes(city.toLowerCase())
    )
  }, [selectedState, city])

  const handleTogglePlace = (place) => {
    setSelectedPlaces(prev => {
      const exists = prev.find(p => p.id === place.id)
      if (exists) {
        return prev.filter(p => p.id !== place.id)
      }
      return [...prev, place]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Please login first')
        setLoading(false)
        return
      }

      // Create the trip
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          trip_name: tripName,
          description: description,
          start_date: startDate,
          end_date: endDate
        })
        .select()
        .single()

      if (tripError) {
        console.error('Trip creation error:', tripError)
        alert('Error creating trip: ' + tripError.message)
        setLoading(false)
        return
      }

      console.log('Trip created:', tripData)

      // If places are selected, add them as stops
      if (selectedPlaces.length > 0) {
        const stopsToAdd = selectedPlaces.map((place, index) => ({
          trip_id: tripData.id,
          city_name: place.name,
          country: 'India',
          state: place.state || 'Unknown',
          position: index
        }))

        const { error: stopsError } = await supabase.from('trip_stops').insert(stopsToAdd)
        if (stopsError) {
          console.error('Error adding places:', stopsError)
          alert('Trip created but failed to add places: ' + stopsError.message)
        } else {
          console.log('Places added successfully')
        }
      }

      // Add map-selected locations as stops
      if (selectedMapLocations.length > 0) {
        const mapStopsToAdd = selectedMapLocations.map((loc, index) => ({
          trip_id: tripData.id,
          city_name: loc.name || loc.city_name || `Location ${index + 1}`,
          country: 'India',
          state: loc.state || 'Custom',
          position: selectedPlaces.length + index
        }))

        const { error: mapError } = await supabase.from('trip_stops').insert(mapStopsToAdd)
        if (mapError) {
          console.error('Error adding map locations:', mapError)
        } else {
          console.log('Map locations added successfully')
        }
      } else if (city && selectedState) {
        // Add single custom city if no recommendation selected
        const { error: cityError } = await supabase.from('trip_stops').insert({
          trip_id: tripData.id,
          city_name: city,
          country: 'India',
          state: selectedState,
          position: 0
        })
        if (cityError) {
          console.error('Error adding city:', cityError)
        }
      }

      navigate(`/trip/${tripData.id}`)
    } catch (err) {
      console.error('Submit error:', err)
      alert('Something went wrong: ' + err.message)
      setLoading(false)
    }
  }

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPhoto(file)
        setCoverPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Apply random cover
  const applyRandomCover = () => {
    const random = coverPresets[Math.floor(Math.random() * coverPresets.length)]
    setCoverPhoto(random.url)
    setCoverPreview(random.url)
  }

  // Clear cover
  const clearCover = () => {
    setCoverPhoto('')
    setCoverPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Calculate trip duration
  const tripDays = startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1 : 0

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <FloatingLines
          enabledWaves={['top', 'bottom']}
          lineCount={[6, 8]}
          lineDistance={[12, 8]}
          parallax={true}
          animationSpeed={0.5}
          linesGradient={['#0a0a0a', '#1a1a1a', '#facc15', '#fde047', '#facc15']}
        />
      </div>
      <div className="absolute inset-0 bg-black/70 z-[1]" />

      {/* Header */}
      <header className="relative z-50 border-b border-zinc-800/50 bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 text-zinc-400 hover:text-yellow-400 transition-colors">
            <ArrowLeft size={20} />
            <span className="tracking-wide">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">TRAVEL</span>
              <span className="text-yellow-400">OOP</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          {/* Title */}
          <div className="text-center mb-12">
            <motion.div className="inline-flex items-center gap-3 px-4 py-2 border border-yellow-400/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium tracking-widest uppercase">Plan Your Journey</span>
            </motion.div>
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Create New Trip</h1>
            <p className="text-zinc-500 text-lg">Discover amazing places across India</p>
          </div>

          {/* Form Card */}
          <motion.div className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Trip Name & Cover Photo Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trip Name */}
                <div className="lg:col-span-2 space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 tracking-wide uppercase">
                    <Navigation className="w-4 h-4 text-yellow-400" />
                    Trip Name
                  </label>
                  <input
                    type="text"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="e.g., Family Vacation 2026"
                    className="w-full px-5 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-all text-lg"
                    required
                  />
                </div>

                {/* Cover Photo */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 tracking-wide uppercase">
                    <Image className="w-4 h-4 text-yellow-400" />
                    Cover Photo <span className="text-zinc-600">(Optional)</span>
                  </label>
                  <div className="relative h-[76px] bg-black/50 border-2 border-dashed border-zinc-700 rounded-xl hover:border-yellow-400/50 transition-all cursor-pointer group overflow-hidden" onClick={() => fileInputRef.current?.click()}>
                    {coverPreview ? (
                      <>
                        <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={(e) => { e.stopPropagation(); clearCover() }} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                        <Upload className="w-6 h-6 mb-1 group-hover:text-yellow-400 transition-colors" />
                        <span className="text-xs">Click to upload</span>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </div>
                </div>
              </div>

              {/* Quick Cover Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-500 tracking-wide">
                    <Wand2 className="w-4 h-4" />
                    Or choose a preset
                  </label>
                  <button type="button" onClick={applyRandomCover} className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
                    <Wand2 size={12} /> Surprise me
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {coverPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => { setCoverPhoto(preset.url); setCoverPreview(preset.url) }}
                      className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${coverPreview === preset.url ? 'border-yellow-400' : 'border-transparent hover:border-zinc-600'}`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* State & City Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 tracking-wide uppercase">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    Select State (India)
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-5 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-zinc-900">Choose a state...</option>
                    {indianStates.map(state => (
                      <option key={state} value={state} className="bg-zinc-900">{state}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 tracking-wide uppercase">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    City / Village (Optional)
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Search city or village..."
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 tracking-wide uppercase">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Trip Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this trip about? Tell us more about your travel plans, expectations, and what you hope to experience..."
                  className="w-full px-5 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-all h-28 resize-none text-lg"
                />
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 tracking-wide uppercase">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  Travel Dates
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400 z-10" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400 z-10" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-yellow-400 transition-all"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-center px-4 py-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
                    <span className="text-yellow-400 font-bold text-lg">
                      {tripDays > 0 ? `${tripDays} day${tripDays > 1 ? 's' : ''}` : 'Select dates'}
                    </span>
                  </div>
                </div>
                {startDate && endDate && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">
                      Trip duration: {tripDays} day{tripDays > 1 ? 's' : ''}
                      {startDate && endDate && ` (${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Trip Summary Preview */}
              {tripName && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gradient-to-r from-yellow-400/10 to-yellow-500/5 border border-yellow-400/20 rounded-2xl">
                  <h3 className="text-yellow-400 font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Trip Preview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-zinc-500 text-xs uppercase tracking-wider">Trip Name</p>
                      <p className="text-white font-semibold">{tripName}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs uppercase tracking-wider">Duration</p>
                      <p className="text-white font-semibold">{tripDays > 0 ? `${tripDays} day${tripDays > 1 ? 's' : ''}` : 'TBD'}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs uppercase tracking-wider">Places</p>
                      <p className="text-white font-semibold">{(selectedPlaces.length + selectedMapLocations.length) || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs uppercase tracking-wider">Destination</p>
                      <p className="text-white font-semibold">{selectedState || city || 'India'}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Recommended Places Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
                <h2 className="text-2xl font-semibold text-white">Recommended Destinations</h2>
              </div>
              <span className="text-zinc-500 text-sm">
                {selectedPlaces.length} place{selectedPlaces.length !== 1 ? 's' : ''} selected
              </span>
            </div>

            {/* Search indicator */}
            {selectedState && (
              <motion.div className="mb-4 px-4 py-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Search className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm">Showing places for: {selectedState}</span>
                <button onClick={() => setSelectedState('')} className="ml-auto text-zinc-500 hover:text-white">
                  <X size={16} />
                </button>
              </motion.div>
            )}

            {/* Places Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPlaces.map((place, index) => {
                const isSelected = selectedPlaces.find(p => p.id === place.id)
                return (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTogglePlace(place)}
                    className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-yellow-400 shadow-lg shadow-yellow-400/20'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Image */}
                    <div className="h-32 relative">
                      <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      {/* Selected indicator */}
                      {isSelected && (
                        <motion.div
                          className="absolute top-3 right-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Plus size={14} className="text-black" />
                        </motion.div>
                      )}

                      {/* Rating */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-medium">{place.rating}</span>
                      </div>

                      {/* Category badge */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                        <span className="text-yellow-400 text-xs font-medium">{place.category}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg">{place.name}</h3>
                      <p className="text-zinc-500 text-sm flex items-center gap-1">
                        <MapPin size={12} />
                        {place.state}
                      </p>
                      <p className="text-zinc-600 text-xs mt-1 line-clamp-2">{place.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Popular Cities Quick Select */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Popular Cities</h3>
              <div className="flex flex-wrap gap-3">
                {popularDestinations.map((dest) => (
                  <button
                    key={dest.city}
                    onClick={() => {
                      setCity(dest.city)
                      setSelectedState(dest.state)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-xl hover:border-yellow-400/50 transition-all group"
                  >
                    <img src={dest.image} alt={dest.city} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="text-left">
                      <p className="text-white text-sm font-medium group-hover:text-yellow-400 transition-colors">{dest.city}</p>
                      <p className="text-zinc-600 text-xs">{dest.state}</p>
                    </div>
                    <ChevronRight size={14} className="text-zinc-600 group-hover:text-yellow-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Interactive Map Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
              <h2 className="text-2xl font-semibold text-white">Select on Map</h2>
            </div>
            <OpenStreetMapSelector
              onLocationsSelect={setSelectedMapLocations}
              selectedLocations={selectedMapLocations}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div className="mt-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <motion.button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !tripName || !startDate || !endDate}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold rounded-2xl shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 transition-all flex items-center justify-center gap-3 text-xl disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={24} />
                  Create Trip {(selectedPlaces.length + selectedMapLocations.length) > 0 && `with ${selectedPlaces.length + selectedMapLocations.length} Places`}
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}