import { Music, Play, SkipBack, SkipForward, Volume2, Heart } from "lucide-react"

const Spotify = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl max-w-[400px] text-white overflow-hidden group hover:scale-[1.02] transition-all duration-300 top-10">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex items-center gap-6">
        {/* Enhanced icon with pulsing animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-30 scale-110" />
          <div className="relative p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg shadow-green-500/25 group-hover:shadow-green-500/40 transition-all duration-300">
            <Music className="w-7 h-7 text-white drop-shadow-sm" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Spotify Player
            </h2>
            <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <span className="text-xs font-medium text-green-400">SOON</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Stream your favorite tracks with premium quality audio
          </p>

          {/* Mock player controls */}
          <div className="flex items-center gap-3 mb-3">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 opacity-50 cursor-not-allowed">
              <SkipBack className="w-4 h-4" />
            </button>
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 opacity-50 cursor-not-allowed">
              <Play className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 opacity-50 cursor-not-allowed">
              <SkipForward className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 opacity-50 cursor-not-allowed ml-auto">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 opacity-50 cursor-not-allowed">
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Mock progress bar */}
          <div className="w-full bg-white/10 rounded-full h-1 mb-2 overflow-hidden">
            <div className="w-1/3 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full relative">
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>0:00</span>
            <span>3:42</span>
          </div>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10" />
    </div>
  )
}

export default Spotify
