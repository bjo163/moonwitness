"use client"

import React, { useState, useEffect } from "react"
import { useBattleStore } from "../../store/battle.store"
import { usePlayerStore } from "../../store/player.store"
import { EventBus } from "../../engine/core/EventBus"
import { BattleState } from "../../types/battle"
import { Swords, Shield, Zap, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function BattleHUD() {
  const { state, player, enemy, activeTurnId, submitAction } = useBattleStore()
  const { setScene } = usePlayerStore()
  const [battleLog, setBattleLog] = useState<string>("Battle Started!")

  useEffect(() => {
    const onLog = (msg: string) => setBattleLog(msg)
    EventBus.on('battle:log', onLog)
    return () => { EventBus.off('battle:log', onLog) }
  }, [])

  if (!player || !enemy) return null;

  const isPlayerTurn = state === BattleState.AWAIT_INPUT && activeTurnId === player.id;

  const handleAttack = () => {
    if (!isPlayerTurn) return;
    submitAction({
      actorId: player.id,
      targetId: enemy.id,
      type: 'ATTACK'
    });
  }

  return (
    <div className="w-full flex flex-col gap-4 pointer-events-auto">
      
      {/* VS OR LOG */}
      <div className="text-center w-full max-w-sm mx-auto mb-20 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div 
            key={battleLog}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs font-mono text-white/90 bg-black/80 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm shadow-xl inline-block"
          >
            {battleLog}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Health Bars HUD */}
      <div className="flex justify-between items-end px-2">
        {/* Player HUD */}
        <div className={`w-[140px] bg-black/60 p-2 rounded-lg border transition-colors ${activeTurnId === player.id ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'border-cyan-900/50'} backdrop-blur-md`}>
          <h3 className="text-sm font-bold text-cyan-400 mb-1 uppercase truncate">{player.name}</h3>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-900/50">
            <motion.div 
              className="h-full bg-cyan-500"
              initial={{ width: "100%" }}
              animate={{ width: `${Math.max(0, (player.hp / player.maxHp) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-[10px] font-mono text-cyan-200 mt-1 text-right">{player.hp}/{player.maxHp}</p>
        </div>

        {/* Enemy HUD */}
        <div className={`w-[140px] text-right bg-black/60 p-2 rounded-lg border transition-colors ${activeTurnId === enemy.id ? 'border-red-400 shadow-[0_0_15px_rgba(248,113,113,0.5)]' : 'border-red-900/50'} backdrop-blur-md`}>
          <h3 className="text-sm font-bold text-red-400 mb-1 uppercase truncate">{enemy.name}</h3>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-red-900/50">
            <motion.div 
              className="h-full bg-red-500"
              initial={{ width: "100%" }}
              animate={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-[10px] font-mono text-red-200 mt-1 text-left">{enemy.hp}/{enemy.maxHp}</p>
        </div>
      </div>

      {/* Action Menu (Bottom) */}
      <div className="bg-black/80 backdrop-blur-md border border-cyan-900/50 rounded-2xl p-4">
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <button 
            onClick={handleAttack}
            disabled={!isPlayerTurn}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-bold hover:bg-cyan-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Swords className="w-5 h-5" /> ATTACK
          </button>
          
          <button 
            disabled={!isPlayerTurn}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-fuchsia-950/50 border border-fuchsia-500/30 text-fuchsia-300 font-bold hover:bg-fuchsia-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="w-5 h-5" /> SKILL
          </button>

          <button 
            disabled={!isPlayerTurn}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-400 font-bold hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Shield className="w-5 h-5" /> DEFEND
          </button>

          <button 
            onClick={() => setScene("map")}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-400 font-bold hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Zap className="w-5 h-5" /> RUN
          </button>
        </div>
      </div>
    </div>
  )
}
