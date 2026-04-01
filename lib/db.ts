import path from "path"
import fs from "fs"

const dataDir = path.join(process.cwd(), "data")
const dataPath = path.join(dataDir, "market-history.json")

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export interface PriceSnapshot {
  symbol: string
  price: number
  pct_change: number
  timestamp: number
  date: string
}

interface HistoryData {
  [date: string]: {
    [symbol: string]: PriceSnapshot[]
  }
}

let historyCache: HistoryData = {}
let lastSaveTime = 0
const SAVE_INTERVAL = 30000

function loadHistory(): HistoryData {
  // Disabled in production (Vercel filesystem is read-only)
  if (process.env.NODE_ENV === 'production') {
    return {}
  }
  
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, "utf-8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading history:", error)
  }
  return {}
}

function saveHistory() {
  // Disabled in production (Vercel filesystem is read-only)
  // Data is kept in memory only
  if (process.env.NODE_ENV === 'production') {
    return
  }
  
  try {
    const now = Date.now()
    if (now - lastSaveTime < SAVE_INTERVAL) return
    
    const today = new Date().toISOString().split("T")[0]
    const filtered: HistoryData = {}
    
    if (historyCache[today]) {
      filtered[today] = historyCache[today]
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2))
    lastSaveTime = now
  } catch (error) {
    console.error("Error saving history:", error)
  }
}

historyCache = loadHistory()

export function saveSnapshot(snapshot: PriceSnapshot) {
  try {
    const { date, symbol } = snapshot
    
    if (!historyCache[date]) {
      historyCache[date] = {}
    }
    
    if (!historyCache[date][symbol]) {
      historyCache[date][symbol] = []
    }
    
    historyCache[date][symbol].push(snapshot)
    
    if (historyCache[date][symbol].length > 2880) {
      historyCache[date][symbol] = historyCache[date][symbol].slice(-2880)
    }
    
    saveHistory()
  } catch (error) {
    console.error("Error saving snapshot:", error)
  }
}

export function getSnapshotsForSymbol(symbol: string, date: string): PriceSnapshot[] {
  try {
    return historyCache[date]?.[symbol] || []
  } catch (error) {
    console.error("Error getting snapshots:", error)
    return []
  }
}

export function getSnapshotsForSymbols(symbols: string[], date: string): Map<string, PriceSnapshot[]> {
  try {
    const result = new Map<string, PriceSnapshot[]>()
    
    for (const symbol of symbols) {
      const snapshots = historyCache[date]?.[symbol] || []
      if (snapshots.length > 0) {
        result.set(symbol, snapshots)
      }
    }
    
    return result
  } catch (error) {
    console.error("Error getting snapshots for symbols:", error)
    return new Map()
  }
}

export function sampleSnapshots(snapshots: PriceSnapshot[], maxPoints: number = 48): number[] {
  if (snapshots.length === 0) return []
  if (snapshots.length <= maxPoints) {
    return snapshots.map(s => s.price)
  }
  
  const step = Math.floor(snapshots.length / maxPoints)
  const sampled: number[] = []
  
  for (let i = 0; i < snapshots.length; i += step) {
    if (sampled.length >= maxPoints) break
    sampled.push(snapshots[i].price)
  }
  
  return sampled
}
