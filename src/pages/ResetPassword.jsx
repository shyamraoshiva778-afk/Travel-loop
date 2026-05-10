import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, Check, AlertCircle, ArrowRight } from 'lucide-react'
import FloatingLines from '../components/effects/FloatingLines'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Get the token from URL (Supabase puts it there)
  const token = searchParams.get('access_token')
  const type = searchParams.get('type')

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 3000)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  // Show invalid link message if no token
  if (!token || type !== 'recovery') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 z-0">
          <FloatingLines
            enabledWaves={['middle']}
            lineCount={[12]}
            lineDistance={[8]}
            parallax={true}
            animationSpeed={0.8}
            linesGradient={['#0a0a0a', '#1a1a1a', '#facc15', '#fde047', '#facc15']}
          />
        </div>
        <div className="absolute inset-0 bg-black/60 z-[1]" />

        <motion.div
          className="relative z-10 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Invalid Link</h2>
          <p className="text-zinc-400 mb-8">
            This password reset link has expired or is invalid. Please request a new one.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl"
          >
            Go to Login
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
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
          className="relative z-10 text-center max-w-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #facc15 0%, #fde047 100%)',
              boxShadow: '0 0 60px rgba(250, 204, 21, 0.5)'
            }}
          >
            <Check className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Password Reset!</h2>
          <p className="text-zinc-400 mb-8">Your password has been updated successfully.</p>
          <p className="text-yellow-400 text-sm animate-pulse mb-8">Redirecting to login...</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
          >
            Go to Login Now
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-10"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center mb-6">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #facc15 0%, #fde047 100%)',
                boxShadow: '0 0 40px rgba(250, 204, 21, 0.4)'
              }}
            >
              <Lock className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-white">RESET</span>
            <span className="text-yellow-400">PASSWORD</span>
          </h1>
          <p className="text-zinc-500 mt-3">Enter your new password below</p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-10 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleReset} className="space-y-6">
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

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 tracking-wide uppercase">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-12 pr-14 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-all"
                  required
                  minLength={6}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-12 pr-14 py-4 bg-black/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-yellow-400 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-400 text-xs">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || (password && confirmPassword && password !== confirmPassword)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-semibold rounded-xl shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-sm">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <p className="text-center text-zinc-400">
            Remember your password?{' '}
            <Link to="/login" className="text-yellow-400 font-medium hover:text-yellow-300">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}