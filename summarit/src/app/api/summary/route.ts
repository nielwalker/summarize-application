import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  // Include dev header for quick testing
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-openai-key'
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders as Record<string, string> })
}

export async function POST(req: NextRequest) {
  const { text } = await req.json().catch(() => ({ text: '' })) as { text: string }
  // If no text provided, aggregate from recent reports for simple demo
  let inputText = text
  if (!inputText) {
    const recent = await prisma.weeklyReport.findMany({ take: 20, orderBy: { id: 'desc' } })
    inputText = recent.map(r => `Week ${r.weekNumber}: ${r.activities}. Learnings: ${r.learnings}. Score: ${r.score}.`).join(' ')
  }

  // Prefer server env; allow dev override via header for local testing
  const headerKey = req.headers.get('x-openai-key') || undefined
  const apiKey = process.env.OPENAI_API_KEY || headerKey
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing OPENAI_API_KEY. Set it in .env.local or send x-openai-key header (dev only).', summary: '', poScores: [] },
      { status: 500, headers: corsHeaders as Record<string, string> }
    )
  }

  const poDefinitions = `
PO1 (A): Apply knowledge of computing, science, and mathematics in solving computing/IT-related problems.
PO2 (B): Use current best practices and standards in solving complex computing/IT-related problems.
PO3 (C): Analyze complex computing/IT-related problems; define appropriate computing requirements.
PO4 (D): Identify and analyze user needs and consider them in computer-based systems.
PO5 (E): Design, implement, and evaluate computer-based systems to meet needs under constraints.
PO6 (F): Integrate IT-based solutions considering public health/safety, cultural, societal, environmental concerns.
PO7 (G): Select/adapt/apply appropriate techniques, resources, skills, and modern tools with awareness of limits.
PO8 (H): Work effectively individually and in diverse/multidisciplinary/multicultural teams; lead when needed.
PO9 (I): Assist in the creation of effective IT project plans.
PO10 (J): Communicate effectively in oral and written forms to diverse audiences.
PO11 (K): Assess local/global impact of IT on individuals, organizations, and society.
PO12 (L): Act ethically and responsibly regarding professional, legal, security, and social considerations.
PO13 (M): Pursue independent learning; keep pace with latest IT developments (DB/IS, Networks, CV/Imaging).
PO14 (N): Participate in R&D aligned to local/national goals; contribute to the economy.
PO15 (O): Preserve and promote Filipino historical and cultural heritage.
`

  const prompt = `You are scoring practicum weekly reports against Program Outcomes (PO1..PO15). Use ONLY the following PO definitions as your rubric:\n\n${poDefinitions}\n\nTask:\n1) Summarize the learner's work in 3-5 concise sentences.\n2) Return a numeric alignment score for each PO1..PO15 in [0,100], integers only. A PO with no clear evidence must get 0. Do not infer beyond the text.\n\nReturn strict JSON exactly as: {"summary": string, "poScores": [15 numbers in order PO1..PO15] }.\n\nReports text:\n${inputText}`

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You output STRICT JSON only. No prose outside JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    })

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '')
      return NextResponse.json(
        { error: 'OpenAI request failed', details: errText },
        { status: 502, headers: corsHeaders as Record<string, string> }
      )
    }

    const data = await resp.json() as any
    const content: string | undefined = data?.choices?.[0]?.message?.content

    let parsed: { summary: string; poScores: number[] } = { summary: '', poScores: [] }
    if (content) {
      try {
        parsed = JSON.parse(content)
      } catch {
        // attempt to extract JSON block
        const match = content.match(/\{[\s\S]*\}/)
        if (match) parsed = JSON.parse(match[0])
      }
    }

    // Fallback shape to avoid frontend crashes
    if (!Array.isArray(parsed.poScores) || parsed.poScores.length !== 15) {
      parsed.poScores = Array.from({ length: 15 }, () => 0)
    }

    return NextResponse.json(parsed, { headers: corsHeaders as Record<string, string> })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Unexpected server error', details: String(error) },
      { status: 500, headers: corsHeaders as Record<string, string> }
    )
  }
}


