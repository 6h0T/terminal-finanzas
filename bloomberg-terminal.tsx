"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ChevronDown,
  X,
  Maximize2,
  Minus,
  MessageSquare,
  Star,
  Bell,
  HelpCircle,
  ChevronRight,
  Sun,
  Moon,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Building2,
  Landmark,
  FileText,
  ScrollText,
  BarChart3,
  Globe,
  Cpu,
  Banknote,
  Zap,
  Heart,
  ShoppingCart,
  Factory,
  Home,
  Layers,
} from "lucide-react"
import { Sparkline } from "./sparkline"
import { CedearHeatmap } from "./components/cedear-heatmap"
import useSWR from "swr"

const fixedColumnClass = "w-[120px] sm:w-[140px] whitespace-nowrap overflow-hidden text-ellipsis"

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

interface DolarItem {
  casa: string
  compra: number
  venta: number
}

interface ArgApiResponse {
  data: {
    cedears: MarketItem[]
    acciones: MarketItem[]
    bonos: MarketItem[]
    letras: MarketItem[]
    obligaciones: MarketItem[]
    opciones: MarketItem[]
  }
  dolar: {
    oficial?: DolarItem
    blue?: DolarItem
    bolsa?: DolarItem
    ccl?: DolarItem
    mayorista?: DolarItem
    cripto?: DolarItem
    tarjeta?: DolarItem
  }
  summary: {
    totalCedears: number
    totalAcciones: number
    totalBonos: number
    totalLetras: number
    totalObligaciones: number
    totalOpciones: number
  }
  lastUpdate: string
}

interface UsaApiResponse {
  data: {
    tech: MarketItem[]
    financial: MarketItem[]
    energy: MarketItem[]
    healthcare: MarketItem[]
    consumer: MarketItem[]
    industrial: MarketItem[]
    realestate: MarketItem[]
    etf: MarketItem[]
    all: MarketItem[]
  }
  summary: {
    totalTech: number
    totalFinancial: number
    totalEnergy: number
    totalHealthcare: number
    totalConsumer: number
    totalIndustrial: number
    totalRealestate: number
    totalEtf: number
    totalAll: number
  }
  lastUpdate: string
}

type MarketType = "argentina" | "usa"

type ArgCategoryType = "all" | "cedears" | "acciones" | "bonos" | "letras" | "obligaciones" | "opciones"
type UsaCategoryType = "all" | "tech" | "financial" | "energy" | "healthcare" | "consumer" | "industrial" | "realestate" | "etf"
type CategoryType = ArgCategoryType | UsaCategoryType

const ARG_CATEGORIES: { id: ArgCategoryType; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "TODOS", icon: <BarChart3 className="h-3.5 w-3.5" /> },
  { id: "cedears", label: "CEDEARs", icon: <TrendingUp className="h-3.5 w-3.5" /> },
  { id: "acciones", label: "ACCIONES", icon: <Building2 className="h-3.5 w-3.5" /> },
  { id: "bonos", label: "BONOS", icon: <Landmark className="h-3.5 w-3.5" /> },
  { id: "letras", label: "LETRAS", icon: <FileText className="h-3.5 w-3.5" /> },
  { id: "obligaciones", label: "ONs", icon: <ScrollText className="h-3.5 w-3.5" /> },
  { id: "opciones", label: "OPCIONES", icon: <BarChart3 className="h-3.5 w-3.5" /> },
]

const USA_CATEGORIES: { id: UsaCategoryType; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "TODOS", icon: <BarChart3 className="h-3.5 w-3.5" /> },
  { id: "tech", label: "TECH", icon: <Cpu className="h-3.5 w-3.5" /> },
  { id: "financial", label: "FINANCIERO", icon: <Banknote className="h-3.5 w-3.5" /> },
  { id: "energy", label: "ENERGÍA", icon: <Zap className="h-3.5 w-3.5" /> },
  { id: "healthcare", label: "SALUD", icon: <Heart className="h-3.5 w-3.5" /> },
  { id: "consumer", label: "CONSUMO", icon: <ShoppingCart className="h-3.5 w-3.5" /> },
  { id: "industrial", label: "INDUSTRIAL", icon: <Factory className="h-3.5 w-3.5" /> },
  { id: "realestate", label: "REAL ESTATE", icon: <Home className="h-3.5 w-3.5" /> },
  { id: "etf", label: "ETFs", icon: <Layers className="h-3.5 w-3.5" /> },
]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type ViewType = "tabla" | "heatmap"

export default function BloombergTerminal() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedMarket, setSelectedMarket] = useState<MarketType>("argentina")
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("cedears")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewType, setViewType] = useState<ViewType>("tabla")
  const [marketDropdownOpen, setMarketDropdownOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const [lastRefreshReset, setLastRefreshReset] = useState(Date.now())
  
  const { data: argData, error: argError, isLoading: argLoading, mutate: argMutate } = useSWR<ArgApiResponse>(
    selectedMarket === "argentina" ? `/api/mercado?category=${selectedCategory === "all" ? "all" : selectedCategory}` : null,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  const { data: usaData, error: usaError, isLoading: usaLoading, mutate: usaMutate } = useSWR<UsaApiResponse>(
    selectedMarket === "usa" ? `/api/usa-stocks` : null,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  const data = selectedMarket === "argentina" ? argData : null
  const usaStocks = selectedMarket === "usa" ? usaData : null
  const error = selectedMarket === "argentina" ? argError : usaError
  const isLoading = selectedMarket === "argentina" ? argLoading : usaLoading
  const currentLastUpdate = selectedMarket === "argentina" ? argData?.lastUpdate : usaData?.lastUpdate

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
    document.body.classList.toggle("light", !isDarkMode)
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleRefresh = useCallback(() => {
    const now = Date.now()
    const hourInMs = 60 * 60 * 1000
    
    // Reset counter if more than 1 hour has passed
    if (now - lastRefreshReset > hourInMs) {
      setRefreshCount(0)
      setLastRefreshReset(now)
    }
    
    // Check if user has exceeded 2 refreshes per hour
    if (refreshCount >= 2) {
      alert("Límite de actualizaciones alcanzado. Podés actualizar manualmente 2 veces por hora.")
      return
    }
    
    // Perform refresh
    if (selectedMarket === "argentina") {
      argMutate()
    } else {
      usaMutate()
    }
    
    setRefreshCount(prev => prev + 1)
  }, [selectedMarket, argMutate, usaMutate, refreshCount, lastRefreshReset])

  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category)
    setSearchTerm("")
  }

  const handleMarketChange = (market: MarketType) => {
    setSelectedMarket(market)
    setSelectedCategory(market === "argentina" ? "cedears" : "tech")
    setSearchTerm("")
    setViewType("tabla")
    setMarketDropdownOpen(false)
  }

  const activeCategories = selectedMarket === "argentina" ? ARG_CATEGORIES : USA_CATEGORIES

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch((err) => {
        console.error("Error entering fullscreen:", err)
      })
    }
  }, [])

  const handleMinimize = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch((err) => {
        console.error("Error exiting fullscreen:", err)
      })
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const filterItems = (items: MarketItem[]) => {
    if (!searchTerm) return items
    return items.filter((item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const renderTableHeader = (isDarkMode: boolean) => (
    <thead>
      <tr className={`${isDarkMode ? "text-white bg-[#1d3969]" : "text-[#1d3969] bg-[#e2e8f0]"}`}>
        <th className={`sticky left-0 ${isDarkMode ? "bg-[#1d3969]" : "bg-[#e2e8f0]"} px-2 py-2 text-left font-semibold ${fixedColumnClass}`}>
          Simbolo
        </th>
        <th className={`px-2 py-2 text-center font-semibold ${isDarkMode ? "bg-[#1d3969]" : "bg-[#e2e8f0]"}`}>Grafico</th>
        <th className="px-2 py-2 text-right font-semibold">Precio</th>
        <th className="px-2 py-2 text-right font-semibold">Var. Neta</th>
        <th className="px-2 py-2 text-right font-semibold">%Var.</th>
        <th className="px-2 py-2 text-right font-semibold hidden sm:table-cell">Volumen</th>
        <th className="px-2 py-2 text-right font-semibold hidden md:table-cell">Bid</th>
        <th className="px-2 py-2 text-right font-semibold hidden md:table-cell">Ask</th>
        <th className="px-2 py-2 text-right font-semibold hidden lg:table-cell">Operaciones</th>
        <th className="px-2 py-2 text-right font-semibold hidden sm:table-cell">Hora</th>
      </tr>
    </thead>
  )

  const renderTableRow = (item: MarketItem, isDarkMode: boolean) => (
    <tr key={item.id} className={`border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"} hover:bg-[#2563eb]/10 transition-colors`}>
      <td className={`sticky left-0 ${isDarkMode ? "bg-[#0f172a]" : "bg-[#f8fafc]"} px-2 py-1.5 ${fixedColumnClass}`}>
        <div className="flex items-center gap-2">
          <span className={`${isDarkMode ? "text-[#64748b]" : "text-[#64748b]"} text-xs`}>{item.num}</span>
          <div className="flex flex-col">
            <span className="text-[#2563eb] font-medium text-xs">{item.symbol}</span>
          </div>
        </div>
      </td>
      <td className={`px-2 py-1.5 w-[100px] ${isDarkMode ? "bg-[#1d3969]/50" : "bg-[#e2e8f0]"}`}>
        <div className="flex justify-center">
          <Sparkline
            data1={[0.5, 0.6, 0.4, 0.7, 0.5, 0.8, 0.6, 0.7]}
            data2={[0.7, 0.5, 0.8, 0.6, 0.9, 0.7, 1.0, 0.8]}
            width={80}
            height={20}
            color1={isDarkMode ? "#64748b" : "#94a3b8"}
            color2={item.pctChange >= 0 ? "#059669" : "#dc2626"}
          />
        </div>
      </td>
      <td className={`px-2 py-1.5 text-right ${isDarkMode ? "text-white" : "text-[#374151]"} font-medium text-xs`}>
        ${item.value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className={`px-2 py-1.5 text-right text-xs font-medium ${item.change >= 0 ? "text-[#059669]" : "text-[#dc2626]"}`}>
        {item.change >= 0 ? "+" : ""}
        ${item.change.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className={`px-2 py-1.5 text-right text-xs font-medium ${item.pctChange >= 0 ? "text-[#059669]" : "text-[#dc2626]"}`}>
        {item.pctChange >= 0 ? "+" : ""}
        {item.pctChange.toFixed(2)}%
      </td>
      <td className={`px-2 py-1.5 text-right ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs hidden sm:table-cell`}>
        {item.volume.toLocaleString("es-AR")}
      </td>
      <td className={`px-2 py-1.5 text-right ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs hidden md:table-cell`}>
        ${item.bid.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
      </td>
      <td className={`px-2 py-1.5 text-right ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs hidden md:table-cell`}>
        ${item.ask.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
      </td>
      <td className={`px-2 py-1.5 text-right ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs hidden lg:table-cell`}>
        {item.operations.toLocaleString("es-AR")}
      </td>
      <td className={`px-2 py-1.5 text-right ${isDarkMode ? "text-white" : "text-[#374151]"} text-xs hidden sm:table-cell`}>
        {item.time}
      </td>
    </tr>
  )

  const renderSection = (title: string, items: MarketItem[], sectionNum: string, isDarkMode: boolean) => {
    const filteredItems = filterItems(items)
    if (filteredItems.length === 0) return null
    
    return (
      <>
        <tr className={`${isDarkMode ? "text-white bg-[#1d3969]" : "text-[#1d3969] bg-[#e2e8f0]"}`}>
          <th
            className={`sticky left-0 ${isDarkMode ? "bg-[#1d3969]" : "bg-[#e2e8f0]"} px-2 py-1.5 text-left font-semibold ${fixedColumnClass}`}
          >
            {sectionNum} {title} ({filteredItems.length})
          </th>
          <th colSpan={9}></th>
        </tr>
        {filteredItems.slice(0, 50).map((item) => renderTableRow(item, isDarkMode))}
        {filteredItems.length > 50 && (
          <tr>
            <td colSpan={10} className={`text-center py-2 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"} text-xs`}>
              ... y {filteredItems.length - 50} mas
            </td>
          </tr>
        )}
      </>
    )
  }

  const getCategoryData = (): MarketItem[] => {
    if (selectedMarket === "argentina") {
      if (!data?.data) return []
      switch (selectedCategory) {
        case "cedears": return data.data.cedears
        case "acciones": return data.data.acciones
        case "bonos": return data.data.bonos
        case "letras": return data.data.letras
        case "obligaciones": return data.data.obligaciones
        case "opciones": return data.data.opciones
        case "all":
        default: return []
      }
    } else {
      if (!usaStocks?.data) return []
      switch (selectedCategory) {
        case "tech": return usaStocks.data.tech
        case "financial": return usaStocks.data.financial
        case "energy": return usaStocks.data.energy
        case "healthcare": return usaStocks.data.healthcare
        case "consumer": return usaStocks.data.consumer
        case "industrial": return usaStocks.data.industrial
        case "realestate": return usaStocks.data.realestate
        case "etf": return usaStocks.data.etf
        case "all":
        default: return []
      }
    }
  }

  const hasData = selectedMarket === "argentina" ? !!data?.data : !!usaStocks?.data

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? "bg-[#0f172a] text-white" : "bg-[#f8fafc] text-[#374151]"}`}>
      {/* Encabezado */}
      <div
        className={`${isDarkMode ? "bg-[#1d3969] text-white" : "bg-[#e2e8f0] text-[#1d3969]"} px-3 py-2 flex items-center justify-between border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-[#2563eb] font-semibold text-xs sm:text-sm flex items-center gap-1">
            {selectedMarket === "argentina" ? <TrendingUp className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            {selectedMarket === "argentina" ? "MERCADO ARGENTINO" : "MERCADO USA"}
          </span>
          <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs sm:text-sm`}>Panel de Cotizaciones</span>
        </div>
        <div className="flex items-center gap-3">
          {selectedMarket === "argentina" && data?.dolar?.ccl && (
            <span className="bg-gradient-to-r from-[#1d3969] to-[#2563eb] px-3 py-1 text-white rounded-lg text-xs sm:text-sm font-medium hidden sm:flex items-center gap-1 shadow-md">
              <DollarSign className="h-3 w-3" />
              CCL: ${data.dolar.ccl.venta?.toLocaleString("es-AR")}
            </span>
          )}
          {selectedMarket === "argentina" && data?.dolar?.blue && (
            <span className="bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1 text-white rounded-lg text-xs sm:text-sm font-medium hidden md:flex items-center gap-1 shadow-md">
              Blue: ${data.dolar.blue.venta?.toLocaleString("es-AR")}
            </span>
          )}
          <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs sm:text-sm hidden lg:inline`}>
            {currentLastUpdate ? new Date(currentLastUpdate).toLocaleTimeString("es-AR") : ""}
          </span>
          <div className="flex gap-1.5">
            <button 
              onClick={handleRefresh}
              className={`p-1 hover:bg-[#2563eb]/20 rounded transition-colors ${isLoading ? "animate-spin" : ""}`}
              disabled={isLoading}
              title={`Actualizar (${refreshCount}/2 por hora)`}
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            {isFullscreen && (
              <button 
                onClick={handleMinimize}
                className="p-1 hover:bg-[#2563eb]/20 rounded transition-colors"
                title="Salir de pantalla completa"
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            )}
            {!isFullscreen && (
              <button 
                onClick={handleFullscreen}
                className="p-1 hover:bg-[#2563eb]/20 rounded transition-colors"
                title="Pantalla completa"
              >
                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
          <button 
            onClick={toggleTheme} 
            className="ml-2 p-1.5 bg-gradient-to-r from-[#1d3969] to-[#2563eb] rounded-lg hover:shadow-lg transition-all"
          >
            {isDarkMode ? <Sun className="h-3 w-3 sm:h-4 sm:w-4 text-white" /> : <Moon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
          </button>
        </div>
      </div>

      {/* Categorías */}
      <div
        className={`flex flex-wrap gap-2 ${isDarkMode ? "bg-[#1d3969]/80" : "bg-[#e2e8f0]"} px-3 py-2 text-xs sm:text-sm`}
      >
        <button 
          onClick={handleRefresh}
          className="bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1.5 text-white rounded-lg font-medium hover:shadow-lg transition-all shadow-md flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          ACTUALIZAR
        </button>
        {activeCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              handleCategoryChange(cat.id)
              setViewType("tabla")
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shadow-md flex items-center gap-1.5 ${
              selectedCategory === cat.id && viewType === "tabla"
                ? "bg-gradient-to-r from-[#1d3969] to-[#2563eb] text-white"
                : isDarkMode
                ? "bg-[#374151] text-white hover:bg-[#4b5563]"
                : "bg-white text-[#374151] hover:bg-gray-100"
            }`}
          >
            {cat.icon}
            {cat.label}
            {selectedMarket === "argentina" && data?.summary && cat.id !== "all" && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedCategory === cat.id ? "bg-white/20" : isDarkMode ? "bg-[#2563eb]/30" : "bg-[#2563eb]/10"
              }`}>
                {cat.id === "cedears" && data.summary.totalCedears}
                {cat.id === "acciones" && data.summary.totalAcciones}
                {cat.id === "bonos" && data.summary.totalBonos}
                {cat.id === "letras" && data.summary.totalLetras}
                {cat.id === "obligaciones" && data.summary.totalObligaciones}
                {cat.id === "opciones" && data.summary.totalOpciones}
              </span>
            )}
            {selectedMarket === "usa" && usaStocks?.summary && cat.id !== "all" && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedCategory === cat.id ? "bg-white/20" : isDarkMode ? "bg-[#2563eb]/30" : "bg-[#2563eb]/10"
              }`}>
                {cat.id === "tech" && usaStocks.summary.totalTech}
                {cat.id === "financial" && usaStocks.summary.totalFinancial}
                {cat.id === "energy" && usaStocks.summary.totalEnergy}
                {cat.id === "healthcare" && usaStocks.summary.totalHealthcare}
                {cat.id === "consumer" && usaStocks.summary.totalConsumer}
                {cat.id === "industrial" && usaStocks.summary.totalIndustrial}
                {cat.id === "realestate" && usaStocks.summary.totalRealestate}
                {cat.id === "etf" && usaStocks.summary.totalEtf}
              </span>
            )}
          </button>
        ))}
        
        {/* Boton Mapa de Calor - solo visible cuando hay CEDEARs en mercado argentino */}
        {selectedMarket === "argentina" && data?.data?.cedears && data.data.cedears.length > 0 && (
          <button
            onClick={() => {
              setSelectedCategory("cedears")
              setViewType("heatmap")
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shadow-md flex items-center gap-1.5 ${
              viewType === "heatmap"
                ? "bg-gradient-to-r from-[#dc2626] to-[#f97316] text-white"
                : isDarkMode
                ? "bg-[#374151] text-white hover:bg-[#4b5563]"
                : "bg-white text-[#374151] hover:bg-gray-100"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            MAPA DE CALOR
          </button>
        )}
      </div>

      {/* Barra de Navegación */}
      <div
        className={`flex items-center gap-2 border-b ${isDarkMode ? "border-[#2563eb]/30 bg-[#1d3969]/60" : "border-[#e2e8f0] bg-[#f1f5f9]"} px-3 py-2 text-xs sm:text-sm`}
      >
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#2563eb]" />
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#2563eb]" />
        <div className="relative">
          <button
            onClick={() => setMarketDropdownOpen(!marketDropdownOpen)}
            className={`flex items-center gap-1 font-medium px-2 py-1 rounded-lg transition-all ${
              isDarkMode
                ? "hover:bg-[#2563eb]/20"
                : "hover:bg-[#2563eb]/10"
            }`}
          >
            {selectedMarket === "argentina" ? (
              <>
                <TrendingUp className="h-3 w-3 text-[#2563eb]" />
                Mercado Argentino
              </>
            ) : (
              <>
                <Globe className="h-3 w-3 text-[#2563eb]" />
                Mercado de USA
              </>
            )}
            <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${marketDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {marketDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMarketDropdownOpen(false)} />
              <div className={`absolute top-full left-0 mt-1 z-20 rounded-lg shadow-xl border ${
                isDarkMode
                  ? "bg-[#1d3969] border-[#2563eb]/30"
                  : "bg-white border-[#e2e8f0]"
              } overflow-hidden min-w-[200px]`}>
                <button
                  onClick={() => handleMarketChange("argentina")}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                    selectedMarket === "argentina"
                      ? "bg-[#2563eb]/20 text-[#2563eb] font-semibold"
                      : isDarkMode
                      ? "hover:bg-[#2563eb]/10 text-white"
                      : "hover:bg-[#f1f5f9] text-[#374151]"
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">Mercado Argentino</span>
                    <span className={`text-[10px] ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>CEDEARs, Acciones, Bonos, Letras</span>
                  </div>
                </button>
                <button
                  onClick={() => handleMarketChange("usa")}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                    selectedMarket === "usa"
                      ? "bg-[#2563eb]/20 text-[#2563eb] font-semibold"
                      : isDarkMode
                      ? "hover:bg-[#2563eb]/10 text-white"
                      : "hover:bg-[#f1f5f9] text-[#374151]"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">Mercado de USA</span>
                    <span className={`text-[10px] ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>Tech, Financial, Energy, ETFs</span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar simbolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`px-3 py-1 rounded-lg text-xs ${
              isDarkMode 
                ? "bg-[#0f172a] border border-[#2563eb]/30 text-white placeholder-[#64748b]" 
                : "bg-white border border-[#e2e8f0] text-[#374151] placeholder-[#94a3b8]"
            } focus:outline-none focus:ring-2 focus:ring-[#2563eb]/50`}
          />
          <button className="flex items-center gap-1 hover:text-[#2563eb] transition-colors">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Mensaje</span>
          </button>
          <button className="hover:text-[#2563eb] transition-colors">
            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button className="hover:text-[#2563eb] transition-colors">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button className="hover:text-[#2563eb] transition-colors">
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Cotizaciones de Dólar - Solo mercado argentino */}
      {selectedMarket === "argentina" && data?.dolar && (
        <div className={`flex flex-wrap items-center gap-3 ${isDarkMode ? "bg-[#1d3969]/40" : "bg-[#f1f5f9]"} px-3 py-2 text-xs border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
          <span className="font-bold text-[#2563eb]">Cotizaciones Dolar:</span>
          {data.dolar.oficial && (
            <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
              Oficial: <span className="font-medium text-[#059669]">${data.dolar.oficial.venta?.toLocaleString("es-AR")}</span>
            </span>
          )}
          {data.dolar.blue && (
            <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
              Blue: <span className="font-medium text-[#2563eb]">${data.dolar.blue.venta?.toLocaleString("es-AR")}</span>
            </span>
          )}
          {data.dolar.bolsa && (
            <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} hidden sm:inline`}>
              MEP: <span className="font-medium">${data.dolar.bolsa.venta?.toLocaleString("es-AR")}</span>
            </span>
          )}
          {data.dolar.ccl && (
            <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} hidden sm:inline`}>
              CCL: <span className="font-medium">${data.dolar.ccl.venta?.toLocaleString("es-AR")}</span>
            </span>
          )}
          {data.dolar.cripto && (
            <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} hidden md:inline`}>
              Cripto: <span className="font-medium">${data.dolar.cripto.venta?.toLocaleString("es-AR")}</span>
            </span>
          )}
          {data.dolar.tarjeta && (
            <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} hidden lg:inline`}>
              Tarjeta: <span className="font-medium">${data.dolar.tarjeta.venta?.toLocaleString("es-AR")}</span>
            </span>
          )}
        </div>
      )}

      {/* Estado de carga o error */}
      {isLoading && !hasData && (
        <div className={`flex items-center justify-center py-20 ${isDarkMode ? "text-white" : "text-[#374151]"}`}>
          <RefreshCw className="h-8 w-8 animate-spin mr-3" />
          <span>Cargando cotizaciones...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-20 text-[#dc2626]">
          <span>Error al cargar las cotizaciones. </span>
          <button onClick={handleRefresh} className="ml-2 underline hover:text-[#b91c1c]">
            Reintentar
          </button>
        </div>
      )}

      {/* Contenido Principal - Mercado Argentino */}
      {selectedMarket === "argentina" && data?.data && viewType === "tabla" && (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            {renderTableHeader(isDarkMode)}
            <tbody>
              {selectedCategory === "all" ? (
                <>
                  {data.data.cedears.length > 0 && renderSection("CEDEARs", data.data.cedears, "1)", isDarkMode)}
                  {data.data.acciones.length > 0 && renderSection("Acciones", data.data.acciones, "2)", isDarkMode)}
                  {data.data.bonos.length > 0 && renderSection("Bonos", data.data.bonos, "3)", isDarkMode)}
                  {data.data.letras.length > 0 && renderSection("Letras", data.data.letras, "4)", isDarkMode)}
                  {data.data.obligaciones.length > 0 && renderSection("Obligaciones Negociables", data.data.obligaciones, "5)", isDarkMode)}
                  {data.data.opciones.length > 0 && renderSection("Opciones", data.data.opciones, "6)", isDarkMode)}
                </>
              ) : (
                <>
                  {filterItems(getCategoryData()).slice(0, 100).map((item) => renderTableRow(item, isDarkMode))}
                  {filterItems(getCategoryData()).length > 100 && (
                    <tr>
                      <td colSpan={10} className={`text-center py-2 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"} text-xs`}>
                        Mostrando 100 de {filterItems(getCategoryData()).length} resultados
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Contenido Principal - Mercado USA */}
      {selectedMarket === "usa" && usaStocks?.data && viewType === "tabla" && (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            {renderTableHeader(isDarkMode)}
            <tbody>
              {selectedCategory === "all" ? (
                <>
                  {usaStocks.data.tech.length > 0 && renderSection("Tech", usaStocks.data.tech, "1)", isDarkMode)}
                  {usaStocks.data.financial.length > 0 && renderSection("Financiero", usaStocks.data.financial, "2)", isDarkMode)}
                  {usaStocks.data.energy.length > 0 && renderSection("Energía", usaStocks.data.energy, "3)", isDarkMode)}
                  {usaStocks.data.healthcare.length > 0 && renderSection("Salud", usaStocks.data.healthcare, "4)", isDarkMode)}
                  {usaStocks.data.consumer.length > 0 && renderSection("Consumo", usaStocks.data.consumer, "5)", isDarkMode)}
                  {usaStocks.data.industrial.length > 0 && renderSection("Industrial", usaStocks.data.industrial, "6)", isDarkMode)}
                  {usaStocks.data.realestate.length > 0 && renderSection("Real Estate", usaStocks.data.realestate, "7)", isDarkMode)}
                  {usaStocks.data.etf.length > 0 && renderSection("ETFs", usaStocks.data.etf, "8)", isDarkMode)}
                </>
              ) : (
                <>
                  {filterItems(getCategoryData()).slice(0, 100).map((item) => renderTableRow(item, isDarkMode))}
                  {filterItems(getCategoryData()).length > 100 && (
                    <tr>
                      <td colSpan={10} className={`text-center py-2 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"} text-xs`}>
                        Mostrando 100 de {filterItems(getCategoryData()).length} resultados
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Vista Mapa de Calor - Solo mercado argentino */}
      {selectedMarket === "argentina" && data?.data?.cedears && data.data.cedears.length > 0 && viewType === "heatmap" && (
        <div className={`m-3 rounded-lg border ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
          {/* Header del Mapa de Calor */}
          <div className={`${isDarkMode ? "bg-[#1d3969] text-white" : "bg-[#e2e8f0] text-[#1d3969]"} px-4 py-3 flex items-center justify-between rounded-t-lg`}>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#2563eb]" />
              <span className="font-semibold">Mapa de Calor - CEDEARs</span>
              <span className={`text-xs ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                (Variacion % del dia)
              </span>
            </div>
            <span className={`text-xs ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
              {data.data.cedears.length} activos
            </span>
          </div>
          
          <CedearHeatmap data={data.data.cedears} isDarkMode={isDarkMode} />
        </div>
      )}

      {/* Footer con información */}
      <div className={`px-3 py-2 mt-4 text-xs ${isDarkMode ? "bg-[#1d3969]/40 text-[#94a3b8]" : "bg-[#f1f5f9] text-[#64748b]"} border-t ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <span>
            Información provista gracias a{" "}
            <a 
              href="https://github.com/ferminrp/google-sheets-argento" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#2563eb] hover:underline"
            >
              google-sheets-argento
            </a>
            {" "}| Diseñado por{" "}
            <a 
              href="https://gh0t.art" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#2563eb] hover:underline"
            >
              gh0t
            </a>
          </span>
          <span>Actualizacion automatica cada 30 segundos</span>
        </div>
      </div>
    </div>
  )
}
