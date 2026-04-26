import { useState, useRef, useEffect, useMemo } from 'react'
import {
  ArrowLeft, Send, Users, Hash, Lock, Wifi, WifiOff, Trash2,
  Plus, Settings, X, Smile, Image as ImageIcon
} from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const BASE_CHANNELS = [
  { id: 'genel', name: 'Genel Sohbet', type: 'text', visibility: 'public' },
  { id: 'duyurular', name: 'Duyurular', type: 'announcement', visibility: 'public' },
  { id: 'etkinlik', name: 'Etkinlik Tartışmaları', type: 'text', visibility: 'public' },
  { id: 'yardim', name: 'Yardım / Soru-Cevap', type: 'text', visibility: 'public' },
  { id: 'proje', name: 'Proje Paylaşımları', type: 'text', visibility: 'public' },
  { id: 'ogretmenler', name: 'Öğretmenler Odası', type: 'private', visibility: 'teacher-only' },
]

const USERS = [
  { id: 1, name: 'Ahmet Yılmaz', role: 'Öğrenci', status: 'online', avatar: 'AY' },
  { id: 2, name: 'Elif Kaya', role: 'Öğrenci', status: 'online', avatar: 'EK' },
  { id: 3, name: 'Mehmet Demir', role: 'Öğrenci', status: 'offline', avatar: 'MD' },
  { id: 4, name: 'Zeynep Çelik', role: 'Öğrenci', status: 'online', avatar: 'ZÇ' },
  { id: 5, name: 'Ali Öztürk', role: 'Öğretmen', status: 'online', avatar: 'AÖ' },
  { id: 6, name: 'Fatma Şahin', role: 'Öğretmen', status: 'offline', avatar: 'FŞ' },
  { id: 7, name: 'Can Yıldız', role: 'Ziyaretçi', status: 'online', avatar: 'CY' },
]

const MESSAGES = [
  { id: 1, userId: 1, channelId: 'genel', text: 'Bugünkü robotik yarışmasına kimler katılıyor?', time: '10:15', type: 'text' },
  { id: 2, userId: 2, channelId: 'genel', text: 'Ben katılacağım! Çok heyecanlı 😊', time: '10:16', type: 'text' },
  { id: 3, userId: 5, channelId: 'genel', text: 'Toplantı 14:00\'da laboratuvarda olacak.', time: '10:18', type: 'text' },
  { id: 4, userId: 4, channelId: 'genel', text: 'Proje dosyalarını kim kontrol edebilir?', time: '10:20', type: 'text' },
  { id: 5, userId: 1, channelId: 'genel', text: 'Ben yardımcı olabilirim Zeynep.', time: '10:21', type: 'text' },
  { id: 6, userId: 3, channelId: 'genel', text: 'Geç kaldım, birazdan geliyorum!', time: '10:22', type: 'text' },
  { id: 7, userId: 5, channelId: 'duyurular', text: '📢 Yarın sınav var, hazırlıklı gelin!', time: '09:00', type: 'text' },
  { id: 8, userId: 2, channelId: 'yardim', text: 'Arduino kodunda takıldım, yardım edebilir misiniz?', time: '10:30', type: 'text' },
]

const EMOJIS = [
  '😀','😂','🥰','😎','🤔','👍','👎','🎉','🔥','❤️',
  '👏','🙏','💯','⭐','🚀','💡','⚡','🧪','💻','🤖',
  '📚','✅','❌','⚠️','🎯','🏆','🎓','📷','🎵','🎮',
]

function Avatar({ name, size = 'md' }) {
  const colors = ['bg-cyan-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-blue-500']
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colorIndex = name.charCodeAt(0) % colors.length
  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm'

  return (
    <div className={`${sizeClasses} ${colors[colorIndex]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}>
      {initials}
    </div>
  )
}

export default function ChatScreen() {
  const {
    role, resetRole, chatChannels, addChannel,
    channelUnreadCounts, clearChannelUnread,
  } = useCampus()

  const [activeChannel, setActiveChannel] = useState('genel')
  const [message, setMessage] = useState('')
  const [localMessages, setLocalMessages] = useState(MESSAGES)
  const [localChannels, setLocalChannels] = useState([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [showUsers, setShowUsers] = useState(false)
  const [connected, setConnected] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [newChannelForm, setNewChannelForm] = useState({ name: '', visibility: 'public' })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  const canManageChannels = role === 'ogretmen' || role === 'admin'

  // Kanal değiştiğinde okunmamış sayısını sıfırla
  useEffect(() => {
    clearChannelUnread(activeChannel)
  }, [activeChannel, clearChannelUnread])

  const contextChannels = useMemo(() => {
    return chatChannels.map(c => ({
      id: c.id, name: c.name, type: 'text', visibility: 'public', fromContext: true,
    }))
  }, [chatChannels])

  const allChannels = useMemo(() => [...BASE_CHANNELS, ...localChannels, ...contextChannels], [localChannels, contextChannels])

  const visibleChannels = useMemo(() => {
    return allChannels.filter(ch => ch.visibility !== 'teacher-only' || canManageChannels)
  }, [allChannels, canManageChannels])

  const matchedChannelId = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase()
    const match = visibleChannels.find(ch => ch.name.toLowerCase().includes(q))
    return match ? match.id : null
  }, [searchQuery, visibleChannels])

  const channelMessages = localMessages.filter(m => m.channelId === activeChannel)
  const activeChannelData = visibleChannels.find(c => c.id === activeChannel)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [channelMessages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    const newMsg = {
      id: Date.now(), userId: 1, channelId: activeChannel,
      text: message.trim(), time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    }
    setLocalMessages(prev => [...prev, newMsg])
    setMessage('')
    inputRef.current?.focus()
  }

  const handleDelete = (msgId) => {
    setLocalMessages(prev => prev.filter(m => m.id !== msgId))
  }

  const getUser = (userId) => USERS.find(u => u.id === userId)

  const handleCreateChannel = (e) => {
    e.preventDefault()
    if (!newChannelForm.name.trim()) return
    const newCh = { id: `local-ch-${Date.now()}`, name: newChannelForm.name.trim(), type: 'text', visibility: newChannelForm.visibility }
    setLocalChannels(prev => [...prev, newCh])
    addChannel({ name: newChannelForm.name.trim(), classGroup: 'Genel', createdBy: role || 'user', type: newChannelForm.visibility === 'teacher-only' ? 'private' : 'text' })
    setNewChannelForm({ name: '', visibility: 'public' })
    setShowCreateChannel(false)
    setActiveChannel(newCh.id)
  }

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji)
    inputRef.current?.focus()
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const newMsg = {
        id: Date.now(), userId: 1, channelId: activeChannel,
        text: '', time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        type: 'image', imageUrl: reader.result,
      }
      setLocalMessages(prev => [...prev, newMsg])
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={resetRole} className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {activeChannelData?.type === 'private' ? (
              <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            ) : (
              <Hash className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            )}
            <h1 className="text-sm sm:text-base font-semibold text-white truncate">{activeChannelData?.name || 'Sohbet'}</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
            {connected ? 'Bağlı' : 'Bağlantı kesildi'}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {canManageChannels && (
            <button onClick={() => setShowCreateChannel(true)} className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-cyan-400 cursor-pointer" title="Kanal Oluştur">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          <button onClick={() => setShowUsers(!showUsers)} className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer relative">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Channels (desktop) */}
        <aside className="hidden sm:flex flex-col w-56 lg:w-64 bg-slate-900/50 border-r border-white/5">
          <div className="p-3">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg mb-3">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Kanal ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-xs text-white placeholder-slate-500 outline-none flex-1" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white cursor-pointer"><X className="w-3 h-3" /></button>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-2 mb-2">Kanallar</div>
            {visibleChannels.map(channel => {
              const isMatched = matchedChannelId === channel.id
              const unread = channelUnreadCounts[channel.id] || 0
              return (
                <button key={channel.id} onClick={() => setActiveChannel(channel.id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer mb-0.5 ${activeChannel === channel.id ? 'bg-white/10 text-white' : isMatched ? 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.15)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  {channel.type === 'private' || channel.visibility === 'teacher-only' ? <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /> : <Hash className="w-3.5 h-3.5 flex-shrink-0" />}
                  <span className="truncate flex-1 text-left">{channel.name}</span>
                  {unread > 0 && activeChannel !== channel.id && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full font-medium flex-shrink-0">{unread}</span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="p-3 border-t border-white/5">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Çevrimiçi — {USERS.filter(u => u.status === 'online').length}</div>
            <div className="space-y-1">
              {USERS.filter(u => u.status === 'online').slice(0, 3).map(user => (
                <div key={user.id} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer">
                  <div className="relative"><Avatar name={user.name} size="sm" /><div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" /></div>
                  <span className="text-xs text-slate-400 truncate">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
            {channelMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-600">
                <Hash className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Henüz mesaj yok</p>
                <p className="text-xs">İlk mesajı sen gönder!</p>
              </div>
            ) : (
              channelMessages.map((msg, i) => {
                const user = getUser(msg.userId)
                const isOwn = msg.userId === 1
                const showAvatar = i === 0 || channelMessages[i - 1]?.userId !== msg.userId
                return (
                  <div key={msg.id} className={`flex gap-2 sm:gap-3 ${isOwn ? 'flex-row-reverse' : ''} ${showAvatar ? 'mt-3' : 'mt-0'}`}>
                    {!isOwn && showAvatar ? <Avatar name={user?.name || '??'} size="sm" /> : !isOwn ? <div className="w-8 flex-shrink-0" /> : null}
                    <div className={`max-w-[75%] sm:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                      {showAvatar && !isOwn && <div className="flex items-center gap-1.5 mb-1"><span className="text-xs font-medium text-slate-300">{user?.name}</span><span className="text-[10px] text-slate-600">{msg.time}</span></div>}
                      <div className={`group relative px-3 py-2 rounded-2xl text-sm ${isOwn ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white rounded-br-md' : 'bg-white/5 text-slate-200 rounded-bl-md'}`}>
                        {msg.type === 'image' && msg.imageUrl ? (
                          <img src={msg.imageUrl} alt="Paylaşılan görsel" className="max-w-full max-h-48 rounded-lg object-cover" />
                        ) : (
                          <p className="leading-relaxed break-words">{msg.text}</p>
                        )}
                        {isOwn && (
                          <button onClick={() => handleDelete(msg.id)} className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all cursor-pointer">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      {isOwn && <span className="text-[10px] text-slate-600 mt-0.5 block">{msg.time}</span>}
                    </div>
                    {isOwn && showAvatar ? <Avatar name={user?.name || 'Sen'} size="sm" /> : isOwn ? <div className="w-8 flex-shrink-0" /> : null}
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-3 right-3 sm:left-auto sm:right-auto sm:bottom-24 sm:w-72 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-3 z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Emojiler</span>
                <button onClick={() => setShowEmojiPicker(false)} className="text-slate-500 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {EMOJIS.map(emoji => (
                  <button key={emoji} onClick={() => handleEmojiClick(emoji)} className="text-lg p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">{emoji}</button>
                ))}
              </div>
            </div>
          )}

          {/* Message input */}
          <form onSubmit={handleSend} className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/80 backdrop-blur-xl border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all">
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer flex-shrink-0">
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <input ref={inputRef} type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`#${activeChannelData?.name || activeChannel} kanalına mesaj yaz...`} className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer flex-shrink-0">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
              <button type="submit" disabled={!message.trim()} className="p-2 sm:p-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>
        </main>

        {/* Users panel */}
        {showUsers && (
          <aside className="w-52 lg:w-56 bg-slate-900/50 border-l border-white/5 p-3 hidden sm:flex flex-col">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2"><Users className="w-3 h-3" /> Kullanıcılar</div>
            <div className="space-y-1 overflow-y-auto">
              {USERS.map(user => (
                <div key={user.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
                  <div className="relative"><Avatar name={user.name} size="sm" /><div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${user.status === 'online' ? 'bg-emerald-400' : 'bg-slate-600'}`} /></div>
                  <div className="min-w-0"><p className="text-xs text-slate-300 truncate">{user.name}</p><p className="text-[10px] text-slate-600">{user.role}</p></div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Kanallar</span>
              <button onClick={() => setShowSidebar(false)} className="p-1 text-slate-500 hover:text-white cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg mb-3">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Kanal ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-xs text-white placeholder-slate-500 outline-none flex-1" />
            </div>
            {visibleChannels.map(channel => {
              const isMatched = matchedChannelId === channel.id
              const unread = channelUnreadCounts[channel.id] || 0
              return (
                <button key={channel.id} onClick={() => { setActiveChannel(channel.id); setShowSidebar(false) }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 cursor-pointer ${activeChannel === channel.id ? 'bg-white/10 text-white' : isMatched ? 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  {channel.type === 'private' || channel.visibility === 'teacher-only' ? <Lock className="w-4 h-4 text-amber-400" /> : <Hash className="w-4 h-4" />}
                  {channel.name}
                  {unread > 0 && activeChannel !== channel.id && <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">{unread}</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateChannel(false)} />
          <div className="relative w-full sm:max-w-md bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-cyan-400" /> Yeni Kanal Oluştur</h2>
              <button onClick={() => setShowCreateChannel(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Kanal Adı</label>
                <input type="text" value={newChannelForm.name} onChange={(e) => setNewChannelForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Örn: Proje X Tartışma" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Görünürlük</label>
                <div className="flex gap-2">
                  {[{ id: 'public', label: 'Herkese Açık', icon: Hash }, { id: 'teacher-only', label: 'Öğretmenlere Özel', icon: Lock }].map(v => (
                    <button key={v.id} type="button" onClick={() => setNewChannelForm(prev => ({ ...prev, visibility: v.id }))} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${newChannelForm.visibility === v.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                      <v.icon className="w-3.5 h-3.5" />{v.label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={!newChannelForm.name.trim()} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                <Plus className="w-4 h-4" /> Kanal Oluştur
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
