"use client"

import { useEffect, useRef } from "react"

interface MiniChartProps {
  symbol: string
  market: "argentina" | "usa"
  price: number
  pctChange: number
  width?: number
  height?: number
  isDarkMode?: boolean
}

function generateSparklineData(symbol: string, price: number, pctChange: number): number[] {
  // Seed a deterministic pseudo-random from the symbol string
  let seed = 0
  for (let i = 0; i < symbol.length; i++) {
    seed = ((seed << 5) - seed + symbol.charCodeAt(i)) | 0
  }
  const seededRandom = () => {
    seed = (seed * 16807 + 0) % 2147483647
    return (seed & 0x7fffffff) / 0x7fffffff
  }

  const points = 20
  const data: number[] = []
  
  // Calculate start price from current price and pctChange
  const startPrice = price / (1 + pctChange / 100)
  const priceRange = price - startPrice
  
  // Generate a path from startPrice to price with realistic noise
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1)
    // Base trend line
    const trend = startPrice + priceRange * progress
    // Add noise proportional to the price movement (but capped)
    const noiseAmp = Math.abs(priceRange) * 0.4 + price * 0.002
    const noise = (seededRandom() - 0.5) * 2 * noiseAmp
    data.push(trend + noise)
  }
  
  // Ensure last point is exactly the current price
  data[data.length - 1] = price
  
  return data
}

export function MiniChart({ symbol, price, pctChange, width = 90, height = 24, isDarkMode = true }: MiniChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || price <= 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    ctx.clearRect(0, 0, width, height)

    const data = generateSparklineData(symbol, price, pctChange)
    if (data.length < 2) return

    const yMin = Math.min(...data)
    const yMax = Math.max(...data)
    const yRange = yMax - yMin || 1
    const padding = height * 0.12
    const xStep = width / (data.length - 1)

    const color = pctChange >= 0 ? "#059669" : "#dc2626"
    const bgColor = pctChange >= 0 ? "rgba(5, 150, 105, 0.08)" : "rgba(220, 38, 38, 0.08)"

    // Draw filled area
    ctx.beginPath()
    ctx.moveTo(0, height)
    data.forEach((val, i) => {
      const x = i * xStep
      const y = height - padding - ((val - yMin) / yRange) * (height - 2 * padding)
      ctx.lineTo(x, y)
    })
    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fillStyle = bgColor
    ctx.fill()

    // Draw line
    ctx.beginPath()
    data.forEach((val, i) => {
      const x = i * xStep
      const y = height - padding - ((val - yMin) / yRange) * (height - 2 * padding)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = color
    ctx.lineWidth = 1.2
    ctx.lineJoin = "round"
    ctx.stroke()

    // Draw end dot
    const lastX = (data.length - 1) * xStep
    const lastY = height - padding - ((data[data.length - 1] - yMin) / yRange) * (height - 2 * padding)
    ctx.beginPath()
    ctx.arc(lastX, lastY, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }, [symbol, price, pctChange, width, height, isDarkMode])

  return <canvas ref={canvasRef} className="inline-block" />
}
