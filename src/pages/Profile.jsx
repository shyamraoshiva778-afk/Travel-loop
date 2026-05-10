import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { User, LogOut, Plane, MapPin, Calendar, ArrowLeft, Save, X, Camera, Mail, Lock, Eye, EyeOff, AlertCircle, Check, Trash2 } from 'lucide-react'
import { LogoText } from '../components/ui/Logo'
import FloatingLines from '../components/effects/FloatingLines'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ trips: 0, cities: 0, totalDays: 0 })
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }
      setUser(user)
      setEditName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Traveler')

      const { data: tripsData } = await supabase.from('trips').select('*').eq('user_id', user.id)
      setTrips(tripsData || [])

      let totalCities = 0
      let totalDays = 0
      if (tripsData?.length) {
        const tripIds = tripsData.map(t => t.id)
        const { count: citiesCount } = await supabase.from('trip_stops').select('*', { count: 'exact', head: true }).in('trip_id', tripIds)
        totalCities = citiesCount || 0
        totalDays = tripsData.reduce((sum, t) => {
          const start = new Date(t.start_date)
          const end = new Date(t.end_date)
          return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
        }, 0)
      }

      setStats({ trips: tripsData?.length || 0, cities: totalCities, totalDays })
      setLoading(false)
    }
    fetchData()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdateLoading(true)
    const { error } = await supabase.auth.updateUser({
      data: { full_name: editName }
    })
    if (error) {
      alert(error.message)
    } else {
      setUser({ ...user, user_metadata: { ...user.user_metadata, full_name: editName } })
      setIsEditing(false)
    }
    setUpdateLoading(false)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    setUpdateLoading(true)
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => { setShowPasswordForm(false); setPasswordSuccess(false) }, 2000)
    }
    setUpdateLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <FloatingLines enabledWaves={['top']} lineCount={[6]} lineDistance={[12]} parallax={true} animationSpeed={0.5} linesGradient={['#0a0a0a', '#1a1a1a', '#facc15']} />
      </div>
      <div className="absolute inset-0 bg-black/70 z-[1]" />
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen map-bg">
      <header className="border-b-2 border-slate-700/50 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 text-slate-400 hover:text-yellow-400">
            <ArrowLeft size={20} /> <span>Dashboard</span>
          </Link>
          <LogoText />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Card */}
          <motion.div className="bg-slate-800/80 border-2 border-slate-700 rounded-3xl p-8 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar with Edit */}
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                  {editName ? (
                    <span className="text-5xl font-bold text-black">{editName.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User className="w-16 h-16 text-black" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center">
                  <Plane className="w-5 h-5 text-black" />
                </div>
                <button onClick={() => setIsEditing(true)} className="absolute inset-0 w-32 h-32 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Display Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white focus:border-yellow-400"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" disabled={updateLoading} className="px-5 py-2.5 bg-yellow-400 text-black rounded-xl font-medium flex items-center gap-2 hover:bg-yellow-300 disabled:opacity-50">
                        {updateLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Save size={18} /> Save</>}
                      </button>
                      <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-slate-700 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-slate-600">
                        <X size={18} /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white mb-2">{user?.user_metadata?.full_name || 'Traveler'}</h1>
                    <p className="text-slate-400 text-lg mb-6">{user?.email}</p>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-xl hover:bg-yellow-400/30 flex items-center gap-2">
                        <User size={18} /> Edit Profile
                      </button>
                      <button onClick={() => setShowPasswordForm(true)} className="px-5 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 flex items-center gap-2">
                        <Lock size={18} /> Change Password
                      </button>
                      <button onClick={handleLogout} className="px-6 py-2.5 bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl hover:bg-red-600/30 flex items-center gap-2">
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Password Change Form */}
            {showPasswordForm && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Lock className="text-yellow-400" /> Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {passwordError && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 text-sm">{passwordError}</span>
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 text-sm">Password updated successfully!</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full pl-12 pr-14 py-3 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white focus:border-yellow-400"
                          placeholder="Current password"
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-yellow-400">
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-12 pr-14 py-3 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white focus:border-yellow-400"
                          placeholder="New password"
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-yellow-400">
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Confirm</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white focus:border-yellow-400"
                          placeholder="Confirm new"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={updateLoading} className="px-5 py-2.5 bg-yellow-400 text-black rounded-xl font-medium flex items-center gap-2 hover:bg-yellow-300 disabled:opacity-50">
                      {updateLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Save size={18} /> Update Password</>}
                    </button>
                    <button type="button" onClick={() => { setShowPasswordForm(false); setPasswordError(''); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }} className="px-5 py-2.5 bg-slate-700 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-slate-600">
                      <X size={18} /> Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6 text-center">
              <Plane className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <p className="text-4xl font-bold text-white">{stats.trips}</p>
              <p className="text-slate-400">Total Trips</p>
            </div>
            <div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6 text-center">
              <MapPin className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <p className="text-4xl font-bold text-white">{stats.cities}</p>
              <p className="text-slate-400">Cities Visited</p>
            </div>
            <div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6 text-center">
              <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <p className="text-4xl font-bold text-white">{stats.totalDays}</p>
              <p className="text-slate-400">Total Days</p>
            </div>
          </motion.div>

          {/* Recent Trips */}
          <motion.div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold text-white mb-6">Recent Trips</h2>
            {trips.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No trips yet</p>
            ) : (
              <div className="space-y-3">
                {trips.slice(0, 5).map(trip => (
                  <Link key={trip.id} to={`/trip/${trip.id}`} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-yellow-400/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                        <Plane className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{trip.trip_name}</p>
                        <p className="text-slate-500 text-sm">{trip.start_date} - {trip.end_date}</p>
                      </div>
                    </div>
                    <span className="text-yellow-400">View →</span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}