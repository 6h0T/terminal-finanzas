import { NextResponse } from "next/server"
import { getSnapshotsForSymbols, sampleSnapshots } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbolsParam = searchParams.get("symbols")
    
    if (!symbolsParam) {
      return NextResponse.json({ error: "symbols parameter required" }, { status: 400 })
    }
    
    const symbols = symbolsParam.split(",").map(s => s.trim()).filter(Boolean)
    if (symbols.length === 0) {
      return NextResponse.json({ error: "No valid symbols provided" }, { status: 400 })
    }
    
    const today = new Date().toISOString().split("T")[0]
    const snapshotsMap = getSnapshotsForSymbols(symbols, today)
    
    const result: Record<string, number[]> = {}
    
    for (const symbol of symbols) {
      const snapshots = snapshotsMap.get(symbol) || []
      result[symbol] = sampleSnapshots(snapshots, 48)
    }
    
    return NextResponse.json({
      data: result,
      date: today,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error in historico API:", error)
    return NextResponse.json(
      { error: "Error al obtener datos históricos" },
      { status: 500 }
    )
  }
}
