import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { Logo, LogoText } from '../components/ui/Logo'
import FloatingLines from '../components/effects/FloatingLines'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      setError(error.message)
    } else {
      alert('Password reset link sent! Check your email.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <FloatingLines
          enabledWaves={['middle']}
          lineCount={[12]}
          lineDistance={[8]}
          parallax={true}
          parallaxStrength={0.3}
          animationSpeed={0.8}
          linesGradient={['#0a0a0a', '#1a1a1a', '#facc15', '#fde047', '#facc15', '#1a1a1a', '#0a0a0a']}
          mixBlendMode="screen"
        />
      </div>

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/60 z-[1]" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            className="text-center mb-12"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #facc15 0%, #fde047 50%, #facc15 100%)',
                    boxShadow: '0 0 60px rgba(250, 204, 21, 0.5)'
                  }}
                >
                  {/* Map pin SVG */}
                  <svg viewBox="0 0 24 24" className="w-12 h-12">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      fill="#0a0a0a"
                    />
                    <circle cx="12" cy="9" r="3" fill="#facc15" />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-white">TRAVEL</span>
              <span className="text-yellow-400">OOP</span>
            </h1>
            <p className="text-zinc-500 mt-4 text-lg tracking-wide">Chart your next adventure</p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-10 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
              <p className="text-zinc-500 mt-2">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 text-sm">{error}</span>
                </motion.div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 focus:bg-black/70 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-14 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 focus:bg-black/70 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-yellow-400 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-yellow-400/70 hover:text-yellow-400 transition-colors tracking-wide"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
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
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-zinc-600 text-sm tracking-wider">or</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-zinc-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors tracking-wide"
              >
                Create one
              </Link>
            </p>
          </motion.div>

          {/* Footer */}
          <motion.p
            className="text-center text-zinc-600 text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}