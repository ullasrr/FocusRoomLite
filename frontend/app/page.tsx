import Link from "next/link";
import { BookOpen, Timer, Users, Sparkles, ArrowRight, Zap, Brain, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto mb-20">
          <div className="mb-8">
            <BookOpen className="w-20 h-20 text-purple-400 mx-auto" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              StudyWithMe
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-4">
            Study better, together
          </p>
          
          <p className="text-base text-gray-400 mb-12 max-w-2xl mx-auto">
            Pomodoro timer, notes, AI help, and study rooms in one place
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href='/dashboard'
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-semibold hover:opacity-90 transition"
            >
              Get Started →
            </Link>
            
            <Link 
              href='/createroom'
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition"
            >
              Create Room
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Timer className="w-7 h-7" />,
              title: "Pomodoro Timer",
              description: "Focus sessions with breaks"
            },
            {
              icon: <Brain className="w-7 h-7" />,
              title: "AI Assistant",
              description: "StudyGPT helps you learn"
            },
            {
              icon: <Target className="w-7 h-7" />,
              title: "Notes",
              description: "Keep your study notes organized"
            },
            {
              icon: <Users className="w-7 h-7" />,
              title: "Study Rooms",
              description: "Study together with friends"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
