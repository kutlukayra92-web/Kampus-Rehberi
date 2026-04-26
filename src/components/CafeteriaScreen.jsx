import { useState } from 'react'
import { ArrowLeft, Utensils, Soup, Salad, Cake, Flame } from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']

const TYPE_ICONS = {
  'Ana Yemek': Flame,
  'Çorba': Soup,
  'Salata': Salad,
  'Tatlı': Cake,
}

const TYPE_COLORS = {
  'Ana Yemek': 'text-amber-400 bg-amber-500/10',
  'Çorba': 'text-orange-400 bg-orange-500/10',
  'Salata': 'text-emerald-400 bg-emerald-500/10',
  'Tatlı': 'text-pink-400 bg-pink-500/10',
}

export default function CafeteriaScreen() {
  const { resetRole, cafeteriaMenu } = useCampus()
  const todayIndex = new Date().getDay() - 1
  const [activeDay, setActiveDay] = useState(todayIndex >= 0 && todayIndex < 5 ? DAYS[todayIndex] : DAYS[0])

  const menu = cafeteriaMenu[activeDay] || []

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={resetRole} className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-white">Yemekhane</h1>
          <p className="text-xs text-slate-500">Günlük yemek listesi</p>
        </div>
      </header>

      {/* Day selector */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
        {DAYS.map(day => {
          const isActive = day === activeDay
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
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Total calories */}
        <div className="mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Toplam Kalori</span>
          </div>
          <span className="text-sm font-bold text-white">
            {menu.reduce((acc, item) => acc + parseInt(item.calories), 0)} kcal
          </span>
        </div>

        {/* Menu items */}
        <div className="space-y-2 sm:space-y-3">
          {menu.map((item, i) => {
            const Icon = TYPE_ICONS[item.type] || Utensils
            return (
              <div key={i} className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                <div className={`flex-shrink-0 p-2 rounded-lg ${TYPE_COLORS[item.type] || 'text-slate-400 bg-slate-500/10'}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-500 mb-0.5">{item.type}</p>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{item.calories}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
