import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Plus, X, Layers, Crosshair, Heart, Star } from 'lucide-react'

// Popular Indian destinations with coordinates
const popularDestinations = [
  { id: 1, name: 'Goa', lat: 15.2993, lng: 74.1240, state: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40a7f2?w=100' },
  { id: 2, name: 'Vadodara', lat: 22.3072, lng: 73.1812, state: 'Gujarat', image: 'https://images.unsplash.com/photo-1590766942947-9c57a8e29d3a?w=100' },
  { id: 3, name: 'Kerala', lat: 10.8505, lng: 76.2711, state: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=100' },
  { id: 4, name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=100' },
  { id: 5, name: 'Manali', lat: 32.2432, lng: 77.1892, state: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=100' },
  { id: 6, name: 'Varanasi', lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=100' },
  { id: 7, name: 'Mysore', lat: 12.2958, lng: 76.6394, state: 'Karnataka', image: 'https://images.unsplash.com/photo-1570459027562-4a916cc131f8?w=100' },
  { id: 8, name: 'Darjeeling', lat: 27.0410, lng: 88.2643, state: 'West Bengal', image: 'https://images.unsplash.com/photo-1585136937973-3b5d280d4d0d?w=100' },
  { id: 9, name: 'Udaipur', lat: 24.5854, lng: 73.7125, state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=100' },
  { id: 10, name: 'Ooty', lat: 11.4102, lng: 76.6950, state: 'Tamil Nadu', image: 'https://images.unsplash.com/photo-1599231463535-20d4767773b6?w=100' },
  { id: 11, name: 'Agra', lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1564507592333-bf99fd18a5d5?w=100' },
  { id: 12, name: 'Rishikesh', lat: 30.0869, lng: 78.2676, state: 'Uttarakhand', image: 'https://images.unsplash.com/photo-1600100195362-63369f3e0e2f?w=100' },
]

export default function InteractiveMap({ onLocationsSelect, selectedLocations = [] }) {
  const [markers, setMarkers] = useState(selectedLocations)
  const [userLocation, setUserLocation] = useState(null)
  const [showDestinations, setShowDestinations] = useState(true)
  const [isLocating, setIsLocating] = useState(false)
  const mapRef = useRef(null)

  // Get user's live location
  const getUserLocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setIsLocating(false)
        },
        (error) => {
          console.log('Location error:', error)
          setIsLocating(false)
        }
      )
    }
  }

  // Handle map click to add marker
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert click to approximate lat/lng (India center)
    const lat = 20 + (0.03 * (300 - y))
    const lng = 68 + (0.04 * x)

    const newMarker = {
      id: Date.now(),
      lat,
      lng,
      name: `Location ${markers.length + 1}`,
      custom: true
    }

    const updatedMarkers = [...markers, newMarker]
    setMarkers(updatedMarkers)
    if (onLocationsSelect) onLocationsSelect(updatedMarkers)
  }

  // Add destination as marker
  const addDestination = (dest) => {
    const exists = markers.find(m => m.id === dest.id)
    if (!exists) {
      const newMarkers = [...markers, { ...dest, custom: false }]
      setMarkers(newMarkers)
      if (onLocationsSelect) onLocationsSelect(newMarkers)
    }
  }

  // Remove marker
  const removeMarker = (id) => {
    const updatedMarkers = markers.filter(m => m.id !== id)
    setMarkers(updatedMarkers)
    if (onLocationsSelect) onLocationsSelect(updatedMarkers)
  }

  // Clear all markers
  const clearAll = () => {
    setMarkers([])
    if (onLocationsSelect) onLocationsSelect([])
  }

  return (
    <motion.div
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Interactive Map</h3>
            <p className="text-zinc-500 text-sm">Click to add locations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle destinations */}
          <button
            onClick={() => setShowDestinations(!showDestinations)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              showDestinations
                ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            <Layers size={16} />
            Destinations
          </button>

          {/* Get user location */}
          <button
            onClick={getUserLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-yellow-400 transition-all disabled:opacity-50"
          >
            <Crosshair size={16} className={isLocating ? 'animate-spin' : ''} />
          </button>

          {/* Clear all */}
          {markers.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[400px] overflow-hidden cursor-crosshair">
        {/* SVG Map Background - India */}
        <svg
          ref={mapRef}
          onClick={handleMapClick}
          viewBox="0 0 400 300"
          className="w-full h-full"
          style={{ filter: 'blur(0.5px)' }}
        >
          {/* Ocean/Background */}
          <rect width="400" height="300" fill="#0a0a0a" />

          {/* Grid lines */}
          <g stroke="#1a1a1a" strokeWidth="0.5" opacity="0.5">
            {[...Array(10)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 30} x2="400" y2={i * 30} />
            ))}
            {[...Array(14)].map((_, i) => (
              <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="300" />
            ))}
          </g>

          {/* Decorative waves */}
          <path
            d="M0,150 Q100,130 200,150 T400,150"
            fill="none"
            stroke="rgba(250,204,21,0.1)"
            strokeWidth="2"
          />
          <path
            d="M0,180 Q100,160 200,180 T400,180"
            fill="none"
            stroke="rgba(250,204,21,0.05)"
            strokeWidth="1"
          />

          {/* India approximate shape */}
          <path
            d="M80,80 L120,60 L180,50 L220,45 L260,50 L300,70 L320,100 L330,150 L320,200 L300,230 L260,240 L200,235 L150,220 L100,200 L70,170 L60,130 Z"
            fill="rgba(250,204,21,0.03)"
            stroke="rgba(250,204,21,0.2)"
            strokeWidth="1"
            className="hover:fill-yellow-400/10 transition-colors"
          />

          {/* Popular destination markers */}
          {showDestinations && popularDestinations.map((dest) => {
            // Approximate SVG coordinates
            const x = 80 + (dest.lng - 68) * 25
            const y = 50 + (20 - dest.lat) * 15
            const isSelected = markers.some(m => m.id === dest.id)

            return (
              <g
                key={dest.id}
                onClick={(e) => { e.stopPropagation(); addDestination(dest); }}
                className="cursor-pointer"
              >
                {/* Glow effect for selected */}
                {isSelected && (
                  <circle cx={x} cy={y} r="12" fill="rgba(250,204,21,0.3)" className="animate-pulse" />
                )}

                {/* Pin marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '6' : '4'}
                  fill={isSelected ? '#facc15' : '#52525b'}
                  stroke={isSelected ? '#facc15' : '#3f3f46'}
                  strokeWidth="2"
                  className="hover:fill-yellow-400 transition-colors"
                />

                {/* Tooltip on hover */}
                <title>{dest.name}, {dest.state}</title>
              </g>
            )
          })}

          {/* User location marker */}
          {userLocation && (
            <g>
              <circle
                cx={80 + (userLocation.lng - 68) * 25}
                cy={50 + (20 - userLocation.lat) * 15}
                r="8"
                fill="rgba(34,197,94,0.3)"
                className="animate-ping"
              />
              <circle
                cx={80 + (userLocation.lng - 68) * 25}
                cy={50 + (20 - userLocation.lat) * 15}
                r="5"
                fill="#22c55e"
                stroke="#4ade80"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Custom markers */}
          {markers.filter(m => m.custom).map((marker) => {
            const x = 80 + (marker.lng - 68) * 25
            const y = 50 + (20 - marker.lat) * 15

            return (
              <g
                key={marker.id}
                onClick={(e) => { e.stopPropagation(); }}
                className="cursor-pointer"
              >
                <circle cx={x} cy={y} r="8" fill="rgba(250,204,21,0.4)" />
                <circle cx={x} cy={y} r="5" fill="#facc15" stroke="#000" strokeWidth="1" />
              </g>
            )
          })}
        </svg>

        {/* Overlay blur gradient */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/60" />

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-zinc-500 border border-zinc-600"></div>
            <span className="text-zinc-500">Destinations</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></div>
            <span className="text-zinc-500">Selected</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-zinc-500">Your Location</span>
            </div>
          )}
        </div>

        {/* Add marker hint */}
        <div className="absolute top-4 right-4 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-lg">
          <p className="text-zinc-400 text-xs flex items-center gap-2">
            <Plus size={12} />
            Click anywhere to add pin
          </p>
        </div>
      </div>

      {/* Selected Locations List */}
      {markers.length > 0 && (
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium text-sm">
              Selected Locations ({markers.length})
            </h4>
            <button
              onClick={clearAll}
              className="text-zinc-500 hover:text-white text-xs"
            >
              Clear All
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {markers.map((marker) => (
              <motion.div
                key={marker.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 bg-black/50 border border-zinc-700 rounded-lg"
              >
                <MapPin size={14} className="text-yellow-400" />
                <span className="text-white text-sm">{marker.name}</span>
                {marker.custom && (
                  <button
                    onClick={() => removeMarker(marker.id)}
                    className="text-zinc-500 hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Quick Select */}
      <div className="p-4 border-t border-zinc-800">
        <h4 className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Quick Add</h4>
        <div className="flex flex-wrap gap-2">
          {popularDestinations.slice(0, 8).map((dest) => {
            const isSelected = markers.some(m => m.id === dest.id)
            return (
              <button
                key={dest.id}
                onClick={() => addDestination(dest)}
                disabled={isSelected}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                  isSelected
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {isSelected ? <Star size={12} className="fill-yellow-400" /> : <Plus size={12} />}
                {dest.name}
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}