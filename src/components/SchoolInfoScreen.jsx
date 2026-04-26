import { useState } from 'react'
import {
  ArrowLeft, MapPin, Phone, Mail, Users, Calendar, Award,
  Target, Eye, MessageSquareQuote, Edit3, X, CheckCircle
} from 'lucide-react'
import { useCampus } from '../context/CampusContext'
import HallOfFame from './HallOfFame'

export default function SchoolInfoScreen() {
  const { role, resetRole, schoolInfo, updateSchoolInfo } = useCampus()
  const isAdmin = role === 'admin'
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ ...schoolInfo })

  const handleSave = () => {
    updateSchoolInfo(editForm)
    setShowEditModal(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={resetRole} className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-white">Okul Hakkında</h1>
          <p className="text-xs text-slate-500">{schoolInfo.name}</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setEditForm({ ...schoolInfo }); setShowEditModal(true) }} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white text-xs font-medium hover:shadow-lg transition-all cursor-pointer">
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Düzenle</span>
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Hero */}
        <div className="relative rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5 sm:p-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-3 shadow-lg shadow-cyan-500/20">
            <Award className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">{schoolInfo.name}</h2>
          <p className="text-sm text-cyan-400 font-medium">{schoolInfo.motto}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-[10px] sm:text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Kuruluş: {schoolInfo.founded}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />Kapasite: {schoolInfo.capacity}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />Kadro: {schoolInfo.staffCount}</span>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10"><Eye className="w-4 h-4 text-cyan-400" /></div>
              <h3 className="text-sm font-semibold text-white">Vizyonumuz</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{schoolInfo.vision}</p>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10"><Target className="w-4 h-4 text-purple-400" /></div>
              <h3 className="text-sm font-semibold text-white">Misyonumuz</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{schoolInfo.mission}</p>
          </div>
        </div>

        {/* Principal Message */}
        <div className="rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/10 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-amber-500/10"><MessageSquareQuote className="w-4 h-4 text-amber-400" /></div>
            <h3 className="text-sm font-semibold text-white">Müdürümüzün Mesajı</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">"{schoolInfo.principalMessage}"</p>
        </div>

        {/* Contact */}
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-white mb-3">İletişim Bilgileri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02]">
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-xs text-slate-400">{schoolInfo.address}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02]">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-slate-400">{schoolInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.02]">
              <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-xs text-slate-400">{schoolInfo.email}</span>
            </div>
          </div>
        </div>

        <HallOfFame />
      </div>

      {/* Edit Modal (Admin only) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full sm:max-w-lg bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><Edit3 className="w-5 h-5 text-cyan-400" />Okul Bilgilerini Düzenle</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'name', label: 'Okul Adı', type: 'text' },
                { key: 'motto', label: 'Slogan', type: 'text' },
                { key: 'vision', label: 'Vizyon', type: 'textarea' },
                { key: 'mission', label: 'Misyon', type: 'textarea' },
                { key: 'principalMessage', label: 'Müdür Mesajı', type: 'textarea' },
                { key: 'address', label: 'Adres', type: 'text' },
                { key: 'phone', label: 'Telefon', type: 'text' },
                { key: 'email', label: 'E-posta', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-slate-400 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={editForm[field.key]}
                      onChange={(e) => setEditForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={editForm[field.key]}
                      onChange={(e) => setEditForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
                    />
                  )}
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'founded', label: 'Kuruluş' },
                  { key: 'capacity', label: 'Kapasite' },
                  { key: 'staffCount', label: 'Kadro' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-400 mb-1">{field.label}</label>
                    <input
                      type="number"
                      value={editForm[field.key]}
                      onChange={(e) => setEditForm(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg transition-all cursor-pointer">
                <CheckCircle className="w-4 h-4" /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
