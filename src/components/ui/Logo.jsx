import { motion } from 'framer-motion'

function Logo({ size = 'md', className = '' }) {
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80
  }

  const containerSize = sizes[size] || sizes.md

  return (
    <motion.div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: containerSize, height: containerSize }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #facc15 0%, #fde047 50%, #facc15 100%)',
          boxShadow: '0 0 20px rgba(250, 204, 21, 0.4)'
        }}
      />
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 w-full h-full p-2"
      >
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill="#0a0a0a"
        />
        <circle cx="12" cy="9" r="2.5" fill="#facc15" />
      </svg>
      <motion.div
        className="absolute -inset-1 rounded-xl border-2 border-dashed border-yellow-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  )
}

function LogoText({ className = '' }) {
  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo size="sm" />
      <div>
        <span className="text-xl font-bold text-white tracking-tight">TRAVEL</span>
        <span className="text-xl font-bold text-yellow-400 tracking-tight">OOP</span>
      </div>
    </motion.div>
  )
}

export { Logo, LogoText }
export default Logo