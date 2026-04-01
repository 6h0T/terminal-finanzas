import { NextResponse } from "next/server"
import { USA_SECTOR_SYMBOLS } from "@/lib/usa-stocks-categories"

const USA_STOCKS_API = "https://data912.com/live/usa_stocks"

interface MarketItem {
  symbol: string
  c: number
  v: number
  q_bid: number
  px_bid: number
  px_ask: number
  q_ask: number
  q_op: number
  pct_change: number
}

async function fetchUsaStocks(): Promise<MarketItem[]> {
  try {
    const response = await fetch(USA_STOCKS_API, {
      next: { revalidate: 30 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching USA stocks:", error)
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

function categorizeStocks(allStocks: MarketItem[]) {
  const symbolSet = new Map<string, MarketItem>()
  for (const stock of allStocks) {
    symbolSet.set(stock.symbol, stock)
  }

  const categorized: Record<string, MarketItem[]> = {
    tech: [],
    financial: [],
    energy: [],
    healthcare: [],
    consumer: [],
    industrial: [],
    realestate: [],
    etf: [],
  }

  for (const [category, symbols] of Object.entries(USA_SECTOR_SYMBOLS)) {
    for (const sym of symbols) {
      const stock = symbolSet.get(sym)
      if (stock) {
        categorized[category].push(stock)
      }
    }
  }

  return categorized
}

export async function GET() {
  try {
    const allStocks = await fetchUsaStocks()
    const categorized = categorizeStocks(allStocks)

    const data = {
      tech: transformMarketData(categorized.tech, "tech"),
      financial: transformMarketData(categorized.financial, "financial"),
      energy: transformMarketData(categorized.energy, "energy"),
      healthcare: transformMarketData(categorized.healthcare, "healthcare"),
      consumer: transformMarketData(categorized.consumer, "consumer"),
      industrial: transformMarketData(categorized.industrial, "industrial"),
      realestate: transformMarketData(categorized.realestate, "realestate"),
      etf: transformMarketData(categorized.etf, "etf"),
      all: transformMarketData(allStocks, "all"),
    }

    const summary = {
      totalTech: categorized.tech.length,
      totalFinancial: categorized.financial.length,
      totalEnergy: categorized.energy.length,
      totalHealthcare: categorized.healthcare.length,
      totalConsumer: categorized.consumer.length,
      totalIndustrial: categorized.industrial.length,
      totalRealestate: categorized.realestate.length,
      totalEtf: categorized.etf.length,
      totalAll: allStocks.length,
    }

    return NextResponse.json({
      data,
      summary,
      lastUpdate: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in USA Stocks API:", error)
    return NextResponse.json(
      { error: "Error al obtener cotizaciones del mercado USA" },
      { status: 500 }
    )
  }
}
