import { useState } from 'react'
import { useCampus } from './context/CampusContext'
import LandingScreen from './components/LandingScreen'
import ChatBot from './components/ChatBot'
import InteractiveMap from './components/InteractiveMap'
import EventsScreen from './components/EventsScreen'
import ClubsScreen from './components/ClubsScreen'
import ChatScreen from './components/ChatScreen'
import NotificationsScreen from './components/NotificationsScreen'
import ScheduleScreen from './components/ScheduleScreen'
import ReportScreen from './components/ReportScreen'
import AdminScreen from './components/AdminScreen'
import SchoolInfoScreen from './components/SchoolInfoScreen'
import DutyScreen from './components/DutyScreen'
import CafeteriaScreen from './components/CafeteriaScreen'
import {
  MapPin,
  CalendarDays,
  Users,
  MessageCircle,
  Bell,
  BookOpen,
  AlertTriangle,
  School,
  LogOut,
  Sparkles,
  ChevronDown,
  UserCheck,
  Utensils,
  Siren,
} from 'lucide-react'

const STUDENT_TABS = [
  { key: 'map', label: 'Harita', icon: MapPin },
  { key: 'events', label: 'Etkinlikler', icon: CalendarDays },
  { key: 'chat', label: 'Sohbet', icon: MessageCircle },
  { key: 'schedule', label: 'Program', icon: BookOpen },
  { key: 'more', label: 'Daha Fazla', icon: ChevronDown },
]

const TEACHER_TABS = [
  { key: 'map', label: 'Harita', icon: MapPin },
  { key: 'events', label: 'Etkinlikler', icon: CalendarDays },
  { key: 'chat', label: 'Sohbet', icon: MessageCircle },
  { key: 'report', label: 'Arıza Bildirimi', icon: AlertTriangle },
  { key: 'more', label: 'Daha Fazla', icon: ChevronDown },
]

const VISITOR_TABS = [
  { key: 'map', label: 'Harita', icon: MapPin },
  { key: 'events', label: 'Etkinlikler', icon: CalendarDays },
  { key: 'more', label: 'Daha Fazla', icon: ChevronDown },
]

const MORE_ITEMS = [
  { key: 'schoolinfo', label: 'Okul Hakkında', icon: School, roles: ['student', 'teacher', 'visitor'] },
  { key: 'clubs', label: 'Kulüpler', icon: Users, roles: ['student', 'teacher', 'visitor'] },
  { key: 'duty', label: 'Nöbetçi Listesi', icon: UserCheck, roles: ['student', 'teacher', 'visitor'] },
  { key: 'cafeteria', label: 'Yemekhane', icon: Utensils, roles: ['student', 'teacher', 'visitor'] },
  { key: 'schedule', label: 'Ders Programı', icon: BookOpen, roles: ['teacher', 'visitor'] },
  { key: 'report', label: 'Arıza Takip', icon: AlertTriangle, roles: ['student', 'visitor'] },
  { key: 'notifications', label: 'Bildirimler', icon: Bell, roles: ['student', 'teacher', 'visitor'] },
]

function App() {
  const { role, activeTab, setActiveTab, unreadNotificationCount, resetRole, emergencyMode } = useCampus()
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  if (!role) return <LandingScreen />

  // Admin rolü için özel yönetim panelini göster
  if (role === 'admin') return <AdminScreen />

  const getTabsForRole = () => {
    switch (role) {
      case 'ogrenci': return STUDENT_TABS
      case 'ogretmen': return TEACHER_TABS
      case 'ziyaretci': return VISITOR_TABS
      default: return STUDENT_TABS
    }
  }

  const getRoleLabel = () => {
    switch (role) {
      case 'ogrenci': return 'Öğrenci'
      case 'ogretmen': return 'Öğretmen'
      case 'ziyaretci': return 'Ziyaretçi'
      case 'admin': return 'İdare'
      default: return ''
    }
  }

  const getRoleColor = () => {
    switch (role) {
      case 'ogrenci': return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
      case 'ogretmen': return 'bg-purple-500/10 border-purple-500/20 text-purple-400'
      case 'ziyaretci': return 'bg-amber-500/10 border-amber-500/20 text-amber-400'
      case 'admin': return 'bg-amber-500/10 border-amber-500/20 text-amber-400'
      default: return ''
    }
  }

  const tabs = getTabsForRole()

  const handleTabClick = (tabKey) => {
    if (tabKey === 'more') {
      setShowMoreMenu(!showMoreMenu)
    } else {
      setActiveTab(tabKey)
      setShowMoreMenu(false)
    }
  }

  const handleMoreItemClick = (itemKey) => {
    setActiveTab(itemKey)
    setShowMoreMenu(false)
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'map': return <InteractiveMap />
      case 'events': return <EventsScreen />
      case 'clubs': return <ClubsScreen />
      case 'chat': return <ChatScreen />
      case 'schedule': return <ScheduleScreen />
      case 'report': return <ReportScreen />
      case 'notifications': return <NotificationsScreen />
      case 'schoolinfo': return <SchoolInfoScreen />
      case 'duty': return <DutyScreen />
      case 'cafeteria': return <CafeteriaScreen />
      default: return <InteractiveMap />
    }
  }

  const filteredMoreItems = MORE_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col">
      {/* Top Bar */}
      <header className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-white/5 bg-slate-950/90 backdrop-blur-xl z-30">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Kampüs Rehberi
          </h1>
          <p className="text-[10px] text-slate-500">Teknik Lise • Akıllı Kampüs Sistemi</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${getRoleColor()}`}>
            {getRoleLabel()}
          </span>
          <button
            onClick={resetRole}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all duration-200"
            title="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Emergency Banner */}
      {emergencyMode && (
        <div className="flex-shrink-0 px-3 py-2 bg-red-500/10 border-y border-red-500/20 flex items-center gap-2 animate-pulse z-30">
          <Siren className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-xs font-bold text-red-400">ACİL DURUM — Lütfen en yakın tahliye yolunu kullanın!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderTab()}
      </div>

      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="absolute bottom-20 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-80
              bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-3 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
              Diğer Bölümler
            </p>
            {filteredMoreItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => handleMoreItemClick(item.key)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    bg-white/[0.02] border border-white/5
                    hover:bg-white/[0.05] hover:border-white/10
                    text-slate-300 hover:text-white
                    transition-all duration-200 text-left"
                >
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 border-t border-white/5 bg-slate-950/90 backdrop-blur-xl
        flex items-center justify-around
        px-1 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]
        safe-bottom z-30"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.key === 'more' ? showMoreMenu : activeTab === tab.key
          const showBadge = tab.key === 'more' && unreadNotificationCount > 0

          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`
                flex flex-col items-center justify-center gap-0.5
                py-1.5 px-3 rounded-xl min-w-[60px]
                transition-all duration-200 cursor-pointer
                relative
                ${isActive
                  ? 'text-cyan-400'
                  : 'text-slate-600 hover:text-slate-400'
                }
              `}
            >
              {isActive && tab.key !== 'more' && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-500/30" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-slate-950 flex items-center justify-center">
                    <span className="text-[7px] font-bold text-white">{unreadNotificationCount}</span>
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium leading-tight">
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* ChatBot FAB */}
      <ChatBot />

      {/* Safe area spacer */}
      <style>{`
        .safe-bottom {
          padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
        }
      `}</style>
    </div>
  )
}

export default App