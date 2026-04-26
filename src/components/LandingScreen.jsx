import { useState, useEffect } from 'react'
import { MapPin, Sparkles, ChevronRight, Shield, CalendarCheck } from 'lucide-react'
import { useCampus } from '../context/CampusContext'
import AppointmentForm from './AppointmentForm'

const roles = [
  {
    id: 'ogrenci',
    title: 'Öğrenci',
    subtitle: 'Keşfet, öğren',
    description: 'Kampüs haritasını görüntüle, etkinlikleri takip et, sohbet et ve ders programını gör.',
    gradient: 'from-cyan-500 to-blue-600',
    bgGradient: 'from-cyan-500/5 to-blue-600/5',
    border: 'border-cyan-500/30 hover:border-cyan-400/60',
    shadow: 'shadow-cyan-500/20',
    icon: MapPin,
  },
  {
    id: 'ogretmen',
    title: 'Öğretmen',
    subtitle: 'Yönet, planla',
    description: 'Etkinlik oluştur, arıza bildirimi yap, sohbet kanallarını yönet ve haritayı düzenle.',
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-500/5 to-pink-600/5',
    border: 'border-purple-500/30 hover:border-purple-400/60',
    shadow: 'shadow-purple-500/20',
    icon: Sparkles,
  },
  {
    id: 'ziyaretci',
    title: 'Ziyaretçi',
    subtitle: 'Gez, tanı',
    description: 'Okulumuzu yakından tanıyın, kampüs haritasını inceleyin ve etkinlikleri görüntüleyin.',
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-500/5 to-teal-600/5',
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    shadow: 'shadow-emerald-500/20',
    icon: ChevronRight,
  },
  {
    id: 'admin',
    title: 'İdare',
    subtitle: 'Yönet, denetle',
    description: 'Kampüs yönetim paneli: etkinlik onayları, arıza takibi, harita düzenleme ve sistem ayarları.',
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-500/5 to-orange-600/5',
    border: 'border-amber-500/30 hover:border-amber-400/60',
    shadow: 'shadow-amber-500/20',
    icon: Shield,
  },
]

function RoleCard({ role, isSelected, onSelect }) {
  const Icon = role.icon

  return (
    <button
      onClick={() => onSelect(role.id)}
      className={`
        group relative w-full text-left transition-all duration-500 cursor-pointer
        p-4 sm:p-5 rounded-xl sm:rounded-2xl
        bg-white/[0.03] backdrop-blur-xl border
        ${role.border}
        ${isSelected ? `ring-2 ring-offset-2 ring-offset-slate-950 ${role.border.replace('border-', 'ring-').replace('/30', '/60').replace('hover:border-', '')} scale-[1.02]` : 'hover:scale-[1.01]'}
        ${role.shadow}
      `}
    >
      {/* Arka plan gradient efekti */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative flex items-start gap-3 sm:gap-4">
        {/* İkon alanı */}
        <div className={`
          flex-shrink-0 flex items-center justify-center rounded-xl
          bg-gradient-to-br ${role.gradient} p-2.5 sm:p-3 shadow-lg ${role.shadow}
          transition-transform duration-300 group-hover:scale-110
        `}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        {/* Metin alanı */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {role.title}
            </h3>
            <span className={`text-xs font-medium bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent`}>
              {role.subtitle}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
            {role.description}
          </p>
        </div>

        {/* Ok ikonu */}
        <div className={`
          flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full
          bg-white/5 border border-white/10
          transition-all duration-300
          group-hover:bg-white/10 group-hover:border-white/20
          ${isSelected ? 'bg-white/15 border-white/25' : ''}
        `}>
          <ChevronRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/40 animate-pulse" />
      )}
    </button>
  )
}

export default function LandingScreen() {
  const { selectRole } = useCampus()
  const [selectedRole, setSelectedRole] = useState(null)
  const [showAppt, setShowAppt] = useState(false)

  const handleSelect = (roleId) => {
    setSelectedRole(roleId)
  }

  const handleContinue = () => {
    if (selectedRole) {
      selectRole(selectedRole)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgb(148 163 184) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse" />

      <div className="relative w-full max-w-lg mx-auto">
        {/* Logo / Header */}
        <div className="text-center mb-8 sm:mb-10">
          {/* İkon halkası */}
          <div className="inline-flex items-center justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-40 animate-pulse" />
              <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10">
                <MapPin className="w-7 h-7 sm:w-9 sm:h-9 text-cyan-400" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
            Kampüs{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Rehberi</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xs mx-auto leading-relaxed">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block mr-1 text-cyan-400" />
            Etkinlik Haritası ile kampüsü keşfedin
          </p>
        </div>

        {/* Role selection */}
        <div className="space-y-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Rolünüzü Seçin
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
          </div>

          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selectedRole === role.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Randevu Al butonu */}
        <button
          onClick={() => setShowAppt(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/20 hover:text-cyan-300 transition-all cursor-pointer mb-3"
        >
          <CalendarCheck className="w-4 h-4" />Randevu Al
        </button>

        {/* Continue button */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`
              group relative w-full py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base
              transition-all duration-300 cursor-pointer
              ${selectedRole
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98]'
                : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              {selectedRole ? 'Keşfetmeye Başla' : 'Devam etmek için rol seçin'}
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${selectedRole ? 'group-hover:translate-x-1' : ''}`} />
            </span>
          </button>

          {!selectedRole && (
            <p className="text-center text-xs text-slate-600">
              Yukarıdan size uygun rolü seçerek devam edebilirsiniz
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-xs text-slate-700">
            Teknik Lise Kampüs Rehberi • v1.0
          </p>
        </div>
      </div>

      {showAppt && <AppointmentForm onClose={() => setShowAppt(false)} />}
    </div>
  )
}
