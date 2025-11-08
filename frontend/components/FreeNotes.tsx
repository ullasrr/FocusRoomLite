"use client"

import { LogIn, Lock, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AuthCheckProps {
  session?: {
    user?: {
      plan?: string
    }
  } | null
  signIn: () => void
}

export default function Component({ session, signIn }: AuthCheckProps) {
  if (!session || session?.user?.plan !== "pro") {
    return (
      <div className="fixed top-20 right-4 w-96 bg-gradient-to-br from-gray-900 via-gray-800 to-black backdrop-blur-md rounded-2xl shadow-2xl z-50 border border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-500/60 bg-gradient-to-r from-gray-900 to-black backdrop-blur-md">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              Access Required
            </h2>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm">
              <Crown className="w-3 h-3 mr-1" />
              Pro Plan Required
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="bg-gray-800/90 backdrop-blur-md rounded-xl p-4 border border-gray-700/60">
              <p className="text-gray-200 leading-relaxed">
                {!session
                  ? "Please sign in to access your notes and unlock all features."
                  : "Upgrade to Pro to access your personal notes and premium features."}
              </p>
            </div>

            {!session ? (
              <Button
                onClick={signIn}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 rounded-lg py-3"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In to Continue
              </Button>
            ) : (
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 rounded-lg py-3">
                  <Crown className="w-5 h-5 mr-2"
                   />
                  Upgrade to Pro
                </Button>
              </div>
            )}
          </div>

          {/* Features List */}
          <div className="bg-gray-800/90 backdrop-blur-md rounded-xl p-4 border border-gray-700/60">
            <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Pro Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Unlimited personal notes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Advanced search & tagging
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Cloud sync across devices
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                Priority support
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // If user has pro access, return null or the actual notes component
  return null
}
