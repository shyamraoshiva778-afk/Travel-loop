import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import FloatingLines from '../components/effects/FloatingLines'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <FloatingLines
            enabledWaves={['middle']}
            lineCount={[12]}
            lineDistance={[8]}
            parallax={true}
            animationSpeed={0.6}
            linesGradient={['#0a0a0a', '#1a1a1a', '#facc15', '#fde047', '#facc15']}
          />
        </div>
        <div className="absolute inset-0 bg-black/60 z-[1]" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #facc15 0%, #fde047 100%)',
              boxShadow: '0 0 60px rgba(250, 204, 21, 0.5)'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <svg viewBox="0 0 24 24" className="w-14 h-14">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#0a0a0a" />
            </svg>
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">Check your email!</h2>
          <p className="text-zinc-400 text-xl mb-2">We've sent you a confirmation link.</p>
          <p className="text-yellow-400 text-sm animate-pulse">Redirecting to login...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <FloatingLines
          enabledWaves={['middle']}
          lineCount={[12]}
          lineDistance={[8]}
          parallax={true}
          animationSpeed={0.8}
          linesGradient={['#0a0a0a', '#1a1a1a', '#facc15', '#fde047', '#facc15', '#1a1a1a', '#0a0a0a']}
          mixBlendMode="screen"
        />
      </div>
      <div className="absolute inset-0 bg-black/60 z-[1]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            className="text-center mb-12"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center mb-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #facc15 0%, #fde047 50%, #facc15 100%)',
                  boxShadow: '0 0 60px rgba(250, 204, 21, 0.5)'
                }}
              >
                <svg viewBox="0 0 24 24" className="w-12 h-12">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#0a0a0a" />
                  <circle cx="12" cy="9" r="3" fill="#facc15" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-white">TRAVEL</span>
              <span className="text-yellow-400">OOP</span>
            </h1>
            <p className="text-zinc-500 mt-4 text-lg tracking-wide">Start your journey</p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-10 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white">Create account</h2>
              <p className="text-zinc-500 mt-2">Join thousands of travelers worldwide</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 bg-black/70 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-12 pr-14 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 bg-black/70 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-yellow-400 p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-zinc-600">At least 6 characters required</p>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-semibold rounded-xl shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 transition-all flex items-center justify-center gap-3 text-lg font-medium"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-zinc-600 text-sm tracking-wider">or</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <p className="text-center text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="text-yellow-400 font-medium hover:text-yellow-300">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}