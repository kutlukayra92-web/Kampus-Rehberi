import { useState } from 'react'
import { Wrench, AlertTriangle, Zap, Droplets, Monitor, CheckCircle2, MapPin, Clock, X } from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const FAULT_TYPES = [
  { id: 'elektrik', label: 'Elektrik', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'tesisat', label: 'Tesisat', icon: Droplets, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'bilisim', label: 'Bilişim', icon: Monitor, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { id: 'diger', label: 'Diğer', icon: Wrench, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
]

export default function ReportScreen() {
  const { rooms, faultReports, addFaultReport, role } = useCampus()
  const [selectedRoom, setSelectedRoom] = useState('')
  const [faultType, setFaultType] = useState('elektrik')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selectedRoom || !description.trim()) return
    const room = rooms.find(r => r.id === selectedRoom)
    if (!room) return
    addFaultReport({
      roomId: room.id,
      roomName: room.name,
      description: description.trim(),
      category: faultType,
      reportedBy: role,
    })
    setSubmitted(true)
    setSelectedRoom('')
    setFaultType('elektrik')
    setDescription('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  const myFaults = faultReports.filter(f => f.reportedBy === role)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-white/5">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />Arıza Bildirimi
          </h2>
          <p className="text-xs text-slate-500">Oda seçin, arıza türü belirtin ve bildirin</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Arıza Bildirim Formu */}
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />Yeni Arıza Bildirimi
          </h3>

          {/* Oda Seçimi */}
          <div className="mb-3">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
              <MapPin className="w-3 h-3" />Oda Seçimi
            </label>
            <select
              value={selectedRoom}
              onChange={e => setSelectedRoom(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/50 transition-all appearance-none"
            >
              <option value="" className="bg-slate-900">Oda seçin...</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id} className="bg-slate-900">{r.name} ({r.floor}. Kat)</option>
              ))}
            </select>
          </div>

          {/* Arıza Türü */}
          <div className="mb-3">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
              <Wrench className="w-3 h-3" />Arıza Türü
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FAULT_TYPES.map(ft => {
                const Icon = ft.icon
                return (
                  <button
                    key={ft.id}
                    onClick={() => setFaultType(ft.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      faultType === ft.id ? ft.color : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/[0.07]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />{ft.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Açıklama */}
          <div className="mb-3">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
              <AlertTriangle className="w-3 h-3" />Arıza Açıklaması
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Arıza hakkında detaylı açıklama yazın..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500/50 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!selectedRoom || !description.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-40 cursor-pointer"
          >
            <Wrench className="w-4 h-4" /> Arıza Bildirimi Gönder
          </button>

          {submitted && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4" />
              Arıza bildiriminiz alındı. Admin panelinde incelenmektedir.
            </div>
          )}
        </div>

        {/* Benim Arıza Bildirimlerim */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bildirimlerim</h3>
            <span className="text-[10px] px-1.5 py-0.5 bg-white/5 text-slate-500 rounded-full">{myFaults.length}</span>
          </div>

          <div className="space-y-2">
            {myFaults.length === 0 ? (
              <div className="text-center py-6 text-slate-600">
                <Wrench className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Henüz arıza bildiriminiz yok</p>
              </div>
            ) : (
              myFaults.map(fault => {
                const ft = FAULT_TYPES.find(t => t.id === fault.category) || FAULT_TYPES[3]
                const Icon = ft.icon
                return (
                  <div key={fault.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className={`p-1.5 rounded-lg ${ft.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white">{fault.roomName}</h4>
                      <p className="text-[10px] text-slate-500">{fault.description}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block ${
                        fault.status === 'resolved' ? 'text-emerald-400 bg-emerald-500/10' : fault.status === 'in_progress' ? 'text-blue-400 bg-blue-500/10' : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {fault.status === 'resolved' ? 'Çözüldü' : fault.status === 'in_progress' ? 'İşlemde' : 'Bekliyor'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600">
                      {fault.reportedAt ? new Date(fault.reportedAt).toLocaleDateString('tr-TR') : ''}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Tüm Arızalar */}
        {faultReports.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tüm Arızalar</h3>
              <span className="text-[10px] px-1.5 py-0.5 bg-white/5 text-slate-500 rounded-full">{faultReports.length}</span>
            </div>
            <div className="space-y-2">
              {faultReports.slice(0, 5).map(fault => {
                const ft = FAULT_TYPES.find(t => t.id === fault.category) || FAULT_TYPES[3]
                const Icon = ft.icon
                return (
                  <div key={fault.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className={`p-1.5 rounded-lg ${ft.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white">{fault.roomName}</h4>
                      <p className="text-[10px] text-slate-500">{fault.description}</p>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      fault.status === 'resolved' ? 'text-emerald-400 bg-emerald-500/10' : fault.status === 'in_progress' ? 'text-blue-400 bg-blue-500/10' : 'text-amber-400 bg-amber-500/10'
                    }`}>
                      {fault.status === 'resolved' ? 'Çözüldü' : fault.status === 'in_progress' ? 'İşlemde' : 'Bekliyor'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
