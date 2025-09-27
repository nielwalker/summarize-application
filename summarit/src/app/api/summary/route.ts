import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-openai-key'
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders as Record<string, string> })
}

export async function POST(req: NextRequest) {
  const { text, section, studentId } = await req.json().catch(() => ({ text: '', section: undefined, studentId: undefined })) as { text: string; section?: string; studentId?: string }

  // If no text provided, aggregate from recent reports
  let inputText = text
  if (!inputText) {
    const where: any = {}
    if (section) where.section = section
    if (studentId) where.studentId = studentId

    const recent = await prisma.weeklyReport.findMany({ 
      where, 
      take: 50, 
      orderBy: { id: 'desc' } 
    })

    inputText = recent.map(r => {
      const student = r.userName || r.studentId || 'Unknown'
      return `Student: ${student} | Week ${r.weekNumber} | Activities: ${r.activities} | Learnings: ${r.learnings} | Hours: ${r.hours} | Score: ${r.score}`
    }).join('\n')

    if (!inputText.trim()) {
      return NextResponse.json(
        { summary: 'No reports found for the selected criteria.', poScores: Array.from({ length: 15 }, () => 0) },
        { headers: corsHeaders as Record<string, string> }
      )
    }
  }

  // Prefer server env; allow dev override via header
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

  const prompt = `
You are an expert evaluator analyzing practicum weekly reports against Program Outcomes (PO1–PO15). 
You must follow strict keyword matching methodology.

PO DEFINITIONS (use as rubric, do not paraphrase):
${poDefinitions}

METHODOLOGY:
1. Count keyword matches for each PO.
2. TotalMatches = sum of all matches across all POs.
3. For each PO, calculate percentage:
   (MatchesForPO ÷ TotalMatches) × 100
4. If TotalMatches = 0, return all zeros.
5. Only assign scores to POs with actual keyword matches.
6. All percentages must be integers and the array must sum to 100 (normalize if needed).
7. Create a compact technical summary (≤ 15 words) highlighting main actions, tools, or topics found.

OUTPUT FORMAT (strict JSON only):
{
  "summary": "compact technical summary",
  "poScores": [15 integers, each 0–100, must sum to 100]
}

REPORTS TO ANALYZE (section=${section ?? 'ALL'}):
${inputText}
`

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
          { 
            role: 'system', 
            content: 'You are a precise evaluator. Output ONLY valid JSON. No explanations outside JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 500,
        top_p: 0.9
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
        const match = content.match(/\{[\s\S]*\}/)
        if (match) parsed = JSON.parse(match[0])
      }
    }

    if (!Array.isArray(parsed.poScores) || parsed.poScores.length !== 15) {
      parsed.poScores = Array.from({ length: 15 }, () => 0)
    }

    if (parsed.summary && parsed.summary.split(' ').length > 15) {
      const words = parsed.summary.split(' ')
      parsed.summary = words.slice(0, 15).join(' ') + '...'
    }

    parsed.poScores = parsed.poScores.map(score => {
      const num = Number(score)
      return isNaN(num) ? 0 : Math.max(0, Math.min(100, Math.round(num)))
    })

    const totalScore = parsed.poScores.reduce((sum, score) => sum + score, 0)
    if (totalScore > 0 && totalScore !== 100) {
      parsed.poScores = parsed.poScores.map(score => 
        Math.round((score / totalScore) * 100)
      )
    }

    return NextResponse.json(parsed, { headers: corsHeaders as Record<string, string> })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Unexpected server error', details: String(error) },
      { status: 500, headers: corsHeaders as Record<string, string> }
    )
  }
}
