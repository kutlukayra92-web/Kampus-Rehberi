import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, MapPin, FileText, Utensils, AlertTriangle, Users, CalendarCheck } from 'lucide-react'
import { useCampus } from '../context/CampusContext'

const QUICK_REPLIES = [
  { label: 'Randevu', icon: CalendarCheck, message: 'Randevu nasıl alabilirim?' },
  { label: 'Ulaşım', icon: MapPin, message: 'Bilişim laboratuvarları nerede?' },
  { label: 'Kurallar', icon: FileText, message: 'Kütüphane kuralları nedir?' },
  { label: 'Yemek', icon: Utensils, message: 'Bugün yemekte ne var?' },
  { label: 'Arıza', icon: AlertTriangle, message: 'Laboratuvardaki bilgisayar açılmıyor ne yapmalıyım?' },
]

export default function ChatBot() {
  const { chatHistory, sendChatMessage, isTyping } = useCampus()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory, isOpen, isTyping])

  const handleSend = (text) => {
    const msg = text || input
    if (!msg.trim()) return
    sendChatMessage(msg.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
          isOpen
            ? 'bg-red-500/90 hover:bg-red-500 rotate-0'
            : 'bg-cyan-500/90 hover:bg-cyan-500 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 max-w-md rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-[slideUp_0.2s_ease-out]">
          {/* Header */}
          <div className="px-4 py-3 bg-cyan-500/10 border-b border-white/5 flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">Kampüs Asistanı</h3>
              <p className="text-[10px] text-cyan-400 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                {isTyping ? 'Yazıyor...' : 'Çevrimiçi'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 max-h-[50vh] overflow-y-auto p-4 space-y-3">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                  msg.sender === 'user' ? 'bg-cyan-500/20' : 'bg-purple-500/20'
                }`}>
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5 text-cyan-400" /> : <Bot className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <div className={`max-w-[78%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500/15 text-cyan-100 border border-cyan-500/20 rounded-tr-sm'
                    : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-sm'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-purple-500/20">
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div className="px-3 pt-2 pb-1 flex gap-1.5 flex-wrap">
            {QUICK_REPLIES.map((qr, i) => {
              const Icon = qr.icon
              return (
                <button key={i} onClick={() => handleSend(qr.message)} disabled={isTyping}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/20 hover:text-cyan-300 transition-all disabled:opacity-40 cursor-pointer">
                  <Icon className="w-3 h-3" />{qr.label}
                </button>
              )
            })}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/5 bg-white/[0.02]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Sorunuzu yazın..."
                disabled={isTyping}
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/30 transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
