import { useState } from 'react'
import {
  Code2,
  Cpu,
  Users,
  CalendarDays,
  UserCircle,
  MapPin,
  Zap,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
} from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const ICON_MAP = {
  Code2, Cpu,
}

export default function ClubsScreen() {
  const { clubs, getRoomById, navigateToRoom } = useCampus()
  const [toastMessage, setToastMessage] = useState(null)

  const handleJoin = (clubName) => {
    setToastMessage(`${clubName} başvurunuz alındı! Danışman öğretmen sizinle iletişime geçecek.`)
    setTimeout(() => setToastMessage(null), 3500)
  }

  return (
    <div className="min-h-full bg-slate-950 flex flex-col relative">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 sm:px-6 sm:pt-4 sm:pb-3">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-400" />
          Kulüpler
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Okul bünyesindeki öğrenci kulüpleri ve toplulukları
        </p>
      </div>

      {/* Club List */}
      <div className="flex-1 px-4 sm:px-6 pb-4 space-y-3 overflow-y-auto">
        {clubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
            <Users className="w-10 h-10 mb-3" />
            <p className="text-sm">Henüz kulüp bulunmuyor</p>
          </div>
        ) : (
          clubs.map((club) => {
            const room = getRoomById(club.roomId)
            const IconComp = ICON_MAP[club.icon] || Users

            return (
              <div
                key={club.id}
                className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-200"
              >
                {/* Club header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-3">
                  <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 shadow-lg shadow-purple-500/10 flex-shrink-0">
                    <IconComp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                      {club.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {club.description}
                    </p>
                  </div>
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <UserCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-slate-600">Danışman</p>
                      <p className="text-[10px] sm:text-xs text-slate-300 font-medium truncate">{club.advisor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-slate-600">Toplantı Günü</p>
                      <p className="text-[10px] sm:text-xs text-slate-300 font-medium truncate">{club.meetingDay}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <Users className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-slate-600">Üye Sayısı</p>
                      <p className="text-[10px] sm:text-xs text-slate-300 font-medium">{club.memberCount} öğrenci</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] text-slate-600">Konum</p>
                      <button
                        onClick={() => navigateToRoom(club.roomId)}
                        className="text-[10px] sm:text-xs text-cyan-400 font-medium hover:text-cyan-300 transition-colors duration-150 truncate cursor-pointer"
                      >
                        {room ? room.name : 'Belirtilmemiş'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Join button */}
                <button
                  onClick={() => handleJoin(club.name)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                    bg-gradient-to-r from-purple-500/10 to-pink-500/10
                    border border-purple-500/20 hover:border-purple-500/30
                    text-purple-400 hover:text-purple-300
                    text-xs sm:text-sm font-medium
                    transition-all duration-200 hover:from-purple-500/20 hover:to-pink-500/20
                    cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  Kulübe Katıl
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-auto z-50
          flex items-center gap-2.5 px-4 py-3 rounded-xl
          bg-green-500/90 backdrop-blur-md border border-green-400/30
          shadow-lg shadow-green-500/20
          animate-[slideUp_0.3s_ease-out]"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-white flex-1">
            {toastMessage}
          </p>
        </div>
      )}
    </div>
  )
}