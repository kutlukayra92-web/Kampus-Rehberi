import { useMemo } from 'react'
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Trophy,
  Lightbulb,
  Megaphone,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const CATEGORY_CONFIG = {
  yarisma: { icon: Trophy, bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Yarışma' },
  seminer: { icon: Megaphone, bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Seminer' },
  workshop: { icon: Lightbulb, bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Workshop' },
}

export default function EventsScreen() {
  const { events, role, getRoomById, navigateToRoom } = useCampus()

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA - dateB
    })
  }, [events])

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-full bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 sm:px-6 sm:pt-4 sm:pb-3">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Etkinlikler
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Yaklaşan tüm kampüs etkinlikleri — tarih sırasıyla
        </p>
      </div>

      {/* Event List */}
      <div className="flex-1 px-4 sm:px-6 pb-4 space-y-3 overflow-y-auto">
        {sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
            <CalendarDays className="w-10 h-10 mb-3" />
            <p className="text-sm">Henüz planlanmış etkinlik bulunmuyor</p>
          </div>
        ) : (
          sortedEvents.map((event) => {
            const room = getRoomById(event.roomId)
            const cat = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.seminer
            const CatIcon = cat.icon

            return (
              <div
                key={event.id}
                className="group p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-200"
              >
                {/* Category badge + date */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium ${cat.bg} ${cat.text} border ${cat.border}`}>
                    <CatIcon className="w-3 h-3" />
                    {cat.label}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {formatDate(event.date)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3 line-clamp-2">
                  {event.description}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap mb-3">
                  <span className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.orginazer}
                  </span>
                </div>

                {/* "Konumu Gör" button */}
                <button
                  onClick={() => navigateToRoom(event.roomId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Konumu Gör
                  <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}