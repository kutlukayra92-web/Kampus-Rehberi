import { useState } from 'react'
import { Trophy, Award, Star, Crown, X, Medal } from 'lucide-react'

const ACHIEVEMENTS = [
  { id: 1, title: 'Robotik Yarışması 1.liği', year: '2025', category: 'trophy', description: 'Türkiye Robotik Yarışması\'nda 45 takım arasından 1. olarak büyük ödülü kazandık. Takım kaptanı Ahmet Yılmaz ve ekibi, otonom robot projesiyle jüriyi büyüledi.', icon: Trophy, gradient: 'from-amber-500/20 to-yellow-600/20', border: 'border-amber-500/30', text: 'text-amber-400' },
  { id: 2, title: 'TÜBİTAK 4006 Bilim Fuarı', year: '2025', category: 'award', description: 'Öğrencilerimizin geliştirdiği Akıllı Sulama Sistemi projesi ile TÜBİTAK 4006 Bilim Fuarı\'nda birincilik elde etti.', icon: Award, gradient: 'from-cyan-500/20 to-blue-600/20', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  { id: 3, title: 'Siber Güvenlik CTF 2.liği', year: '2024', category: 'medal', description: 'Üniversitelerarası Siber Güvenlik Capture The Flag yarışmasında 2. olduk. Öğrencilerimiz penetrasyon testi ve kriptografi alanlarında üstün başarı gösterdi.', icon: Medal, gradient: 'from-slate-400/20 to-slate-600/20', border: 'border-slate-400/30', text: 'text-slate-300' },
  { id: 4, title: 'Haftanın Öğrencisi', year: '2025', category: 'star', description: 'Elif Kaya (9-A) matematik olimpiyatlarında gösterdiği üstün başarı ve arkadaşlarına yardımseverliği ile bu haftanın öğrencisi seçildi.', icon: Star, gradient: 'from-purple-500/20 to-pink-600/20', border: 'border-purple-500/30', text: 'text-purple-400' },
  { id: 5, title: 'VEX Robotics Excellence', year: '2024', category: 'crown', description: 'VEX Robotics World Championship\'te Excellence Award kazanan tek Türk okulu olduk. 40 ülkeden 500 takımın katıldığı yarışmada finale kaldık.', icon: Crown, gradient: 'from-emerald-500/20 to-teal-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  { id: 6, title: 'Bilişim Olimpiyatı 3.lük', year: '2025', category: 'medal', description: 'Ulusal Bilişim Olimpiyatı\'nda algoritma ve veri yapıları kategorisinde 3. olduk. Mezunlarımız arasında Google ve Microsoft\'ta çalışan mühendisler var.', icon: Medal, gradient: 'from-orange-500/20 to-red-600/20', border: 'border-orange-500/30', text: 'text-orange-400' },
]

export default function HallOfFame() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-amber-400" />
        <h2 className="text-sm font-bold text-white">Onur Köşesi</h2>
        <span className="text-[10px] text-slate-500">Başarı Vitrini</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACHIEVEMENTS.map(a => {
          const Icon = a.icon
          return (
            <button key={a.id} onClick={() => setSelected(a)}
              className={`relative group p-4 rounded-xl border ${a.border} bg-gradient-to-br ${a.gradient} text-left transition-all hover:scale-[1.02] cursor-pointer`}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5">
                  <Icon className={`w-5 h-5 ${a.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{a.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{a.year}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full sm:max-w-md bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-white/10 p-5 max-h-[80vh] overflow-y-auto">
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${selected.gradient} border ${selected.border}`}>
                <selected.icon className={`w-6 h-6 ${selected.text}`} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selected.title}</h3>
                <p className="text-xs text-slate-500">{selected.year}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
