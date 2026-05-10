import { useState, useCallback, useMemo } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Autocomplete, InfoWindow } from '@react-google-maps/api'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Navigation, X, Plus, Star, Building2, Clock, DollarSign } from 'lucide-react'

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '16px'
}

const center = {
  lat: 20.5937, // India center
  lng: 78.9629
}

const libraries = ['places', 'marker']

// India major cities with coordinates
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
  { name: 'Kerala', state: 'Kerala', lat: 10.8505, lng: 76.2711 },
  { name: 'Manali', state: 'Himachal Pradesh', lat: 32.2432, lng: 77.1892 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
]

// Predefined popular places with details
const popularPlaces = [
  { id: 1, name: 'India Gate', city: 'Delhi', state: 'Delhi', lat: 28.6304, lng: 77.2397, category: 'Monument', rating: 4.5, cost: 'Free' },
  { id: 2, name: 'Taj Mahal', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1751, lng: 78.0421, category: 'Monument', rating: 4.9, cost: '₹1,100' },
  { id: 3, name: 'Marine Drive', city: 'Mumbai', state: 'Maharashtra', lat: 18.9438, lng: 72.8234, category: 'Beach', rating: 4.4, cost: 'Free' },
  { id: 4, name: 'Bangalore Palace', city: 'Bangalore', state: 'Karnataka', lat: 12.9980, lng: 77.5926, category: 'Heritage', rating: 4.3, cost: '₹230' },
  { id: 5, name: 'Meenakshi Temple', city: 'Madurai', state: 'Tamil Nadu', lat: 9.9195, lng: 78.1203, category: 'Temple', rating: 4.7, cost: 'Free' },
  { id: 6, name: 'Howrah Bridge', city: 'Kolkata', state: 'West Bengal', lat: 22.5857, lng: 88.3419, category: 'Landmark', rating: 4.5, cost: 'Free' },
  { id: 7, name: 'Charminar', city: 'Hyderabad', state: 'Telangana', lat: 17.3617, lng: 78.4747, category: 'Monument', rating: 4.4, cost: '₹100' },
  { id: 8, name: ' Gateway of India', city: 'Mumbai', state: 'Maharashtra', lat: 18.9217, lng: 72.8332, category: 'Monument', rating: 4.6, cost: 'Free' },
  { id: 9, name: 'Hawa Mahal', city: 'Jaipur', state: 'Rajasthan', lat: 26.9559, lng: 75.8469, category: 'Palace', rating: 4.4, cost: '₹200' },
  { id: 10, name: 'Calangute Beach', city: 'Goa', state: 'Goa', lat: 15.5517, lng: 73.7673, category: 'Beach', rating: 4.2, cost: 'Free' },
  { id: 11, name: 'KBackwaters', city: 'Kerala', state: 'Kerala', lat: 9.4981, lng: 76.3388, category: 'Nature', rating: 4.8, cost: '₹500+' },
  { id: 12, name: 'Rohtang Pass', city: 'Manali', state: 'Himachal Pradesh', lat: 32.3654, lng: 77.5093, category: 'Adventure', rating: 4.7, cost: '₹500' },
  { id: 13, name: 'Varanasi Ghats', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.2826, lng: 82.9964, category: 'Spiritual', rating: 4.8, cost: 'Free' },
  { id: 14, name: 'Lake Palace', city: 'Udaipur', state: 'Rajasthan', lat: 24.6854, lng: 73.6914, category: 'Palace', rating: 4.6, cost: '₹300' },
  { id: 15, name: 'Mysore Palace', city: 'Mysore', state: 'Karnataka', lat: 12.3052, lng: 76.6551, category: 'Palace', rating: 4.7, cost: '₹200' },
]

export default function GoogleMapSelector({ onLocationSelect, selectedLocations = [] }) {
  const [map, setMap] = useState(null)
  const [autocomplete, setAutocomplete] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  const { isLoaded: googleLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  })

  const options = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0a0a' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2d2d' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a1a' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3d3d3d' }] },
      { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    ]
  }), [])

  const onLoad = useCallback((map) => {
    setMap(map)
    setIsLoaded(true)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const onPlaceSelected = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()

        const newLocation = {
          id: Date.now(),
          lat,
          lng,
          name: place.name || place.formatted_address?.split(',')[0] || 'Selected Location',
          address: place.formatted_address || '',
          placeId: place.place_id,
          custom: true
        }

        const updatedLocations = [...selectedLocations, newLocation]
        onLocationSelect?.(updatedLocations)

        // Find nearby places
        const nearby = popularPlaces.filter(p =>
          Math.abs(p.lat - lat) < 0.5 && Math.abs(p.lng - lng) < 0.5
        )
        setNearbyPlaces(nearby)

        map?.panTo({ lat, lng })
        map?.setZoom(14)
        setSelectedPlace(newLocation)
        setShowInfoWindow(true)
      }
    }
  }, [autocomplete, map, onLocationSelect, selectedLocations])

  const handleMapClick = useCallback((e) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()

      // Reverse geocode to get address
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        let address = ''
        let name = `Location ${selectedLocations.length + 1}`

        if (status === 'OK' && results[0]) {
          address = results[0].formatted_address
          name = results[0].address_components?.find(c => c.types.includes('locality'))?.long_name || name
        }

        const newLocation = {
          id: Date.now(),
          lat,
          lng,
          name,
          address,
          custom: true
        }

        const updatedLocations = [...selectedLocations, newLocation]
        onLocationSelect?.(updatedLocations)

        // Find nearby places
        const nearby = popularPlaces.filter(p =>
          Math.abs(p.lat - lat) < 1 && Math.abs(p.lng - lng) < 1
        )
        setNearbyPlaces(nearby)

        setSelectedPlace(newLocation)
        setShowInfoWindow(true)
      })
    }
  }, [onLocationSelect, selectedLocations])

  const handleAddPlace = (place) => {
    const exists = selectedLocations.find(p => p.id === place.id)
    if (!exists) {
      const location = {
        ...place,
        custom: false
      }
      const updated = [...selectedLocations, location]
      onLocationSelect?.(updated)

      map?.panTo({ lat: place.lat, lng: place.lng })
      map?.setZoom(12)
    }
  }

  const handleRemoveLocation = (id) => {
    const updated = selectedLocations.filter(l => l.id !== id)
    onLocationSelect?.(updated)
  }

  const centerOnCity = (city) => {
    map?.panTo({ lat: city.lat, lng: city.lng })
    map?.setZoom(11)
    setSearchQuery(city.name)

    // Show nearby places for this city
    const nearby = popularPlaces.filter(p => p.city === city.name || p.state === city.state)
    setNearbyPlaces(nearby)
  }

  // If Google Maps API key is not set, show fallback message
  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Google Maps Not Configured</h3>
          <p className="text-zinc-500 text-sm mb-4">
            Add your Google Maps API key to enable map selection
          </p>
          <p className="text-zinc-600 text-xs">
            Create a .env file with: VITE_GOOGLE_MAPS_API_KEY=your_api_key
          </p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
        <div className="text-center py-12">
          <p className="text-red-400">Error loading Google Maps</p>
        </div>
      </div>
    )
  }

  if (!googleLoaded) {
    return (
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
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
            <p className="text-zinc-500 text-sm">Search or click on map</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNearbyPlaces(popularPlaces)}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-400 rounded-lg text-sm hover:text-yellow-400 transition-all"
          >
            <Search size={16} />
            All Places
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-zinc-800">
        <div className="relative">
          <Autocomplete
            onLoad={(auto) => setAutocomplete(auto)}
            onPlaceChanged={onPlaceSelected}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a city or location..."
                className="w-full pl-12 pr-4 py-3 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-all"
              />
            </div>
          </Autocomplete>
        </div>

        {/* Quick City Select */}
        <div className="flex flex-wrap gap-2 mt-3">
          {majorCities.slice(0, 8).map((city) => (
            <button
              key={city.name}
              onClick={() => centerOnCity(city)}
              className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-full text-xs text-zinc-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={5}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={options}
        >
          {/* Selected Location Markers */}
          {selectedLocations.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: location.custom ? 8 : 10,
                fillColor: location.custom ? '#facc15' : '#22c55e',
                fillOpacity: 1,
                strokeColor: '#000',
                strokeWeight: 2,
              }}
              onClick={() => {
                setSelectedPlace(location)
                setShowInfoWindow(true)
              }}
            />
          ))}

          {/* Popular Places Markers */}
          {nearbyPlaces.map((place) => (
            <Marker
              key={place.id}
              position={{ lat: place.lat, lng: place.lng }}
              icon={{
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: '#f97316',
                fillOpacity: 0.9,
                strokeColor: '#fff',
                strokeWeight: 1,
              }}
              onClick={() => {
                setSelectedPlace(place)
                setShowInfoWindow(true)
              }}
            />
          ))}

          {/* Info Window */}
          {showInfoWindow && selectedPlace && (
            <InfoWindow
              position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
              onCloseClick={() => setShowInfoWindow(false)}
            >
              <div className="p-2 min-w-[200px]">
                <h4 className="font-semibold text-gray-900">{selectedPlace.name}</h4>
                {selectedPlace.address && (
                  <p className="text-sm text-gray-600 mt-1">{selectedPlace.address}</p>
                )}
                <button
                  onClick={() => handleAddPlace(selectedPlace)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                >
                  Add to Trip
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Map Controls Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => map?.setZoom(map.getZoom() + 1)}
            className="p-2 bg-black/80 text-white rounded-lg hover:bg-black"
          >
            +
          </button>
          <button
            onClick={() => map?.setZoom(map.getZoom() - 1)}
            className="p-2 bg-black/80 text-white rounded-lg hover:bg-black"
          >
            -
          </button>
        </div>
      </div>

      {/* Nearby Places */}
      {nearbyPlaces.length > 0 && (
        <div className="p-4 border-t border-zinc-800">
          <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
            <Building2 size={16} className="text-yellow-400" />
            Nearby Places
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {nearbyPlaces.map((place) => {
              const isSelected = selectedLocations.some(l => l.id === place.id)
              return (
                <button
                  key={place.id}
                  onClick={() => handleAddPlace(place)}
                  disabled={isSelected}
                  className={`flex-shrink-0 p-3 rounded-xl border transition-all text-left ${
                    isSelected
                      ? 'bg-yellow-400/20 border-yellow-400/50 opacity-50'
                      : 'bg-zinc-800/50 border-zinc-700 hover:border-yellow-400/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-medium">{place.name}</span>
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