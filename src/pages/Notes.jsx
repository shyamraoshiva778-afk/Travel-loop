import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Plus, Trash2, FileText, Edit2, Save, X, Tag, Briefcase, Home, Heart } from 'lucide-react'

const noteCategories = [
  { name: 'Hotel', icon: Home, color: 'text-blue-400', bg: 'bg-blue-400/20' },
  { name: 'Transport', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-400/20' },
  { name: 'Food', icon: Heart, color: 'text-red-400', bg: 'bg-red-400/20' },
  { name: 'General', icon: Tag, color: 'text-yellow-400', bg: 'bg-yellow-400/20' }
]

export default function Notes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [noteCategory, setNoteCategory] = useState('General')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('All')

  useEffect(() => { fetchNotes() }, [id])

  const fetchNotes = async () => {
    const { data } = await supabase.from('notes').select('*').eq('trip_id', id).order('created_at', { ascending: false })
    setNotes(data || [])
    setLoading(false)
  }

  const addNote = async (e) => {
    e.preventDefault()
    if (!newNote.trim()) return
    await supabase.from('notes').insert({ trip_id: id, note_text: newNote, category: noteCategory })
    setNewNote('')
    setNoteCategory('General')
    fetchNotes()
  }

  const deleteNote = async (noteId) => {
    if (confirm('Delete this note?')) { await supabase.from('notes').delete().eq('id', noteId); fetchNotes() }
  }

  const startEdit = (note) => { setEditingId(note.id); setEditText(note.note_text) }
  const saveEdit = async (noteId) => { await supabase.from('notes').update({ note_text: editText }).eq('id', noteId); setEditingId(null); fetchNotes() }
  const cancelEdit = () => { setEditingId(null); setEditText('') }

  if (loading) return <div className="min-h-screen map-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen map-bg">
      <header className="border-b-2 border-slate-700/50 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(`/trip/${id}`)} className="flex items-center gap-3 text-slate-400 hover:text-yellow-400">
            <ArrowLeft size={20} /> <span>Back to Trip</span>
          </button>
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold text-white">Notes</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Travel Notes</h1>
          <p className="text-slate-500 mb-10">Keep track of important information</p>

          {/* Add Note */}
          <motion.form onSubmit={addNote} className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                  <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note... (hotel info, reminders, plans)" className="w-full pl-12 p-4 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-yellow-400 h-32 resize-none" />
                </div>
                <div className="md:w-48 space-y-2">
                  <label className="text-sm font-medium text-slate-400">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {noteCategories.map(cat => {
                      const Icon = cat.icon
                      return (
                        <button key={cat.name} type="button" onClick={() => setNoteCategory(cat.name)} className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${noteCategory === cat.name ? `${cat.bg} ${cat.color} border-${cat.color}` : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                          <Icon size={14} /> {cat.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 flex items-center gap-2">
                <Plus size={20} /> Add Note
              </button>
            </div>
          </motion.form>

          {/* Category Filter */}
          <motion.div className="flex flex-wrap gap-2 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <button onClick={() => setFilterCategory('All')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterCategory === 'All' ? 'bg-yellow-400 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>All</button>
            {noteCategories.map(cat => {
              const Icon = cat.icon
              return (
                <button key={cat.name} onClick={() => setFilterCategory(cat.name)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterCategory === cat.name ? `${cat.bg} ${cat.color}` : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                  <Icon size={14} /> {cat.name}
                </button>
              )
            })}
          </motion.div>

          {/* Notes List */}
          {(() => {
            const filteredNotes = filterCategory === 'All' ? notes : notes.filter(n => n.category === filterCategory)
            if (filteredNotes.length === 0) return null
            return (
              <div className="space-y-4">
                {filteredNotes.map((note, index) => {
                  const catConfig = noteCategories.find(c => c.name === note.category) || noteCategories[3]
                  const CatIcon = catConfig.icon
                  return (
                    <motion.div key={note.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.1 }} className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6">
                      {editingId === note.id ? (
                        <div>
                          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full p-4 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white h-40" />
                          <div className="flex gap-3 mt-4">
                            <button onClick={() => saveEdit(note.id)} className="px-5 py-2.5 bg-yellow-400 text-black rounded-xl font-medium flex items-center gap-2"><Save size={18} /> Save</button>
                            <button onClick={cancelEdit} className="px-5 py-2.5 bg-slate-700 text-white rounded-xl font-medium flex items-center gap-2"><X size={18} /> Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${catConfig.bg} ${catConfig.color}`}>
                              <CatIcon size={12} className="inline mr-1" />{note.category || 'General'}
                            </span>
                          </div>
                          <p className="text-white whitespace-pre-wrap">{note.note_text}</p>
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                            <span className="text-slate-500 text-sm">{new Date(note.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            <div className="flex gap-2">
                              <button onClick={() => startEdit(note)} className="p-2 text-slate-500 hover:text-yellow-400"><Edit2 size={18} /></button>
                              <button onClick={() => deleteNote(note.id)} className="p-2 text-slate-500 hover:text-red-400"><Trash2 size={18} /></button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )
          })()}
        </motion.div>
      </main>
    </div>
  )
}