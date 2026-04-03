"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Clock, DollarSign, Activity, Layers } from "lucide-react"

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

interface SymbolDetailProps {
  item: MarketItem
  market: "argentina" | "usa"
  isDarkMode: boolean
  onBack: () => void
}

function getTradingViewSymbol(symbol: string, market: "argentina" | "usa"): string {
  if (market === "usa") {
    return `NASDAQ:${symbol}`
  }
  return `BCBA:${symbol}`
}

function TradingViewChart({ symbol, market, isDarkMode }: { symbol: string; market: "argentina" | "usa"; isDarkMode: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: getTradingViewSymbol(symbol, market),
      interval: "D",
      timezone: market === "argentina" ? "America/Argentina/Buenos_Aires" : "America/New_York",
      theme: isDarkMode ? "dark" : "light",
      style: "1",
      locale: "es",
      backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
      gridColor: isDarkMode ? "rgba(37, 99, 235, 0.1)" : "rgba(226, 232, 240, 0.5)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
      studies: [
        "STD;Bollinger_Bands",
        "STD;MACD",
        "STD;RSI",
      ],
    })

    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [symbol, market, isDarkMode])

  return (
    <div className="tradingview-widget-container w-full h-full" ref={containerRef}>
      <div className="tradingview-widget-container__widget w-full h-full" />
    </div>
  )
}

export function SymbolDetail({ item, market, isDarkMode, onBack }: SymbolDetailProps) {
  const [activeTab, setActiveTab] = useState<"chart" | "orderbook" | "info">("chart")
  const isPositive = item.pctChange >= 0

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? "bg-[#0f172a] text-white" : "bg-[#f8fafc] text-[#1d3969]"}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? "border-[#2563eb]/30 bg-[#1d3969]/30" : "border-[#e2e8f0] bg-[#e2e8f0]"}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? "hover:bg-[#2563eb]/20 text-[#94a3b8]" : "hover:bg-[#e2e8f0] text-[#64748b]"}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#2563eb]">{item.symbol}</h2>
              <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? "bg-[#2563eb]/20 text-[#60a5fa]" : "bg-[#2563eb]/10 text-[#2563eb]"}`}>
                {item.category.toUpperCase()}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? "bg-[#475569]/50 text-[#94a3b8]" : "bg-[#e2e8f0] text-[#64748b]"}`}>
                {market === "argentina" ? "BCBA" : "NASDAQ"}
              </span>
            </div>
            <p className={`text-xs ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>{item.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-[#1d3969]"}`}>
              ${item.value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2 justify-end">
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5 text-[#059669]" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-[#dc2626]" />
              )}
              <span className={`text-sm font-medium ${isPositive ? "text-[#059669]" : "text-[#dc2626]"}`}>
                {isPositive ? "+" : ""}{item.change.toLocaleString("es-AR", { minimumFractionDigits: 2 })} ({isPositive ? "+" : ""}{item.pctChange.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-1 px-4 py-2 border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
        {[
          { id: "chart" as const, label: "Grafico", icon: <BarChart3 className="h-3.5 w-3.5" /> },
          { id: "orderbook" as const, label: "Ordenes", icon: <Layers className="h-3.5 w-3.5" /> },
          { id: "info" as const, label: "Info", icon: <Activity className="h-3.5 w-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#2563eb] text-white"
                : isDarkMode
                ? "text-[#94a3b8] hover:bg-[#2563eb]/10"
                : "text-[#64748b] hover:bg-[#e2e8f0]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "chart" && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Chart */}
            <div className="flex-1 min-h-[400px] lg:min-h-0">
              <TradingViewChart symbol={item.symbol} market={market} isDarkMode={isDarkMode} />
            </div>

            {/* Side Panel */}
            <div className={`w-full lg:w-[280px] border-t lg:border-t-0 lg:border-l ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"} overflow-y-auto`}>
              {/* Price Info */}
              <div className={`p-3 border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
                <h3 className={`text-xs font-bold mb-2 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>COTIZACION</h3>
                <div className="space-y-1.5">
                  <InfoRow label="Precio" value={`$${item.value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`} isDarkMode={isDarkMode} />
                  <InfoRow label="Var. Neta" value={`${isPositive ? "+" : ""}$${item.change.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`} isDarkMode={isDarkMode} valueColor={isPositive ? "#059669" : "#dc2626"} />
                  <InfoRow label="% Var." value={`${isPositive ? "+" : ""}${item.pctChange.toFixed(2)}%`} isDarkMode={isDarkMode} valueColor={isPositive ? "#059669" : "#dc2626"} />
                  <InfoRow label="Hora" value={item.time} isDarkMode={isDarkMode} />
                </div>
              </div>

              {/* Volume */}
              <div className={`p-3 border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
                <h3 className={`text-xs font-bold mb-2 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>VOLUMEN</h3>
                <div className="space-y-1.5">
                  <InfoRow label="Volumen" value={item.volume.toLocaleString("es-AR")} isDarkMode={isDarkMode} />
                  <InfoRow label="Operaciones" value={item.operations.toLocaleString("es-AR")} isDarkMode={isDarkMode} />
                </div>
              </div>

              {/* Order Book */}
              <div className={`p-3 border-b ${isDarkMode ? "border-[#2563eb]/30" : "border-[#e2e8f0]"}`}>
                <h3 className={`text-xs font-bold mb-2 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>LIBRO DE ORDENES</h3>
                <div className="space-y-1.5">
                  <InfoRow label="Bid" value={`$${item.bid.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`} isDarkMode={isDarkMode} valueColor="#059669" />
                  <InfoRow label="Bid Qty" value={item.bidQty.toLocaleString("es-AR")} isDarkMode={isDarkMode} />
                  <InfoRow label="Ask" value={`$${item.ask.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`} isDarkMode={isDarkMode} valueColor="#dc2626" />
                  <InfoRow label="Ask Qty" value={item.askQty.toLocaleString("es-AR")} isDarkMode={isDarkMode} />
                  <InfoRow
                    label="Spread"
                    value={`$${(item.ask - item.bid).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              {/* Bid/Ask Bar */}
              <div className={`p-3`}>
                <h3 className={`text-xs font-bold mb-2 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>PRESION BID/ASK</h3>
                {item.bid > 0 && item.ask > 0 && (
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-[#059669]">BID {item.bidQty.toLocaleString("es-AR")}</span>
                      <span className="text-[#dc2626]">ASK {item.askQty.toLocaleString("es-AR")}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden flex bg-[#1e293b]">
                      {(() => {
                        const total = item.bidQty + item.askQty
                        const bidPct = total > 0 ? (item.bidQty / total) * 100 : 50
                        return (
                          <>
                            <div className="bg-[#059669] h-full transition-all" style={{ width: `${bidPct}%` }} />
                            <div className="bg-[#dc2626] h-full transition-all" style={{ width: `${100 - bidPct}%` }} />
                          </>
                        )
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orderbook" && (
          <div className="flex-1 p-4 overflow-y-auto">
            <OrderBookView item={item} isDarkMode={isDarkMode} />
          </div>
        )}

        {activeTab === "info" && (
          <div className="flex-1 p-4 overflow-y-auto">
            <SymbolInfoView item={item} market={market} isDarkMode={isDarkMode} />
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value, isDarkMode, valueColor }: { label: string; value: string; isDarkMode: boolean; valueColor?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-[11px] ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>{label}</span>
      <span
        className="text-[11px] font-medium"
        style={{ color: valueColor || (isDarkMode ? "#e2e8f0" : "#374151") }}
      >
        {value}
      </span>
    </div>
  )
}

function OrderBookView({ item, isDarkMode }: { item: MarketItem; isDarkMode: boolean }) {
  const isPositive = item.pctChange >= 0

  return (
    <div className="max-w-lg mx-auto">
      <h3 className={`text-sm font-bold mb-4 ${isDarkMode ? "text-white" : "text-[#1d3969]"}`}>
        Libro de Ordenes — {item.symbol}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Bids */}
        <div>
          <div className={`text-xs font-bold mb-2 text-[#059669]`}>COMPRA (BID)</div>
          <div className={`rounded-lg overflow-hidden border ${isDarkMode ? "border-[#059669]/30" : "border-[#059669]/20"}`}>
            <div className={`grid grid-cols-2 gap-0 text-[10px] font-bold px-3 py-1.5 ${isDarkMode ? "bg-[#059669]/10" : "bg-[#059669]/5"}`}>
              <span className="text-[#059669]">Precio</span>
              <span className="text-right text-[#059669]">Cantidad</span>
            </div>
            {item.bid > 0 ? (
              <div className={`grid grid-cols-2 gap-0 text-xs px-3 py-2 ${isDarkMode ? "bg-[#059669]/5" : "bg-white"}`}>
                <span className={isDarkMode ? "text-[#e2e8f0]" : "text-[#374151]"}>
                  ${item.bid.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-right ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                  {item.bidQty.toLocaleString("es-AR")}
                </span>
              </div>
            ) : (
              <div className={`text-xs text-center py-3 ${isDarkMode ? "text-[#475569]" : "text-[#94a3b8]"}`}>Sin datos</div>
            )}
          </div>
        </div>

        {/* Asks */}
        <div>
          <div className={`text-xs font-bold mb-2 text-[#dc2626]`}>VENTA (ASK)</div>
          <div className={`rounded-lg overflow-hidden border ${isDarkMode ? "border-[#dc2626]/30" : "border-[#dc2626]/20"}`}>
            <div className={`grid grid-cols-2 gap-0 text-[10px] font-bold px-3 py-1.5 ${isDarkMode ? "bg-[#dc2626]/10" : "bg-[#dc2626]/5"}`}>
              <span className="text-[#dc2626]">Precio</span>
              <span className="text-right text-[#dc2626]">Cantidad</span>
            </div>
            {item.ask > 0 ? (
              <div className={`grid grid-cols-2 gap-0 text-xs px-3 py-2 ${isDarkMode ? "bg-[#dc2626]/5" : "bg-white"}`}>
                <span className={isDarkMode ? "text-[#e2e8f0]" : "text-[#374151]"}>
                  ${item.ask.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </span>
                <span className={`text-right ${isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                  {item.askQty.toLocaleString("es-AR")}
                </span>
              </div>
            ) : (
              <div className={`text-xs text-center py-3 ${isDarkMode ? "text-[#475569]" : "text-[#94a3b8]"}`}>Sin datos</div>
            )}
          </div>
        </div>
      </div>

      {/* Spread Info */}
      <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-[#1d3969]/30 border border-[#2563eb]/20" : "bg-[#e2e8f0] border border-[#e2e8f0]"}`}>
        <div className="flex justify-between items-center">
          <span className={`text-xs ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>Spread</span>
          <span className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-[#1d3969]"}`}>
            ${(item.ask - item.bid).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            {item.bid > 0 && (
              <span className={`ml-1 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
                ({(((item.ask - item.bid) / item.bid) * 100).toFixed(2)}%)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Bid/Ask Pressure */}
      <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-[#1d3969]/30 border border-[#2563eb]/20" : "bg-[#e2e8f0] border border-[#e2e8f0]"}`}>
        <div className={`text-xs font-bold mb-2 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>PRESION DE MERCADO</div>
        {item.bidQty + item.askQty > 0 ? (
          <>
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="text-[#059669] font-medium">Compradores {((item.bidQty / (item.bidQty + item.askQty)) * 100).toFixed(1)}%</span>
              <span className="text-[#dc2626] font-medium">Vendedores {((item.askQty / (item.bidQty + item.askQty)) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex">
              <div className="bg-[#059669] h-full transition-all" style={{ width: `${(item.bidQty / (item.bidQty + item.askQty)) * 100}%` }} />
              <div className="bg-[#dc2626] h-full transition-all" style={{ width: `${(item.askQty / (item.bidQty + item.askQty)) * 100}%` }} />
            </div>
          </>
        ) : (
          <div className={`text-xs text-center py-2 ${isDarkMode ? "text-[#475569]" : "text-[#94a3b8]"}`}>Sin datos de presión</div>
        )}
      </div>
    </div>
  )
}

function SymbolInfoView({ item, market, isDarkMode }: { item: MarketItem; market: "argentina" | "usa"; isDarkMode: boolean }) {
  const isPositive = item.pctChange >= 0

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-[#1d3969]"}`}>
        Informacion — {item.symbol}
      </h3>

      {/* General Info */}
      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-[#1d3969]/30 border border-[#2563eb]/20" : "bg-[#e2e8f0] border border-[#e2e8f0]"}`}>
        <div className="space-y-2">
          <InfoRow label="Simbolo" value={item.symbol} isDarkMode={isDarkMode} />
          <InfoRow label="Mercado" value={market === "argentina" ? "BCBA (Buenos Aires)" : "NASDAQ / NYSE"} isDarkMode={isDarkMode} />
          <InfoRow label="Categoria" value={item.category.toUpperCase()} isDarkMode={isDarkMode} />
          <InfoRow label="Ultimo Precio" value={`$${item.value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`} isDarkMode={isDarkMode} />
          <InfoRow
            label="Variacion"
            value={`${isPositive ? "+" : ""}${item.pctChange.toFixed(2)}%`}
            isDarkMode={isDarkMode}
            valueColor={isPositive ? "#059669" : "#dc2626"}
          />
          <InfoRow label="Volumen" value={item.volume.toLocaleString("es-AR")} isDarkMode={isDarkMode} />
          <InfoRow label="Operaciones" value={item.operations.toLocaleString("es-AR")} isDarkMode={isDarkMode} />
          <InfoRow label="Ultima Actualizacion" value={item.time} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Trading Info */}
      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-[#1d3969]/30 border border-[#2563eb]/20" : "bg-[#e2e8f0] border border-[#e2e8f0]"}`}>
        <h4 className={`text-xs font-bold mb-3 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>DATOS DE TRADING</h4>
        <div className="space-y-2">
          <InfoRow label="Bid" value={`$${item.bid.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`} isDarkMode={isDarkMode} valueColor="#059669" />
          <InfoRow label="Bid Qty" value={item.bidQty.toLocaleString("es-AR")} isDarkMode={isDarkMode} />
          <InfoRow label="Ask" value={`$${item.ask.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`} isDarkMode={isDarkMode} valueColor="#dc2626" />
          <InfoRow label="Ask Qty" value={item.askQty.toLocaleString("es-AR")} isDarkMode={isDarkMode} />
          <InfoRow label="Spread" value={`$${(item.ask - item.bid).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`} isDarkMode={isDarkMode} />
          {item.bid > 0 && (
            <InfoRow
              label="Spread %"
              value={`${(((item.ask - item.bid) / item.bid) * 100).toFixed(2)}%`}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>

      {/* TradingView Link */}
      <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-[#1d3969]/30 border border-[#2563eb]/20" : "bg-[#e2e8f0] border border-[#e2e8f0]"}`}>
        <a
          href={`https://www.tradingview.com/symbols/${getTradingViewSymbol(item.symbol, market).replace(":", "-")}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#2563eb] hover:underline"
        >
          Ver en TradingView →
        </a>
      </div>
    </div>
  )
}
