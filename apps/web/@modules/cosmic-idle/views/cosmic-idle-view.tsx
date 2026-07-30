"use client"

import React, { useEffect, useState } from "react"
import { Sparkles, Activity, Backpack } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { usePlayerStore } from "../store/player.store"
import dynamic from "next/dynamic"
import { EventBus } from "../engine/core/EventBus"
import { DialogueSystem } from "../systems/DialogueSystem"

const PhaserGame = dynamic(() => import("../engine/PhaserGame").then(mod => mod.PhaserGame), { ssr: false })

// UI Overlays
import { BattleHUD } from "../components/battle/BattleHUD"
// import { InventoryScreen } from "../components/inventory/InventoryScreen"
import { DialogueOverlay } from "../components/ui/DialogueOverlay"

export function CosmicIdleView() {
  const { nur, currentScene, setScene } = usePlayerStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    DialogueSystem.initialize()

    return () => {
      DialogueSystem.destroy()
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[600px] mx-auto bg-black relative select-none overflow-hidden">
      
      {/* PHASER LAYER */}
      <div className="absolute inset-0 z-0">
        <PhaserGame />
      </div>

      {/* REACT UI LAYER */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none p-4 gap-4">
        
        {/* GLOBAL STATUS BAR */}
        <div className="pointer-events-auto flex items-center justify-between px-6 py-3 bg-slate-900/80 border border-cyan-900/40 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-black text-cyan-400 tracking-wider">NUR: {nur.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-fuchsia-400">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">
                {currentScene}
              </span>
            </div>
            {currentScene === "map" && (
              <button 
                onClick={() => setScene("inventory")}
                className="flex items-center justify-center gap-2 px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 transition-colors border border-slate-600 text-slate-300 pointer-events-auto"
              >
                <Backpack className="w-4 h-4" />
                <span className="text-xs font-bold">ARMORY</span>
              </button>
            )}
          </div>
        </div>

        {/* DIALOGUE SYSTEM OVERLAY */}
        <DialogueOverlay />

        {/* OVERLAYS */}
        <div className="flex-1 relative pointer-events-none">
          <AnimatePresence mode="wait">
            {/* When currentScene is 'map', we render NO overlay here, because Phaser is handling the map underneath! */}
            
            {currentScene === "inventory" && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-black/90 rounded-2xl overflow-hidden pointer-events-auto"
              >
                {/* <InventoryScreen /> Will be rebuilt later */}
              </motion.div>
            )}

            {currentScene === "battle" && (
              <motion.div 
                key="battle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col justify-end pb-4 pointer-events-auto"
              >
                <BattleHUD />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
