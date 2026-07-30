"use client"

import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { WorldScene } from '../scenes/WorldScene';
import { BattleScene } from '../scenes/BattleScene';
import { EventBus, GameEvents } from './core/EventBus';
import { SceneManager } from './managers/SceneManager';
import { AudioManager } from './managers/AudioManager';

export function PhaserGame() {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 600,
      height: 800,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 }, // Top-down RPG has no gravity
          debug: false // Set to true to see collision boxes
        }
      },
      backgroundColor: '#000000',
      scene: [BootScene, WorldScene, BattleScene],
    };

    const game = new Phaser.Game(config);

    // Initialize Core Managers
    SceneManager.initialize(game);
    AudioManager.initialize();

    const onReady = () => {
      setIsReady(true);
    };

    EventBus.on(GameEvents.SCENE_READY, onReady);

    return () => {
      EventBus.off(GameEvents.SCENE_READY, onReady);
      game.destroy(true);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div ref={gameRef} className="w-full h-full max-w-[600px] max-h-[800px]" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <p className="text-cyan-400 font-mono animate-pulse">INIT ENGINE...</p>
        </div>
      )}
    </div>
  );
}
