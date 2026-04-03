"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, Send, MessageSquare } from "lucide-react"
import useSWR from "swr"

interface Message {
  id: number
  anon_id: string
  content: string
  created_at: string
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

function getRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return "ahora"
  if (diffMin < 60) return `hace ${diffMin}m`
  if (diffHour < 24) return `hace ${diffHour}h`
  return `hace ${diffDay}d`
}

function getAnonColor(anonId: string): string {
  const colors = [
    "#f87171", "#fb923c", "#fbbf24", "#a3e635",
    "#34d399", "#22d3ee", "#60a5fa", "#a78bfa",
    "#e879f9", "#fb7185",
  ]
  let hash = 0
  for (let i = 0; i < anonId.length; i++) {
    hash = anonId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

interface MessageBoardProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
}

export function MessageBoard({ isOpen, onClose, isDarkMode }: MessageBoardProps) {
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, mutate } = useSWR<{ messages: Message[] }>(
    isOpen ? "/api/messages" : null,
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    }
  )

  const messages = data?.messages || []

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)
    setError(null)

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al enviar")
        return
      }

      setNewMessage("")
      mutate()
    } catch {
      setError("Error de conexión")
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div
        className={`relative w-full max-w-md h-full flex flex-col ${
          isDarkMode ? "bg-[#0f172a] border-l border-[#2563eb]/30" : "bg-[#f8fafc] border-l border-[#e2e8f0]"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-b ${
            isDarkMode ? "border-[#2563eb]/30 bg-[#1d3969]/50" : "border-[#e2e8f0] bg-[#e2e8f0]"
          }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#2563eb]" />
            <span className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-[#1d3969]"}`}>
              Terminal Chat
            </span>
            <span className={`text-xs ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
              ({messages.length} msgs)
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-[#2563eb]/20 transition-colors ${
              isDarkMode ? "text-[#94a3b8]" : "text-[#64748b]"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className={`text-center py-8 ${isDarkMode ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay mensajes todavía</p>
              <p className="text-xs mt-1">Sé el primero en escribir</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`group ${isDarkMode ? "hover:bg-[#1d3969]/30" : "hover:bg-[#e2e8f0]/50"} rounded px-2 py-1.5 transition-colors`}>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="font-bold text-xs"
                  style={{ color: getAnonColor(msg.anon_id) }}
                >
                  {msg.anon_id}
                </span>
                <span className={`text-[10px] ${isDarkMode ? "text-[#475569]" : "text-[#94a3b8]"}`}>
                  {getRelativeTime(msg.created_at)}
                </span>
                <span className={`text-[10px] ${isDarkMode ? "text-[#334155]" : "text-[#cbd5e1]"}`}>
                  No.{msg.id}
                </span>
              </div>
              <p className={`text-sm break-words ${isDarkMode ? "text-[#cbd5e1]" : "text-[#374151]"}`}>
                {msg.content}
              </p>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/30">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Input */}
        <div
          className={`px-4 py-3 border-t ${
            isDarkMode ? "border-[#2563eb]/30 bg-[#1d3969]/30" : "border-[#e2e8f0] bg-[#f1f5f9]"
          }`}
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí un mensaje..."
              maxLength={500}
              disabled={sending}
              className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                isDarkMode
                  ? "bg-[#0f172a] border border-[#2563eb]/30 text-white placeholder-[#64748b]"
                  : "bg-white border border-[#e2e8f0] text-[#374151] placeholder-[#94a3b8]"
              } focus:outline-none focus:ring-2 focus:ring-[#2563eb]/50 disabled:opacity-50`}
            />
            <button
              onClick={handleSend}
              disabled={sending || !newMessage.trim()}
              className={`px-3 py-2 rounded-lg transition-colors ${
                sending || !newMessage.trim()
                  ? "bg-[#2563eb]/30 text-[#64748b] cursor-not-allowed"
                  : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="flex justify-between mt-1.5">
            <p className={`text-[10px] ${isDarkMode ? "text-[#475569]" : "text-[#94a3b8]"}`}>
              Mensajes anónimos · Max 500 chars
            </p>
            <p className={`text-[10px] ${newMessage.length > 450 ? "text-red-400" : isDarkMode ? "text-[#475569]" : "text-[#94a3b8]"}`}>
              {newMessage.length}/500
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
