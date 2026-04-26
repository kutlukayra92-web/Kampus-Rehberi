import { useState, useMemo, useEffect } from 'react'
import {
  ArrowLeft, Wrench, AlertTriangle, CheckCircle, Clock, MapPin,
  Image, Send, Plus, X, User, Calendar
} from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const CATEGORIES = [
  { id: 'elektrik', name: 'Elektrik Arızası', icon: '⚡', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30' },
  { id: 'su', name: 'Su / Tesisat', icon: '💧', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
  { id: 'isitma', name: 'Isıtma / Soğutma', icon: '🔥', color: 'from-red-500/20 to-orange-500/20 border-red-500/30' },
  { id: 'teknoloji', name: 'Teknoloji / Bilgisayar', icon: '💻', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
  { id: 'mobilya', name: 'Mobilya / Demirbaş', icon: '🪑', color: 'from-stone-500/20 to-neutral-500/20 border-stone-500/30' },
  { id: 'temizlik', name: 'Temizlik / Hijyen', icon: '🧹', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
  { id: 'guvenlik', name: 'Güvenlik', icon: '🔒', color: 'from-slate-500/20 to-gray-500/20 border-slate-500/30' },
  { id: 'diger', name: 'Diğer', icon: '📋', color: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30' },
]

const LOCATIONS = [
  'Lab-101', 'Lab-102', 'Lab-103', 'Lab-104', 'Lab-105', 'Lab-106',
  'D-201', 'D-202', 'D-203', 'D-204', 'D-205', 'D-301',
  'Konferans Salonu', 'Spor Salonu', 'Kantin', 'Kütüphane',
  'Bahçe', 'Koridor 1. Kat', 'Koridor 2. Kat', 'Koridor 3. Kat', 'Otopark',
]

const STATUS_LABELS = {
  pending: { label: 'Beklemede', icon: Clock, color: 'text-amber-400 bg-amber-500/10' },
  in_progress: { label: 'İşlemde', icon: Wrench, color: 'text-blue-400 bg-blue-500/10' },
  resolved: { label: 'Çözüldü', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10' },
}

const INITIAL_REPORTS = [
  {
    id: 1, category: 'teknoloji',
    description: 'Lab-102\'deki 3 numaralı bilgisayar açılmıyor. Güç kablosu kontrol edildi fakat çalışmıyor.',
    location: 'Lab-102', status: 'in_progress', reporter: 'Ahmet Yılmaz', date: '15 Nisan 2026', priority: 'high',
  },
  {
    id: 2, category: 'elektrik',
    description: 'D-203 sınıfındaki floresan lambalardan ikisi yanmıyor. Değiştirilmesi gerekiyor.',
    location: 'D-203', status: 'pending', reporter: 'Elif Kaya', date: '18 Nisan 2026', priority: 'medium',
  },
  {
    id: 3, category: 'su',
    description: 'Spor salonu soyunma odasındaki musluk sürekli damlatıyor.',
    location: 'Spor Salonu', status: 'resolved', reporter: 'Mehmet Demir', date: '10 Nisan 2026', priority: 'low',
  },
  {
    id: 4, category: 'isitma',
    description: 'Lab-105\'te klima yeterince soğutmuyor, yaz için bakım gerekli.',
    location: 'Lab-105', status: 'pending', reporter: 'Zeynep Çelik', date: '20 Nisan 2026', priority: 'high',
  },
]

const PRIORITY_LABELS = {
  high: { label: 'Yüksek', color: 'text-red-400 bg-red-500/10' },
  medium: { label: 'Orta', color: 'text-amber-400 bg-amber-500/10' },
  low: { label: 'Düşük', color: 'text-slate-400 bg-slate-500/10' },
}

export default function MaintenanceScreen() {
  const { role, resetRole, faultReports, addFaultReport } = useCampus()
  const [localReports, setLocalReports] = useState(INITIAL_REPORTS)

  const allReports = useMemo(() => {
    return [...localReports, ...faultReports.map(f => ({
      id: f.id,
      category: f.category || 'diger',
      description: f.description || f.roomName,
      location: f.roomName || 'Bilinmiyor',
      status: f.status === 'reported' ? 'pending' : f.status,
      reporter: f.reporter || 'Öğretmen',
      date: f.reportedAt ? new Date(f.reportedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-',
      priority: f.priority || 'medium',
    }))]
  }, [localReports, faultReports])

  const [reports, setReports] = useState(allReports)
  useEffect(() => { setReports(allReports) }, [allReports])

  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ category: '', location: '', description: '', priority: 'medium' })

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status === filter)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.category || !form.location || !form.description.trim()) return

    const newReport = {
      id: Date.now(), category: form.category, description: form.description.trim(),
      location: form.location, status: 'pending',
      reporter: role === 'ogretmen' ? 'Öğretmen' : 'Öğrenci',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      priority: form.priority,
    }
    setLocalReports(prev => [newReport, ...prev])
    addFaultReport({
      roomName: form.location, description: form.description.trim(),
      category: form.category, priority: form.priority,
      reporter: role === 'ogretmen' ? 'Öğretmen' : 'Öğrenci',
    })
    setForm({ category: '', location: '', description: '', priority: 'medium' })
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={resetRole} className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-white">Arıza Bildirimi</h1>
          <p className="text-xs text-slate-500">Teknik destek ve bakım talepleri</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white text-xs sm:text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer">
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Yeni Bildirim</span>
        </button>
      </header>

      <div className="px-3 sm:px-4 py-3 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: 'Bekleyen', count: reports.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-amber-400' },
          { label: 'İşlemde', count: reports.filter(r => r.status === 'in_progress').length, icon: Wrench, color: 'text-blue-400' },
          { label: 'Çözülen', count: reports.filter(r => r.status === 'resolved').length, icon: CheckCircle, color: 'text-emerald-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/5 rounded-xl p-2.5 sm:p-3 text-center">
            <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color} mx-auto mb-1`} />
            <div className="text-lg sm:text-xl font-bold text-white">{stat.count}</div>
            <div className="text-[10px] sm:text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="px-3 sm:px-4 pb-2 flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {[{ id: 'all', label: 'Tümü' }, { id: 'pending', label: 'Bekleyen' }, { id: 'in_progress', label: 'İşlemde' }, { id: 'resolved', label: 'Çözülen' }].map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${filter === tab.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 py-12">
            <Wrench className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">Henüz bildirim yok</p>
            <p className="text-xs">Yeni bir arıza bildirimi oluşturun</p>
          </div>
        ) : (
          filteredReports.map(report => {
            const category = CATEGORIES.find(c => c.id === report.category)
            const status = STATUS_LABELS[report.status]
            const StatusIcon = status.icon
            const priority = PRIORITY_LABELS[report.priority]
            return (
              <div key={report.id} className={`rounded-xl sm:rounded-2xl bg-gradient-to-r ${category?.color} border backdrop-blur-sm p-3 sm:p-4 transition-all hover:scale-[1.005]`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950/50 text-lg">{category?.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm sm:text-base font-semibold text-white">{category?.name}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priority.color}`}>{priority.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${status.color}`}><StatusIcon className="w-2.5 h-2.5 inline mr-0.5" />{status.label}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2 line-clamp-2">{report.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-slate-500">
                      <div className="flex items-center gap-1"><MapPin className="w-3 h-3 flex-shrink-0" />{report.location}</div>
                      <div className="flex items-center gap-1"><User className="w-3 h-3 flex-shrink-0" />{report.reporter}</div>
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3 flex-shrink-0" />{report.date}</div>
                    </div>
                  </div>
                  <StatusIcon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${status.color.split(' ')[0]}`} />
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="sm:hidden px-3 py-2 bg-slate-900/80 border-t border-white/5">
        <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white text-sm font-medium cursor-pointer">
          <Plus className="w-4 h-4" /> Yeni Arıza Bildirimi
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full sm:max-w-lg bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> Yeni Arıza Bildirimi</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Arıza Kategorisi *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} type="button" onClick={() => setForm(prev => ({ ...prev, category: cat.id }))} className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs border transition-all cursor-pointer ${form.category === cat.id ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
                      <span className="text-sm">{cat.icon}</span><span className="truncate">{cat.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Konum *</label>
                <select value={form.location} onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer">
                  <option value="" className="bg-slate-800">Konum seçin...</option>
                  {LOCATIONS.map(loc => <option key={loc} value={loc} className="bg-slate-800">{loc}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Öncelik</label>
                <div className="flex gap-2">
                  {[{ id: 'low', label: 'Düşük' }, { id: 'medium', label: 'Orta' }, { id: 'high', label: 'Yüksek' }].map(p => (
                    <button key={p.id} type="button" onClick={() => setForm(prev => ({ ...prev, priority: p.id }))} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${form.priority === p.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{p.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Açıklama *</label>
                <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Arıza detaylarını açıklayın..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all resize-none" />
              </div>
              <button type="submit" disabled={!form.category || !form.location || !form.description.trim()} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                <Send className="w-4 h-4" /> Bildirimi Gönder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
