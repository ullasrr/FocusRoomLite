"use client"

import { useState, useEffect, useRef } from "react"
import Draggable from "react-draggable"
import { GripHorizontalIcon, Timer, Coffee, Zap,AlertTriangle, RotateCcw, Trash2, X } from "lucide-react"

const SESSION_TYPES = {
  focus: 0.1 * 60,
  shortBreak: 0.1 * 60,
  longBreak: 0.1 * 60,
}

type SessionKey = keyof typeof SESSION_TYPES

export default function PomodoroTimer() {
  const [session, setSession] = useState<SessionKey>("focus")
  const [timeLeft, setTimeLeft] = useState(SESSION_TYPES[session])
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const dragRef = useRef(null) // ✅ ref for draggable
  const [setshowResetModal, setSetshowResetModal] = useState(false)

  // Reset timer on session change
  useEffect(() => {
    setTimeLeft(SESSION_TYPES[session])
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [session])

  const [focusCount, setFocusCount] = useState(0)

  useEffect(() => {
    if (!isRunning) return

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null

          // Auto switch and start next session
          setSession((prevSession) => {
            if (prevSession === "focus") {
              const updatedCount = focusCount + 1
              setFocusCount(updatedCount)
              const nextSession = updatedCount % 4 === 0 ? "longBreak" : "shortBreak"
              setTimeout(() => setIsRunning(true), 100)
              return nextSession
            } else {
              setTimeout(() => setIsRunning(true), 100) // Auto start
              return "focus"
            }
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRunning, session, focusCount])

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60)
      .toString()
      .padStart(2, "0")
    const s = (time % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  const handleReset = () => {
    setTimeLeft(SESSION_TYPES[session])
    setIsRunning(false)
    setFocusCount(0)
    if (timerRef.current) clearInterval(timerRef.current)
    // Optional: reset cycle count
    if (session === "focus") setFocusCount(0)
  }

    const handleResetcurrent = () => {
    setTimeLeft(SESSION_TYPES[session])
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
    // Optional: reset cycle count
    // if (session === "focus") setFocusCount(0)
  }

  const handleSkip = () => {
    if (session !== "focus") {
      setSession("focus")
    }
  }

  const getSessionIcon = (sessionType: string) => {
    switch (sessionType) {
      case "focus":
        return <Zap className="w-5 h-5" />
      case "shortBreak":
        return <Coffee className="w-5 h-5" />
      case "longBreak":
        return <Timer className="w-5 h-5" />
      default:
        return null
    }
  }

  const getSessionColors = () => {
    switch (session) {
      case "focus":
        return {
          bg: "from-violet-900/90 via-purple-900/90 to-indigo-900/90",
          accent: "from-violet-500 to-purple-600",
          shadow: "shadow-violet-500/20",
        }
      case "shortBreak":
        return {
          bg: "from-emerald-900/90 via-teal-900/90 to-cyan-900/90",
          accent: "from-emerald-500 to-teal-600",
          shadow: "shadow-emerald-500/20",
        }
      case "longBreak":
        return {
          bg: "from-amber-900/90 via-orange-900/90 to-red-900/90",
          accent: "from-amber-500 to-orange-600",
          shadow: "shadow-amber-500/20",
        }
    }
  }

  const colors = getSessionColors()

  return (
  <div className="flex items-center justify-center min-h-screen">
   {/*  <Draggable nodeRef={dragRef} handle=".drag-handle">
      <div ref={dragRef} className="fixed drag-handle cursor-move"> */}
        {/* Animated background blur */}
        <div className="absolute rounded-3xl blur-xl scale-110 animate-pulse"></div>

        <div
          className={`relative flex flex-col items-center gap-8 p-12 bg-gradient-to-br ${colors.bg} backdrop-blur-xl text-white rounded-3xl shadow-2xl border border-white/10 max-w-xl w-full transition-all duration-700 hover:shadow-3xl hover:scale-[1.02] hover:border-white/20`}
        >
          {/* Floating orbs for visual interest */}
          <div className="absolute top-6 left-6 w-3 h-3 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-1000"></div>

          {/* Header with session type indicator */}
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${colors.accent} ${colors.shadow} shadow-lg`}>
              {getSessionIcon(session)}
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {session === "focus" ? "Focus Time" : session === "shortBreak" ? "Short Break" : "Long Break"}
            </h1>
          </div>

          {/* Session Selectors */}
          <div className="flex space-x-3 p-2 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm">
            {Object.keys(SESSION_TYPES).map((key) => (
              <button
                key={key}
                onClick={() => setSession(key as SessionKey)}
                className={`group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden cursor-pointer ${
                  session === key
                    ? `bg-gradient-to-r ${colors.accent} text-white shadow-lg ${colors.shadow} scale-105 border border-white/20`
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:scale-105 border border-transparent hover:border-white/10"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-2">
                  {getSessionIcon(key)}
                  {key === "focus" ? "Focus" : key === "shortBreak" ? "Short Break" : "Long Break"}
                </div>
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative group">
            {/* Glowing background effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${colors.accent} rounded-3xl blur-2xl opacity-20 scale-110 group-hover:opacity-30 transition-opacity duration-500`}
            ></div>

            <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="text-7xl md:text-8xl font-extrabold font-mono bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent drop-shadow-2xl tracking-wider">
                {formatTime(timeLeft)}
              </div>

              {/* Animated progress ring */}
              <div className="absolute inset-0 rounded-3xl">
                <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeDasharray={`${(1 - timeLeft / SESSION_TYPES[session]) * 283} 283`}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Focus Sessions Counter */}
          <div className="flex items-center gap-3 px-6 py-3 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < focusCount % 4 ? `bg-gradient-to-r ${colors.accent} shadow-lg ${colors.shadow}` : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-mono text-white/80">
              Focus Sessions: <span className="font-bold text-white">{focusCount}</span>
            </span>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md min-h-[80px]">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-2xl text-lg text-white font-bold shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40 border border-emerald-400/20 overflow-hidden ${isRunning ? "animate-pulse" : ""} ${session !== "focus" ? "" : "col-span-1"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative ">{isRunning ? "⏸ Pause" : "▶ Start"}</span>
            </button>

            {session !== "focus" && (
              <button
                onClick={handleSkip}
                className="cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-2xl text-lg text-white font-bold shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/40 border border-amber-400/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative">⏭ Skip Break</span>
              </button>
            )}

            <button
              onClick={() => setSetshowResetModal(true)}
              className={`cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-2xl text-lg text-white font-bold shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/40 border border-red-400/20 overflow-hidden ${session !== "focus" ? "" : "col-span-1"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative">🔄 Reset</span>
            </button>
          </div>

          {/* reset part */}
          {setshowResetModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md flex justify-center items-center z-50 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-700/50 w-[90%] max-w-md space-y-6 animate-in zoom-in-95 duration-300 ease-out">
            {/* Header with icon */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Reset Timer
                </h2>
              </div>
              <button
                onClick={() => setSetshowResetModal(false)}
                className="ml-auto p-1 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>

            <p className="text-sm text-slate-300 leading-relaxed">What do you want to reset?</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  handleResetcurrent() // current session only
                  setSetshowResetModal(false)
                }}
                className="cursor-pointer group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                Current Timer
                <div className="ml-auto text-xs bg-blue-500/30 px-2 py-1 rounded-md">Session Only</div>
              </button>

              <button
                onClick={() => {
                  setFocusCount(0)
                  handleReset() // resets both
                  setSetshowResetModal(false)
                }}
                className="cursor-pointer group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98]"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                Entire Sessions
                <div className="ml-auto text-xs bg-red-500/30 px-2 py-1 rounded-md">All Data</div>
              </button>

              
            </div>

            {/* Subtle bottom accent */}
            <div className="flex justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-red-500 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      )}

          {/* Enhanced Drag Indicator */}
          {/* <div className="absolute top-4 right-4 drag-handle cursor-move group">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300">
              <GripHorizontalIcon className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors duration-300" />
            </div>
          </div> */}

          {/* Subtle animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
{/*   </div>
</Draggable> */}
        </div>
  )
}
