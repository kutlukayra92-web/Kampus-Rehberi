export const FLOOR_PLANS = [
  {
    id: 0,
    label: 'Z',
    name: 'Zemin Kat',
    viewBox: '0 0 800 600',
    rooms: [
      { id: 'room-acil', name: 'Acil Çıkış', type: 'emergency', x: 20, y: 20, w: 80, h: 50 },
      { id: 'room-giris', name: 'Ana Giriş', type: 'entrance', x: 300, y: 20, w: 200, h: 60 },
      { id: 'room-wc-e', name: 'WC Erkek', type: 'wc', x: 40, y: 120, w: 80, h: 50 },
      { id: 'room-wc-k', name: 'WC Kız', type: 'wc', x: 130, y: 120, w: 80, h: 50 },
      { id: 'room-gezi', name: 'Gezi Kulübü', type: 'club', x: 40, y: 190, w: 170, h: 100 },
      { id: 'room-9a', name: '9-A', type: 'classroom', x: 550, y: 120, w: 100, h: 80 },
      { id: 'room-9b', name: '9-B', type: 'classroom', x: 660, y: 120, w: 100, h: 80 },
      { id: 'room-9c', name: '9-C', type: 'classroom', x: 550, y: 220, w: 100, h: 80 },
      { id: 'room-9d', name: '9-D', type: 'classroom', x: 660, y: 220, w: 100, h: 80 },
      { id: 'room-kutuphane', name: 'Kütüphane', type: 'social', x: 550, y: 320, w: 210, h: 120 },
      { id: 'room-merdiven', name: 'Merdivenler', type: 'stairs', x: 300, y: 450, w: 100, h: 100 },
      { id: 'room-ataturk', name: 'Atatürk Köşesi', type: 'social', x: 300, y: 520, w: 200, h: 60 },
    ],
    walls: [
      // Dış çeper
      { x1: 10, y1: 10, x2: 790, y2: 10 },
      { x1: 790, y1: 10, x2: 790, y2: 590 },
      { x1: 790, y1: 590, x2: 10, y2: 590 },
      { x1: 10, y1: 590, x2: 10, y2: 10 },
      // Giriş boşluğu (üst orta)
      { x1: 10, y1: 10, x2: 290, y2: 10 },
      { x1: 510, y1: 10, x2: 790, y2: 10 },
      // Atatürk boşluğu (alt orta)
      { x1: 10, y1: 590, x2: 290, y2: 590 },
      { x1: 510, y1: 590, x2: 790, y2: 590 },
      // Üst yatay iç duvar (giriş altı)
      { x1: 10, y1: 100, x2: 240, y2: 100 },
      { x1: 530, y1: 100, x2: 790, y2: 100 },
      // Alt yatay iç duvar (atatürk üstü)
      { x1: 10, y1: 440, x2: 290, y2: 440 },
      { x1: 510, y1: 440, x2: 790, y2: 440 },
      // Sol dikey iç duvar
      { x1: 240, y1: 100, x2: 240, y2: 180 },
      { x1: 240, y1: 300, x2: 240, y2: 440 },
      // Sağ dikey iç duvar
      { x1: 530, y1: 100, x2: 530, y2: 440 },
      // Sol blok iç bölme (WC altı)
      { x1: 40, y1: 180, x2: 220, y2: 180 },
      // Sağ blok iç bölmeler
      { x1: 550, y1: 210, x2: 770, y2: 210 },
      { x1: 550, y1: 310, x2: 770, y2: 310 },
      { x1: 650, y1: 120, x2: 650, y2: 210 },
      { x1: 650, y1: 220, x2: 650, y2: 310 },
      // Merdiven üstü
      { x1: 290, y1: 440, x2: 410, y2: 440 },
      // Merdiven yanları
      { x1: 290, y1: 440, x2: 290, y2: 560 },
      { x1: 410, y1: 440, x2: 410, y2: 560 },
    ],
    stairs: [
      { id: 'stair-main', x: 300, y: 450, connectsTo: [] },
    ],
    emergencyExits: [
      { id: 'exit-main', x: 20, y: 20, label: 'Acil Çıkış' },
    ],
  },
  {
    id: 1,
    label: '1',
    name: '1. Kat',
    viewBox: '0 0 800 600',
    rooms: [
      { id: 'room-acil', name: 'Acil Çıkış', type: 'emergency', x: 20, y: 20, w: 80, h: 50 },
      { id: 'room-kantin', name: 'Kantin', type: 'social', x: 300, y: 20, w: 200, h: 60 },
      { id: 'room-elektrik-1', name: 'Elektrik Atölyesi', type: 'workshop', x: 40, y: 120, w: 170, h: 100 },
      { id: 'room-elektrik-2', name: 'Elektronik Lab', type: 'workshop', x: 40, y: 240, w: 170, h: 100 },
      { id: 'room-elektrik-3', name: 'Otomasyon Atölyesi', type: 'workshop', x: 40, y: 360, w: 170, h: 100 },
      { id: 'room-10a', name: '10-A', type: 'classroom', x: 270, y: 120, w: 100, h: 100 },
      { id: 'room-10b', name: '10-B', type: 'classroom', x: 380, y: 120, w: 100, h: 100 },
      { id: 'room-10c', name: '10-C', type: 'classroom', x: 270, y: 240, w: 100, h: 100 },
      { id: 'room-10d', name: '10-D', type: 'classroom', x: 380, y: 240, w: 100, h: 100 },
      { id: 'room-11a', name: '11-A', type: 'classroom', x: 550, y: 120, w: 100, h: 100 },
      { id: 'room-11b', name: '11-B', type: 'classroom', x: 660, y: 120, w: 100, h: 100 },
      { id: 'room-11c', name: '11-C', type: 'classroom', x: 550, y: 240, w: 100, h: 100 },
      { id: 'room-11d', name: '11-D', type: 'classroom', x: 660, y: 240, w: 100, h: 100 },
      { id: 'room-ogretmenler', name: 'Öğretmenler Odası', type: 'admin', x: 550, y: 360, w: 210, h: 80 },
      { id: 'room-mudur1', name: '1. Müdür Yrd.', type: 'admin', x: 550, y: 460, w: 210, h: 60 },
      { id: 'room-merdiven', name: 'Merdivenler', type: 'stairs', x: 300, y: 450, w: 100, h: 100 },
    ],
    walls: [
      // Dış çeper
      { x1: 10, y1: 10, x2: 790, y2: 10 },
      { x1: 790, y1: 10, x2: 790, y2: 590 },
      { x1: 790, y1: 590, x2: 10, y2: 590 },
      { x1: 10, y1: 590, x2: 10, y2: 10 },
      // Kantin boşluğu (üst orta)
      { x1: 10, y1: 10, x2: 290, y2: 10 },
      { x1: 510, y1: 10, x2: 790, y2: 10 },
      // Üst yatay iç duvar
      { x1: 10, y1: 100, x2: 240, y2: 100 },
      { x1: 530, y1: 100, x2: 790, y2: 100 },
      // Alt yatay iç duvar
      { x1: 10, y1: 480, x2: 240, y2: 480 },
      { x1: 530, y1: 480, x2: 790, y2: 480 },
      // Sol dikey iç duvar
      { x1: 240, y1: 100, x2: 240, y2: 480 },
      // Sağ dikey iç duvar
      { x1: 530, y1: 100, x2: 530, y2: 480 },
      // Sol blok iç bölme
      { x1: 40, y1: 230, x2: 220, y2: 230 },
      { x1: 40, y1: 350, x2: 220, y2: 350 },
      // Orta blok iç bölme
      { x1: 270, y1: 230, x2: 490, y2: 230 },
      { x1: 380, y1: 100, x2: 380, y2: 350 },
      // Sağ blok iç bölme
      { x1: 550, y1: 230, x2: 770, y2: 230 },
      { x1: 550, y1: 350, x2: 770, y2: 350 },
      { x1: 550, y1: 440, x2: 770, y2: 440 },
      { x1: 650, y1: 120, x2: 650, y2: 230 },
      { x1: 650, y1: 240, x2: 650, y2: 350 },
      // Merdiven üstü
      { x1: 290, y1: 440, x2: 410, y2: 440 },
      { x1: 290, y1: 440, x2: 290, y2: 560 },
      { x1: 410, y1: 440, x2: 410, y2: 560 },
    ],
    stairs: [
      { id: 'stair-main', x: 300, y: 450, connectsTo: [] },
    ],
    emergencyExits: [
      { id: 'exit-main', x: 20, y: 20, label: 'Acil Çıkış' },
    ],
  },
  {
    id: 2,
    label: '2',
    name: '2. Kat',
    viewBox: '0 0 800 600',
    rooms: [
      { id: 'room-acil', name: 'Acil Çıkış', type: 'emergency', x: 20, y: 20, w: 80, h: 50 },
      { id: 'room-mudur2', name: '2. Müdür Yrd.', type: 'admin', x: 550, y: 20, w: 100, h: 50 },
      { id: 'room-mudur3', name: '3. Müdür Yrd.', type: 'admin', x: 660, y: 20, w: 100, h: 50 },
      { id: 'room-mudur', name: 'Müdür Odası', type: 'admin', x: 550, y: 90, w: 210, h: 60 },
      { id: 'room-depo', name: 'Depo', type: 'storage', x: 550, y: 170, w: 100, h: 60 },
      { id: 'room-konferans', name: 'Konferans Salonu', type: 'social', x: 550, y: 250, w: 210, h: 160 },
      { id: 'room-kimya-1', name: 'Kimya Lab 1', type: 'workshop', x: 40, y: 120, w: 170, h: 100 },
      { id: 'room-kimya-2', name: 'Kimya Lab 2', type: 'workshop', x: 40, y: 240, w: 170, h: 100 },
      { id: 'room-kimya-3', name: 'Kimya Atölyesi', type: 'workshop', x: 40, y: 360, w: 170, h: 100 },
      { id: 'room-wc-e', name: 'WC Erkek', type: 'wc', x: 400, y: 520, w: 70, h: 50 },
      { id: 'room-wc-k', name: 'WC Kız', type: 'wc', x: 480, y: 520, w: 70, h: 50 },
      { id: 'room-merdiven', name: 'Merdivenler', type: 'stairs', x: 300, y: 450, w: 100, h: 100 },
    ],
    walls: [
      // Dış çeper
      { x1: 10, y1: 10, x2: 790, y2: 10 },
      { x1: 790, y1: 10, x2: 790, y2: 590 },
      { x1: 790, y1: 590, x2: 10, y2: 590 },
      { x1: 10, y1: 590, x2: 10, y2: 10 },
      // Üst sağ idari boşluk
      { x1: 540, y1: 10, x2: 540, y2: 80 },
      // Üst yatay iç duvar
      { x1: 10, y1: 100, x2: 240, y2: 100 },
      { x1: 530, y1: 100, x2: 790, y2: 100 },
      // Alt yatay iç duvar
      { x1: 10, y1: 480, x2: 290, y2: 480 },
      { x1: 510, y1: 480, x2: 790, y2: 480 },
      // Sol dikey iç duvar
      { x1: 240, y1: 100, x2: 240, y2: 480 },
      // Sağ dikey iç duvar
      { x1: 530, y1: 100, x2: 530, y2: 480 },
      // Sağ üst idari bölme
      { x1: 550, y1: 80, x2: 770, y2: 80 },
      { x1: 550, y1: 160, x2: 770, y2: 160 },
      { x1: 650, y1: 160, x2: 650, y2: 240 },
      // Sol blok iç bölme
      { x1: 40, y1: 230, x2: 220, y2: 230 },
      { x1: 40, y1: 350, x2: 220, y2: 350 },
      // Konferans üstü
      { x1: 550, y1: 240, x2: 770, y2: 240 },
      // WC üstü
      { x1: 390, y1: 480, x2: 560, y2: 480 },
      { x1: 390, y1: 480, x2: 390, y2: 580 },
      { x1: 560, y1: 480, x2: 560, y2: 580 },
      // Merdiven
      { x1: 290, y1: 440, x2: 410, y2: 440 },
      { x1: 290, y1: 440, x2: 290, y2: 560 },
      { x1: 410, y1: 440, x2: 410, y2: 560 },
    ],
    stairs: [
      { id: 'stair-main', x: 300, y: 450, connectsTo: [] },
    ],
    emergencyExits: [
      { id: 'exit-main', x: 20, y: 20, label: 'Acil Çıkış' },
    ],
  },
  {
    id: 3,
    label: '3',
    name: '3. Kat',
    viewBox: '0 0 800 600',
    rooms: [
      { id: 'room-acil', name: 'Acil Çıkış', type: 'emergency', x: 20, y: 20, w: 80, h: 50 },
      { id: 'room-bilisim-1', name: 'Bilişim Atölyesi', type: 'workshop', x: 40, y: 120, w: 170, h: 100 },
      { id: 'room-bilisim-2', name: 'Yazılım Lab', type: 'workshop', x: 40, y: 240, w: 170, h: 100 },
      { id: 'room-bilisim-3', name: 'Siber Güvenlik Lab', type: 'workshop', x: 40, y: 360, w: 170, h: 100 },
      { id: 'room-12a', name: '12-A', type: 'classroom', x: 550, y: 120, w: 100, h: 100 },
      { id: 'room-12b', name: '12-B', type: 'classroom', x: 660, y: 120, w: 100, h: 100 },
      { id: 'room-12c', name: '12-C', type: 'classroom', x: 550, y: 240, w: 100, h: 100 },
      { id: 'room-12d', name: '12-D', type: 'classroom', x: 660, y: 240, w: 100, h: 100 },
      { id: 'room-depo', name: 'Depo', type: 'storage', x: 550, y: 360, w: 100, h: 60 },
      { id: 'room-wc-e', name: 'WC Erkek', type: 'wc', x: 400, y: 520, w: 70, h: 50 },
      { id: 'room-wc-k', name: 'WC Kız', type: 'wc', x: 480, y: 520, w: 70, h: 50 },
      { id: 'room-merdiven', name: 'Merdivenler', type: 'stairs', x: 300, y: 450, w: 100, h: 100 },
    ],
    walls: [
      // Dış çeper
      { x1: 10, y1: 10, x2: 790, y2: 10 },
      { x1: 790, y1: 10, x2: 790, y2: 590 },
      { x1: 790, y1: 590, x2: 10, y2: 590 },
      { x1: 10, y1: 590, x2: 10, y2: 10 },
      // Üst yatay iç duvar
      { x1: 10, y1: 100, x2: 240, y2: 100 },
      { x1: 530, y1: 100, x2: 790, y2: 100 },
      // Alt yatay iç duvar
      { x1: 10, y1: 480, x2: 290, y2: 480 },
      { x1: 510, y1: 480, x2: 790, y2: 480 },
      // Sol dikey iç duvar
      { x1: 240, y1: 100, x2: 240, y2: 480 },
      // Sağ dikey iç duvar
      { x1: 530, y1: 100, x2: 530, y2: 480 },
      // Sol blok iç bölme
      { x1: 40, y1: 230, x2: 220, y2: 230 },
      { x1: 40, y1: 350, x2: 220, y2: 350 },
      // Sağ blok iç bölme
      { x1: 550, y1: 230, x2: 770, y2: 230 },
      { x1: 550, y1: 350, x2: 770, y2: 350 },
      { x1: 650, y1: 120, x2: 650, y2: 230 },
      { x1: 650, y1: 240, x2: 650, y2: 350 },
      // WC üstü
      { x1: 390, y1: 480, x2: 560, y2: 480 },
      { x1: 390, y1: 480, x2: 390, y2: 580 },
      { x1: 560, y1: 480, x2: 560, y2: 580 },
      // Merdiven
      { x1: 290, y1: 440, x2: 410, y2: 440 },
      { x1: 290, y1: 440, x2: 290, y2: 560 },
      { x1: 410, y1: 440, x2: 410, y2: 560 },
    ],
    stairs: [
      { id: 'stair-main', x: 300, y: 450, connectsTo: [] },
    ],
    emergencyExits: [
      { id: 'exit-main', x: 20, y: 20, label: 'Acil Çıkış' },
    ],
  },
]

export const ROOM_TYPE_STYLES = {
  workshop:    { fill: 'rgba(6,182,212,0.05)', stroke: 'rgba(34,211,238,0.85)', label: 'text-cyan-400' },
  classroom:   { fill: 'rgba(16,185,129,0.05)', stroke: 'rgba(52,211,153,0.85)', label: 'text-emerald-400' },
  social:      { fill: 'rgba(245,158,11,0.05)', stroke: 'rgba(251,191,36,0.85)', label: 'text-amber-400' },
  admin:       { fill: 'rgba(168,85,247,0.05)', stroke: 'rgba(192,132,252,0.85)', label: 'text-purple-400' },
  emergency:   { fill: 'rgba(239,68,68,0.08)', stroke: 'rgba(248,113,113,0.95)', label: 'text-red-400' },
  stairs:      { fill: 'rgba(148,163,184,0.03)', stroke: 'rgba(203,213,225,0.65)', label: 'text-slate-400' },
  wc:          { fill: 'rgba(99,102,241,0.05)', stroke: 'rgba(129,140,248,0.75)', label: 'text-indigo-400' },
  storage:     { fill: 'rgba(100,116,139,0.05)', stroke: 'rgba(148,163,184,0.65)', label: 'text-slate-400' },
  entrance:    { fill: 'rgba(6,182,212,0.10)', stroke: 'rgba(34,211,238,0.95)', label: 'text-cyan-400' },
  club:        { fill: 'rgba(236,72,153,0.05)', stroke: 'rgba(244,114,182,0.75)', label: 'text-pink-400' },
}

export const PATH_NODES = {
  // Zemin kat düğümleri
  0: [
    { id: 'n-giris', x: 400, y: 80, roomId: 'room-giris' },
    { id: 'n-acil', x: 60, y: 70, roomId: 'room-acil' },
    { id: 'n-wc-e', x: 80, y: 170, roomId: 'room-wc-e' },
    { id: 'n-wc-k', x: 170, y: 170, roomId: 'room-wc-k' },
    { id: 'n-gezi', x: 125, y: 260, roomId: 'room-gezi' },
    { id: 'n-9a', x: 600, y: 170, roomId: 'room-9a' },
    { id: 'n-9b', x: 710, y: 170, roomId: 'room-9b' },
    { id: 'n-9c', x: 600, y: 270, roomId: 'room-9c' },
    { id: 'n-9d', x: 710, y: 270, roomId: 'room-9d' },
    { id: 'n-kutuphane', x: 655, y: 400, roomId: 'room-kutuphane' },
    { id: 'n-merdiven', x: 350, y: 500, roomId: 'room-merdiven' },
    { id: 'n-ataturk', x: 400, y: 510, roomId: 'room-ataturk' },
    // Koridor düğümleri
    { id: 'n-koridor-ust', x: 400, y: 100 },
    { id: 'n-koridor-sol', x: 140, y: 300 },
    { id: 'n-koridor-sag', x: 655, y: 300 },
    { id: 'n-koridor-alt', x: 400, y: 440 },
  ],
  // 1. kat düğümleri
  1: [
    { id: 'n-acil', x: 60, y: 70, roomId: 'room-acil' },
    { id: 'n-kantin', x: 400, y: 80, roomId: 'room-kantin' },
    { id: 'n-elektrik-1', x: 125, y: 170, roomId: 'room-elektrik-1' },
    { id: 'n-elektrik-2', x: 125, y: 290, roomId: 'room-elektrik-2' },
    { id: 'n-elektrik-3', x: 125, y: 410, roomId: 'room-elektrik-3' },
    { id: 'n-10a', x: 320, y: 170, roomId: 'room-10a' },
    { id: 'n-10b', x: 430, y: 170, roomId: 'room-10b' },
    { id: 'n-10c', x: 320, y: 290, roomId: 'room-10c' },
    { id: 'n-10d', x: 430, y: 290, roomId: 'room-10d' },
    { id: 'n-11a', x: 600, y: 170, roomId: 'room-11a' },
    { id: 'n-11b', x: 710, y: 170, roomId: 'room-11b' },
    { id: 'n-11c', x: 600, y: 290, roomId: 'room-11c' },
    { id: 'n-11d', x: 710, y: 290, roomId: 'room-11d' },
    { id: 'n-ogretmenler', x: 655, y: 400, roomId: 'room-ogretmenler' },
    { id: 'n-mudur1', x: 655, y: 490, roomId: 'room-mudur1' },
    { id: 'n-merdiven', x: 350, y: 500, roomId: 'room-merdiven' },
    // Koridor düğümleri
    { id: 'n-koridor-ust', x: 400, y: 100 },
    { id: 'n-koridor-sol', x: 140, y: 300 },
    { id: 'n-koridor-orta', x: 380, y: 300 },
    { id: 'n-koridor-sag', x: 655, y: 300 },
    { id: 'n-koridor-alt', x: 400, y: 440 },
  ],
  // 2. kat düğümleri
  2: [
    { id: 'n-acil', x: 60, y: 70, roomId: 'room-acil' },
    { id: 'n-mudur2', x: 600, y: 55, roomId: 'room-mudur2' },
    { id: 'n-mudur3', x: 710, y: 55, roomId: 'room-mudur3' },
    { id: 'n-mudur', x: 655, y: 130, roomId: 'room-mudur' },
    { id: 'n-depo', x: 600, y: 210, roomId: 'room-depo' },
    { id: 'n-konferans', x: 655, y: 350, roomId: 'room-konferans' },
    { id: 'n-kimya-1', x: 125, y: 170, roomId: 'room-kimya-1' },
    { id: 'n-kimya-2', x: 125, y: 290, roomId: 'room-kimya-2' },
    { id: 'n-kimya-3', x: 125, y: 410, roomId: 'room-kimya-3' },
    { id: 'n-wc-e', x: 435, y: 555, roomId: 'room-wc-e' },
    { id: 'n-wc-k', x: 515, y: 555, roomId: 'room-wc-k' },
    { id: 'n-merdiven', x: 350, y: 500, roomId: 'room-merdiven' },
    // Koridor düğümleri
    { id: 'n-koridor-ust', x: 400, y: 100 },
    { id: 'n-koridor-sol', x: 140, y: 300 },
    { id: 'n-koridor-sag', x: 655, y: 300 },
    { id: 'n-koridor-alt', x: 400, y: 440 },
  ],
  // 3. kat düğümleri
  3: [
    { id: 'n-acil', x: 60, y: 70, roomId: 'room-acil' },
    { id: 'n-bilisim-1', x: 125, y: 170, roomId: 'room-bilisim-1' },
    { id: 'n-bilisim-2', x: 125, y: 290, roomId: 'room-bilisim-2' },
    { id: 'n-bilisim-3', x: 125, y: 410, roomId: 'room-bilisim-3' },
    { id: 'n-12a', x: 600, y: 170, roomId: 'room-12a' },
    { id: 'n-12b', x: 710, y: 170, roomId: 'room-12b' },
    { id: 'n-12c', x: 600, y: 290, roomId: 'room-12c' },
    { id: 'n-12d', x: 710, y: 290, roomId: 'room-12d' },
    { id: 'n-depo', x: 600, y: 400, roomId: 'room-depo' },
    { id: 'n-wc-e', x: 435, y: 555, roomId: 'room-wc-e' },
    { id: 'n-wc-k', x: 515, y: 555, roomId: 'room-wc-k' },
    { id: 'n-merdiven', x: 350, y: 500, roomId: 'room-merdiven' },
    // Koridor düğümleri
    { id: 'n-koridor-ust', x: 400, y: 100 },
    { id: 'n-koridor-sol', x: 140, y: 300 },
    { id: 'n-koridor-sag', x: 655, y: 300 },
    { id: 'n-koridor-alt', x: 400, y: 440 },
  ],
}

// Her düğümün komşuları (sadece aynı kat)
export const PATH_EDGES = {
  0: {
    'n-giris': ['n-koridor-ust'],
    'n-acil': ['n-koridor-ust'],
    'n-wc-e': ['n-koridor-sol'],
    'n-wc-k': ['n-koridor-sol'],
    'n-gezi': ['n-koridor-sol'],
    'n-9a': ['n-koridor-sag'], 'n-9b': ['n-koridor-sag'],
    'n-9c': ['n-koridor-sag'], 'n-9d': ['n-koridor-sag'],
    'n-kutuphane': ['n-koridor-sag'],
    'n-merdiven': ['n-koridor-alt'],
    'n-ataturk': ['n-koridor-alt'],
    'n-koridor-ust': ['n-giris', 'n-acil', 'n-koridor-sol', 'n-koridor-sag'],
    'n-koridor-sol': ['n-koridor-ust', 'n-wc-e', 'n-wc-k', 'n-gezi', 'n-koridor-alt'],
    'n-koridor-sag': ['n-koridor-ust', 'n-9a', 'n-9b', 'n-9c', 'n-9d', 'n-kutuphane', 'n-koridor-alt'],
    'n-koridor-alt': ['n-koridor-sol', 'n-koridor-sag', 'n-merdiven', 'n-ataturk'],
  },
  1: {
    'n-acil': ['n-koridor-ust'],
    'n-kantin': ['n-koridor-ust'],
    'n-elektrik-1': ['n-koridor-sol'], 'n-elektrik-2': ['n-koridor-sol'], 'n-elektrik-3': ['n-koridor-sol'],
    'n-10a': ['n-koridor-orta'], 'n-10b': ['n-koridor-orta'], 'n-10c': ['n-koridor-orta'], 'n-10d': ['n-koridor-orta'],
    'n-11a': ['n-koridor-sag'], 'n-11b': ['n-koridor-sag'], 'n-11c': ['n-koridor-sag'], 'n-11d': ['n-koridor-sag'],
    'n-ogretmenler': ['n-koridor-sag'], 'n-mudur1': ['n-koridor-sag'],
    'n-merdiven': ['n-koridor-alt'],
    'n-koridor-ust': ['n-acil', 'n-kantin', 'n-koridor-sol', 'n-koridor-orta', 'n-koridor-sag'],
    'n-koridor-sol': ['n-koridor-ust', 'n-elektrik-1', 'n-elektrik-2', 'n-elektrik-3', 'n-koridor-alt'],
    'n-koridor-orta': ['n-koridor-ust', 'n-10a', 'n-10b', 'n-10c', 'n-10d', 'n-koridor-alt'],
    'n-koridor-sag': ['n-koridor-ust', 'n-11a', 'n-11b', 'n-11c', 'n-11d', 'n-ogretmenler', 'n-mudur1', 'n-koridor-alt'],
    'n-koridor-alt': ['n-koridor-sol', 'n-koridor-orta', 'n-koridor-sag', 'n-merdiven'],
  },
  2: {
    'n-acil': ['n-koridor-ust'],
    'n-mudur2': ['n-koridor-ust'], 'n-mudur3': ['n-koridor-ust'], 'n-mudur': ['n-koridor-ust'],
    'n-depo': ['n-koridor-sag'], 'n-konferans': ['n-koridor-sag'],
    'n-kimya-1': ['n-koridor-sol'], 'n-kimya-2': ['n-koridor-sol'], 'n-kimya-3': ['n-koridor-sol'],
    'n-wc-e': ['n-koridor-alt'], 'n-wc-k': ['n-koridor-alt'],
    'n-merdiven': ['n-koridor-alt'],
    'n-koridor-ust': ['n-acil', 'n-mudur2', 'n-mudur3', 'n-mudur', 'n-koridor-sol', 'n-koridor-sag'],
    'n-koridor-sol': ['n-koridor-ust', 'n-kimya-1', 'n-kimya-2', 'n-kimya-3', 'n-koridor-alt'],
    'n-koridor-sag': ['n-koridor-ust', 'n-depo', 'n-konferans', 'n-koridor-alt'],
    'n-koridor-alt': ['n-koridor-sol', 'n-koridor-sag', 'n-merdiven', 'n-wc-e', 'n-wc-k'],
  },
  3: {
    'n-acil': ['n-koridor-ust'],
    'n-bilisim-1': ['n-koridor-sol'], 'n-bilisim-2': ['n-koridor-sol'], 'n-bilisim-3': ['n-koridor-sol'],
    'n-12a': ['n-koridor-sag'], 'n-12b': ['n-koridor-sag'], 'n-12c': ['n-koridor-sag'], 'n-12d': ['n-koridor-sag'],
    'n-depo': ['n-koridor-sag'],
    'n-wc-e': ['n-koridor-alt'], 'n-wc-k': ['n-koridor-alt'],
    'n-merdiven': ['n-koridor-alt'],
    'n-koridor-ust': ['n-acil', 'n-koridor-sol', 'n-koridor-sag'],
    'n-koridor-sol': ['n-koridor-ust', 'n-bilisim-1', 'n-bilisim-2', 'n-bilisim-3', 'n-koridor-alt'],
    'n-koridor-sag': ['n-koridor-ust', 'n-12a', 'n-12b', 'n-12c', 'n-12d', 'n-depo', 'n-koridor-alt'],
    'n-koridor-alt': ['n-koridor-sol', 'n-koridor-sag', 'n-merdiven', 'n-wc-e', 'n-wc-k'],
  },
}

export function findPath(startFloor, startRoomId, targetFloor, targetRoomId) {
  if (startFloor === targetFloor && startRoomId === targetRoomId) return []

  const nodes = PATH_NODES[startFloor]
  const edges = PATH_EDGES[startFloor]
  if (!nodes || !edges) return null

  // roomId -> node id bul
  const findNodeByRoom = (roomId) => {
    const n = nodes.find(node => node.roomId === roomId)
    return n ? n.id : null
  }

  const startNodeId = findNodeByRoom(startRoomId)
  const targetNodeId = findNodeByRoom(targetRoomId)
  if (!startNodeId || !targetNodeId) return null

  // BFS
  const queue = [[{ nodeId: startNodeId, floor: startFloor }]]
  const visited = new Set([`${startFloor}:${startNodeId}`])

  while (queue.length > 0) {
    const path = queue.shift()
    const last = path[path.length - 1]
    const neighbors = edges[last.nodeId] || []

    for (const neighborId of neighbors) {
      const key = `${last.floor}:${neighborId}`
      if (visited.has(key)) continue
      visited.add(key)
      const newPath = [...path, { nodeId: neighborId, floor: last.floor }]
      if (neighborId === targetNodeId) {
        // node id'leri room id'lere çevir
        return newPath.map(p => {
          const n = nodes.find(node => node.id === p.nodeId)
          return { roomId: n?.roomId || p.nodeId, floor: p.floor, x: n?.x, y: n?.y }
        })
      }
      queue.push(newPath)
    }
  }

  return null
}
