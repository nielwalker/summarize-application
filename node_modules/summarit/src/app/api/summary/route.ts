import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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

  const prompt = `Summarize the following practicum weekly reports in 3-5 sentences. Then estimate alignment (0-100) for PO1..PO15 as integers.
Return strict JSON: {"summary": string, "poScores": [15 numbers] }.
Text:\n${inputText}`

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
          { role: 'system', content: 'You are a concise summarizer that outputs strict JSON.' },
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


