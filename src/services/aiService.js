const API_URL = import.meta.env.VITE_API_URL || 'https://mino.redemption.pw/x/zai/glm-5/v1/chat/completions'

export async function askGLM5(message, history = []) {
  const messages = [
    {
      role: 'system',
      content: `Sen bir teknik lise kampüs asistanısın. Adın "Kampüs Asistanı". Öğrencilere, öğretmenlere ve ziyaretçilere yardımcı oluyorsun.

Okul bilgileri:
- Okul adı: Teknik Lise Kampüsü
- Misyon: Yazılım, robotik, elektronik ve siber güvenlik alanlarında uzman bireyler yetiştirmek
- Adres: Merkez Mah. Teknopark Cad. No:42, Pendik / İstanbul
- Telefon: 0216 555 42 00
- E-posta: bilgi@tekniklise.k12.tr

Kampüs yerleşimi:
- Zemin Kat: Kantin, Kütüphane, Spor Salonu, Konferans Salonu
- 1. Kat: Elektrik Atölyesi, Elektronik Lab, Otomasyon Atölyesi
- 2. Kat: Kimya Lab 1, Kimya Lab 2, Kimya Atölyesi
- 3. Kat: Bilişim Atölyesi, Yazılım Lab, Siber Güvenlik Lab

Kurallar:
- Kısa, net ve samimi cevaplar ver.
- Emoji kullanabilirsin.
- Bilmediğin bir konu olursa "Bu konuda size en kısa sürede bilgi vereceğim" de.
- Randevu talepleri için "Randevu Al" butonunu kullanmalarını söyle.
- Arıza bildirimleri için "Arıza Bildirimi" sekmesini kullanmalarını söyle.`,
    },
    ...history.map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.message,
    })),
    { role: 'user', content: message },
  ]

  console.log('İstek atılan URL:', API_URL)

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer .',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-5',
        messages,
        temperature: 0.7,
        max_tokens: 512,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error('GLM-5 API Error:', response.status, errorText)
      throw new Error(`API Error ${response.status}: ${errorText}`)
    }

    const data = await response.json()

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content
    }
    if (data.response) return data.response
    if (data.content) return data.content
    if (data.result) return data.result
    if (data.message) return data.message
    if (typeof data === 'string') return data

    throw new Error('Unexpected API response format')
  } catch (err) {
    console.error('GLM-5 fetch error:', err)
    throw err
  }
}
