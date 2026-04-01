import { NextResponse } from "next/server"

// Endpoints de la API data912.com
const API_ENDPOINTS = {
  cedears: "https://data912.com/live/arg_cedears",
  acciones: "https://data912.com/live/arg_stocks",
  bonos: "https://data912.com/live/arg_bonds",
  letras: "https://data912.com/live/arg_notes",
  obligaciones: "https://data912.com/live/arg_corp",
  opciones: "https://data912.com/live/arg_options",
}

// Dolar API
const DOLAR_API = "https://dolarapi.com/v1/dolares"

interface MarketItem {
  symbol: string
  c: number // precio actual
  v: number // volumen
  q_bid: number // cantidad bid
  px_bid: number // precio bid
  px_ask: number // precio ask
  q_ask: number // cantidad ask
  q_op: number // operaciones diarias
  pct_change: number // variación porcentual
}

interface DolarData {
  casa: string
  compra: number
  venta: number
}

async function fetchMarketData(endpoint: string): Promise<MarketItem[]> {
  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 30 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return []
  }
}

async function fetchDolarData(): Promise<DolarData[]> {
  try {
    const response = await fetch(DOLAR_API, {
      next: { revalidate: 60 },
    })
    if (!response.ok) throw new Error("Failed to fetch dolar")
    return await response.json()
  } catch (error) {
    console.error("Error fetching dolar:", error)
    return []
  }
}

function transformMarketData(items: MarketItem[], category: string) {
  return items.map((item, index) => ({
    id: item.symbol,
    symbol: item.symbol,
    name: item.symbol,
    category,
    num: `${index + 1})`,
    value: item.c || 0,
    change: ((item.c || 0) * (item.pct_change || 0)) / 100,
    pctChange: item.pct_change || 0,
    volume: item.v || 0,
    bid: item.px_bid || 0,
    ask: item.px_ask || 0,
    bidQty: item.q_bid || 0,
    askQty: item.q_ask || 0,
    operations: item.q_op || 0,
    time: new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "all"

  try {
    // Fetch all data in parallel
    const [cedears, acciones, bonos, letras, obligaciones, opciones, dolarData] = await Promise.all([
      category === "all" || category === "cedears" ? fetchMarketData(API_ENDPOINTS.cedears) : Promise.resolve([]),
      category === "all" || category === "acciones" ? fetchMarketData(API_ENDPOINTS.acciones) : Promise.resolve([]),
      category === "all" || category === "bonos" ? fetchMarketData(API_ENDPOINTS.bonos) : Promise.resolve([]),
      category === "all" || category === "letras" ? fetchMarketData(API_ENDPOINTS.letras) : Promise.resolve([]),
      category === "all" || category === "obligaciones" ? fetchMarketData(API_ENDPOINTS.obligaciones) : Promise.resolve([]),
      category === "all" || category === "opciones" ? fetchMarketData(API_ENDPOINTS.opciones) : Promise.resolve([]),
      fetchDolarData(),
    ])

    // Transform data
    const data = {
      cedears: transformMarketData(cedears, "cedears"),
      acciones: transformMarketData(acciones, "acciones"),
      bonos: transformMarketData(bonos, "bonos"),
      letras: transformMarketData(letras, "letras"),
      obligaciones: transformMarketData(obligaciones, "obligaciones"),
      opciones: transformMarketData(opciones, "opciones"),
    }

    // Extract dolar values
    const dolar = {
      oficial: dolarData.find((d) => d.casa === "oficial"),
      blue: dolarData.find((d) => d.casa === "blue"),
      bolsa: dolarData.find((d) => d.casa === "bolsa"),
      ccl: dolarData.find((d) => d.casa === "contadoconliqui"),
      mayorista: dolarData.find((d) => d.casa === "mayorista"),
      cripto: dolarData.find((d) => d.casa === "cripto"),
      tarjeta: dolarData.find((d) => d.casa === "tarjeta"),
    }

    // Summary counts
    const summary = {
      totalCedears: cedears.length,
      totalAcciones: acciones.length,
      totalBonos: bonos.length,
      totalLetras: letras.length,
      totalObligaciones: obligaciones.length,
      totalOpciones: opciones.length,
    }

    return NextResponse.json({
      data,
      dolar,
      summary,
      lastUpdate: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in Market API:", error)
    return NextResponse.json(
      { error: "Error al obtener cotizaciones del mercado" },
      { status: 500 }
    )
  }
}
