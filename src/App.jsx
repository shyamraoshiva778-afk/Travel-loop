import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import TripDetails from './pages/TripDetails'
import Budget from './pages/Budget'
import Packing from './pages/Packing'
import Notes from './pages/Notes'
import Profile from './pages/Profile'
import SharedTrip from './pages/SharedTrip'
import LandingPage from './components/ui/LandingPage'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/create-trip" element={session ? <CreateTrip /> : <Navigate to="/login" />} />
        <Route path="/trip/:id" element={session ? <TripDetails /> : <Navigate to="/login" />} />
        <Route path="/budget/:id" element={session ? <Budget /> : <Navigate to="/login" />} />
        <Route path="/packing/:id" element={session ? <Packing /> : <Navigate to="/login" />} />
        <Route path="/notes/:id" element={session ? <Notes /> : <Navigate to="/login" />} />
        <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/shared/:id" element={<SharedTrip />} />
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App