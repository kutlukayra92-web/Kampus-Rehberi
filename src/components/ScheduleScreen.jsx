import { useState } from 'react'
import { ArrowLeft, Clock, MapPin, User, BookOpen, Calendar, ChevronLeft, ChevronRight, Bell } from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']

const SCHEDULE = {
  'Pazartesi': [
    { id: 1, subject: 'Robotik Kodlama', time: '08:30 - 09:20', room: 'Lab-101', teacher: 'Ali Öztürk', type: 'lab', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30', icon: 'cyan' },
    { id: 2, subject: 'Matematik', time: '09:30 - 10:20', room: 'D-201', teacher: 'Fatma Şahin', type: 'lecture', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30', icon: 'purple' },
    { id: 3, subject: 'Elektronik Devreler', time: '10:30 - 11:20', room: 'Lab-102', teacher: 'Mehmet Kaya', type: 'lab', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30', icon: 'amber' },
    { id: 4, subject: 'Fizik', time: '11:30 - 12:20', room: 'D-301', teacher: 'Zeynep Çelik', type: 'lecture', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30', icon: 'emerald' },
    { id: 5, subject: 'Proje Geliştirme', time: '13:30 - 15:20', room: 'Lab-103', teacher: 'Ali Öztürk', type: 'project', color: 'from-rose-500/20 to-red-500/20 border-rose-500/30', icon: 'rose' },
  ],
  'Salı': [
    { id: 6, subject: 'Yapay Zeka', time: '08:30 - 09:20', room: 'Lab-101', teacher: 'Ali Öztürk', type: 'lab', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30', icon: 'cyan' },
    { id: 7, subject: 'Türk Dili', time: '09:30 - 10:20', room: 'D-202', teacher: 'Ayşe Demir', type: 'lecture', color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30', icon: 'indigo' },
    { id: 8, subject: '3D Modelleme', time: '10:30 - 11:20', room: 'Lab-104', teacher: 'Can Yıldız', type: 'lab', color: 'from-orange-500/20 to-red-500/20 border-orange-500/30', icon: 'orange' },
    { id: 9, subject: 'İngilizce', time: '11:30 - 12:20', room: 'D-203', teacher: 'Sarah Johnson', type: 'lecture', color: 'from-sky-500/20 to-blue-500/20 border-sky-500/30', icon: 'sky' },
    { id: 10, subject: 'Spor / Beden Eğitimi', time: '13:30 - 14:20', room: 'Spor Salonu', teacher: 'Murat Aydın', type: 'sport', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30', icon: 'green' },
  ],
  'Çarşamba': [
    { id: 11, subject: 'Nesnelerin İnterneti', time: '08:30 - 09:20', room: 'Lab-101', teacher: 'Ali Öztürk', type: 'lab', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30', icon: 'cyan' },
    { id: 12, subject: 'Matematik', time: '09:30 - 10:20', room: 'D-201', teacher: 'Fatma Şahin', type: 'lecture', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30', icon: 'purple' },
    { id: 13, subject: 'PLC Programlama', time: '10:30 - 12:20', room: 'Lab-105', teacher: 'Mehmet Kaya', type: 'lab', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30', icon: 'amber' },
    { id: 14, subject: 'Tarih', time: '13:30 - 14:20', room: 'D-204', teacher: 'Hüseyin Yılmaz', type: 'lecture', color: 'from-stone-500/20 to-neutral-500/20 border-stone-500/30', icon: 'stone' },
  ],
  'Perşembe': [
    { id: 15, subject: 'Siber Güvenlik', time: '08:30 - 09:20', room: 'Lab-102', teacher: 'Emre Şahin', type: 'lab', color: 'from-red-500/20 to-rose-500/20 border-red-500/30', icon: 'red' },
    { id: 16, subject: 'Fizik', time: '09:30 - 10:20', room: 'D-301', teacher: 'Zeynep Çelik', type: 'lecture', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30', icon: 'emerald' },
    { id: 17, subject: 'Mobil Uygulama', time: '10:30 - 12:20', room: 'Lab-103', teacher: 'Can Yıldız', type: 'project', color: 'from-violet-500/20 to-purple-500/20 border-violet-500/30', icon: 'violet' },
    { id: 18, subject: 'Rehberlik', time: '13:30 - 14:20', room: 'D-205', teacher: 'Pınar Aksu', type: 'lecture', color: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30', icon: 'teal' },
  ],
  'Cuma': [
    { id: 19, subject: 'Drone Teknolojisi', time: '08:30 - 10:20', room: 'Lab-106', teacher: 'Ali Öztürk', type: 'project', color: 'from-sky-500/20 to-indigo-500/20 border-sky-500/30', icon: 'sky' },
    { id: 20, subject: 'İngilizce', time: '10:30 - 11:20', room: 'D-203', teacher: 'Sarah Johnson', type: 'lecture', color: 'from-sky-500/20 to-blue-500/20 border-sky-500/30', icon: 'sky' },
    { id: 21, subject: 'Kulüp Saati', time: '11:30 - 12:20', room: 'Konferans', teacher: 'Tüm Öğretmenler', type: 'club', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30', icon: 'pink' },
  ],
}

const TYPE_LABELS = {
  lab: { label: 'Laboratuvar', icon: '🧪' },
  lecture: { label: 'Ders', icon: '📚' },
  project: { label: 'Proje', icon: '🔧' },
  sport: { label: 'Spor', icon: '⚽' },
  club: { label: 'Kulüp', icon: '🎯' },
}

const ICON_COLORS = {
  cyan: 'text-cyan-400',
  purple: 'text-purple-400',
  amber: 'text-amber-400',
  emerald: 'text-emerald-400',
  rose: 'text-rose-400',
  indigo: 'text-indigo-400',
  orange: 'text-orange-400',
  sky: 'text-sky-400',
  green: 'text-green-400',
  stone: 'text-stone-400',
  red: 'text-red-400',
  violet: 'text-violet-400',
  teal: 'text-teal-400',
  pink: 'text-pink-400',
}

export default function ScheduleScreen() {
  const { role, resetRole, notifications, unreadNotificationCount, markAllNotificationsRead } = useCampus()
  const [showNotifPopover, setShowNotifPopover] = useState(false)
  const todayIndex = new Date().getDay() - 1
  const [activeDay, setActiveDay] = useState(todayIndex >= 0 && todayIndex < 5 ? DAYS[todayIndex] : DAYS[0])

  const lessons = SCHEDULE[activeDay] || []

  const goToPrevDay = () => {
    const idx = DAYS.indexOf(activeDay)
    setActiveDay(DAYS[(idx - 1 + DAYS.length) % DAYS.length])
  }

  const goToNextDay = () => {
    const idx = DAYS.indexOf(activeDay)
    setActiveDay(DAYS[(idx + 1) % DAYS.length])
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <button
          onClick={resetRole}
          className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-white">Ders Programı</h1>
          <p className="text-xs text-slate-500">2024-2025 • 2. Dönem</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifPopover(!showNotifPopover)}
            className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer relative"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full border-2 border-slate-900" />
            )}
          </button>

          {/* Notification Popover */}
          {showNotifPopover && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifPopover(false)} />
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-40 overflow-hidden">
                <div className="px-3 py-2.5 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Bildirimler</span>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={() => { markAllNotificationsRead(); setShowNotifPopover(false) }}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      Tümünü okundu işaretle
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {notifications.length === 0 ? (
                    <div className="px-3 py-4 text-center">
                      <Bell className="w-6 h-6 text-slate-700 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Henüz bildirim yok</p>
                    </div>
                  ) : (
                    notifications.slice(0, 6).map(notif => (
                      <div
                        key={notif.id}
                        className={`px-3 py-2 border-b border-white/5 last:border-0 ${notif.read ? 'opacity-50' : ''}`}
                      >
                        <p className="text-xs font-medium text-white">{notif.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                        {notif.timestamp && (
                          <p className="text-[9px] text-slate-600 mt-0.5">
                            {new Date(notif.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Day selector */}
      <div className="bg-slate-900/50 border-b border-white/5 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={goToPrevDay}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex gap-1 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
            {DAYS.map(day => {
              const isActive = day === activeDay
              const isToday = day === DAYS[todayIndex]

              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {day}
                  {isToday && !isActive && (
                    <span className="block text-[10px] text-cyan-400">Bugün</span>
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={goToNextDay}
            className="p-1 sm:p-1.5 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Schedule content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Day header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">{activeDay}</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {lessons.length} ders • Toplam {lessons.reduce((acc, l) => {
                const [start, end] = l.time.split(' - ')
                const [sh, sm] = start.split(':').map(Number)
                const [eh, em] = end.split(':').map(Number)
                return acc + ((eh * 60 + em) - (sh * 60 + sm))
              }, 0)} dakika
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-slate-400">2. Dönem</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3 sm:space-y-4">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="relative">
              {/* Timeline connector */}
              {index < lessons.length - 1 && (
                <div className="absolute left-[19px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-slate-700 to-transparent" />
              )}

              <div className={`relative rounded-xl sm:rounded-2xl bg-gradient-to-r ${lesson.color} border backdrop-blur-sm p-3 sm:p-4 transition-all hover:scale-[1.01]`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Time badge */}
                  <div className="flex-shrink-0 min-w-[56px] sm:min-w-[64px] flex flex-col items-center bg-slate-950/50 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2">
                    <Clock className={`w-3.5 h-3.5 ${ICON_COLORS[lesson.icon]} mb-0.5`} />
                    <span className="text-[10px] sm:text-xs font-medium text-white leading-tight text-center">
                      {lesson.time.split(' - ')[0]}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-500 leading-tight text-center">
                      {lesson.time.split(' - ')[1]}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm sm:text-base font-semibold text-white">{lesson.subject}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded-full text-white/70 flex-shrink-0">
                        {TYPE_LABELS[lesson.type]?.icon} {TYPE_LABELS[lesson.type]?.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{lesson.room}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{lesson.teacher}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subject icon */}
                  <div className={`hidden sm:flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-xl bg-white/5`}>
                    <BookOpen className={`w-5 h-5 ${ICON_COLORS[lesson.icon]}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile bottom indicator */}
      <div className="sm:hidden px-3 py-2 bg-slate-900/80 border-t border-white/5">
        <div className="flex items-center justify-center gap-1 text-xs text-slate-600">
          <ChevronLeft className="w-3 h-3" />
          Günler arası kaydırarak gezin
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  )
}