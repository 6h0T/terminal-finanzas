"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { Sparkline } from "./sparkline"
import { marketData } from "./marketData"

const fixedColumnClass = "w-[120px] sm:w-[140px] whitespace-nowrap overflow-hidden text-ellipsis"

export default function BloombergTerminal() {
  const [data, setData] = useState(marketData)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
    document.body.classList.toggle("light", !isDarkMode)
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const renderSection = (title: string, items: any[], sectionNum: string, isDarkMode: boolean) => (
    <>
      <tr className={`${isDarkMode ? "text-white bg-[#1d3969]" : "text-[#1d3969] bg-[#e2e8f0]"}`}>
        <th
          className={`sticky left-0 ${isDarkMode ? "bg-[#1d3969]" : "bg-[#e2e8f0]"} px-2 py-1.5 text-left font-semibold ${fixedColumnClass}`}
        >
          {sectionNum} {title}
        </th>
        <th colSpan={9}></th>
      </tr>
      {items.map((item, index) => (
        <tr key={item.id} className={`border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"} hover:bg-[#2563eb]/10 transition-colors`}>
          <td className={`sticky left-0 ${isDarkMode ? "bg-[#0f172a]" : "bg-[#f8fafc]"} px-2 py-1.5 ${fixedColumnClass}`}>
            <div className="flex items-center gap-2">
              <span className={`${isDarkMode ? "text-[#64748b]" : "text-[#64748b]"} text-xs`}>{item.num}</span>
              <span className="text-[#2563eb] font-medium text-xs">{item.id}</span>
            </div>
          </td>
          <td className={`px-2 py-1.5 text-center ${isDarkMode ? "text-[#64748b]" : "text-[#64748b]"} text-xs`}>[□]</td>
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
            {item.value.toFixed(2)}
          </td>
          <td className={`px-2 py-1.5 text-right text-xs font-medium ${item.change > 0 ? "text-[#059669]" : "text-[#dc2626]"}`}>
            {item.change > 0 ? "+" : ""}
            {item.change.toFixed(2)}
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

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? "bg-[#0f172a] text-white" : "bg-[#f8fafc] text-[#374151]"}`}>
      {/* Encabezado */}
      <div
        className={`${isDarkMode ? "bg-[#1d3969] text-white" : "bg-[#e2e8f0] text-[#1d3969]"} px-3 py-2 flex items-center justify-between border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-[#2563eb] font-semibold text-xs sm:text-sm">4-COTIZACIONES</span>
          <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs sm:text-sm`}>2-MERCADOS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-[#1d3969] to-[#2563eb] px-3 py-1 text-white rounded-lg text-xs sm:text-sm font-medium hidden sm:inline-block shadow-md">Pestañas aquí</span>
          <span className={`${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"} text-xs sm:text-sm`}>= Opciones</span>
          <div className="flex gap-1.5">
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
        <button className="bg-[#dc2626] px-3 py-1.5 text-white rounded-lg font-medium hover:bg-[#b91c1c] transition-colors shadow-md hover:shadow-lg">CANCELAR</button>
        <button className="bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1.5 text-white rounded-lg font-medium hover:shadow-lg transition-all shadow-md">NUEVO</button>
        <button className="bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1.5 text-white rounded-lg font-medium hover:shadow-lg transition-all shadow-md">BLANCO</button>
        <button className="bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1.5 text-white rounded-lg font-medium hover:shadow-lg transition-all shadow-md">NOTICIAS</button>
        <button className="bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1.5 text-white rounded-lg font-medium hover:shadow-lg transition-all shadow-md">GMOV</button>
        <button className="bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1.5 text-white rounded-lg font-medium hover:shadow-lg transition-all shadow-md">GVOL</button>
        <button className="bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1.5 text-white rounded-lg font-medium hover:shadow-lg transition-all shadow-md">RATC</button>
      </div>

      {/* Barra de Navegación */}
      <div
        className={`flex items-center gap-2 border-b ${isDarkMode ? "border-[#2563eb]/30 bg-[#1d3969]/60" : "border-[#e2e8f0] bg-[#f1f5f9]"} px-3 py-2 text-xs sm:text-sm`}
      >
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#2563eb]" />
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#2563eb]" />
        <span className="font-medium">Sin Valor Cargado</span>
        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className={isDarkMode ? "text-[#64748b]" : "text-[#64748b]"}>|</span>
        <span>WEI</span>
        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Menú de Funciones Relacionadas</span>
        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
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
          <span className="font-bold">Estándar</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#1d3969] transition-colors">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#2563eb] rounded" />
          <span>Movimientos</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#1d3969] transition-colors">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#2563eb] rounded" />
          <span>Volatilidad</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#1d3969] transition-colors">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#2563eb] rounded" />
          <span>Ratios</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#1d3969] transition-colors">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#2563eb] rounded" />
          <span>Futuros</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#1d3969] transition-colors">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#2563eb] rounded" defaultChecked />
          <span>Δ AVAT</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-[#1d3969] to-[#2563eb] px-2.5 py-1 text-white rounded-lg font-medium text-xs">10D</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-[#1d3969] to-[#2563eb] px-2.5 py-1 text-white rounded-lg font-medium text-xs">%Var YTD</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-[#1d3969] to-[#2563eb] px-2.5 py-1 text-white rounded-lg font-medium text-xs">ARS</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className={`${isDarkMode ? "text-white bg-[#1d3969]" : "text-[#1d3969] bg-[#e2e8f0]"}`}>
              <th
                className={`sticky left-0 ${isDarkMode ? "bg-[#1d3969]" : "bg-[#e2e8f0]"} px-2 py-2 text-left font-semibold ${fixedColumnClass}`}
              >
                Mercado
              </th>
              <th className="px-2 py-2 text-center font-semibold">RMI</th>
              <th className={`px-2 py-2 text-center font-semibold ${isDarkMode ? "bg-[#1d3969]" : "bg-[#e2e8f0]"}`}>2 Días</th>
              <th className="px-2 py-2 text-right font-semibold">Valor</th>
              <th className="px-2 py-2 text-right font-semibold">Var. Neta</th>
              <th className="px-2 py-2 text-right font-semibold">%Var.</th>
              <th className="px-2 py-2 text-right font-semibold hidden sm:table-cell">Δ AVAT</th>
              <th className="px-2 py-2 text-right font-semibold hidden sm:table-cell">Hora</th>
              <th className="px-2 py-2 text-right font-semibold hidden md:table-cell">%Ytd</th>
              <th className="px-2 py-2 text-right font-semibold hidden md:table-cell">%YtdMon</th>
            </tr>
          </thead>
          <tbody>
            {renderSection("Américas", data.americas, "1)", isDarkMode)}
            {renderSection("EMEA", data.emea, "2)", isDarkMode)}
            {renderSection("Asia/Pacífico", data.asiaPacific, "3)", isDarkMode)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
