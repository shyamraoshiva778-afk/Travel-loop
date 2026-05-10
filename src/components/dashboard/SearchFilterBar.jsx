import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X, ChevronDown } from 'lucide-react'

const sortOptions = [
  { id: 'newest', name: 'Newest First' },
  { id: 'oldest', name: 'Oldest First' },
  { id: 'az', name: 'A → Z' },
  { id: 'za', name: 'Z → A' }
]

const filterOptions = [
  { id: 'all', name: 'All Trips' },
  { id: 'upcoming', name: 'Upcoming' },
  { id: 'ongoing', name: 'Ongoing' },
  { id: 'completed', name: 'Completed' }
]

export default function SearchFilterBar({ trips, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onFilter({ searchTerm: value, sortBy, filterBy })
  }

  const handleSortChange = (option) => {
    setSortBy(option.id)
    onFilter({ searchTerm, sortBy: option.id, filterBy })
  }

  const handleFilterChange = (option) => {
    setFilterBy(option.id)
    onFilter({ searchTerm, sortBy, filterBy: option.id })
  }

  return (
    <motion.div
      className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search trips..."
            className="w-full pl-12 pr-4 py-3 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-all"
          />
          {searchTerm && (
            <button onClick={() => handleSearch({ target: { value: '' } })} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(sortOptions.find(o => o.id === e.target.value))}
            className="appearance-none bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white pr-10 cursor-pointer focus:outline-none focus:border-yellow-400"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        </div>

        {/* Filter Button */}
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
            showFilters || filterBy !== 'all'
              ? 'bg-yellow-400/10 border-yellow-400/50 text-yellow-400'
              : 'bg-black/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
          }`}
        >
          <Filter size={18} />
          <span>Filter</span>
        </motion.button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-zinc-800"
        >
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleFilterChange(option)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filterBy === option.id
                    ? 'bg-yellow-400 text-black font-medium'
                    : 'bg-black/50 text-zinc-400 hover:text-white border border-zinc-700'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-zinc-600 text-sm">
          {trips?.length || 0} trips found
        </span>
        {(searchTerm || filterBy !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterBy('all')
              onFilter({ searchTerm: '', sortBy: 'newest', filterBy: 'all' })
            }}
            className="text-yellow-400/70 hover:text-yellow-400 text-sm"
          >
            Clear all
          </button>
        )}
      </div>
    </motion.div>
  )
}
