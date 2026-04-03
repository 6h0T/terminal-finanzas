import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { hashIP, generateAnonId } from "@/lib/anon"

const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_MS = 5000

async function getOrCreateAnonId(ipHash: string): Promise<string> {
  const { data: existing } = await supabase
    .from("anon_ids")
    .select("anon_id")
    .eq("ip_hash", ipHash)
    .single()

  if (existing) return existing.anon_id

  const anonId = generateAnonId()
  
  const { error } = await supabase
    .from("anon_ids")
    .insert({ ip_hash: ipHash, anon_id: anonId })

  if (error) {
    // Race condition: another request already created it
    const { data: retry } = await supabase
      .from("anon_ids")
      .select("anon_id")
      .eq("ip_hash", ipHash)
      .single()
    if (retry) return retry.anon_id
    throw new Error("Failed to create anon ID")
  }

  return anonId
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("id, anon_id, content, created_at")
      .order("created_at", { ascending: true })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ messages: data })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Error al obtener mensajes" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
      || request.headers.get("x-real-ip") 
      || "unknown"
    
    const ipHash = hashIP(ip)

    // Rate limiting
    const lastMessage = rateLimitMap.get(ipHash)
    if (lastMessage && Date.now() - lastMessage < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: "Esperá unos segundos antes de enviar otro mensaje" },
        { status: 429 }
      )
    }

    const body = await request.json()
    const content = body.content?.trim()

    if (!content || content.length === 0) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "El mensaje no puede superar los 500 caracteres" },
        { status: 400 }
      )
    }

    const anonId = await getOrCreateAnonId(ipHash)

    const { data, error } = await supabase
      .from("messages")
      .insert({ anon_id: anonId, content })
      .select("id, anon_id, content, created_at")
      .single()

    if (error) throw error

    rateLimitMap.set(ipHash, Date.now())

    return NextResponse.json({ message: data })
  } catch (error) {
    console.error("Error posting message:", error)
    return NextResponse.json(
      { error: "Error al enviar mensaje" },
      { status: 500 }
    )
  }
}
