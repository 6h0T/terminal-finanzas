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
  item: MarketItem | null
  label: string
  pctChange: number
  x: number
  y: number
  width: number
  height: number
  isGroup?: boolean
  groupCount?: number
}

interface SectorData {
  name: string
  items: MarketItem[]
  totalVolume: number
}

// Mapeo de CEDEARs a sectores
const SECTOR_MAP: Record<string, string> = {
  // Tecnologia
  AAPL: "TECNOLOGIA", MSFT: "TECNOLOGIA", GOOGL: "TECNOLOGIA", GOOG: "TECNOLOGIA",
  META: "TECNOLOGIA", AMZN: "TECNOLOGIA", NVDA: "TECNOLOGIA", AMD: "TECNOLOGIA",
  INTC: "TECNOLOGIA", TSLA: "TECNOLOGIA", NFLX: "TECNOLOGIA", CRM: "TECNOLOGIA",
  ORCL: "TECNOLOGIA", IBM: "TECNOLOGIA", CSCO: "TECNOLOGIA", ADBE: "TECNOLOGIA",
  PYPL: "TECNOLOGIA", SQ: "TECNOLOGIA", UBER: "TECNOLOGIA", SNAP: "TECNOLOGIA",
  SPOT: "TECNOLOGIA", SHOP: "TECNOLOGIA", MELI: "TECNOLOGIA", GLOB: "TECNOLOGIA",
  PLTR: "TECNOLOGIA", SNOW: "TECNOLOGIA", ZM: "TECNOLOGIA", DOCU: "TECNOLOGIA",
  TWLO: "TECNOLOGIA", NET: "TECNOLOGIA", CRWD: "TECNOLOGIA", ZS: "TECNOLOGIA",
  DDOG: "TECNOLOGIA", MDB: "TECNOLOGIA", PANW: "TECNOLOGIA", NOW: "TECNOLOGIA",
  WDAY: "TECNOLOGIA", TEAM: "TECNOLOGIA", OKTA: "TECNOLOGIA", VEEV: "TECNOLOGIA",
  SPLK: "TECNOLOGIA", AVGO: "TECNOLOGIA", QCOM: "TECNOLOGIA", TXN: "TECNOLOGIA",
  MU: "TECNOLOGIA", LRCX: "TECNOLOGIA", KLAC: "TECNOLOGIA", AMAT: "TECNOLOGIA",
  MRVL: "TECNOLOGIA",
  
  // Finanzas
  JPM: "FINANZAS", BAC: "FINANZAS", WFC: "FINANZAS", C: "FINANZAS",
  GS: "FINANZAS", MS: "FINANZAS", V: "FINANZAS", MA: "FINANZAS",
  AXP: "FINANZAS", BRK: "FINANZAS", BRKB: "FINANZAS", BLK: "FINANZAS",
  SCHW: "FINANZAS", COF: "FINANZAS", USB: "FINANZAS", PNC: "FINANZAS",
  TFC: "FINANZAS",
  
  // Energia
  XOM: "ENERGIA", CVX: "ENERGIA", COP: "ENERGIA", SLB: "ENERGIA",
  EOG: "ENERGIA", OXY: "ENERGIA", HAL: "ENERGIA", VLO: "ENERGIA",
  PSX: "ENERGIA", MPC: "ENERGIA", SHEL: "ENERGIA", BP: "ENERGIA",
  TTE: "ENERGIA", YPF: "ENERGIA", VISTA: "ENERGIA", PAM: "ENERGIA",
  
  // Salud
  JNJ: "SALUD", UNH: "SALUD", PFE: "SALUD", ABBV: "SALUD",
  MRK: "SALUD", LLY: "SALUD", TMO: "SALUD", ABT: "SALUD",
  DHR: "SALUD", BMY: "SALUD", AMGN: "SALUD", GILD: "SALUD",
  CVS: "SALUD", BIIB: "SALUD", MRNA: "SALUD", ISRG: "SALUD",
  MDT: "SALUD", SYK: "SALUD", REGN: "SALUD", VRTX: "SALUD",
  
  // Consumo
  HD: "CONSUMO", MCD: "CONSUMO", NKE: "CONSUMO", SBUX: "CONSUMO",
  DIS: "CONSUMO", TGT: "CONSUMO", LOW: "CONSUMO", TJX: "CONSUMO",
  BABA: "CONSUMO", JD: "CONSUMO", BKNG: "CONSUMO", MAR: "CONSUMO",
  HLT: "CONSUMO", CMG: "CONSUMO", YUM: "CONSUMO", EBAY: "CONSUMO",
  ETSY: "CONSUMO", KO: "CONSUMO", PEP: "CONSUMO", WMT: "CONSUMO",
  COST: "CONSUMO", PG: "CONSUMO", PM: "CONSUMO", MO: "CONSUMO",
  CL: "CONSUMO", KMB: "CONSUMO", MDLZ: "CONSUMO", KHC: "CONSUMO",
  GIS: "CONSUMO", K: "CONSUMO", HSY: "CONSUMO",
  
  // Industrial
  BA: "INDUSTRIAL", CAT: "INDUSTRIAL", HON: "INDUSTRIAL", UPS: "INDUSTRIAL",
  RTX: "INDUSTRIAL", LMT: "INDUSTRIAL", GE: "INDUSTRIAL", MMM: "INDUSTRIAL",
  DE: "INDUSTRIAL", UNP: "INDUSTRIAL", FDX: "INDUSTRIAL", NOC: "INDUSTRIAL",
  GD: "INDUSTRIAL", EMR: "INDUSTRIAL", ETN: "INDUSTRIAL", ITW: "INDUSTRIAL",
  PH: "INDUSTRIAL", ROK: "INDUSTRIAL",
  
  // Comunicaciones
  VZ: "COMUNICACIONES", T: "COMUNICACIONES", TMUS: "COMUNICACIONES",
  CMCSA: "COMUNICACIONES", CHTR: "COMUNICACIONES",
  
  // Materiales
  LIN: "MATERIALES", APD: "MATERIALES", SHW: "MATERIALES", FCX: "MATERIALES",
  NEM: "MATERIALES", NUE: "MATERIALES", VALE: "MATERIALES", RIO: "MATERIALES",
  BHP: "MATERIALES", GOLD: "MATERIALES", DD: "MATERIALES", DOW: "MATERIALES",
  ECL: "MATERIALES", PPG: "MATERIALES",
  
  // Automotriz
  F: "AUTOMOTRIZ", GM: "AUTOMOTRIZ", RIVN: "AUTOMOTRIZ", NIO: "AUTOMOTRIZ",
  XPEV: "AUTOMOTRIZ", LI: "AUTOMOTRIZ", LCID: "AUTOMOTRIZ",
}

const SECTOR_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "TECNOLOGIA": { bg: "#1e3a5f", border: "#3b82f6", text: "#60a5fa" },
  "FINANZAS": { bg: "#3b1f5f", border: "#8b5cf6", text: "#a78bfa" },
  "ENERGIA": { bg: "#5f3b1f", border: "#f59e0b", text: "#fbbf24" },
  "SALUD": { bg: "#1f5f3b", border: "#10b981", text: "#34d399" },
  "CONSUMO": { bg: "#5f1f4b", border: "#ec4899", text: "#f472b6" },
  "INDUSTRIAL": { bg: "#2d2d5f", border: "#6366f1", text: "#818cf8" },
  "COMUNICACIONES": { bg: "#1f4f5f", border: "#14b8a6", text: "#2dd4bf" },
  "MATERIALES": { bg: "#3f3f3f", border: "#78716c", text: "#a8a29e" },
  "AUTOMOTRIZ": { bg: "#5f1f1f", border: "#ef4444", text: "#f87171" },
  "OTROS": { bg: "#2d3748", border: "#4a5568", text: "#a0aec0" },
}

function getHeatColor(pctChange: number): string {
  const intensity = Math.min(Math.abs(pctChange) / 5, 1)
  
  if (pctChange > 0) {
    // Verde - de claro a oscuro segun intensidad
    if (intensity < 0.1) return "#22c55e"  // Verde brillante
    if (intensity < 0.2) return "#16a34a"  // Verde medio-claro
    if (intensity < 0.35) return "#15803d" // Verde medio
    if (intensity < 0.5) return "#166534"  // Verde oscuro
    if (intensity < 0.7) return "#14532d"  // Verde muy oscuro
    return "#052e16"                        // Verde casi negro
  } else if (pctChange < 0) {
    // Rojo - de claro a oscuro segun intensidad
    if (intensity < 0.1) return "#ef4444"  // Rojo brillante
    if (intensity < 0.2) return "#dc2626"  // Rojo medio-claro
    if (intensity < 0.35) return "#b91c1c" // Rojo medio
    if (intensity < 0.5) return "#991b1b"  // Rojo oscuro
    if (intensity < 0.7) return "#7f1d1d"  // Rojo muy oscuro
    return "#450a0a"                        // Rojo casi negro
  }
  
  return "#4b5563" // Gris para sin cambio
}

// Algoritmo de treemap simplificado con mejor distribucion
function calculateTreemap(
  items: { label: string; value: number; pctChange: number; item: MarketItem | null; isGroup?: boolean; groupCount?: number }[],
  x: number,
  y: number,
  width: number,
  height: number
): TreemapNode[] {
  if (items.length === 0) return []
  
  const totalValue = items.reduce((sum, i) => sum + i.value, 0)
  if (totalValue === 0) return []
  
  const nodes: TreemapNode[] = []
  const sorted = [...items].sort((a, b) => b.value - a.value)
  
  let currentX = x
  let currentY = y
  let remainingWidth = width
  let remainingHeight = height
  let index = 0
  
  while (index < sorted.length) {
    const remainingItems = sorted.slice(index)
    const remainingValue = remainingItems.reduce((s, i) => s + i.value, 0)
    const isHorizontal = remainingWidth >= remainingHeight
    
    // Determinar cuantos items van en esta fila
    let rowItems: typeof sorted = []
    let rowValue = 0
    let bestAspect = Infinity
    
    for (let i = 0; i < remainingItems.length; i++) {
      const testItems = remainingItems.slice(0, i + 1)
      const testValue = testItems.reduce((s, item) => s + item.value, 0)
      const rowSize = (testValue / remainingValue) * (isHorizontal ? remainingWidth : remainingHeight)
      const sideSize = isHorizontal ? remainingHeight : remainingWidth
      
      // Calcular peor aspect ratio
      let worstAspect = 0
      testItems.forEach(item => {
        const itemSize = (item.value / testValue) * sideSize
        const aspect = Math.max(rowSize / itemSize, itemSize / rowSize)
        worstAspect = Math.max(worstAspect, aspect)
      })
      
      if (worstAspect <= bestAspect) {
        rowItems = testItems
        rowValue = testValue
        bestAspect = worstAspect
      } else if (i > 0) {
        break
      }
    }
    
    // Posicionar items de la fila
    const rowSize = (rowValue / remainingValue) * (isHorizontal ? remainingWidth : remainingHeight)
    const sideSize = isHorizontal ? remainingHeight : remainingWidth
    let offset = 0
    
    rowItems.forEach(item => {
      const itemSize = (item.value / rowValue) * sideSize
      
      nodes.push({
        label: item.label,
        pctChange: item.pctChange,
        item: item.item,
        isGroup: item.isGroup,
        groupCount: item.groupCount,
        x: isHorizontal ? currentX : currentX + offset,
        y: isHorizontal ? currentY + offset : currentY,
        width: isHorizontal ? rowSize : itemSize,
        height: isHorizontal ? itemSize : rowSize,
      })
      
      offset += itemSize
    })
    
    // Actualizar espacio restante
    if (isHorizontal) {
      currentX += rowSize
      remainingWidth -= rowSize
    } else {
      currentY += rowSize
      remainingHeight -= rowSize
    }
    
    index += rowItems.length
  }
  
  return nodes
}

export function CedearHeatmap({ data, isDarkMode }: CedearHeatmapProps) {
  const [hoveredItem, setHoveredItem] = useState<TreemapNode | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  
  const { sectors, containerWidth, containerHeight } = useMemo(() => {
    // Agrupar por sector
    const groups: Record<string, MarketItem[]> = {}
    
    data.forEach((item) => {
      const cleanSymbol = item.symbol.replace(/D$/, "").replace(/\.BA$/, "").toUpperCase()
      const sector = SECTOR_MAP[cleanSymbol] || "OTROS"
      
      if (!groups[sector]) groups[sector] = []
      groups[sector].push(item)
    })
    
    // Crear datos de sectores con items limitados
    const sectorData: (SectorData & { nodes: TreemapNode[] })[] = []
    const containerWidth = 1400
    const containerHeight = 700
    
    // Calcular layout de sectores
    const sectorList = Object.entries(groups)
      .map(([name, items]) => ({
        name,
        items: items.sort((a, b) => b.volume - a.volume),
        totalVolume: items.reduce((sum, item) => sum + Math.max(item.volume, 10000), 0),
      }))
      .sort((a, b) => b.totalVolume - a.totalVolume)
    
    const totalVolume = sectorList.reduce((sum, s) => sum + s.totalVolume, 0)
    
    // Calcular posiciones de sectores
    let sectorX = 0
    let sectorY = 0
    let remainingW = containerWidth
    let remainingH = containerHeight
    let sectorIndex = 0
    
    while (sectorIndex < sectorList.length) {
      const remainingSectors = sectorList.slice(sectorIndex)
      const remainingVolume = remainingSectors.reduce((s, sec) => s + sec.totalVolume, 0)
      const isHorizontal = remainingW >= remainingH
      
      // Determinar fila de sectores
      let rowSectors: typeof sectorList = []
      let rowVolume = 0
      let bestAspect = Infinity
      
      for (let i = 0; i < Math.min(remainingSectors.length, 4); i++) {
        const testSectors = remainingSectors.slice(0, i + 1)
        const testVolume = testSectors.reduce((s, sec) => s + sec.totalVolume, 0)
        const rowSize = (testVolume / remainingVolume) * (isHorizontal ? remainingW : remainingH)
        const sideSize = isHorizontal ? remainingH : remainingW
        
        let worstAspect = 0
        testSectors.forEach(sec => {
          const secSize = (sec.totalVolume / testVolume) * sideSize
          const aspect = Math.max(rowSize / secSize, secSize / rowSize)
          worstAspect = Math.max(worstAspect, aspect)
        })
        
        if (worstAspect <= bestAspect) {
          rowSectors = testSectors
          rowVolume = testVolume
          bestAspect = worstAspect
        } else if (i > 0) {
          break
        }
      }
      
      const rowSize = (rowVolume / remainingVolume) * (isHorizontal ? remainingW : remainingH)
      const sideSize = isHorizontal ? remainingH : remainingW
      let offset = 0
      
      rowSectors.forEach(sector => {
        const secSize = (sector.totalVolume / rowVolume) * sideSize
        
        const sx = isHorizontal ? sectorX : sectorX + offset
        const sy = isHorizontal ? sectorY + offset : sectorY
        const sw = isHorizontal ? rowSize : secSize
        const sh = isHorizontal ? secSize : rowSize
        
        // Limitar items a los top 15 por sector, agrupar el resto
        const maxItems = 15
        const topItems = sector.items.slice(0, maxItems)
        const otherItems = sector.items.slice(maxItems)
        
        const treemapItems = topItems.map(item => ({
          label: item.symbol.replace(/D$/, "").slice(0, 5),
          value: Math.max(item.volume, 10000),
          pctChange: item.pctChange,
          item,
        }))
        
        // Agregar grupo "Otros" si hay mas items
        if (otherItems.length > 0) {
          const avgPctChange = otherItems.reduce((s, i) => s + i.pctChange, 0) / otherItems.length
          treemapItems.push({
            label: `+${otherItems.length}`,
            value: otherItems.reduce((s, i) => s + Math.max(i.volume, 10000), 0),
            pctChange: avgPctChange,
            item: null,
            isGroup: true,
            groupCount: otherItems.length,
          } as typeof treemapItems[0])
        }
        
        const nodes = calculateTreemap(treemapItems, sx + 2, sy + 20, sw - 4, sh - 22)
        
        sectorData.push({
          name: sector.name,
          items: sector.items,
          totalVolume: sector.totalVolume,
          nodes,
          x: sx,
          y: sy,
          width: sw,
          height: sh,
        } as SectorData & { nodes: TreemapNode[]; x: number; y: number; width: number; height: number })
        
        offset += secSize
      })
      
      if (isHorizontal) {
        sectorX += rowSize
        remainingW -= rowSize
      } else {
        sectorY += rowSize
        remainingH -= rowSize
      }
      
      sectorIndex += rowSectors.length
    }
    
    return { sectors: sectorData, containerWidth, containerHeight }
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
    <div className={`${isDarkMode ? "bg-[#0f0f0f]" : "bg-[#f8fafc]"} rounded-b-lg overflow-hidden`}>
      {/* Barra de escala */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDarkMode ? "border-[#1f2937] bg-[#111]" : "border-[#e2e8f0] bg-[#f1f5f9]"}`}>
          <div className="flex items-center gap-4">
          <span className={`text-xs font-medium ${isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}`}>Variacion %</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-red-400">-5%</span>
            <div className="flex h-5 rounded overflow-hidden shadow-inner">
              {[
                "#450a0a", "#7f1d1d", "#991b1b", "#b91c1c", "#dc2626",
                "#4b5563",
                "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d",
              ].map((color, i) => (
                <div key={i} className="w-5 h-full" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span className="text-xs font-bold text-green-400">+5%</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs">
          <span className={`${isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}`}>
            <span className="font-medium">{data.length}</span> activos
          </span>
          <span className="text-green-400 font-medium">
            {stats.subiendo} subiendo
          </span>
          <span className="text-red-400 font-medium">
            {stats.bajando} bajando
          </span>
        </div>
      </div>

      {/* Mapa de calor */}
      <div 
        className="relative"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        }}
      >
        <div 
          className="w-full overflow-auto"
          style={{ minHeight: "550px" }}
        >
          <svg
            viewBox={`0 0 ${containerWidth} ${containerHeight}`}
            className="w-full h-auto"
            style={{ minWidth: "800px" }}
          >
            <defs>
              {/* Filtro de sombra 3D */}
              <filter id="cell-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.4" />
              </filter>
              <filter id="cell-shadow-hover" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.6" />
              </filter>
            </defs>
            
            {(sectors as (SectorData & { nodes: TreemapNode[]; x: number; y: number; width: number; height: number })[]).map((sector) => {
              const colors = SECTOR_COLORS[sector.name] || SECTOR_COLORS["OTROS"]
              
              return (
                <g key={sector.name}>
                  {/* Fondo del sector */}
                  <rect
                    x={sector.x}
                    y={sector.y}
                    width={sector.width}
                    height={sector.height}
                    fill={colors.bg}
                    stroke={colors.border}
                    strokeWidth="1.5"
                  />
                  
                  {/* Titulo del sector */}
                  <text
                    x={sector.x + 6}
                    y={sector.y + 14}
                    fill={colors.text}
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="0.5"
                  >
                    {sector.name}
                  </text>
                  
                  {/* Celdas del treemap */}
                  {sector.nodes.map((node, idx) => {
                    const cellColor = getHeatColor(node.pctChange)
                    const isHovered = hoveredItem?.label === node.label && hoveredItem?.item?.id === node.item?.id
                    const minDim = Math.min(node.width, node.height)
                    
                    // Determinar que mostrar segun el tamano
                    const showLabel = node.width > 28 && node.height > 22
                    const showPercent = node.width > 32 && node.height > 38
                    const fontSize = minDim > 80 ? 14 : minDim > 50 ? 12 : 10
                    const percentSize = minDim > 80 ? 11 : minDim > 50 ? 9 : 8
                    
                    return (
                      <g
                        key={`${node.label}-${idx}`}
                        onMouseEnter={() => setHoveredItem(node)}
                        onMouseLeave={() => setHoveredItem(null)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Celda con color 3D */}
                        <rect
                          x={node.x + 1}
                          y={node.y + 1}
                          width={Math.max(node.width - 2, 2)}
                          height={Math.max(node.height - 2, 2)}
                          fill={cellColor}
                          stroke={isHovered ? "#fff" : "rgba(0,0,0,0.4)"}
                          strokeWidth={isHovered ? "2" : "1"}
                          rx="2"
                          filter={isHovered ? "url(#cell-shadow-hover)" : "url(#cell-shadow)"}
                          style={{
                            transition: "all 0.15s ease-out",
                          }}
                        />
                        
                        {/* Efecto de brillo 3D (borde superior izquierdo) */}
                        <rect
                          x={node.x + 2}
                          y={node.y + 2}
                          width={Math.max(node.width - 4, 1)}
                          height={Math.max(node.height / 3, 1)}
                          fill="url(#shine)"
                          rx="2"
                          opacity="0.15"
                          pointerEvents="none"
                        />
                        
                        {/* Texto del simbolo */}
                        {showLabel && (
                          <text
                            x={node.x + node.width / 2}
                            y={node.y + node.height / 2 - (showPercent ? 6 : 0)}
                            fill="#ffffff"
                            fontSize={fontSize}
                            fontWeight="700"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ 
                              textShadow: "0 1px 3px rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.5)",
                              pointerEvents: "none",
                            }}
                          >
                            {node.label}
                          </text>
                        )}
                        
                        {/* Porcentaje */}
                        {showPercent && (
                          <text
                            x={node.x + node.width / 2}
                            y={node.y + node.height / 2 + 10}
                            fill="rgba(255,255,255,0.9)"
                            fontSize={percentSize}
                            fontWeight="600"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ 
                              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                              pointerEvents: "none",
                            }}
                          >
                            {node.pctChange >= 0 ? "+" : ""}{node.pctChange.toFixed(2)}%
                          </text>
                        )}
                      </g>
                    )
                  })}
                </g>
              )
            })}
            
            {/* Gradiente de brillo */}
            <defs>
              <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Tooltip mejorado */}
        {hoveredItem && hoveredItem.item && (
          <div
            className={`absolute pointer-events-none z-50 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-sm ${
              isDarkMode 
                ? "bg-[#1f2937]/95 border-[#374151] text-white" 
                : "bg-white/95 border-[#e5e7eb] text-[#111827]"
            }`}
            style={{
              left: Math.min(tooltipPos.x + 20, containerWidth - 220),
              top: Math.max(tooltipPos.y - 80, 10),
              minWidth: "200px",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg">{hoveredItem.item.symbol}</span>
              <span 
                className={`text-sm font-semibold px-2 py-0.5 rounded ${
                  hoveredItem.pctChange >= 0 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {hoveredItem.pctChange >= 0 ? "+" : ""}{hoveredItem.pctChange.toFixed(2)}%
              </span>
            </div>
            <div className={`text-xs ${isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"} mb-2 truncate max-w-[180px]`}>
              {hoveredItem.item.name}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <span className={isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}>Precio:</span>
              <span className="font-semibold text-right">${hoveredItem.item.value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
              <span className={isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}>Var. Neta:</span>
              <span className={`font-semibold text-right ${hoveredItem.item.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {hoveredItem.item.change >= 0 ? "+" : ""}${hoveredItem.item.change.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </span>
              <span className={isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}>Volumen:</span>
              <span className="font-semibold text-right">{hoveredItem.item.volume.toLocaleString("es-AR")}</span>
            </div>
          </div>
        )}
        
        {/* Tooltip para grupos */}
        {hoveredItem && hoveredItem.isGroup && (
          <div
            className={`absolute pointer-events-none z-50 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-sm ${
              isDarkMode 
                ? "bg-[#1f2937]/95 border-[#374151] text-white" 
                : "bg-white/95 border-[#e5e7eb] text-[#111827]"
            }`}
            style={{
              left: Math.min(tooltipPos.x + 20, containerWidth - 180),
              top: Math.max(tooltipPos.y - 40, 10),
            }}
          >
            <div className="font-bold text-sm mb-1">Otros activos</div>
            <div className={`text-xs ${isDarkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}`}>
              {hoveredItem.groupCount} CEDEARs adicionales
            </div>
            <div className={`text-xs mt-1 ${hoveredItem.pctChange >= 0 ? "text-green-400" : "text-red-400"}`}>
              Variacion promedio: {hoveredItem.pctChange >= 0 ? "+" : ""}{hoveredItem.pctChange.toFixed(2)}%
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
