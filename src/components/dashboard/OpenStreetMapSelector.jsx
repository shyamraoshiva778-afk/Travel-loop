import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, X, Plus, Star, Building2, Layers } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom yellow marker icon
const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Green marker for selected
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const mapCenter = [20.5937, 78.9629] // India center
const defaultZoom = 5

// Major Indian cities
const majorCities = [
  { name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Goa', state: 'Goa', lat: 15.2993, lng: 74.1240 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Manali', state: 'Himachal Pradesh', lat: 32.2432, lng: 77.1892 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
]

// Popular destinations with details
const popularDestinations = [
  { id: 1, name: 'India Gate', city: 'Delhi', state: 'Delhi', lat: 28.6304, lng: 77.2397, category: 'Monument', rating: 4.5, cost: 'Free' },
  { id: 2, name: 'Taj Mahal', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1751, lng: 78.0421, category: 'Monument', rating: 4.9, cost: '₹1,100' },
  { id: 3, name: 'Marine Drive', city: 'Mumbai', state: 'Maharashtra', lat: 18.9438, lng: 72.8234, category: 'Beach', rating: 4.4, cost: 'Free' },
  { id: 4, name: 'Bangalore Palace', city: 'Bangalore', state: 'Karnataka', lat: 12.9980, lng: 77.5926, category: 'Heritage', rating: 4.3, cost: '₹230' },
  { id: 5, name: 'Meenakshi Temple', city: 'Madurai', state: 'Tamil Nadu', lat: 9.9195, lng: 78.1203, category: 'Temple', rating: 4.7, cost: 'Free' },
  { id: 6, name: 'Howrah Bridge', city: 'Kolkata', state: 'West Bengal', lat: 22.5857, lng: 88.3419, category: 'Landmark', rating: 4.5, cost: 'Free' },
  { id: 7, name: 'Charminar', city: 'Hyderabad', state: 'Telangana', lat: 17.3617, lng: 78.4747, category: 'Monument', rating: 4.4, cost: '₹100' },
  { id: 8, name: 'Gateway of India', city: 'Mumbai', state: 'Maharashtra', lat: 18.9217, lng: 72.8332, category: 'Monument', rating: 4.6, cost: 'Free' },
  { id: 9, name: 'Hawa Mahal', city: 'Jaipur', state: 'Rajasthan', lat: 26.9559, lng: 75.8469, category: 'Palace', rating: 4.4, cost: '₹200' },
  { id: 10, name: 'Calangute Beach', city: 'Goa', state: 'Goa', lat: 15.5517, lng: 73.7673, category: 'Beach', rating: 4.2, cost: 'Free' },
  { id: 11, name: 'Munnar', city: 'Kerala', state: 'Kerala', lat: 10.0889, lng: 77.0595, category: 'Nature', rating: 4.7, cost: 'Free' },
  { id: 12, name: 'Rohtang Pass', city: 'Manali', state: 'Himachal Pradesh', lat: 32.3654, lng: 77.5093, category: 'Adventure', rating: 4.7, cost: '₹500' },
  { id: 13, name: 'Varanasi Ghats', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.2826, lng: 82.9964, category: 'Spiritual', rating: 4.8, cost: 'Free' },
  { id: 14, name: 'Lake Palace', city: 'Udaipur', state: 'Rajasthan', lat: 24.6854, lng: 73.6914, category: 'Palace', rating: 4.6, cost: '₹300' },
  { id: 15, name: 'Mysore Palace', city: 'Mysore', state: 'Karnataka', lat: 12.3052, lng: 76.6551, category: 'Palace', rating: 4.7, cost: '₹200' },
]

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

// Component to fly to a location
function FlyToLocation({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 })
    }
  }, [center, zoom, map])
  return null
}

export default function OpenStreetMapSelector({ onLocationSelect, selectedLocations = [] }) {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629])
  const [mapZoom, setMapZoom] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  // Filter cities based on search
  const filteredCities = majorCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6)

  const handleMapClick = (lat, lng) => {
    const newLocation = {
      id: Date.now(),
      lat,
      lng,
      name: `Location ${selectedLocations.length + 1}`,
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      custom: true
    }

    const updatedLocations = [...selectedLocations, newLocation]
    onLocationSelect?.(updatedLocations)

    // Find nearby places
    const nearby = popularDestinations.filter(p =>
      Math.abs(p.lat - lat) < 1 && Math.abs(p.lng - lng) < 1
    )
    setNearbyPlaces(nearby)
    setSelectedPlace(newLocation)
    setShowPopup(true)
  }

  const handleCitySelect = (city) => {
    setMapCenter([city.lat, city.lng])
    setMapZoom(10)
    setSearchQuery(city.name)

    // Show nearby places for this city
    const nearby = popularDestinations.filter(p => p.city === city.name || p.state === city.state)
    setNearbyPlaces(nearby)
  }

  const handleAddPlace = (place) => {
    const exists = selectedLocations.find(p => p.id === place.id)
    if (!exists) {
      const location = {
        ...place,
        custom: false
      }
      const updated = [...selectedLocations, location]
      onLocationSelect?.(updated)

      setMapCenter([place.lat, place.lng])
      setMapZoom(12)
    }
  }

  const handleRemoveLocation = (id) => {
    const updated = selectedLocations.filter(l => l.id !== id)
    onLocationSelect?.(updated)
  }

  return (
    <motion.div
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Select Location</h3>
            <p className="text-zinc-500 text-sm">Search cities or click on map</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setNearbyPlaces(popularDestinations); setMapCenter([20.5937, 78.9629]); setMapZoom(5) }}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-400 rounded-lg text-sm hover:text-yellow-400 transition-all"
          >
            <Layers size={16} />
            All Places
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-zinc-800">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city in India..."
            className="w-full pl-12 pr-4 py-3 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-all"
          />
        </div>

        {/* Search Results */}
        {searchQuery && filteredCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-50 mt-2 w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            {filteredCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCitySelect(city)}
                className="w-full px-4 py-3 text-left hover:bg-zinc-800 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">{city.name}</p>
                  <p className="text-zinc-500 text-sm">{city.state}</p>
                </div>
                <MapPin size={16} className="text-yellow-400" />
              </button>
            ))}
          </motion.div>
        )}

        {/* Quick City Select */}
        <div className="flex flex-wrap gap-2 mt-3">
          {majorCities.slice(0, 8).map((city) => (
            <button
              key={city.name}
              onClick={() => handleCitySelect(city)}
              className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-full text-xs text-zinc-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '400px', width: '100%', borderRadius: '0' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <FlyToLocation center={mapCenter} zoom={mapZoom} />

          {/* Selected Location Markers */}
          {selectedLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={location.custom ? yellowIcon : greenIcon}
            >
              <Popup>
                <div className="min-w-[150px]">
                  <h4 className="font-semibold text-gray-900">{location.name}</h4>
                  {location.address && (
                    <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                  )}
                  {location.state && (
                    <p className="text-xs text-gray-500 mt-1">{location.state}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Popular Destination Markers */}
          {nearbyPlaces.map((place) => {
            const isSelected = selectedLocations.some(l => l.id === place.id)
            return (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={isSelected ? greenIcon : yellowIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedPlace(place)
                    setShowPopup(true)
                  }
                }}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <h4 className="font-semibold text-gray-900">{place.name}</h4>
                    <p className="text-sm text-gray-600">{place.city}, {place.state}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">{place.category}</span>
                      <span className="text-xs text-gray-500">{place.cost}</span>
                    </div>
                    {!isSelected && (
                      <button
                        onClick={() => handleAddPlace(place)}
                        className="mt-2 px-3 py-1 bg-yellow-400 text-black text-xs rounded-full hover:bg-yellow-500"
                      >
                        Add to Trip
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-[1000]">
          <button
            onClick={() => setMapZoom(mapZoom + 1)}
            className="w-8 h-8 bg-zinc-900/90 text-white rounded flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors text-lg font-bold"
          >
            +
          </button>
          <button
            onClick={() => setMapZoom(Math.max(1, mapZoom - 1))}
            className="w-8 h-8 bg-zinc-900/90 text-white rounded flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors text-lg font-bold"
          >
            −
          </button>
        </div>
      </div>

      {/* Nearby Places */}
      {nearbyPlaces.length > 0 && (
        <div className="p-4 border-t border-zinc-800">
          <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
            <Building2 size={16} className="text-yellow-400" />
            Nearby Places ({nearbyPlaces.length})
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {nearbyPlaces.slice(0, 8).map((place) => {
              const isSelected = selectedLocations.some(l => l.id === place.id)
              return (
                <button
                  key={place.id}
                  onClick={() => handleAddPlace(place)}
                  disabled={isSelected}
                  className={`flex-shrink-0 p-3 rounded-xl border transition-all text-left min-w-[140px] ${
                    isSelected
                      ? 'bg-yellow-400/20 border-yellow-400/50 opacity-50'
                      : 'bg-zinc-800/50 border-zinc-700 hover:border-yellow-400/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-medium truncate">{place.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{place.category}</span>
                    <span>•</span>
                    <span>{place.cost}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected Locations */}
      {selectedLocations.length > 0 && (
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium text-sm">
              Selected ({selectedLocations.length})
            </h4>
            <button
              onClick={() => onLocationSelect?.([])}
              className="text-zinc-500 hover:text-red-400 text-xs"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedLocations.map((location) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 bg-black/50 border border-zinc-700 rounded-lg"
              >
                <MapPin size={14} className={location.custom ? 'text-yellow-400' : 'text-green-400'} />
                <span className="text-white text-sm">{location.name}</span>
                {location.custom && (
                  <button
                    onClick={() => handleRemoveLocation(location.id)}
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
    </motion.div>
  )
}