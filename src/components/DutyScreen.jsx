import { ArrowLeft, UserCheck, GraduationCap, Calendar } from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']

export default function DutyScreen() {
  const { resetRole, dutySchedule } = useCampus()
  const todayIndex = new Date().getDay() - 1
  const today = todayIndex >= 0 && todayIndex < 5 ? DAYS[todayIndex] : DAYS[0]

  const todayTeacher = dutySchedule.teachers.find(t => t.day === today)
  const todayStudent = dutySchedule.students.find(s => s.day === today)

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={resetRole} className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-white">Nöbetçi Sistemi</h1>
          <p className="text-xs text-slate-500">Bugün: {today}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
        {/* Bugünkü nöbetçiler */}
        <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-5 text-center">
          <Calendar className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <h2 className="text-sm font-bold text-white mb-3">Bugünkü Nöbetçiler — {today}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <UserCheck className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
              <p className="text-xs text-slate-500">Nöbetçi Öğretmen</p>
              <p className="text-sm font-semibold text-white">{todayTeacher?.name || '-'}</p>
              <p className="text-[10px] text-slate-400">{todayTeacher?.area}</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <GraduationCap className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-xs text-slate-500">Nöbetçi Öğrenci</p>
              <p className="text-sm font-semibold text-white">{todayStudent?.name || '-'}</p>
              <p className="text-[10px] text-slate-400">{todayStudent?.classGroup}</p>
            </div>
          </div>
        </div>

        {/* Haftalık liste */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Haftalık Nöbetçi Listesi</h3>
          <div className="space-y-2">
            {DAYS.map(day => {
              const t = dutySchedule.teachers.find(x => x.day === day)
              const s = dutySchedule.students.find(x => x.day === day)
              const isToday = day === today
              return (
                <div key={day} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isToday ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${isToday ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-500'}`}>
                    {day.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-slate-500">Öğretmen</p>
                      <p className="text-xs text-white">{t?.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Öğrenci</p>
                      <p className="text-xs text-white">{s?.name}</p>
                    </div>
                  </div>
                  {isToday && <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full font-medium">Bugün</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
