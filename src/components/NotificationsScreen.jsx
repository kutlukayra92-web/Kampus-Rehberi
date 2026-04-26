import { useState } from 'react'
import { Bell, CheckCircle, AlertTriangle, Calendar, MessageSquare, Wrench } from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const TYPE_CONFIG = {
  event: { icon: Calendar, color: 'text-cyan-400 bg-cyan-500/10', label: 'Etkinlik' },
  chat: { icon: MessageSquare, color: 'text-purple-400 bg-purple-500/10', label: 'Sohbet' },
  fault: { icon: Wrench, color: 'text-amber-400 bg-amber-500/10', label: 'Arıza' },
}

export default function NotificationsScreen() {
  const { notifications, unreadNotificationCount, markAllNotificationsRead } = useCampus()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === filter)

  if (notifications.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Bell className="w-12 h-12 text-slate-700 mb-4" />
        <h2 className="text-lg font-semibold text-slate-400 mb-1">Bildirim Yok</h2>
        <p className="text-xs text-slate-600">Henüz bir bildirim almadınız</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-white/5">
        <div>
          <h2 className="text-base font-semibold text-white">Bildirimler</h2>
          {unreadNotificationCount > 0 && (
            <p className="text-xs text-cyan-400">{unreadNotificationCount} okunmamış</p>
          )}
        </div>
        {unreadNotificationCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Tümünü Okundu İşaretle
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex-shrink-0 px-4 py-2 flex items-center gap-2 border-b border-white/5 overflow-x-auto">
        {[
          { key: 'all', label: 'Tümü' },
          { key: 'unread', label: 'Okunmamış' },
          { key: 'event', label: 'Etkinlikler' },
          { key: 'chat', label: 'Sohbet' },
          { key: 'fault', label: 'Arızalar' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              filter === f.key
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-slate-500 hover:text-slate-300 border border-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.map((notif) => {
          const config = TYPE_CONFIG[notif.type] || { icon: Bell, color: 'text-slate-400 bg-slate-500/10', label: 'Genel' }
          const Icon = config.icon

          return (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                notif.read ? 'bg-white/[0.01] opacity-60' : 'bg-white/[0.03] border border-white/5'
              }`}
            >
              <div className={`flex-shrink-0 p-2 rounded-lg ${config.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-slate-500">{config.label}</span>
                  {!notif.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  )}
                </div>
                <h3 className="text-sm font-medium text-white">{notif.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                {notif.timestamp && (
                  <p className="text-[10px] text-slate-600 mt-1">
                    {new Date(notif.timestamp).toLocaleString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-600">Bu kategoride bildirim bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  )
}