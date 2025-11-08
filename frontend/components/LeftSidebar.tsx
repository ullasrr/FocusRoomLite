"use client"
import { iconMap } from "../lib/iconMap";
import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Clock, StickyNote, Music, Palette, Sparkles, ListChecks, Users, Flame, Quote, Settings } from "lucide-react"

interface Link{
  icon: string;
  label:string;
}

interface Props {
  sidebar?: Link[];
  onItemClick?: (label : string) =>void;
}

const LeftSidebar = ({ sidebar =[],onItemClick }: Props) => {
  return (
    
    <TooltipProvider delayDuration={300}>
      <div className="h-screen text-white w-20 bg-gradient-to-b from-slate-900/40 via-purple-900/30 to-slate-900/40 backdrop-blur-2xl border-r border-white/10 shadow-2xl relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 animate-pulse"></div>
        
        {/* Glowing top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-4 p-3 pt-6">
          {/* Logo/Brand Icon */}
          <div className="mb-4 p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer group">
            <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
          </div>
          
          {/* Divider */}
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-2"></div>
          
          {sidebar.filter((item) => iconMap[item.icon]).map((item, index) => (
            <SidebarItem
              key={index}
              icon={iconMap[item.icon] ?? iconMap["Clock"]}
              label={item.label}
              onClick={() => onItemClick?.(item.label)}
              index={index}
            />
          ))}
        </div>
        
        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
      </div>
    </TooltipProvider>
  )
}

export default LeftSidebar

function SidebarItem({ icon, label, onClick, index }: { icon: React.ReactNode; label: string; onClick?: () => void; index: number }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={onClick}
          className="group relative flex items-center justify-center w-14 h-14 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-2xl cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:shadow-2xl overflow-hidden border border-white/10 hover:border-white/20"
          style={{
            animationDelay: `${index * 50}ms`
          }}
        >
          {/* Hover gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all duration-300"></div>
          
          {/* Animated border on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-sm"></div>
          </div>
          
          {/* Icon */}
          <div
            className="relative z-10 text-gray-300 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
          >
            {icon}
          </div>
          
          {/* Ripple effect on click */}
          <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200"></div>
        </div>
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        className="ml-2 bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 text-white shadow-2xl backdrop-blur-xl"
      >
        <p className="text-sm font-semibold">{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

