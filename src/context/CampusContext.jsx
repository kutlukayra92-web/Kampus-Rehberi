import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import campusData from '../data/campusData.json'
import { askGLM5 } from '../services/aiService'

const CampusContext = createContext()

let nextEventId = 4
let nextMsgId = 5
let nextFaultId = 1
let nextChannelId = 4

// LocalStorage helpers
const LS_KEYS = {
  appointments: 'kampus_appointments',
  apptId: 'kampus_appointment_id',
}

function loadAppointments() {
  try {
    const raw = localStorage.getItem(LS_KEYS.appointments)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveAppointments(list) {
  localStorage.setItem(LS_KEYS.appointments, JSON.stringify(list))
}

function getNextAppointmentId() {
  try {
    const raw = localStorage.getItem(LS_KEYS.apptId)
    return raw ? parseInt(raw, 10) : 1
  } catch { return 1 }
}

function setNextAppointmentId(id) {
  localStorage.setItem(LS_KEYS.apptId, String(id))
}

let nextAppointmentId = getNextAppointmentId()

const roleLabels = {
  student: 'Öğrenci',
  teacher: 'Öğretmen',
  visitor: 'Ziyaretçi',
  admin: 'İdare',
}

const INITIAL_SCHOOL_INFO = {
  name: 'Teknik Lise Kampüsü',
  motto: 'Geleceği Kodlayan Nesiller',
  vision: 'Teknoloji ve inovasyon odaklı eğitim anlayışıyla, ülkemizin ihtiyaç duyduğu nitelikli insan gücünü yetiştirmek.',
  mission: 'Öğrencilerimizi 21. yüzyıl becerileriyle donatarak; yazılım, robotik, elektronik ve siber güvenlik alanlarında uzman bireyler olarak yetiştirmek.',
  principalMessage: 'Sevgili öğrencilerimiz, okulumuzda sadece ders değil, hayata hazırlık da görüyorsunuz. Her projeniz, her kod satırınız geleceğinizin temel taşı. Başarılar!',
  address: 'Merkez Mah. Teknopark Cad. No:42, Pendik / İstanbul',
  phone: '0216 555 42 00',
  email: 'bilgi@tekniklise.k12.tr',
  founded: 2005,
  capacity: 1200,
  staffCount: 68,
}

export function CampusProvider({ children }) {
  const [role, setRole] = useState(null)
  const [rooms, setRooms] = useState(campusData.rooms)
  const [events, setEvents] = useState(campusData.events)
  const [clubs] = useState(campusData.clubs)
  const [schedule] = useState(campusData.schedule)
  const [studentList] = useState(campusData.studentList)
  const [achievements] = useState(campusData.schoolAchievements)
  const [activeTab, setActiveTab] = useState('map')
  const [navigateToRoomId, setNavigateToRoomId] = useState(null)

  const [announcements, setAnnouncements] = useState([
    { id: 1, floorId: 2, message: '2. Kat WC tadilattadır', type: 'warning', date: '26.04.2026' },
    { id: 2, floorId: 1, message: 'Kantin bugün 13:00\'te kapanacaktır', type: 'info', date: '26.04.2026' },
    { id: 3, floorId: 0, message: 'Zemin Kat kütüphane bugün 17:00\'ye kadar açık', type: 'info', date: '26.04.2026' },
  ])

  const [canteenData, setCanteenData] = useState({
    menu: [
      { day: 'Pazartesi', main: 'Izgara Köfte & Pirinç Pilavı', side: 'Mercimek Çorbası', dessert: 'Sütlaç' },
      { day: 'Salı', main: 'Tavuk Sote & Bulgur Pilavı', side: 'Ezogelin Çorbası', dessert: 'Revani' },
      { day: 'Çarşamba', main: 'Karnıyarık & Pirinç Pilavı', side: 'Tarhana Çorbası', dessert: 'Kazandibi' },
      { day: 'Perşembe', main: 'Fırında Balık & Patates Püresi', side: 'Domates Çorbası', dessert: 'Baklava' },
      { day: 'Cuma', main: 'Etli Nohut & Pirinç Pilavı', side: 'Yayla Çorbası', dessert: 'Kemalpaşa' },
    ],
    density: 'medium',
    densityPercent: 65,
    openHours: '11:30 - 13:30',
  })

  const [userLocation, setUserLocation] = useState(null)

  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', message: 'Merhaba! 👋 Kampüs Asistanı\'na hoş geldin. Size nasıl yardımcı olabilirim? Aşağıdaki hazır butonlardan birini seçebilir veya sorunuzu yazabilirsiniz.', timestamp: new Date().toISOString() },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const [chatChannels, setChatChannels] = useState(campusData.chatChannels)
  const [messages, setMessages] = useState(campusData.initialMessages)
  const [notifications, setNotifications] = useState([])
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)

  const [channelUnreadCounts, setChannelUnreadCounts] = useState({
    genel: 5, duyurular: 1, etkinlik: 0, yardim: 3, proje: 0, ogretmenler: 0,
  })

  const [schoolInfo, setSchoolInfo] = useState(INITIAL_SCHOOL_INFO)
  const [faultReports, setFaultReports] = useState([])
  const [appointments, setAppointments] = useState(() => loadAppointments())
  const [selectedChannelId, setSelectedChannelId] = useState(null)
  const [pendingNotifications, setPendingNotifications] = useState([])
  const [emergencyMode, setEmergencyMode] = useState(false)

  const [dutySchedule, setDutySchedule] = useState({
    teachers: [
      { day: 'Pazartesi', name: 'Ali Öztürk', area: 'Ana Bina' },
      { day: 'Salı', name: 'Fatma Şahin', area: 'Laboratuvarlar' },
      { day: 'Çarşamba', name: 'Mehmet Kaya', area: 'Ana Bina' },
      { day: 'Perşembe', name: 'Zeynep Çelik', area: 'Spor Salonu' },
      { day: 'Cuma', name: 'Emre Şahin', area: 'Ana Bina' },
    ],
    students: [
      { day: 'Pazartesi', name: 'Ahmet Yılmaz', classGroup: '10-Bilişim' },
      { day: 'Salı', name: 'Elif Kaya', classGroup: '9-A' },
      { day: 'Çarşamba', name: 'Mehmet Demir', classGroup: '10-Bilişim' },
      { day: 'Perşembe', name: 'Zeynep Çelik', classGroup: '9-A' },
      { day: 'Cuma', name: 'Can Yıldız', classGroup: '10-Bilişim' },
    ],
  })

  const [cafeteriaMenu, setCafeteriaMenu] = useState({
    'Pazartesi': [
      { type: 'Ana Yemek', name: 'Izgara Köfte & Pirinç Pilavı', calories: '650 kcal' },
      { type: 'Çorba', name: 'Mercimek Çorbası', calories: '120 kcal' },
      { type: 'Salata', name: 'Mevsim Salata', calories: '80 kcal' },
      { type: 'Tatlı', name: 'Sütlaç', calories: '200 kcal' },
    ],
    'Salı': [
      { type: 'Ana Yemek', name: 'Tavuk Sote & Bulgur Pilavı', calories: '580 kcal' },
      { type: 'Çorba', name: 'Ezogelin Çorbası', calories: '110 kcal' },
      { type: 'Salata', name: 'Çoban Salata', calories: '90 kcal' },
      { type: 'Tatlı', name: 'Revani', calories: '220 kcal' },
    ],
    'Çarşamba': [
      { type: 'Ana Yemek', name: 'Karnıyarık & Pirinç Pilavı', calories: '620 kcal' },
      { type: 'Çorba', name: 'Tarhana Çorbası', calories: '130 kcal' },
      { type: 'Salata', name: 'Yoğurtlu Semizotu', calories: '100 kcal' },
      { type: 'Tatlı', name: 'Kazandibi', calories: '210 kcal' },
    ],
    'Perşembe': [
      { type: 'Ana Yemek', name: 'Fırında Balık & Patates Püresi', calories: '550 kcal' },
      { type: 'Çorba', name: 'Domates Çorbası', calories: '100 kcal' },
      { type: 'Salata', name: 'Rus Salatası', calories: '120 kcal' },
      { type: 'Tatlı', name: 'Baklava', calories: '280 kcal' },
    ],
    'Cuma': [
      { type: 'Ana Yemek', name: 'Etli Nohut & Pirinç Pilavı', calories: '680 kcal' },
      { type: 'Çorba', name: 'Yayla Çorbası', calories: '140 kcal' },
      { type: 'Salata', name: 'Mevsim Salata', calories: '80 kcal' },
      { type: 'Tatlı', name: 'Kemalpaşa', calories: '190 kcal' },
    ],
  })

  const selectRole = (roleValue) => setRole(roleValue)
  const resetRole = () => {
    setRole(null)
    setSelectedChannelId(null)
    setActiveTab('map')
  }

  const updateSchoolInfo = useCallback((updates) => {
    setSchoolInfo((prev) => ({ ...prev, ...updates }))
  }, [])

  const getRoomById = (id) => rooms.find((room) => room.id === id) || null
  const getRoomsByFloor = (floor) => rooms.filter((room) => room.floor === floor)
  const getRoomsByType = (type) => rooms.filter((room) => room.type === type)
  const updateRoomName = useCallback((roomId, newName) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, name: newName } : r)))
  }, [])

  const getEventById = (id) => events.find((e) => e.id === id) || null
  const getEventsByRoom = (roomId) => events.filter((e) => e.roomId === roomId)
  const getVisibleEvents = (userRole) => events.filter((e) => e.visibleTo.includes(userRole))
  const addEvent = useCallback((eventData) => {
    const newEvent = { ...eventData, id: `event-${nextEventId++}` }
    setEvents((prev) => [...prev, newEvent])
    addNotification({
      title: 'Yeni Etkinlik',
      message: `"${newEvent.title}" etkinliği ${newEvent.location} konumuna eklendi.`,
      type: 'event',
    })
    return newEvent
  }, [])

  const navigateToRoom = useCallback((roomId) => {
    setNavigateToRoomId(roomId)
    setActiveTab('map')
  }, [])
  const clearNavigation = useCallback(() => setNavigateToRoomId(null), [])

  const addNotification = useCallback(({ title, message, type }) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotif, ...prev])
    setUnreadNotificationCount((prev) => prev + 1)
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadNotificationCount(0)
  }, [])

  const clearChannelUnread = useCallback((channelId) => {
    setChannelUnreadCounts((prev) => ({ ...prev, [channelId]: 0 }))
  }, [])

  const incrementChannelUnread = useCallback((channelId) => {
    setChannelUnreadCounts((prev) => ({
      ...prev,
      [channelId]: (prev[channelId] || 0) + 1,
    }))
  }, [])

  const addChannel = useCallback((channelData) => {
    const newChannel = { ...channelData, id: `channel-${nextChannelId++}` }
    setChatChannels((prev) => [...prev, newChannel])
    return newChannel
  }, [])

  const addMessage = useCallback((channelId, msgData) => {
    const newMsg = {
      ...msgData,
      id: `msg-${nextMsgId++}`,
      channelId,
    }
    setMessages((prev) => [...prev, newMsg])
    incrementChannelUnread(channelId)
    addNotification({
      title: msgData.file ? 'Yeni Dosya Paylaşıldı' : 'Yeni Mesaj',
      message: msgData.file
        ? `${msgData.sender}: "${msgData.file.name}" dosyasını paylaştı`
        : `${msgData.sender}: "${msgData.text}"`,
      type: 'chat',
    })
    return newMsg
  }, [incrementChannelUnread, addNotification])

  const getMessagesByChannel = useCallback(
    (channelId) => messages.filter((m) => m.channelId === channelId),
    [messages]
  )

  const addFaultReport = useCallback((faultData) => {
    const newFault = {
      ...faultData,
      id: `fault-${nextFaultId++}`,
      status: 'reported',
      reportedAt: new Date().toISOString(),
    }
    setFaultReports((prev) => [...prev, newFault])
    addNotification({
      title: 'Arıza Bildirimi',
      message: `${faultData.roomName}: ${faultData.description}`,
      type: 'fault',
    })
    return newFault
  }, [addNotification])

  const resolveFault = useCallback((faultId) => {
    setFaultReports((prev) =>
      prev.map((f) => (f.id === faultId ? { ...f, status: 'resolved' } : f))
    )
  }, [])

  const updateFaultStatus = useCallback((faultId, newStatus) => {
    setFaultReports((prev) =>
      prev.map((f) => (f.id === faultId ? { ...f, status: newStatus } : f))
    )
  }, [])

  const deleteFault = useCallback((faultId) => {
    setFaultReports((prev) => prev.filter((f) => f.id !== faultId))
  }, [])

  const removeChannel = useCallback((channelId) => {
    setChatChannels((prev) => prev.filter((c) => c.id !== channelId))
  }, [])

  const addAppointment = useCallback((apptData) => {
    const newAppt = {
      ...apptData,
      id: `appt-${nextAppointmentId}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    nextAppointmentId += 1
    setNextAppointmentId(nextAppointmentId)
    setAppointments((prev) => {
      const updated = [...prev, newAppt]
      saveAppointments(updated)
      return updated
    })
    addNotification({
      title: 'Yeni Randevu Talebi',
      message: `${newAppt.visitorName} — ${newAppt.person} görüşmesi için randevu talebi alındı.`,
      type: 'appointment',
    })
    return newAppt
  }, [addNotification])

  const updateAppointmentStatus = useCallback((apptId, status) => {
    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === apptId ? { ...a, status } : a))
      saveAppointments(updated)
      const appt = prev.find((a) => a.id === apptId)
      if (appt) {
        addNotification({
          title: status === 'approved' ? 'Randevu Onaylandı' : 'Randevu Reddedildi',
          message: status === 'approved'
            ? `${appt.visitorName} — ${appt.person} görüşmesi onaylandı. Tarih: ${appt.date} Saat: ${appt.time}`
            : `${appt.visitorName} — ${appt.person} görüşmesi reddedildi.`,
          type: 'appointment',
        })
      }
      return updated
    })
  }, [addNotification])

  const createPendingNotification = useCallback((notifData) => {
    const pending = {
      id: `pending-${Date.now()}`,
      ...notifData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setPendingNotifications((prev) => [pending, ...prev])
    return pending
  }, [])

  const publishNotification = useCallback((pendingId) => {
    setPendingNotifications((prev) => {
      const pending = prev.find((n) => n.id === pendingId)
      if (!pending) return prev
      const newNotif = {
        id: Date.now(),
        title: pending.title,
        message: pending.message,
        type: pending.type,
        read: false,
        timestamp: new Date().toISOString(),
      }
      setNotifications((nPrev) => [newNotif, ...nPrev])
      setUnreadNotificationCount((c) => c + 1)
      return prev.filter((n) => n.id !== pendingId)
    })
  }, [])

  const rejectPendingNotification = useCallback((pendingId) => {
    setPendingNotifications((prev) => prev.filter((n) => n.id !== pendingId))
  }, [])

  const sendChatMessage = useCallback(async (message) => {
    setChatHistory(prev => [...prev, { sender: 'user', message, timestamp: new Date().toISOString() }])
    setIsTyping(true)
    try {
      const response = await askGLM5(message, chatHistory)
      setIsTyping(false)
      setChatHistory(prev => [...prev, { sender: 'bot', message: response, timestamp: new Date().toISOString() }])
    } catch (err) {
      setIsTyping(false)
      setChatHistory(prev => [...prev, {
        sender: 'bot',
        message: '⚠️ Şu anda yapay zeka servisine ulaşılamıyor. Lütfen daha sonra tekrar deneyin.\n\nAlternatif olarak hazır butonlardan birini seçebilirsiniz.',
        timestamp: new Date().toISOString(),
      }])
    }
  }, [chatHistory])

  const updateCanteenDensity = useCallback(() => {
    const densities = ['low', 'medium', 'high']
    const percents = [25, 55, 85]
    const idx = Math.floor(Math.random() * 3)
    setCanteenData(prev => ({ ...prev, density: densities[idx], densityPercent: percents[idx] + Math.floor(Math.random() * 10) - 5 }))
  }, [])

  const getCurrentLesson = useCallback(() => {
    const now = new Date()
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
    const currentDay = days[now.getDay()]
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const todaysLessons = schedule.filter((s) => s.day === currentDay)
    for (const lesson of todaysLessons) {
      const [start, end] = lesson.time.split('-')
      if (currentTime >= start && currentTime <= end) {
        return { lesson: lesson.lesson, classroom: lesson.classroom, roomId: lesson.roomId, classGroup: lesson.classGroup, timeRange: lesson.time }
      }
    }
    for (const lesson of todaysLessons) {
      const [start] = lesson.time.split('-')
      if (currentTime < start) {
        return { lesson: lesson.lesson, classroom: lesson.classroom, roomId: lesson.roomId, classGroup: lesson.classGroup, timeRange: lesson.time, upcoming: true }
      }
    }
    return null
  }, [schedule])

  const getStudentsByClass = useCallback(
    (classGroup) => studentList.filter((s) => s.classGroup === classGroup),
    [studentList]
  )

  const value = useMemo(() => ({
    role, selectRole, resetRole, roleLabels,
    rooms, events, clubs, schedule, studentList, achievements,
    schoolInfo, updateSchoolInfo, activeTab, setActiveTab,
    navigateToRoomId, navigateToRoom, clearNavigation,
    getRoomById, getRoomsByFloor, getRoomsByType, updateRoomName,
    getEventById, getEventsByRoom, getVisibleEvents, addEvent,
    chatChannels, addChannel, removeChannel, messages, addMessage,
    getMessagesByChannel, selectedChannelId, setSelectedChannelId,
    channelUnreadCounts, clearChannelUnread, incrementChannelUnread,
    notifications, unreadNotificationCount, addNotification, markAllNotificationsRead,
    pendingNotifications, createPendingNotification, publishNotification, rejectPendingNotification,
    faultReports, addFaultReport, resolveFault, updateFaultStatus, deleteFault,
    appointments, addAppointment, updateAppointmentStatus,
    emergencyMode, setEmergencyMode, dutySchedule, cafeteriaMenu,
    getCurrentLesson, getStudentsByClass,
    announcements, setAnnouncements,
    canteenData, updateCanteenDensity,
    userLocation, setUserLocation,
    chatHistory, sendChatMessage, isTyping,
  }), [
    role, rooms, events, clubs, schedule, studentList, achievements,
    schoolInfo, activeTab, navigateToRoomId, getRoomById, getEventById, getEventsByRoom,
    getVisibleEvents, addEvent, chatChannels, removeChannel, messages,
    getMessagesByChannel, selectedChannelId, channelUnreadCounts, clearChannelUnread,
    incrementChannelUnread, notifications, unreadNotificationCount,
    pendingNotifications, createPendingNotification, publishNotification,
    rejectPendingNotification, faultReports, addFaultReport, resolveFault,
    updateFaultStatus, deleteFault, appointments, addAppointment, updateAppointmentStatus,
    getCurrentLesson, getStudentsByClass, emergencyMode, dutySchedule, cafeteriaMenu,
    announcements, canteenData, userLocation, chatHistory, sendChatMessage, updateCanteenDensity,
  ])

  return (
    <CampusContext.Provider value={value}>
      {children}
    </CampusContext.Provider>
  )
}

export function useCampus() {
  const context = useContext(CampusContext)
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider')
  }
  return context
}
