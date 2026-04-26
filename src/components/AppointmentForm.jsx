import { useState } from 'react'
import { X, Calendar, Clock, User, MessageSquare, CheckCircle2 } from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const PERSON_OPTIONS = [
  'Müdür',
  'Müdür Yardımcısı',
  'Rehberlik Servisi',
  'Bölüm Şefi',
  'Öğretmen',
]

export default function AppointmentForm({ onClose }) {
  const { addAppointment } = useCampus()
  const [form, setForm] = useState({
    visitorName: '',
    person: 'Müdür',
    date: '',
    time: '',
    reason: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!form.visitorName.trim() || !form.date || !form.time || !form.reason.trim()) return
    addAppointment({ ...form })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-white/10 p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />Randevu Talebi
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Talebiniz Alındı!</h3>
            <p className="text-sm text-slate-400">Randevu onay durumunuz bildirimler kısmında görüntülenecektir.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
                <User className="w-3 h-3" />Adınız Soyadınız
              </label>
              <input
                type="text"
                value={form.visitorName}
                onChange={e => handleChange('visitorName', e.target.value)}
                placeholder="Ziyaretçi adı"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
                <User className="w-3 h-3" />Görüşülecek Kişi
              </label>
              <select
                value={form.person}
                onChange={e => handleChange('person', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-all appearance-none"
              >
                {PERSON_OPTIONS.map(p => (
                  <option key={p} value={p} className="bg-slate-900">{p}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
                  <Calendar className="w-3 h-3" />Tarih
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => handleChange('date', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
                  <Clock className="w-3 h-3" />Saat
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => handleChange('time', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
                <MessageSquare className="w-3 h-3" />Görüşme Nedeni
              </label>
              <textarea
                value={form.reason}
                onChange={e => handleChange('reason', e.target.value)}
                placeholder="Görüşme konusunu kısaca açıklayın..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!form.visitorName.trim() || !form.date || !form.time || !form.reason.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg transition-all disabled:opacity-40 cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> Randevu Talebi Gönder
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
