// api/analyze.js — Vercel 서버리스 함수
// ⚠️ 아래 API 키를 실제 키로 교체하세요
const OPENAI_API_KEY = 'process.env.OPENAI_API_KEY'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { images } = req.body
    if (!images || !images.length) return res.status(400).json({ error: '이미지가 없어요.' })

    const systemPrompt = `당신은 대한민국 고등학교 학생부(생활기록부)에서 내신 등급 정보를 추출하는 전문가입니다.
학생부 이미지를 분석하여 학년별·과목별 내신 석차등급을 추출하고 반드시 아래 JSON 형식으로만 응답하세요.
다른 텍스트 없이 JSON만 출력하세요.

{
  "grades": [
    {"year": "1학년", "semester": "1학기", "subject": "국어", "grade": 3},
    {"year": "1학년", "semester": "1학기", "subject": "수학", "grade": 4}
  ],
  "average": 3.5,
  "summary": "1학년 평균 3.2, 2학년 평균 3.8, 3학년 1학기 평균 3.5"
}`

    const imageContents = images.map(img => ({
      type: 'image_url',
      image_url: { url: img }
    }))

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 2000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: [
            { type: 'text', text: '다음 학생부 이미지에서 내신 석차등급 정보를 추출해주세요.' },
            ...imageContents
          ]}
        ]
      })
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'GPT 오류')
    }

    const data = await response.json()
    const raw = data.choices[0].message.content.replace(/```json|```/g, '').trim()
    const result = JSON.parse(raw)
    res.status(200).json(result)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
