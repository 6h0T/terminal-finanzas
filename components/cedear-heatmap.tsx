"use client"

import { useMemo, useState } from "react"

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

interface TreemapNode {
  item: MarketItem
  x: number
  y: number
  width: number
  height: number
}

interface SectorNode {
  name: string
  items: MarketItem[]
  totalVolume: number
  x: number
  y: number
  width: number
  height: number
  children: TreemapNode[]
}

// Mapeo de CEDEARs a sectores
const SECTOR_MAP: Record<string, string> = {
  // Tecnologia - Software
  AAPL: "TECNOLOGIA",
  MSFT: "TECNOLOGIA",
  GOOGL: "TECNOLOGIA",
  GOOG: "TECNOLOGIA",
  META: "TECNOLOGIA",
  AMZN: "TECNOLOGIA",
  NVDA: "TECNOLOGIA",
  AMD: "TECNOLOGIA",
  INTC: "TECNOLOGIA",
  TSLA: "TECNOLOGIA",
  NFLX: "TECNOLOGIA",
  CRM: "TECNOLOGIA",
  ORCL: "TECNOLOGIA",
  IBM: "TECNOLOGIA",
  CSCO: "TECNOLOGIA",
  ADBE: "TECNOLOGIA",
  PYPL: "TECNOLOGIA",
  SQ: "TECNOLOGIA",
  UBER: "TECNOLOGIA",
  SNAP: "TECNOLOGIA",
  SPOT: "TECNOLOGIA",
  SHOP: "TECNOLOGIA",
  MELI: "TECNOLOGIA",
  GLOB: "TECNOLOGIA",
  PLTR: "TECNOLOGIA",
  SNOW: "TECNOLOGIA",
  ZM: "TECNOLOGIA",
  DOCU: "TECNOLOGIA",
  TWLO: "TECNOLOGIA",
  NET: "TECNOLOGIA",
  CRWD: "TECNOLOGIA",
  ZS: "TECNOLOGIA",
  DDOG: "TECNOLOGIA",
  MDB: "TECNOLOGIA",
  PANW: "TECNOLOGIA",
  NOW: "TECNOLOGIA",
  WDAY: "TECNOLOGIA",
  TEAM: "TECNOLOGIA",
  OKTA: "TECNOLOGIA",
  VEEV: "TECNOLOGIA",
  SPLK: "TECNOLOGIA",
  AVGO: "TECNOLOGIA",
  QCOM: "TECNOLOGIA",
  TXN: "TECNOLOGIA",
  MU: "TECNOLOGIA",
  LRCX: "TECNOLOGIA",
  KLAC: "TECNOLOGIA",
  AMAT: "TECNOLOGIA",
  MRVL: "TECNOLOGIA",
  
  // Finanzas
  JPM: "FINANZAS",
  BAC: "FINANZAS",
  WFC: "FINANZAS",
  C: "FINANZAS",
  GS: "FINANZAS",
  MS: "FINANZAS",
  V: "FINANZAS",
  MA: "FINANZAS",
  AXP: "FINANZAS",
  BRK: "FINANZAS",
  BRKB: "FINANZAS",
  BLK: "FINANZAS",
  SCHW: "FINANZAS",
  COF: "FINANZAS",
  USB: "FINANZAS",
  PNC: "FINANZAS",
  TFC: "FINANZAS",
  
  // Energia
  XOM: "ENERGIA",
  CVX: "ENERGIA",
  COP: "ENERGIA",
  SLB: "ENERGIA",
  EOG: "ENERGIA",
  OXY: "ENERGIA",
  HAL: "ENERGIA",
  VLO: "ENERGIA",
  PSX: "ENERGIA",
  MPC: "ENERGIA",
  SHEL: "ENERGIA",
  BP: "ENERGIA",
  TTE: "ENERGIA",
  YPF: "ENERGIA",
  VISTA: "ENERGIA",
  PAM: "ENERGIA",
  
  // Salud
  JNJ: "SALUD",
  UNH: "SALUD",
  PFE: "SALUD",
  ABBV: "SALUD",
  MRK: "SALUD",
  LLY: "SALUD",
  TMO: "SALUD",
  ABT: "SALUD",
  DHR: "SALUD",
  BMY: "SALUD",
  AMGN: "SALUD",
  GILD: "SALUD",
  CVS: "SALUD",
  BIIB: "SALUD",
  MRNA: "SALUD",
  ISRG: "SALUD",
  MDT: "SALUD",
  SYK: "SALUD",
  REGN: "SALUD",
  VRTX: "SALUD",
  
  // Consumo Ciclico
  HD: "CONSUMO CICLICO",
  MCD: "CONSUMO CICLICO",
  NKE: "CONSUMO CICLICO",
  SBUX: "CONSUMO CICLICO",
  DIS: "CONSUMO CICLICO",
  TGT: "CONSUMO CICLICO",
  LOW: "CONSUMO CICLICO",
  TJX: "CONSUMO CICLICO",
  BABA: "CONSUMO CICLICO",
  JD: "CONSUMO CICLICO",
  BKNG: "CONSUMO CICLICO",
  MAR: "CONSUMO CICLICO",
  HLT: "CONSUMO CICLICO",
  CMG: "CONSUMO CICLICO",
  YUM: "CONSUMO CICLICO",
  EBAY: "CONSUMO CICLICO",
  ETSY: "CONSUMO CICLICO",
  
  // Consumo Defensivo
  KO: "CONSUMO DEFENSIVO",
  PEP: "CONSUMO DEFENSIVO",
  WMT: "CONSUMO DEFENSIVO",
  COST: "CONSUMO DEFENSIVO",
  PG: "CONSUMO DEFENSIVO",
  PM: "CONSUMO DEFENSIVO",
  MO: "CONSUMO DEFENSIVO",
  CL: "CONSUMO DEFENSIVO",
  KMB: "CONSUMO DEFENSIVO",
  MDLZ: "CONSUMO DEFENSIVO",
  KHC: "CONSUMO DEFENSIVO",
  GIS: "CONSUMO DEFENSIVO",
  K: "CONSUMO DEFENSIVO",
  HSY: "CONSUMO DEFENSIVO",
  
  // Industrial
  BA: "INDUSTRIAL",
  CAT: "INDUSTRIAL",
  HON: "INDUSTRIAL",
  UPS: "INDUSTRIAL",
  RTX: "INDUSTRIAL",
  LMT: "INDUSTRIAL",
  GE: "INDUSTRIAL",
  MMM: "INDUSTRIAL",
  DE: "INDUSTRIAL",
  UNP: "INDUSTRIAL",
  FDX: "INDUSTRIAL",
  NOC: "INDUSTRIAL",
  GD: "INDUSTRIAL",
  EMR: "INDUSTRIAL",
  ETN: "INDUSTRIAL",
  ITW: "INDUSTRIAL",
  PH: "INDUSTRIAL",
  ROK: "INDUSTRIAL",
  
  // Comunicaciones
  VZ: "COMUNICACIONES",
  T: "COMUNICACIONES",
  TMUS: "COMUNICACIONES",
  CMCSA: "COMUNICACIONES",
  CHTR: "COMUNICACIONES",
  
  // Materiales
  LIN: "MATERIALES",
  APD: "MATERIALES",
  SHW: "MATERIALES",
  FCX: "MATERIALES",
  NEM: "MATERIALES",
  NUE: "MATERIALES",
  VALE: "MATERIALES",
  RIO: "MATERIALES",
  BHP: "MATERIALES",
  GOLD: "MATERIALES",
  DD: "MATERIALES",
  DOW: "MATERIALES",
  ECL: "MATERIALES",
  PPG: "MATERIALES",
  
  // Automotriz
  F: "AUTOMOTRIZ",
  GM: "AUTOMOTRIZ",
  RIVN: "AUTOMOTRIZ",
  NIO: "AUTOMOTRIZ",
  XPEV: "AUTOMOTRIZ",
  LI: "AUTOMOTRIZ",
  LCID: "AUTOMOTRIZ",
  
  // Real Estate
  AMT: "REAL ESTATE",
  PLD: "REAL ESTATE",
  CCI: "REAL ESTATE",
  EQIX: "REAL ESTATE",
  SPG: "REAL ESTATE",
  O: "REAL ESTATE",
}

const SECTOR_BORDER_COLORS: Record<string, string> = {
  "TECNOLOGIA": "#1d4ed8",
  "FINANZAS": "#7c3aed",
  "ENERGIA": "#d97706",
  "SALUD": "#059669",
  "CONSUMO CICLICO": "#db2777",
  "CONSUMO DEFENSIVO": "#0891b2",
  "INDUSTRIAL": "#4f46e5",
  "COMUNICACIONES": "#0d9488",
  "MATERIALES": "#78716c",
  "AUTOMOTRIZ": "#dc2626",
  "REAL ESTATE": "#65a30d",
  "OTROS": "#64748b",
}

function getHeatColor(pctChange: number): string {
  const intensity = Math.min(Math.abs(pctChange) / 5, 1)
  
  if (pctChange > 0) {
    // Verde - de claro a oscuro segun intensidad
    if (intensity < 0.2) return "#22c55e"
    if (intensity < 0.4) return "#16a34a"
    if (intensity < 0.6) return "#15803d"
    if (intensity < 0.8) return "#166534"
    return "#14532d"
  } else if (pctChange < 0) {
    // Rojo - de claro a oscuro segun intensidad
    if (intensity < 0.2) return "#ef4444"
    if (intensity < 0.4) return "#dc2626"
    if (intensity < 0.6) return "#b91c1c"
    if (intensity < 0.8) return "#991b1b"
    return "#7f1d1d"
  }
  
  return "#374151"
}

// Algoritmo Squarified Treemap
function squarify(
  items: { item: MarketItem; value: number }[],
  x: number,
  y: number,
  width: number,
  height: number
): TreemapNode[] {
  if (items.length === 0) return []
  
  const totalValue = items.reduce((sum, i) => sum + i.value, 0)
  if (totalValue === 0) return []
  
  const nodes: TreemapNode[] = []
  let currentX = x
  let currentY = y
  let remainingWidth = width
  let remainingHeight = height
  
  // Ordenar por valor descendente
  const sortedItems = [...items].sort((a, b) => b.value - a.value)
  
  let i = 0
  while (i < sortedItems.length) {
    const isHorizontal = remainingWidth >= remainingHeight
    const sideLength = isHorizontal ? remainingHeight : remainingWidth
    
    // Calcular cuantos items caben en esta fila/columna
    let row: typeof sortedItems = []
    let rowValue = 0
    let bestRatio = Infinity
    
    for (let j = i; j < sortedItems.length; j++) {
      const testRow = [...row, sortedItems[j]]
      const testValue = rowValue + sortedItems[j].value
      const remainingValue = items.slice(i).reduce((s, item) => s + item.value, 0)
      const rowLength = (testValue / remainingValue) * (isHorizontal ? remainingWidth : remainingHeight)
      
      // Calcular el peor aspect ratio de esta fila
      let worstRatio = 0
      testRow.forEach(item => {
        const itemLength = (item.value / testValue) * sideLength
        const ratio = Math.max(rowLength / itemLength, itemLength / rowLength)
        worstRatio = Math.max(worstRatio, ratio)
      })
      
      if (worstRatio <= bestRatio || row.length === 0) {
        row = testRow
        rowValue = testValue
        bestRatio = worstRatio
      } else {
        break
      }
    }
    
    // Layoutear la fila
    const remainingValue = sortedItems.slice(i).reduce((s, item) => s + item.value, 0)
    const rowLength = (rowValue / remainingValue) * (isHorizontal ? remainingWidth : remainingHeight)
    
    let offset = 0
    row.forEach(item => {
      const itemLength = (item.value / rowValue) * sideLength
      
      if (isHorizontal) {
        nodes.push({
          item: item.item,
          x: currentX,
          y: currentY + offset,
          width: rowLength,
          height: itemLength,
        })
      } else {
        nodes.push({
          item: item.item,
          x: currentX + offset,
          y: currentY,
          width: itemLength,
          height: rowLength,
        })
      }
      offset += itemLength
    })
    
    // Actualizar el espacio restante
    if (isHorizontal) {
      currentX += rowLength
      remainingWidth -= rowLength
    } else {
      currentY += rowLength
      remainingHeight -= rowLength
    }
    
    i += row.length
  }
  
  return nodes
}

function layoutSectors(
  sectors: { name: string; items: MarketItem[]; totalVolume: number }[],
  width: number,
  height: number
): SectorNode[] {
  const totalVolume = sectors.reduce((sum, s) => sum + s.totalVolume, 0)
  if (totalVolume === 0) return []
  
  const sectorNodes: SectorNode[] = []
  let currentX = 0
  let currentY = 0
  let remainingWidth = width
  let remainingHeight = height
  
  const sortedSectors = [...sectors].sort((a, b) => b.totalVolume - a.totalVolume)
  
  let i = 0
  while (i < sortedSectors.length) {
    const isHorizontal = remainingWidth >= remainingHeight
    const sideLength = isHorizontal ? remainingHeight : remainingWidth
    
    let row: typeof sortedSectors = []
    let rowValue = 0
    let bestRatio = Infinity
    
    for (let j = i; j < sortedSectors.length; j++) {
      const testRow = [...row, sortedSectors[j]]
      const testValue = rowValue + sortedSectors[j].totalVolume
      const remainingValue = sortedSectors.slice(i).reduce((s, sector) => s + sector.totalVolume, 0)
      const rowLength = (testValue / remainingValue) * (isHorizontal ? remainingWidth : remainingHeight)
      
      let worstRatio = 0
      testRow.forEach(sector => {
        const itemLength = (sector.totalVolume / testValue) * sideLength
        const ratio = Math.max(rowLength / itemLength, itemLength / rowLength)
        worstRatio = Math.max(worstRatio, ratio)
      })
      
      if (worstRatio <= bestRatio || row.length === 0) {
        row = testRow
        rowValue = testValue
        bestRatio = worstRatio
      } else {
        break
      }
    }
    
    const remainingValue = sortedSectors.slice(i).reduce((s, sector) => s + sector.totalVolume, 0)
    const rowLength = (rowValue / remainingValue) * (isHorizontal ? remainingWidth : remainingHeight)
    
    let offset = 0
    row.forEach(sector => {
      const itemLength = (sector.totalVolume / rowValue) * sideLength
      
      const sectorX = isHorizontal ? currentX : currentX + offset
      const sectorY = isHorizontal ? currentY + offset : currentY
      const sectorWidth = isHorizontal ? rowLength : itemLength
      const sectorHeight = isHorizontal ? itemLength : rowLength
      
      // Layout children dentro del sector
      const childItems = sector.items.map(item => ({
        item,
        value: Math.max(item.volume, 1000),
      }))
      
      const children = squarify(childItems, sectorX, sectorY, sectorWidth, sectorHeight)
      
      sectorNodes.push({
        name: sector.name,
        items: sector.items,
        totalVolume: sector.totalVolume,
        x: sectorX,
        y: sectorY,
        width: sectorWidth,
        height: sectorHeight,
        children,
      })
      
      offset += itemLength
    })
    
    if (isHorizontal) {
      currentX += rowLength
      remainingWidth -= rowLength
    } else {
      currentY += rowLength
      remainingHeight -= rowLength
    }
    
    i += row.length
  }
  
  return sectorNodes
}

export function CedearHeatmap({ data, isDarkMode }: CedearHeatmapProps) {
  const [hoveredItem, setHoveredItem] = useState<MarketItem | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  const { sectorNodes, width, height } = useMemo(() => {
    const groups: Record<string, MarketItem[]> = {}
    
    data.forEach((item) => {
      const cleanSymbol = item.symbol.replace(/D$/, "").replace(/\.BA$/, "").toUpperCase()
      const sector = SECTOR_MAP[cleanSymbol] || "OTROS"
      
      if (!groups[sector]) {
        groups[sector] = []
      }
      groups[sector].push(item)
    })
    
    const sectors = Object.entries(groups).map(([name, items]) => ({
      name,
      items,
      totalVolume: items.reduce((sum, item) => sum + Math.max(item.volume, 1000), 0),
    }))
    
    const width = 1200
    const height = 600
    
    return {
      sectorNodes: layoutSectors(sectors, width, height),
      width,
      height,
    }
  }, [data])

  const stats = useMemo(() => ({
    subiendo: data.filter(d => d.pctChange > 0).length,
    bajando: data.filter(d => d.pctChange < 0).length,
    sinCambio: data.filter(d => d.pctChange === 0).length,
  }), [data])

  if (data.length === 0) {
    return (
      <div className={`p-8 text-center ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
        No hay datos de CEDEARs para mostrar
      </div>
    )
  }

  return (
    <div className={`${isDarkMode ? "bg-[#0a0a0a]" : "bg-[#f8fafc]"}`}>
      {/* Escala de colores */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${isDarkMode ? "border-[#1f2937]" : "border-[#e2e8f0]"}`}>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}`}>Variacion:</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-[#7f1d1d]">-5%</span>
            <div className="flex h-4">
              <div className="w-6 h-full" style={{ backgroundColor: "#7f1d1d" }} />
              <div className="w-6 h-full" style={{ backgroundColor: "#991b1b" }} />
              <div className="w-6 h-full" style={{ backgroundColor: "#b91c1c" }} />
              <div className="w-6 h-full" style={{ backgroundColor: "#dc2626" }} />
              <div className="w-6 h-full" style={{ backgroundColor: "#ef4444" }} />
              <div className="w-4 h-full" style={{ backgroundColor: "#374151" }} />
              <div className="w-6 h-full" style={{ backgroundColor: "#22c55e" }} />
              <div className="w-6 h-full" style={{ backgroundColor: "#16a34a" }} />
              <div className="w-6 h-full" style={{ backgroundColor: "#15803d" }} />
              <div className="w-6 h-full" style={{ backgroundColor: "#166534" }} />
              <div className="w-6 h-full" style={{ backgroundColor: "#14532d" }} />
            </div>
            <span className="text-xs font-medium text-[#14532d]">+5%</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className={isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}>
            Total: {data.length}
          </span>
          <span className="text-[#16a34a]">Subiendo: {stats.subiendo}</span>
          <span className="text-[#dc2626]">Bajando: {stats.bajando}</span>
        </div>
      </div>

      {/* Treemap */}
      <div 
        className="relative overflow-auto"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        }}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ minHeight: "500px", maxHeight: "700px" }}
        >
          {sectorNodes.map((sector) => (
            <g key={sector.name}>
              {/* Borde del sector */}
              <rect
                x={sector.x}
                y={sector.y}
                width={sector.width}
                height={sector.height}
                fill="none"
                stroke={SECTOR_BORDER_COLORS[sector.name] || "#374151"}
                strokeWidth="2"
              />
              
              {/* Etiqueta del sector */}
              {sector.width > 80 && sector.height > 30 && (
                <text
                  x={sector.x + 4}
                  y={sector.y + 14}
                  fill={SECTOR_BORDER_COLORS[sector.name] || "#9ca3af"}
                  fontSize="11"
                  fontWeight="bold"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                >
                  {sector.name}
                </text>
              )}
              
              {/* Items dentro del sector */}
              {sector.children.map((node) => {
                const bgColor = getHeatColor(node.item.pctChange)
                const cleanSymbol = node.item.symbol.replace(/D$/, "").slice(0, 6)
                const showSymbol = node.width > 35 && node.height > 25
                const showPercent = node.width > 30 && node.height > 35
                
                return (
                  <g
                    key={node.item.id}
                    onMouseEnter={() => setHoveredItem(node.item)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={node.x + 1}
                      y={node.y + 1}
                      width={Math.max(node.width - 2, 0)}
                      height={Math.max(node.height - 2, 0)}
                      fill={bgColor}
                      stroke={isDarkMode ? "#0a0a0a" : "#ffffff"}
                      strokeWidth="1"
                      rx="1"
                    />
                    
                    {showSymbol && (
                      <text
                        x={node.x + node.width / 2}
                        y={node.y + node.height / 2 - (showPercent ? 4 : 0)}
                        fill="#ffffff"
                        fontSize={node.width > 60 ? "13" : "10"}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                      >
                        {cleanSymbol}
                      </text>
                    )}
                    
                    {showPercent && (
                      <text
                        x={node.x + node.width / 2}
                        y={node.y + node.height / 2 + 10}
                        fill="#ffffff"
                        fontSize={node.width > 60 ? "11" : "9"}
                        fontWeight="500"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                      >
                        {node.item.pctChange >= 0 ? "+" : ""}{node.item.pctChange.toFixed(2)}%
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          ))}
        </svg>

        {/* Tooltip flotante */}
        {hoveredItem && (
          <div
            className={`absolute pointer-events-none z-50 px-3 py-2 rounded-lg shadow-xl border text-sm ${
              isDarkMode 
                ? "bg-[#1f2937] border-[#374151] text-white" 
                : "bg-white border-[#e5e7eb] text-[#111827]"
            }`}
            style={{
              left: Math.min(mousePos.x + 15, width - 200),
              top: mousePos.y + 15,
            }}
          >
            <div className="font-bold text-base">{hoveredItem.symbol}</div>
            <div className={`text-xs ${isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"} mb-1`}>
              {hoveredItem.name?.slice(0, 30)}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <span className={isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}>Precio:</span>
              <span className="font-medium">${hoveredItem.value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
              <span className={isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}>Variacion:</span>
              <span className={`font-bold ${hoveredItem.pctChange >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                {hoveredItem.pctChange >= 0 ? "+" : ""}{hoveredItem.pctChange.toFixed(2)}%
              </span>
              <span className={isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}>Volumen:</span>
              <span className="font-medium">{hoveredItem.volume.toLocaleString("es-AR")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
