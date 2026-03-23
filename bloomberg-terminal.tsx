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
} from "lucide-react"
import { Sparkline } from "./sparkline"
import useSWR from "swr"

const fixedColumnClass = "w-[120px] sm:w-[140px] whitespace-nowrap overflow-hidden text-ellipsis"

interface CedearData {
  id: string
  name: string
  ticker: string
  num: string
  ratio: number
  precioUSD: number
  precioARS: number
  value: number
  change: number
  pctChange: number
  avat: number
  time: string
  ytd: number
  ytdCur: number
  subyacenteUSD: number
}

interface ApiResponse {
  cedears: CedearData[]
  dolarCCL: number
  lastUpdate: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BloombergTerminal() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<"tech" | "finance" | "consumer" | "all">("all")
  
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    "/api/cedears",
    fetcher,
    {
      refreshInterval: 30000, // Actualizar cada 30 segundos
      revalidateOnFocus: true,
    }
  )

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
    document.body.classList.toggle("light", !isDarkMode)
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleRefresh = useCallback(() => {
    mutate()
  }, [mutate])

  const categorizeData = (cedears: CedearData[]) => {
    const tech = ["AAPL", "MSFT", "GOOGL", "META", "NVDA", "AMD", "INTC", "NFLX", "TSLA"]
    const finance = ["JPM", "V"]
    const consumer = ["KO", "DIS", "MCD", "NKE", "WMT", "PG", "AMZN"]
    
    if (selectedCategory === "all") return cedears
    
    return cedears.filter((c) => {
      if (selectedCategory === "tech") return tech.includes(c.id)
      if (selectedCategory === "finance") return finance.includes(c.id)
      if (selectedCategory === "consumer") return consumer.includes(c.id)
      return true
    })
  }

  const renderSection = (title: string, items: CedearData[], sectionNum: string, isDarkMode: boolean) => (
    <>
      <tr className={`${isDarkMode ? "text-white bg-[#1d3969]" : "text-[#1d3969] bg-[#e2e8f0]"}`}>
        <th
          className={`sticky left-0 ${isDarkMode ? "bg-[#1d3969]" : "bg-[#e2e8f0]"} px-2 py-1.5 text-left font-semibold ${fixedColumnClass}`}
        >
          {sectionNum} {title}
        </th>
        <th colSpan={10}></th>
      </tr>
      {items.map((item) => (
        <tr key={item.id} className={`border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"} hover:bg-[#2563eb]/10 transition-colors`}>
          <td className={`sticky left-0 ${isDarkMode ? "bg-[#0f172a]" : "bg-[#f8fafc]"} px-2 py-1.5 ${fixedColumnClass}`}>
            <div className="flex items-center gap-2">
              <span className={`${isDarkMode ? "text-[#64748b]" : "text-[#64748b]"} text-xs`}>{item.num}</span>
              <div className="flex flex-col">
                <span className="text-[#2563eb] font-medium text-xs">{item.id}</span>
                <span className={`text-[10px] ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>{item.name}</span>
              </div>
            </div>
          </td>
          <td className={`px-2 py-1.5 text-center ${isDarkMode ? "text-[#64748b]" : "text-[#64748b]"} text-xs`}>
            1:{item.ratio}
          </td>
          <td className={`px-2 py-1.5 w-[100px] ${isDarkMode ? "bg-[#1d3969]/50" : "bg-[#e2e8f0]"}`}>
            <div className="flex justify-center">
              <Sparkline
                data1={[0.5, 0.6, 0.4, 0.7, 0.5, 0.8, 0.6, 0.7]}
                data2={[0.7, 0.5, 0.8, 0.6, 0.9, 0.7, 1.0, 0.8]}
                width={80}
                height={20}
                color1={isDarkMode ? "#64748b" : "#94a3b8"}
                color2={item.change > 0 ? "#059669" : "#dc2626"}
              />
            </div>
          </td>
          <td className={`px-2 py-1.5 text-right ${isDarkMode ? "text-white" : "text-[#374151]"} font-medium text-xs`}>
            ${item.value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td className={`px-2 py-1.5 text-right ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs hidden lg:table-cell`}>
            US${item.subyacenteUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td className={`px-2 py-1.5 text-right text-xs font-medium ${item.change > 0 ? "text-[#059669]" : "text-[#dc2626]"}`}>
            {item.change > 0 ? "+" : ""}
            ${item.change.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td className={`px-2 py-1.5 text-right text-xs font-medium ${item.pctChange > 0 ? "text-[#059669]" : "text-[#dc2626]"}`}>
            {item.pctChange > 0 ? "+" : ""}
            {item.pctChange.toFixed(2)}%
          </td>
          <td
            className={`px-2 py-1.5 text-right text-xs font-medium ${item.avat > 0 ? "text-[#059669]" : "text-[#dc2626]"} hidden sm:table-cell`}
          >
            {item.avat.toFixed(2)}%
          </td>
          <td
            className={`px-2 py-1.5 text-right ${isDarkMode ? "text-white" : "text-[#374151]"} text-xs hidden sm:table-cell`}
          >
            {item.time}
          </td>
          <td
            className={`px-2 py-1.5 text-right text-xs font-medium ${item.ytd > 0 ? "text-[#059669]" : "text-[#dc2626]"} hidden md:table-cell`}
          >
            {item.ytd.toFixed(2)}%
          </td>
          <td
            className={`px-2 py-1.5 text-right text-xs font-medium ${item.ytdCur > 0 ? "text-[#059669]" : "text-[#dc2626]"} hidden md:table-cell`}
          >
            {item.ytdCur.toFixed(2)}%
          </td>
        </tr>
      ))}
    </>
  )

  const filteredCedears = data?.cedears ? categorizeData(data.cedears) : []
  
  // Dividir CEDEARs en categorías para mostrar
  const techCedears = filteredCedears.filter((c) => 
    ["AAPL", "MSFT", "GOOGL", "META", "NVDA", "AMD", "INTC", "NFLX", "TSLA"].includes(c.id)
  )
  const financeCedears = filteredCedears.filter((c) => 
    ["JPM", "V", "AMZN"].includes(c.id)
  )
  const consumerCedears = filteredCedears.filter((c) => 
    ["KO", "DIS", "MCD", "NKE", "WMT", "PG", "BA", "PFE"].includes(c.id)
  )

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? "bg-[#0f172a] text-white" : "bg-[#f8fafc] text-[#374151]"}`}>
      {/* Encabezado */}
      <div
        className={`${isDarkMode ? "bg-[#1d3969] text-white" : "bg-[#e2e8f0] text-[#1d3969]"} px-3 py-2 flex items-center justify-between border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-[#2563eb] font-semibold text-xs sm:text-sm flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            CEDEARS
          </span>
          <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs sm:text-sm`}>Panel de Cotizaciones</span>
        </div>
        <div className="flex items-center gap-3">
          {data?.dolarCCL && (
            <span className="bg-gradient-to-r from-[#1d3969] to-[#2563eb] px-3 py-1 text-white rounded-lg text-xs sm:text-sm font-medium hidden sm:flex items-center gap-1 shadow-md">
              <DollarSign className="h-3 w-3" />
              CCL: ${data.dolarCCL.toLocaleString("es-AR")}
            </span>
          )}
          <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs sm:text-sm hidden md:inline`}>
            {data?.lastUpdate ? new Date(data.lastUpdate).toLocaleTimeString("es-AR") : ""}
          </span>
          <div className="flex gap-1.5">
            <button 
              onClick={handleRefresh}
              className={`p-1 hover:bg-[#2563eb]/20 rounded transition-colors ${isLoading ? "animate-spin" : ""}`}
              disabled={isLoading}
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button className="p-1 hover:bg-[#2563eb]/20 rounded transition-colors">
              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button className="p-1 hover:bg-[#2563eb]/20 rounded transition-colors">
              <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button className="p-1 hover:bg-[#dc2626]/20 rounded transition-colors">
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
          <button 
            onClick={toggleTheme} 
            className="ml-2 p-1.5 bg-gradient-to-r from-[#1d3969] to-[#2563eb] rounded-lg hover:shadow-lg transition-all"
          >
            {isDarkMode ? <Sun className="h-3 w-3 sm:h-4 sm:w-4 text-white" /> : <Moon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
          </button>
        </div>
      </div>

      {/* Botones de Función */}
      <div
        className={`flex flex-wrap gap-2 ${isDarkMode ? "bg-[#1d3969]/80" : "bg-[#e2e8f0]"} px-3 py-2 text-xs sm:text-sm`}
      >
        <button 
          onClick={handleRefresh}
          className="bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1.5 text-white rounded-lg font-medium hover:shadow-lg transition-all shadow-md"
        >
          ACTUALIZAR
        </button>
        <button 
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all shadow-md ${
            selectedCategory === "all" 
              ? "bg-gradient-to-r from-[#1d3969] to-[#2563eb] text-white" 
              : isDarkMode ? "bg-[#374151] text-white hover:bg-[#4b5563]" : "bg-white text-[#374151] hover:bg-gray-100"
          }`}
        >
          TODOS
        </button>
        <button 
          onClick={() => setSelectedCategory("tech")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all shadow-md ${
            selectedCategory === "tech" 
              ? "bg-gradient-to-r from-[#1d3969] to-[#2563eb] text-white" 
              : isDarkMode ? "bg-[#374151] text-white hover:bg-[#4b5563]" : "bg-white text-[#374151] hover:bg-gray-100"
          }`}
        >
          TECNOLOGIA
        </button>
        <button 
          onClick={() => setSelectedCategory("finance")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all shadow-md ${
            selectedCategory === "finance" 
              ? "bg-gradient-to-r from-[#1d3969] to-[#2563eb] text-white" 
              : isDarkMode ? "bg-[#374151] text-white hover:bg-[#4b5563]" : "bg-white text-[#374151] hover:bg-gray-100"
          }`}
        >
          FINANZAS
        </button>
        <button 
          onClick={() => setSelectedCategory("consumer")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all shadow-md ${
            selectedCategory === "consumer" 
              ? "bg-gradient-to-r from-[#1d3969] to-[#2563eb] text-white" 
              : isDarkMode ? "bg-[#374151] text-white hover:bg-[#4b5563]" : "bg-white text-[#374151] hover:bg-gray-100"
          }`}
        >
          CONSUMO
        </button>
      </div>

      {/* Barra de Navegación */}
      <div
        className={`flex items-center gap-2 border-b ${isDarkMode ? "border-[#2563eb]/30 bg-[#1d3969]/60" : "border-[#e2e8f0] bg-[#f1f5f9]"} px-3 py-2 text-xs sm:text-sm`}
      >
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#2563eb]" />
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#2563eb]" />
        <span className="font-medium">CEDEARs Argentina</span>
        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className={isDarkMode ? "text-[#64748b]" : "text-[#64748b]"}>|</span>
        <span>Yahoo Finance</span>
        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Cotizaciones en Tiempo Real</span>
        <div className="ml-auto flex items-center gap-3">
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

      {/* Barra de Filtros */}
      <div
        className={`flex flex-wrap items-center gap-3 ${isDarkMode ? "bg-[#1d3969]/40" : "bg-[#f1f5f9]"} px-3 py-2 text-[#2563eb] text-xs sm:text-sm`}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold">Moneda</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-[#1d3969] to-[#2563eb] px-2.5 py-1 text-white rounded-lg font-medium text-xs">ARS</span>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#1d3969] transition-colors">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#2563eb] rounded" defaultChecked />
          <span>Mostrar Subyacente USD</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#1d3969] transition-colors">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#2563eb] rounded" defaultChecked />
          <span>Ratios</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#1d3969] transition-colors">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#2563eb] rounded" defaultChecked />
          <span>Variacion %</span>
        </label>
      </div>

      {/* Estado de carga o error */}
      {isLoading && !data && (
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

      {/* Contenido Principal */}
      {data?.cedears && (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className={`${isDarkMode ? "text-white bg-[#1d3969]" : "text-[#1d3969] bg-[#e2e8f0]"}`}>
                <th
                  className={`sticky left-0 ${isDarkMode ? "bg-[#1d3969]" : "bg-[#e2e8f0]"} px-2 py-2 text-left font-semibold ${fixedColumnClass}`}
                >
                  CEDEAR
                </th>
                <th className="px-2 py-2 text-center font-semibold">Ratio</th>
                <th className={`px-2 py-2 text-center font-semibold ${isDarkMode ? "bg-[#1d3969]" : "bg-[#e2e8f0]"}`}>Grafico</th>
                <th className="px-2 py-2 text-right font-semibold">Precio ARS</th>
                <th className="px-2 py-2 text-right font-semibold hidden lg:table-cell">Subyacente USD</th>
                <th className="px-2 py-2 text-right font-semibold">Var. Neta</th>
                <th className="px-2 py-2 text-right font-semibold">%Var.</th>
                <th className="px-2 py-2 text-right font-semibold hidden sm:table-cell">AVAT</th>
                <th className="px-2 py-2 text-right font-semibold hidden sm:table-cell">Hora</th>
                <th className="px-2 py-2 text-right font-semibold hidden md:table-cell">%YTD</th>
                <th className="px-2 py-2 text-right font-semibold hidden md:table-cell">%YTD Mon</th>
              </tr>
            </thead>
            <tbody>
              {selectedCategory === "all" ? (
                <>
                  {techCedears.length > 0 && renderSection("Tecnologia", techCedears, "1)", isDarkMode)}
                  {financeCedears.length > 0 && renderSection("Finanzas", financeCedears, "2)", isDarkMode)}
                  {consumerCedears.length > 0 && renderSection("Consumo", consumerCedears, "3)", isDarkMode)}
                </>
              ) : (
                renderSection(
                  selectedCategory === "tech" ? "Tecnologia" : 
                  selectedCategory === "finance" ? "Finanzas" : "Consumo",
                  filteredCedears,
                  "1)",
                  isDarkMode
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer con información */}
      <div className={`px-3 py-2 text-xs ${isDarkMode ? "bg-[#1d3969]/40 text-[#94a3b8]" : "bg-[#f1f5f9] text-[#64748b]"} border-t ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <span>Fuente: Yahoo Finance | Dolar CCL: DolarAPI</span>
          <span>Los precios de CEDEARs se calculan usando el ratio de conversion y el dolar CCL</span>
          <span>Actualizacion automatica cada 30 segundos</span>
        </div>
      </div>
    </div>
  )
}
