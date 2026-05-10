import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Compass, Sparkles, ArrowRight, Globe, Camera, Mountain } from 'lucide-react'

const features = [
  {
    icon: Compass,
    title: 'Plan Your Journey',
    description: 'Create detailed itineraries with multiple stops and activities',
    color: 'from-yellow-400 to-yellow-500'
  },
  {
    icon: MapPin,
    title: 'Discover India',
    description: 'Explore 12+ curated destinations across the country',
    color: 'from-orange-400 to-red-500'
  },
  {
    icon: Camera,
    title: 'Capture Memories',
    description: 'Keep travel notes, packing lists, and budget trackers',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    icon: Mountain,
    title: 'Adventure Awaits',
    description: 'From beaches to mountains, heritage to adventure',
    color: 'from-violet-400 to-purple-500'
  }
]

const destinations = [
  { name: 'Goa', state: 'Beach Paradise', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40a7f2?w=400&q=80' },
  { name: 'Manali', state: 'Mountain Retreat', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80' },
  { name: 'Jaipur', state: 'Pink City', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80' },
  { name: 'Kerala', state: 'God\'s Own Country', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(250,204,21,0.05)_0%,transparent_40%)]" />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(#facc15 1px, transparent 1px), linear-gradient(90deg, #facc15 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-400/20">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#0a0a0a" />
                <circle cx="12" cy="9" r="2.5" fill="#facc15" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">TRAVEL</span>
              <span className="text-yellow-400">OOP</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors font-medium">
              Sign In
            </Link>
            <Link to="/signup" className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase">Your Adventure Awaits</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hero-title mb-8 leading-[1.1]"
          >
            <span className="text-white">Plan Your Perfect</span>
            <br />
            <span className="text-gradient-travel">Indian Adventure</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="hero-subtitle max-w-2xl mx-auto mb-12"
          >
            From the beaches of Goa to the mountains of Manali, plan every detail of your journey with Traveloop.
            Interactive maps, smart budgets, and seamless planning — all in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link to="/signup" className="group px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold rounded-2xl shadow-xl shadow-yellow-400/30 hover:shadow-2xl hover:shadow-yellow-400/40 transition-all flex items-center gap-3 text-lg">
              <Sparkles className="w-5 h-5" />
              Start Planning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-8 py-4 bg-zinc-900/80 border border-zinc-700 text-white font-medium rounded-2xl hover:bg-zinc-800 hover:border-zinc-600 transition-all flex items-center gap-3 text-lg">
              <Globe className="w-5 h-5 text-yellow-400" />
              Explore Destinations
            </Link>
          </motion.div>

          {/* Featured Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="destination-card group"
              >
                <div className="relative h-40 rounded-2xl overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">{dest.state}</p>
                    <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-block px-4 py-1.5 bg-yellow-400/10 text-yellow-400 text-sm font-semibold rounded-full mb-4"
            >
              FEATURES
            </motion.span>
            <h2 className="display-lg text-white mb-4">
              Everything You Need for
              <br />
              <span className="text-gradient-travel">Your Adventure</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Powerful tools designed to make travel planning effortless and memorable
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="card-adventure p-6 rounded-2xl group hover:scale-[1.02] transition-transform"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 border-t border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50+', label: 'Destinations' },
              { value: '10K+', label: 'Trips Planned' },
              { value: '25+', label: 'States Covered' },
              { value: '4.9', label: 'User Rating' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <p className="stat-travel mb-2">{stat.value}</p>
                <p className="text-zinc-500 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <MapPin className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="display-md text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of travelers who plan their adventures with Traveloop. Your next trip starts here.
              </p>
              <Link to="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-2xl shadow-xl shadow-yellow-400/30 hover:shadow-2xl hover:shadow-yellow-400/40 transition-all text-lg">
                <Sparkles className="w-6 h-6" />
                Create Your First Trip
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">TRAVEL</span>
                <span className="text-yellow-400">OOP</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm">
              Built for adventurers, by adventurers. Start your journey today.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
