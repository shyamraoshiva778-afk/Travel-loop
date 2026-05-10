import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Plus, Trash2, Check, Package, Shirt, Laptop, FileCheck, Heart } from 'lucide-react'

const categoryConfig = { Clothing: { icon: Shirt, color: 'text-yellow-400', bg: 'bg-yellow-400/20' }, Electronics: { icon: Laptop, color: 'text-yellow-300', bg: 'bg-yellow-300/20' }, Documents: { icon: FileCheck, color: 'text-yellow-500', bg: 'bg-yellow-500/20' }, Essentials: { icon: Heart, color: 'text-yellow-400', bg: 'bg-yellow-400/20' } }

export default function Packing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [category, setCategory] = useState('Clothing')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchItems() }, [id])

  const fetchItems = async () => {
    const { data } = await supabase.from('packing_items').select('*').eq('trip_id', id).order('created_at')
    setItems(data || [])
    setLoading(false)
  }

  const addItem = async (e) => {
    e.preventDefault()
    if (!newItem.trim()) return
    await supabase.from('packing_items').insert({ trip_id: id, item_name: newItem, category, is_packed: false })
    setNewItem('')
    fetchItems()
  }

  const togglePacked = async (item) => {
    await supabase.from('packing_items').update({ is_packed: !item.is_packed }).eq('id', item.id)
    fetchItems()
  }

  const deleteItem = async (itemId) => {
    await supabase.from('packing_items').delete().eq('id', itemId)
    fetchItems()
  }

  const categories = ['Clothing', 'Electronics', 'Documents', 'Essentials']
  const grouped = categories.reduce((acc, cat) => ({ ...acc, [cat]: items.filter(i => i.category === cat) }), {})

  const presetItems = {
    Clothing: ['T-shirts', 'Pants/Shorts', 'Underwear', 'Socks', 'Jacket', 'Swimsuit', 'Sleepwear', 'Comfortable Shoes'],
    Electronics: ['Phone Charger', 'Power Bank', 'Camera', 'Headphones', 'Laptop', 'Travel Adapter', 'USB Cable'],
    Documents: ['Passport', 'ID Card', 'Travel Insurance', 'Flight Tickets', 'Hotel Booking', 'Credit Cards', 'Cash'],
    Essentials: ['Sunscreen', 'Sunglasses', 'Hat', 'First Aid Kit', 'Water Bottle', 'Toiletries', 'Medications', 'Umbrella']
  }

  const addPreset = async (presetCategory) => {
    const preset = presetItems[presetCategory]
    const existingNames = items.map(i => i.item_name.toLowerCase())
    const newItems = preset
      .filter(name => !existingNames.includes(name.toLowerCase()))
      .map(name => ({ trip_id: id, item_name: name, category: presetCategory, is_packed: false }))

    if (newItems.length > 0) {
      await supabase.from('packing_items').insert(newItems)
      fetchItems()
    }
  }

  const clearAllPacked = async () => {
    const packedItems = items.filter(i => i.is_packed)
    if (packedItems.length > 0 && confirm('Remove all packed items?')) {
      await supabase.from('packing_items').delete().in('id', packedItems.map(i => i.id))
      fetchItems()
    }
  }
  const packedCount = items.filter(i => i.is_packed).length
  const progress = items.length > 0 ? (packedCount / items.length) * 100 : 0

  if (loading) return <div className="min-h-screen map-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen map-bg">
      <header className="border-b-2 border-slate-700/50 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(`/trip/${id}`)} className="flex items-center gap-3 text-slate-400 hover:text-yellow-400">
            <ArrowLeft size={20} /> <span>Back to Trip</span>
          </button>
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold text-white">Packing List</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Packing List</h1>
          <p className="text-slate-500 mb-10">Don't forget anything!</p>

          {/* Progress */}
          <motion.div className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400">Packing Progress</span>
              <span className="text-yellow-400 font-bold">{packedCount}/{items.length} packed</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
            </div>
          </motion.div>

          {/* Add Form */}
          <motion.form onSubmit={addItem} className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add custom item..." className="w-full pl-12 py-3.5 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-yellow-400" />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-5 py-3.5 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white focus:border-yellow-400">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
              <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/30 flex items-center gap-2">
                <Plus size={20} /> Add
              </button>
            </div>
          </motion.form>

          {/* Quick Add Presets */}
          <motion.div className="bg-slate-800/40 border-2 border-slate-700 rounded-2xl p-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Quick Add Presets</h3>
              {packedCount > 0 && (
                <button onClick={clearAllPacked} className="text-sm text-slate-500 hover:text-red-400 flex items-center gap-1">
                  <Trash2 size={14} /> Clear Packed
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(cat => {
                const config = categoryConfig[cat]
                const Icon = config.icon
                return (
                  <button key={cat} onClick={() => addPreset(cat)} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-yellow-400/50 transition-all text-left">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className="text-white text-sm">{cat}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Categories */}
          <div className="space-y-6">
            {categories.map((cat, index) => {
              const config = categoryConfig[cat]
              const Icon = config.icon
              const catItems = grouped[cat] || []
              return (
                <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }} className="bg-slate-800/60 border-2 border-slate-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}><Icon className={`w-5 h-5 ${config.color}`} /></div>
                    <h3 className="text-xl font-bold text-white">{cat}</h3>
                    <span className="text-slate-500 text-sm ml-auto">{catItems.filter(i => i.is_packed).length}/{catItems.length}</span>
                  </div>
                  {catItems.length === 0 ? <p className="text-slate-500 text-sm">No items added</p> : (
                    <div className="space-y-2">
                      <AnimatePresence>
                        {catItems.map(item => (
                          <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`flex items-center justify-between p-3 rounded-xl ${item.is_packed ? 'bg-slate-800/30' : 'bg-slate-800/50'}`}>
                            <div className="flex items-center gap-3">
                              <button onClick={() => togglePacked(item)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${item.is_packed ? 'bg-yellow-400 border-yellow-400' : 'border-slate-600 hover:border-yellow-400'}`}>
                                {item.is_packed && <Check size={14} className="text-black" />}
                              </button>
                              <span className={`text-white ${item.is_packed ? 'line-through text-slate-500' : ''}`}>{item.item_name}</span>
                            </div>
                            <button onClick={() => deleteItem(item.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 size={18} /></button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </main>
    </div>
  )
}