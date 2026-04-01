"use client"

import { useMemo } from "react"

interface MarketItem {
  id: string
  symbol: string
  name: string
  category: string
  num: string
  value: number
  change: number
  pctChange: number
  volume: number
  bid: number
  ask: number
  bidQty: number
  askQty: number
  operations: number
  time: string
}

interface CedearHeatmapProps {
  data: MarketItem[]
  isDarkMode: boolean
}

// Mapeo de CEDEARs a sectores
const SECTOR_MAP: Record<string, string> = {
  // Tecnologia
  AAPL: "Tecnologia",
  MSFT: "Tecnologia",
  GOOGL: "Tecnologia",
  GOOG: "Tecnologia",
  META: "Tecnologia",
  AMZN: "Tecnologia",
  NVDA: "Tecnologia",
  AMD: "Tecnologia",
  INTC: "Tecnologia",
  TSLA: "Tecnologia",
  NFLX: "Tecnologia",
  CRM: "Tecnologia",
  ORCL: "Tecnologia",
  IBM: "Tecnologia",
  CSCO: "Tecnologia",
  ADBE: "Tecnologia",
  PYPL: "Tecnologia",
  SQ: "Tecnologia",
  UBER: "Tecnologia",
  SNAP: "Tecnologia",
  SPOT: "Tecnologia",
  SHOP: "Tecnologia",
  MELI: "Tecnologia",
  GLOB: "Tecnologia",
  
  // Finanzas
  JPM: "Finanzas",
  BAC: "Finanzas",
  WFC: "Finanzas",
  C: "Finanzas",
  GS: "Finanzas",
  MS: "Finanzas",
  V: "Finanzas",
  MA: "Finanzas",
  AXP: "Finanzas",
  BRK: "Finanzas",
  BRKB: "Finanzas",
  BLK: "Finanzas",
  SCHW: "Finanzas",
  
  // Energia
  XOM: "Energia",
  CVX: "Energia",
  COP: "Energia",
  SLB: "Energia",
  EOG: "Energia",
  OXY: "Energia",
  HAL: "Energia",
  VLO: "Energia",
  PSX: "Energia",
  MPC: "Energia",
  SHEL: "Energia",
  BP: "Energia",
  TTE: "Energia",
  YPF: "Energia",
  VISTA: "Energia",
  PAM: "Energia",
  
  // Salud
  JNJ: "Salud",
  UNH: "Salud",
  PFE: "Salud",
  ABBV: "Salud",
  MRK: "Salud",
  LLY: "Salud",
  TMO: "Salud",
  ABT: "Salud",
  DHR: "Salud",
  BMY: "Salud",
  AMGN: "Salud",
  GILD: "Salud",
  CVS: "Salud",
  BIIB: "Salud",
  MRNA: "Salud",
  
  // Consumo
  KO: "Consumo",
  PEP: "Consumo",
  WMT: "Consumo",
  COST: "Consumo",
  PG: "Consumo",
  HD: "Consumo",
  MCD: "Consumo",
  NKE: "Consumo",
  SBUX: "Consumo",
  DIS: "Consumo",
  TGT: "Consumo",
  LOW: "Consumo",
  TJX: "Consumo",
  BABA: "Consumo",
  JD: "Consumo",
  
  // Industrial
  BA: "Industrial",
  CAT: "Industrial",
  HON: "Industrial",
  UPS: "Industrial",
  RTX: "Industrial",
  LMT: "Industrial",
  GE: "Industrial",
  MMM: "Industrial",
  DE: "Industrial",
  UNP: "Industrial",
  FDX: "Industrial",
  
  // Comunicaciones
  VZ: "Comunicaciones",
  T: "Comunicaciones",
  TMUS: "Comunicaciones",
  CMCSA: "Comunicaciones",
  
  // Materiales
  LIN: "Materiales",
  APD: "Materiales",
  SHW: "Materiales",
  FCX: "Materiales",
  NEM: "Materiales",
  NUE: "Materiales",
  VALE: "Materiales",
  RIO: "Materiales",
  BHP: "Materiales",
  GOLD: "Materiales",
  
  // Otros
  X: "Industrial",
  F: "Industrial",
  GM: "Industrial",
  RIVN: "Industrial",
  NIO: "Industrial",
  XPEV: "Industrial",
  LI: "Industrial",
}

const SECTOR_COLORS: Record<string, { bg: string; text: string }> = {
  Tecnologia: { bg: "#3b82f6", text: "#ffffff" },
  Finanzas: { bg: "#8b5cf6", text: "#ffffff" },
  Energia: { bg: "#f59e0b", text: "#000000" },
  Salud: { bg: "#10b981", text: "#ffffff" },
  Consumo: { bg: "#ec4899", text: "#ffffff" },
  Industrial: { bg: "#6366f1", text: "#ffffff" },
  Comunicaciones: { bg: "#14b8a6", text: "#ffffff" },
  Materiales: { bg: "#78716c", text: "#ffffff" },
  Otros: { bg: "#64748b", text: "#ffffff" },
}

function getHeatColor(pctChange: number): string {
  // Normalizar el cambio porcentual a un rango de color
  const intensity = Math.min(Math.abs(pctChange) / 5, 1) // 5% = maxima intensidad
  
  if (pctChange > 0) {
    // Verde para positivo
    const green = Math.floor(100 + intensity * 155)
    const red = Math.floor(50 - intensity * 50)
    const blue = Math.floor(50 - intensity * 50)
    return `rgb(${red}, ${green}, ${blue})`
  } else if (pctChange < 0) {
    // Rojo para negativo
    const red = Math.floor(100 + intensity * 155)
    const green = Math.floor(50 - intensity * 50)
    const blue = Math.floor(50 - intensity * 50)
    return `rgb(${red}, ${green}, ${blue})`
  }
  
  return "#64748b" // Gris para sin cambio
}

function getTextColor(pctChange: number): string {
  const intensity = Math.abs(pctChange)
  return intensity > 1 ? "#ffffff" : "#e2e8f0"
}

export function CedearHeatmap({ data, isDarkMode }: CedearHeatmapProps) {
  const groupedBySector = useMemo(() => {
    const groups: Record<string, MarketItem[]> = {}
    
    data.forEach((item) => {
      // Limpiar el simbolo para buscar en el mapa
      const cleanSymbol = item.symbol.replace(/D$/, "").replace(/\.BA$/, "").toUpperCase()
      const sector = SECTOR_MAP[cleanSymbol] || "Otros"
      
      if (!groups[sector]) {
        groups[sector] = []
      }
      groups[sector].push(item)
    })
    
    // Ordenar cada sector por volumen (mayor primero)
    Object.keys(groups).forEach((sector) => {
      groups[sector].sort((a, b) => b.volume - a.volume)
    })
    
    return groups
  }, [data])

  const sortedSectors = useMemo(() => {
    return Object.entries(groupedBySector)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([sector]) => sector)
  }, [groupedBySector])

  if (data.length === 0) {
    return (
      <div className={`p-4 text-center ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
        No hay datos de CEDEARs para mostrar
      </div>
    )
  }

  return (
    <div className={`${isDarkMode ? "bg-[#0f172a]" : "bg-[#f8fafc]"} rounded-lg`}>
      {/* Leyenda */}
      <div className={`flex flex-wrap items-center gap-4 px-4 py-2 border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
        <span className={`text-xs font-medium ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>Sectores:</span>
        {sortedSectors.map((sector) => (
          <div key={sector} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: SECTOR_COLORS[sector]?.bg || "#64748b" }}
            />
            <span className={`text-xs ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
              {sector} ({groupedBySector[sector]?.length || 0})
            </span>
          </div>
        ))}
      </div>

      {/* Escala de colores */}
      <div className={`flex items-center justify-center gap-2 px-4 py-2 border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
        <span className="text-xs text-[#dc2626] font-medium">-5%</span>
        <div className="flex h-3 w-48 rounded overflow-hidden">
          <div className="flex-1" style={{ background: "linear-gradient(to right, #dc2626, #ef4444, #f87171, #64748b, #4ade80, #22c55e, #16a34a)" }} />
        </div>
        <span className="text-xs text-[#16a34a] font-medium">+5%</span>
      </div>

      {/* Mapa de Calor */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedSectors.map((sector) => (
            <div key={sector} className={`rounded-lg overflow-hidden border ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
              {/* Header del Sector */}
              <div
                className="px-3 py-2 flex items-center justify-between"
                style={{ 
                  backgroundColor: SECTOR_COLORS[sector]?.bg || "#64748b",
                  color: SECTOR_COLORS[sector]?.text || "#ffffff"
                }}
              >
                <span className="font-semibold text-sm">{sector}</span>
                <span className="text-xs opacity-80">{groupedBySector[sector]?.length} activos</span>
              </div>

              {/* Grid de CEDEARs */}
              <div className={`grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1 p-2 ${isDarkMode ? "bg-[#1d3969]/30" : "bg-[#f1f5f9]"}`}>
                {groupedBySector[sector]?.slice(0, 24).map((item) => {
                  const bgColor = getHeatColor(item.pctChange)
                  const textColor = getTextColor(item.pctChange)
                  
                  return (
                    <div
                      key={item.id}
                      className="relative group cursor-pointer transition-transform hover:scale-105 hover:z-10"
                      title={`${item.name}\nPrecio: $${item.value.toLocaleString("es-AR")}\nVariacion: ${item.pctChange >= 0 ? "+" : ""}${item.pctChange.toFixed(2)}%\nVolumen: ${item.volume.toLocaleString("es-AR")}`}
                    >
                      <div
                        className="p-1.5 rounded text-center min-h-[50px] flex flex-col justify-center"
                        style={{ backgroundColor: bgColor }}
                      >
                        <span 
                          className="font-bold text-[10px] sm:text-xs truncate block"
                          style={{ color: textColor }}
                        >
                          {item.symbol.replace(/D$/, "").slice(0, 5)}
                        </span>
                        <span 
                          className="text-[9px] sm:text-[10px] font-medium"
                          style={{ color: textColor }}
                        >
                          {item.pctChange >= 0 ? "+" : ""}{item.pctChange.toFixed(1)}%
                        </span>
                      </div>

                      {/* Tooltip al hover */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 ${isDarkMode ? "bg-[#1d3969] text-white" : "bg-white text-[#374151]"} shadow-lg border ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
                        <div className="font-bold">{item.symbol}</div>
                        <div className="text-[10px] opacity-80">{item.name?.slice(0, 20)}</div>
                        <div className="text-[10px]">
                          ${item.value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`text-[10px] font-medium ${item.pctChange >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                          {item.pctChange >= 0 ? "+" : ""}{item.pctChange.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )
                })}
                {(groupedBySector[sector]?.length || 0) > 24 && (
                  <div className={`p-1.5 rounded text-center min-h-[50px] flex flex-col justify-center ${isDarkMode ? "bg-[#374151]" : "bg-[#e2e8f0]"}`}>
                    <span className={`text-[10px] ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                      +{(groupedBySector[sector]?.length || 0) - 24}
                    </span>
                    <span className={`text-[9px] ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
                      mas
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div className={`flex flex-wrap justify-between items-center px-4 py-2 text-xs border-t ${isDarkMode ? "border-[#2563eb]/30 text-[#94a3b8]" : "border-[#e2e8f0] text-[#64748b]"}`}>
        <span>Total: {data.length} CEDEARs</span>
        <span className="text-[#16a34a]">
          Subiendo: {data.filter((d) => d.pctChange > 0).length}
        </span>
        <span className="text-[#dc2626]">
          Bajando: {data.filter((d) => d.pctChange < 0).length}
        </span>
        <span>
          Sin cambios: {data.filter((d) => d.pctChange === 0).length}
        </span>
      </div>
    </div>
  )
}
