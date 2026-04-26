import { useState, useMemo } from 'react'
import {
  MapPin, Search, X, ChevronRight, Pencil, Save,
  GraduationCap, FlaskConical, Zap, BookOpen, Coffee,
  DoorOpen, AlertTriangle, CheckCircle2, Wrench,
  Users, Volume2, Info, ArrowRight, ChefHat,
} from 'lucide-react'
import { useCampus } from '../context/CampusContext'
import { FLOOR_PLANS } from '../data/floorPlans'

const TYPE_ICONS = {
  classroom: GraduationCap,
  workshop: Wrench,
  social: Coffee,
  admin: Users,
  emergency: AlertTriangle,
  stairs: ArrowRight,
  wc: DoorOpen,
  storage: BookOpen,
  entrance: DoorOpen,
  club: BookOpen,
}

const TYPE_LABELS = {
  classroom: 'Sınıf',
  workshop: 'Atölye',
  social: 'Sosyal',
  admin: 'İdari',
  emergency: 'Acil',
  stairs: 'Geçiş',
  wc: 'WC',
  storage: 'Depo',
  entrance: 'Giriş',
  club: 'Kulüp',
}

const FLOOR_NAMES = ['Zemin Kat', '1. Kat', '2. Kat', '3. Kat']

export default function InteractiveMap() {
  const {
    rooms, role, getEventsByRoom, getVisibleEvents,
    addFaultReport, updateRoomName,
    announcements, canteenData, updateCanteenDensity,
    userLocation, setUserLocation,
  } = useCampus()

  const [activeFloor, setActiveFloor] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [faultMode, setFaultMode] = useState(false)
  const [faultDesc, setFaultDesc] = useState('')
  const [editingRoomId, setEditingRoomId] = useState(null)
  const [editName, setEditName] = useState('')
  const [toastMessage, setToastMessage] = useState(null)
  const [showCanteen, setShowCanteen] = useState(false)

  const floorPlan = FLOOR_PLANS[activeFloor]

  const floorAnnouncements = useMemo(() =>
    announcements.filter(a => a.floorId === activeFloor),
    [announcements, activeFloor]
  )

  const enrichedRooms = useMemo(() => {
    return floorPlan.rooms.map(fr => {
      const dataRoom = rooms.find(r => r.id === fr.id || r.name === fr.name)
      return { ...fr, ...(dataRoom || {}) }
    })
  }, [floorPlan, rooms])

  const visibleRooms = useMemo(() => {
    if (!search.trim()) return enrichedRooms
    const q = search.toLowerCase()
    return enrichedRooms.filter(r => r.name.toLowerCase().includes(q))
  }, [enrichedRooms, search])

  const visibleEvents = getVisibleEvents(role)

  const openRoom = (room) => {
    setSelectedRoom(room)
    setDrawerOpen(true)
    setFaultMode(false)
    setFaultDesc('')
    setEditingRoomId(null)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setSelectedRoom(null)
    setFaultMode(false)
    setFaultDesc('')
    setEditingRoomId(null)
  }

  const handleFaultSubmit = (roomId, roomName) => {
    if (!faultDesc.trim()) return
    addFaultReport({ roomId, roomName, description: faultDesc.trim(), reportedBy: role })
    setToastMessage(`${roomName} için arıza bildirildi.`)
    setTimeout(() => setToastMessage(null), 3000)
    setFaultMode(false)
    setFaultDesc('')
  }

  const handleEditSave = (roomId) => {
    if (editName.trim()) updateRoomName(roomId, editName.trim())
    setEditingRoomId(null)
    setEditName('')
  }

  const handleLocate = () => {
    const floors = [0, 1, 2, 3]
    const randomFloor = floors[Math.floor(Math.random() * floors.length)]
    const floorRooms = FLOOR_PLANS[randomFloor].rooms
    const randomRoom = floorRooms[Math.floor(Math.random() * floorRooms.length)]
    setActiveFloor(randomFloor)
    setUserLocation({ floorId: randomFloor, roomId: randomRoom.id })
    setToastMessage(`${FLOOR_NAMES[randomFloor]} - ${randomRoom.name} önündesiniz`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const densityColor = canteenData.density === 'low' ? 'bg-emerald-500' : canteenData.density === 'medium' ? 'bg-amber-500' : 'bg-red-500'
  const densityLabel = canteenData.density === 'low' ? 'Az Yoğun' : canteenData.density === 'medium' ? 'Orta Yoğun' : 'Çok Yoğun'

  return (
    <div className="min-h-full bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 sm:px-6 sm:pt-4 sm:pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />Kat Rehberi
          </h2>
          <p className="text-xs text-slate-500 mt-1">{floorPlan.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleLocate}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 hover:bg-cyan-500/20 transition-all cursor-pointer">
            Neredeyim?
          </button>
          <button onClick={() => setShowCanteen(!showCanteen)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer">
            <ChefHat className="w-3.5 h-3.5 inline mr-1" />Kantin
          </button>
        </div>
      </div>

      {/* Kantin Panel */}
      {showCanteen && (
        <div className="mx-4 sm:mx-6 mb-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><ChefHat className="w-4 h-4 text-amber-400" />Kantin</h3>
            <span className="text-[10px] text-slate-500">{canteenData.openHours}</span>
          </div>
          <div className="space-y-2">
            {canteenData.menu.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{item.day}</span>
                <span className="text-slate-400">{item.main}</span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500">Yoğunluk</span>
              <span className="text-[10px] font-medium text-slate-300">{densityLabel}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full rounded-full ${densityColor} transition-all duration-700`} style={{ width: `${canteenData.densityPercent}%` }} />
            </div>
          </div>
          <button onClick={updateCanteenDensity} className="mt-2 text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer">Yenile</button>
        </div>
      )}

      {/* Dijital Pano */}
      {floorAnnouncements.length > 0 && (
        <div className="mx-4 sm:mx-6 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Dijital Pano</span>
          </div>
          <div className="space-y-1.5">
            {floorAnnouncements.map(a => (
              <div key={a.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                a.type === 'warning' ? 'bg-red-500/10 border border-red-500/20 text-red-300' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
              }`}>
                {a.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> : <Info className="w-3.5 h-3.5 flex-shrink-0" />}
                <span className="flex-1">{a.message}</span>
                <span className="text-[10px] opacity-60">{a.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floor Tabs */}
      <div className="px-4 sm:px-6 pb-3">
        <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/5">
          {FLOOR_PLANS.map(f => (
            <button key={f.id} onClick={() => { setActiveFloor(f.id); setUserLocation(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFloor === f.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}>
              {f.label === 'Z' ? 'Zemin' : `${f.label}. Kat`}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 sm:px-6 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Oda ara..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
        </div>
      </div>

      {/* Room Grid */}
      <div className="flex-1 overflow-auto px-4 sm:px-6 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibleRooms.map(room => {
            const Icon = TYPE_ICONS[room.type] || BookOpen
            const roomEvents = getEventsByRoom(room.id).filter(e => visibleEvents.includes(e))
            const isLocated = userLocation?.roomId === room.id && userLocation?.floorId === activeFloor
            return (
              <button key={room.id} onClick={() => openRoom(room)}
                className={`relative group p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isLocated
                    ? 'bg-cyan-500/15 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                }`}>
                {isLocated && (
                  <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-cyan-500 text-white text-[9px] font-bold">Buradasın</span>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isLocated ? 'bg-cyan-500/20' : 'bg-white/5'}`}>
                    <Icon className={`w-5 h-5 ${isLocated ? 'text-cyan-400' : 'text-slate-400'}`} />
                  </div>
                  {roomEvents.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-medium">{roomEvents.length}</span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white mb-0.5 truncate">{room.name}</h3>
                <p className="text-[10px] text-slate-500">{TYPE_LABELS[room.type] || 'Oda'}</p>
                {room.capacity && <p className="text-[10px] text-slate-600 mt-1">{room.capacity} kişi</p>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="relative w-full sm:w-96 max-w-lg h-full bg-slate-900 border-l border-white/10 overflow-y-auto animate-[slideIn_0.2s_ease-out]">
            {(() => {
              const room = selectedRoom
              const roomEvents = getEventsByRoom(room.id)
              const Icon = TYPE_ICONS[room.type] || BookOpen
              return (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        {editingRoomId === room.id ? (
                          <div className="flex items-center gap-2">
                            <input value={editName} onChange={e => setEditName(e.target.value)}
                              className="px-2 py-1 rounded bg-white/10 border border-cyan-500/30 text-white font-bold text-base w-40" autoFocus />
                            <button onClick={() => handleEditSave(room.id)} className="text-cyan-400"><Save className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{room.name}</h3>
                            {role === 'teacher' && (
                              <button onClick={() => { setEditingRoomId(room.id); setEditName(room.name) }} className="text-slate-500 hover:text-cyan-400">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-slate-500">{floorPlan.name} • {TYPE_LABELS[room.type]}</p>
                      </div>
                    </div>
                    <button onClick={closeDrawer} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {room.description && (
                    <div className="mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <p className="text-sm text-slate-300">{room.description}</p>
                    </div>
                  )}

                  {room.equipment && room.equipment.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Ekipmanlar</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {room.equipment.map((eq, i) => (
                          <span key={i} className="px-2 py-1 rounded-md text-[10px] bg-white/5 border border-white/5 text-slate-300">{eq}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {roomEvents.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Etkinlikler</h4>
                      <div className="space-y-1.5">
                        {roomEvents.map(ev => (
                          <div key={ev.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            <p className="text-xs text-slate-300 flex-1">{ev.title}</p>
                            <span className="text-[10px] text-slate-500">{ev.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {role === 'teacher' && room.type !== 'stairs' && room.type !== 'emergency' && (
                    <div className="mt-4">
                      {!faultMode ? (
                        <button onClick={() => setFaultMode(true)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all cursor-pointer">
                          <AlertTriangle className="w-4 h-4" />Arıza Bildirimi Oluştur
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <textarea value={faultDesc} onChange={e => setFaultDesc(e.target.value)}
                            placeholder="Arıza açıklaması..."
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-red-500/20 text-white text-sm placeholder-slate-500 focus:outline-none h-20 resize-none" />
                          <div className="flex gap-2">
                            <button onClick={() => { setFaultMode(false); setFaultDesc('') }}
                              className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-sm">Vazgeç</button>
                            <button onClick={() => handleFaultSubmit(room.id, room.name)} disabled={!faultDesc.trim()}
                              className="flex-1 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium disabled:opacity-50 cursor-pointer">Bildir</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                    <div className="flex items-center gap-2 text-xs text-cyan-400">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Kat Geçiş Noktası: Merdivenler</span>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-500/90 backdrop-blur-md border border-green-400/30 shadow-lg animate-[slideUp_0.3s_ease-out]">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <p className="text-xs sm:text-sm font-medium text-white">{toastMessage}</p>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
