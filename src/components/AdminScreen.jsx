import { useState, useMemo } from 'react'
import {
  ArrowLeft, Users, CalendarPlus, Map as MapIcon, MessageSquare,
  Settings, Wrench, BarChart3, Bell, Plus, Edit3, Trash2,
  CheckCircle, XCircle, Clock, MapPin, ChevronRight, X,
  Hash, Lock, AlertTriangle, RotateCcw, Eye, Siren, CalendarCheck
} from 'lucide-react'
import { useCampus } from '../context/CampusContext'

export default function AdminScreen() {
  const {
    resetRole, resetSystem,
    events, addEvent,
    rooms, updateRoomName,
    faultReports, updateFaultStatus, deleteFault,
    pendingNotifications, publishNotification, rejectPendingNotification,
    createPendingNotification, addNotification,
    notifications, navigateToFaultRoom,
    emergencyMode, setEmergencyMode,
    appointments, updateAppointmentStatus,
  } = useCampus()

  const [showEventModal, setShowEventModal] = useState(false)
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [showFaultModal, setShowFaultModal] = useState(false)
  const [showNotifModal, setShowNotifModal] = useState(false)

  const [eventForm, setEventForm] = useState({
    title: '', date: '', time: '', location: '', description: '', category: 'seminer', visibleTo: ['ogrenci', 'ogretmen', 'ziyaretci']
  })
  const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'event' })
  const [editingRoom, setEditingRoom] = useState(null)
  const [newRoomName, setNewRoomName] = useState('')

  const pendingFaults = faultReports.filter(f => f.status === 'reported' || f.status === 'pending')
  const inProgressFaults = faultReports.filter(f => f.status === 'in_progress')

  // Arıza istatistikleri
  const faultStats = useMemo(() => {
    const total = faultReports.length
    const pending = faultReports.filter(f => f.status === 'reported' || f.status === 'pending').length
    const inProgress = faultReports.filter(f => f.status === 'in_progress').length
    const resolved = faultReports.filter(f => f.status === 'resolved').length
    const catCounts = faultReports.reduce((acc, f) => {
      const cat = f.category || 'diger'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {})
    const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]
    return { total, pending, inProgress, resolved, topCategory }
  }, [faultReports])

  const stats = [
    { id: 1, label: 'Toplam Etkinlik', value: events.length, icon: CalendarPlus, color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30', iconColor: 'text-cyan-400' },
    { id: 2, label: 'Bekleyen Arıza', value: pendingFaults.length, icon: Wrench, color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30', iconColor: 'text-amber-400' },
    { id: 3, label: 'Onay Kuyruğu', value: pendingNotifications.length, icon: Bell, color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30', iconColor: 'text-purple-400' },
    { id: 4, label: 'Harita Konumu', value: rooms.length, icon: MapIcon, color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30', iconColor: 'text-emerald-400' },
    { id: 5, label: 'Randevu Talebi', value: appointments.filter(a => a.status === 'pending').length, icon: CalendarCheck, color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30', iconColor: 'text-rose-400' },
  ]

  const handleCreateEvent = (e) => {
    e.preventDefault()
    if (!eventForm.title.trim() || !eventForm.date || !eventForm.location.trim()) return
    addEvent({ ...eventForm, roomId: rooms[0]?.id || 'room-1', orginazer: 'İdare' })
    setEventForm({ title: '', date: '', time: '', location: '', description: '', category: 'seminer', visibleTo: ['ogrenci', 'ogretmen', 'ziyaretci'] })
    setShowEventModal(false)
  }

  const handleUpdateRoom = (e) => {
    e.preventDefault()
    if (!editingRoom || !newRoomName.trim()) return
    updateRoomName(editingRoom.id, newRoomName.trim())
    setEditingRoom(null)
    setNewRoomName('')
    setShowRoomModal(false)
  }

  const handlePublishDirect = () => {
    if (!notifForm.title.trim() || !notifForm.message.trim()) return
    addNotification({ title: notifForm.title.trim(), message: notifForm.message.trim(), type: notifForm.type })
    setNotifForm({ title: '', message: '', type: 'event' })
    setShowNotifModal(false)
  }

  const handleQueueNotification = () => {
    if (!notifForm.title.trim() || !notifForm.message.trim()) return
    createPendingNotification({ title: notifForm.title.trim(), message: notifForm.message.trim(), type: notifForm.type })
    setNotifForm({ title: '', message: '', type: 'event' })
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={resetRole} className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-white">Yönetim Paneli</h1>
          <p className="text-xs text-slate-500">İdare kontrol paneli</p>
        </div>
        <div className="flex items-center gap-1.5">
          {pendingNotifications.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded-full font-medium">{pendingNotifications.length} bildirim</span>
          )}
          {pendingFaults.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded-full font-medium">{pendingFaults.length} arıza</span>
          )}
          {appointments.filter(a => a.status === 'pending').length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 text-rose-400 rounded-full font-medium">{appointments.filter(a => a.status === 'pending').length} randevu</span>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Stats grid */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {stats.map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.id} className={`rounded-xl bg-gradient-to-br ${stat.color} border backdrop-blur-sm p-3 sm:p-4 text-center`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor} mx-auto mb-2`} />
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-slate-400">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Quick actions */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Hızlı İşlemler</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            <button onClick={() => setShowEventModal(true)} className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer text-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300"><CalendarPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
              <div><p className="text-xs sm:text-sm font-medium text-white">Etkinlik Oluştur</p><p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Yeni etkinlik ekleyin</p></div>
            </button>
            <button onClick={() => setShowRoomModal(true)} className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer text-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:scale-110 transition-transform duration-300"><MapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
              <div><p className="text-xs sm:text-sm font-medium text-white">Konum Yönet</p><p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Oda isimlerini güncelleyin</p></div>
            </button>
            <button onClick={() => setShowFaultModal(true)} className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer text-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300"><Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
              <div><p className="text-xs sm:text-sm font-medium text-white">Arıza Yönet</p><p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Arıza durumlarını güncelleyin</p></div>
            </button>
            <button onClick={() => setShowNotifModal(true)} className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer text-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300"><Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
              <div><p className="text-xs sm:text-sm font-medium text-white">Bildirim Yönet</p><p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Bildirim onay kuyruğu</p></div>
            </button>
            <button onClick={() => setEmergencyMode(!emergencyMode)} className={`group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer text-center ${emergencyMode ? 'bg-red-500/10 border-red-500/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}>
              <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${emergencyMode ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}><Siren className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
              <div><p className={`text-xs sm:text-sm font-medium ${emergencyMode ? 'text-red-400' : 'text-white'}`}>{emergencyMode ? 'Acil Durum Aktif' : 'Acil Durum'}</p><p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">{emergencyMode ? 'Devre dışı bırak' : 'Tüm kullanıcılara uyarı'}</p></div>
            </button>
          </div>
        </div>

        {/* ARIZA YÖNETİM MERKEZİ */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Arıza Yönetim Merkezi</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded-full font-medium">{faultReports.length} kayıt</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
          </div>

          {/* Dashboard kartları */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
              <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{faultStats.total}</div>
              <div className="text-[10px] text-slate-500">Toplam Arıza</div>
            </div>
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
              <Clock className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{faultStats.pending}</div>
              <div className="text-[10px] text-slate-500">Bekleyen</div>
            </div>
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
              <Wrench className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{faultStats.inProgress}</div>
              <div className="text-[10px] text-slate-500">İşlemde</div>
            </div>
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
              <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-white">{faultStats.resolved}</div>
              <div className="text-[10px] text-slate-500">Çözülen</div>
            </div>
          </div>

          {faultStats.topCategory && (
            <div className="mb-3 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">En çok arıza veren kategori:</span>
              <span className="text-xs font-semibold text-amber-400">{faultStats.topCategory[0]} ({faultStats.topCategory[1]} bildirim)</span>
            </div>
          )}

          {/* Arıza listesi */}
          <div className="space-y-1.5">
            {faultReports.length === 0 ? (
              <div className="text-center py-4 text-slate-600">
                <Wrench className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Henüz arıza kaydı yok</p>
              </div>
            ) : (
              faultReports.slice(0, 6).map(fault => (
                <div key={fault.id} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all">
                  <div className="flex-shrink-0">
                    {fault.status === 'resolved' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : fault.status === 'in_progress' ? <Clock className="w-4 h-4 text-blue-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium text-white truncate">{fault.roomName}</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500">{fault.description}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5 inline-block ${
                      fault.status === 'resolved' ? 'text-emerald-400 bg-emerald-500/10' : fault.status === 'in_progress' ? 'text-blue-400 bg-blue-500/10' : 'text-amber-400 bg-amber-500/10'
                    }`}>
                      {fault.status === 'resolved' ? 'Çözüldü' : fault.status === 'in_progress' ? 'İşlemde' : 'Bekliyor'}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {fault.status !== 'in_progress' && (
                      <button onClick={() => updateFaultStatus(fault.id, 'in_progress')} className="p-1 sm:p-1.5 rounded-lg hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 transition-all cursor-pointer" title="Onayla / İşleme Al">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {fault.status !== 'resolved' && (
                      <button onClick={() => updateFaultStatus(fault.id, 'resolved')} className="p-1 sm:p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 transition-all cursor-pointer" title="Tamir Edildi">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => navigateToFaultRoom(fault.roomName)} className="p-1 sm:p-1.5 rounded-lg hover:bg-cyan-500/10 text-slate-500 hover:text-cyan-400 transition-all cursor-pointer" title="Haritada Göster">
                      <MapPin className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteFault(fault.id)} className="p-1 sm:p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all cursor-pointer" title="Reddet / Sil">
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending approvals */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Onay Bekleyenler</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded-full font-medium">{pendingFaults.length + pendingNotifications.length + appointments.filter(a => a.status === 'pending').length}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
          </div>
          <div className="space-y-1.5">
            {pendingFaults.map(fault => (
              <div key={fault.id} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg text-amber-400 bg-amber-500/10"><Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-white truncate">{fault.roomName}</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500">{fault.description} • {new Date(fault.reportedAt).toLocaleDateString('tr-TR')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateFaultStatus(fault.id, 'in_progress')} className="p-1 sm:p-1.5 rounded-lg hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 transition-all cursor-pointer" title="İşleme Al"><Clock className="w-4 h-4" /></button>
                  <button onClick={() => updateFaultStatus(fault.id, 'resolved')} className="p-1 sm:p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 transition-all cursor-pointer" title="Çözüldü"><CheckCircle className="w-4 h-4" /></button>
                  <button onClick={() => deleteFault(fault.id)} className="p-1 sm:p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all cursor-pointer" title="Sil"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {pendingNotifications.map(pending => (
              <div key={pending.id} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg text-purple-400 bg-purple-500/10"><Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-white truncate">{pending.title}</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500">{pending.message} • Bildirim onayı</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => publishNotification(pending.id)} className="p-1 sm:p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 transition-all cursor-pointer" title="Yayınla"><CheckCircle className="w-4 h-4" /></button>
                  <button onClick={() => rejectPendingNotification(pending.id)} className="p-1 sm:p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all cursor-pointer" title="Reddet"><XCircle className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {appointments.filter(a => a.status === 'pending').map(appt => (
              <div key={appt.id} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg text-rose-400 bg-rose-500/10"><CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-white truncate">{appt.visitorName} — {appt.person}</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500">{appt.reason.slice(0, 40)}{appt.reason.length > 40 ? '...' : ''} • {appt.date} {appt.time}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateAppointmentStatus(appt.id, 'approved')} className="p-1 sm:p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 transition-all cursor-pointer" title="Onayla"><CheckCircle className="w-4 h-4" /></button>
                  <button onClick={() => updateAppointmentStatus(appt.id, 'rejected')} className="p-1 sm:p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all cursor-pointer" title="Reddet"><XCircle className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {pendingFaults.length === 0 && pendingNotifications.length === 0 && appointments.filter(a => a.status === 'pending').length === 0 && (
              <div className="text-center py-4 text-slate-600"><CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-xs">Onay bekleyen kayıt yok</p></div>
            )}
          </div>
        </div>

        {/* Activity overview */}
        <div className="px-3 sm:px-4 pb-4 sm:pb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Son Aktiviteler</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
          </div>
          <div className="space-y-2">
            {[...faultReports.slice(0, 2).map(f => ({ user: f.reporter || 'Sistem', action: 'Arıza bildirimi oluşturdu', target: f.roomName, time: f.reportedAt ? new Date(f.reportedAt).toLocaleDateString('tr-TR') : 'Yakın zamanda', color: 'bg-amber-400' })),
              ...events.slice(-2).map(e => ({ user: e.orginazer || 'İdare', action: 'Yeni etkinlik oluşturdu', target: e.title, time: e.date, color: 'bg-cyan-400' })),
              ...appointments.slice(-2).map(a => ({ user: a.visitorName, action: 'Randevu talebi oluşturdu', target: `${a.person} — ${a.reason.slice(0, 20)}${a.reason.length > 20 ? '...' : ''}`, time: new Date(a.createdAt).toLocaleDateString('tr-TR'), color: 'bg-rose-400' })),
              ...notifications.slice(0, 2).map(n => ({ user: 'Sistem', action: n.title, target: n.message.slice(0, 30) + '...', time: n.timestamp ? new Date(n.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-', color: 'bg-purple-400' })),
            ].slice(0, 4).map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-300"><span className="text-white font-medium">{activity.user}</span>{' '}{activity.action}</p>
                  {activity.target && <p className="text-[10px] sm:text-xs text-cyan-400">{activity.target} • {activity.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sistem Sıfırla */}
        <div className="px-3 sm:px-4 pb-4 sm:pb-6">
          <button onClick={resetSystem} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer">
            <RotateCcw className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium">Sistemi Sıfırla (Tüm verileri temizle)</span>
          </button>
        </div>
      </div>

      {/* Event Create Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEventModal(false)} />
          <div className="relative w-full sm:max-w-lg bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><CalendarPlus className="w-5 h-5 text-cyan-400" />Yeni Etkinlik Oluştur</h2>
              <button onClick={() => setShowEventModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-400 mb-2">Etkinlik Adı *</label><input type="text" value={eventForm.title} onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Etkinlik adı" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-400 mb-2">Tarih *</label><input type="date" value={eventForm.date} onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-all" /></div>
                <div><label className="block text-xs font-medium text-slate-400 mb-2">Saat</label><input type="time" value={eventForm.time} onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-all" /></div>
              </div>
              <div><label className="block text-xs font-medium text-slate-400 mb-2">Konum *</label><input type="text" value={eventForm.location} onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))} placeholder="Örn: Konferans Salonu" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all" /></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-2">Açıklama</label><textarea value={eventForm.description} onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Etkinlik açıklaması..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all resize-none" /></div>
              <button type="submit" disabled={!eventForm.title.trim() || !eventForm.date || !eventForm.location.trim()} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"><Plus className="w-4 h-4" />Etkinlik Oluştur</button>
            </form>
          </div>
        </div>
      )}

      {/* Room Management Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRoomModal(false)} />
          <div className="relative w-full sm:max-w-lg bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><MapIcon className="w-5 h-5 text-emerald-400" />Konum Yönetimi</h2>
              <button onClick={() => setShowRoomModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2">
              {rooms.map(room => (
                <div key={room.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-sm text-white">{room.name}</p><p className="text-[10px] text-slate-500">{room.type} • {room.floor}. Kat • Kapasite: {room.capacity}</p></div>
                  {editingRoom?.id === room.id ? (
                    <form onSubmit={handleUpdateRoom} className="flex items-center gap-2">
                      <input autoFocus type="text" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} className="w-28 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none" />
                      <button type="submit" className="p-1 rounded-lg hover:bg-emerald-500/10 text-emerald-400 cursor-pointer"><CheckCircle className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => { setEditingRoom(null); setNewRoomName('') }} className="p-1 rounded-lg hover:bg-red-500/10 text-red-400 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                    </form>
                  ) : (
                    <button onClick={() => { setEditingRoom(room); setNewRoomName(room.name) }} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fault Management Modal */}
      {showFaultModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowFaultModal(false)} />
          <div className="relative w-full sm:max-w-lg bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><Wrench className="w-5 h-5 text-amber-400" />Arıza Yönetimi</h2>
              <button onClick={() => setShowFaultModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2">
              {faultReports.length === 0 ? (
                <div className="text-center py-6 text-slate-600"><Wrench className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-xs">Henüz arıza kaydı yok</p></div>
              ) : (
                faultReports.map(fault => (
                  <div key={fault.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex-shrink-0">
                      {fault.status === 'resolved' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : fault.status === 'in_progress' ? <Clock className="w-4 h-4 text-blue-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{fault.roomName}</p>
                      <p className="text-[10px] text-slate-500">{fault.description}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block ${fault.status === 'resolved' ? 'text-emerald-400 bg-emerald-500/10' : fault.status === 'in_progress' ? 'text-blue-400 bg-blue-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                        {fault.status === 'resolved' ? 'Çözüldü' : fault.status === 'in_progress' ? 'İşlemde' : 'Bekliyor'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {fault.status !== 'in_progress' && <button onClick={() => updateFaultStatus(fault.id, 'in_progress')} className="p-1 rounded-lg hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 cursor-pointer" title="İşleme Al"><Eye className="w-3.5 h-3.5" /></button>}
                      {fault.status !== 'resolved' && <button onClick={() => updateFaultStatus(fault.id, 'resolved')} className="p-1 rounded-lg hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 cursor-pointer" title="Çözüldü"><CheckCircle className="w-3.5 h-3.5" /></button>}
                      <button onClick={() => navigateToFaultRoom(fault.roomName)} className="p-1 rounded-lg hover:bg-cyan-500/10 text-slate-500 hover:text-cyan-400 cursor-pointer" title="Haritada Göster"><MapPin className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteFault(fault.id)} className="p-1 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 cursor-pointer" title="Sil"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Management Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowNotifModal(false)} />
          <div className="relative w-full sm:max-w-lg bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><Bell className="w-5 h-5 text-purple-400" />Bildirim Yönetimi</h2>
              <button onClick={() => setShowNotifModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 mb-4 pb-4 border-b border-white/5">
              <p className="text-xs font-medium text-slate-400">Yeni Bildirim Oluştur</p>
              <input type="text" value={notifForm.title} onChange={(e) => setNotifForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Bildirim başlığı" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all" />
              <textarea value={notifForm.message} onChange={(e) => setNotifForm(prev => ({ ...prev, message: e.target.value }))} placeholder="Bildirim mesajı..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all resize-none" />
              <div className="flex gap-2">
                <button onClick={handleQueueNotification} className="flex-1 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-medium hover:bg-white/10 transition-all cursor-pointer">Onay Kuyruğuna Ekle</button>
                <button onClick={handlePublishDirect} className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white text-xs font-medium hover:shadow-lg transition-all cursor-pointer">Doğrudan Yayınla</button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400">Onay Bekleyen Bildirimler</p>
              {pendingNotifications.length === 0 ? (
                <div className="text-center py-4 text-slate-600"><Bell className="w-6 h-6 mx-auto mb-1 opacity-30" /><p className="text-xs">Onay bekleyen bildirim yok</p></div>
              ) : (
                pendingNotifications.map(pending => (
                  <div key={pending.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Bell className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0"><p className="text-sm text-white">{pending.title}</p><p className="text-[10px] text-slate-500">{pending.message}</p></div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => publishNotification(pending.id)} className="p-1 rounded-lg hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 cursor-pointer"><CheckCircle className="w-3.5 h-3.5" /></button>
                      <button onClick={() => rejectPendingNotification(pending.id)} className="p-1 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 cursor-pointer"><XCircle className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
