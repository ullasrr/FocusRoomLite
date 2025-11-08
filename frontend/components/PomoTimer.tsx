"use client"
import { useState, useEffect, useRef } from "react"
import { Timer, Coffee, Zap, AlertTriangle, RotateCcw, Trash2, X, Square } from "lucide-react"
import { Quantico } from 'next/font/google';

const quantico = Quantico({ 
  weight: '700', // Bold
  subsets: ['latin'],
});


const SESSION_TYPES = {
  focus: 0.1 * 60,
  shortBreak: 0.1 * 60,
  longBreak: 0.1 * 60,
}

type SessionKey = keyof typeof SESSION_TYPES

export default function PomoTimer() {
  const [session, setSession] = useState<SessionKey>("focus")
  const [timeLeft, setTimeLeft] = useState(SESSION_TYPES[session])
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const dragRef = useRef(null)
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
          setSession((prevSession) => {
            if (prevSession === "focus") {
              const updatedCount = focusCount + 1
              setFocusCount(updatedCount)
              const nextSession = updatedCount % 4 === 0 ? "longBreak" : "shortBreak"
              setTimeout(() => setIsRunning(true), 100)
              return nextSession
            } else {
              setTimeout(() => setIsRunning(true), 100)
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
    if (session === "focus") setFocusCount(0)
  }

  const handleResetcurrent = () => {
    setTimeLeft(SESSION_TYPES[session])
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const handleSkip = () => {
    if (session !== "focus") {
      setSession("focus")
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="rounded-2xl p-8 w-full max-w-xl text-center space-y-8 border-2 border-white/20">
        <div className="flex gap-2 justify-center">
          {Object.keys(SESSION_TYPES).map((key) => (
            <button
              key={key}
              onClick={() => setSession(key as SessionKey)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                session === key
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-white border border-white/50 hover:border-white"
              }`}
            >
              {key === "focus" ? "Focus" : key === "shortBreak" ? "Short Break" : "Long Break"}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`text-2xl ${
                i < focusCount % 4 ? "text-yellow-400" : "text-white/30"
              }`}
            >
              ★
            </div>
          ))}
        </div>

        <div className="py-4">
          <div className={`text-7xl md:text-8xl font-bold text-white font-mono ${quantico.className}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => setSetshowResetModal(true)}
            className="border-2 border-white/50 hover:border-white hover:bg-white/10 text-white p-3 rounded-lg transition"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          {session !== "focus" && (
            <button
              onClick={handleSkip}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg transition border border-white/50"
            >
              <Square className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="text-white text-base border border-white/30 rounded-lg p-2 bg-white/5">
          Sessions: <span className="font-semibold">{focusCount}</span>
        </div>
      </div>

      {setshowResetModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white/90 text-gray-800 p-6 rounded-lg w-[90%] max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Reset Timer</h2>
              <button
                onClick={() => setSetshowResetModal(false)}
                className="hover:bg-gray-200 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">What do you want to reset?</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  handleResetcurrent()
                  setSetshowResetModal(false)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                Current Timer
              </button>
              <button
                onClick={() => {
                  setFocusCount(0)
                  handleReset()
                  setSetshowResetModal(false)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                All Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
