import { useRef, useState, useEffect, useCallback } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus';
import { COSMOS_NARRATIVE } from './game/narrative/lore';
import { Quest } from './game/types';
import { QUESTS } from './game/data/quests';

interface GameState {
  player: {
    name: string;
    level: number;
    xp: number;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    gold: number;
    attack: number;
    defense: number;
    speed: number;
  } | null;
  currentScene: string;
  quests: Quest[];
  inventory: { id: string; name: string; type: string; rarity: string }[];
  showQuestLog: boolean;
  showInventory: boolean;
  region: string;
}

function App() {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    player: null,
    currentScene: 'PlayScene',
    quests: QUESTS.map(q => ({ ...q })),
    inventory: [],
    showQuestLog: false,
    showInventory: false,
    region: 'The Shattered Isles',
  });

  const registerPlayer = useCallback((playerName: string) => {
    setGameState((prev) => ({
      ...prev,
      player: {
        name: playerName,
        level: 1,
        xp: 0,
        xpToNext: 100,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        gold: 0,
        attack: 10,
        defense: 5,
        speed: 10,
      },
    }));
  }, []);

  const updatePlayerStats = useCallback((stats: { hp?: number; maxHp?: number; mp?: number; maxMp?: number; level?: number; gold?: number; xp?: number }) => {
    setGameState((prev) => {
      if (!prev.player) return prev;
      return {
        ...prev,
        player: {
          ...prev.player,
          ...stats,
        },
      };
    });
  }, []);

  const addQuest = useCallback((questId: string) => {
    setGameState((prev) => ({
      ...prev,
      quests: prev.quests.map((q) =>
        q.id === questId ? { ...q, status: 'active' } : q
      ),
    }));
  }, []);

  const completeQuest = useCallback((questId: string) => {
    setGameState((prev) => ({
      ...prev,
      quests: prev.quests.map((q) =>
        q.id === questId ? { ...q, status: 'completed' } : q
      ),
    }));
  }, []);

  const addToInventory = useCallback((itemId: string, itemName: string, itemType: string, itemRarity: string) => {
    setGameState((prev) => ({
      ...prev,
      inventory: [...prev.inventory, { id: itemId, name: itemName, type: itemType, rarity: itemRarity }],
    }));
  }, []);

  const toggleQuestLog = useCallback(() => {
    setGameState((prev) => ({ ...prev, showQuestLog: !prev.showQuestLog }));
  }, []);

  const toggleInventory = useCallback(() => {
    setGameState((prev) => ({ ...prev, showInventory: !prev.showInventory }));
  }, []);

  useEffect(() => {
    EventBus.on('new-game', () => {
      registerPlayer('Rockborn');
    });

    EventBus.on('player-stats-update', (stats: { hp: number; maxHp: number; mp: number; maxMp: number; level: number; gold: number }) => {
      console.log('[Rocksoul] Stats update:', stats);
    });

    EventBus.on('scene-change', (data: { targetScene: string; data?: any }) => {
      setGameState((prev) => ({
        ...prev,
        currentScene: data.targetScene,
        region: data.data?.region || prev.region,
      }));
    });

    EventBus.on('quest-progress', () => {
      setGameState((prev) => ({ ...prev }));
    });

    EventBus.on('region-selected', (data: { region: any; scene: string }) => {
      setGameState((prev) => ({
        ...prev,
        region: data.region.name,
        currentScene: data.scene,
      }));
    });

    return () => {
      EventBus.removeListener('new-game');
      EventBus.removeListener('player-stats-update');
      EventBus.removeListener('scene-change');
      EventBus.removeListener('quest-progress');
      EventBus.removeListener('region-selected');
    };
  }, [registerPlayer]);

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} />
      <div className="rocksoul-ui">
        <header className="rocksoul-header">
          <h1 className="rocksoul-title">{COSMOS_NARRATIVE.title}</h1>
          <div className="rocksoul-stats">
            {gameState.player ? (
              <>
                <span className="rocksoul-stat">Lv {gameState.player.level}</span>
                <span className="rocksoul-stat">HP {gameState.player.hp}/{gameState.player.maxHp}</span>
                <span className="rocksoul-stat">MP {gameState.player.mp}/{gameState.player.maxMp}</span>
                <span className="rocksoul-stat">Gold {gameState.player.gold}</span>
              </>
            ) : (
              <span className="rocksoul-stat">Awaiting Awakening</span>
            )}
          </div>
        </header>
        <nav className="rocksoul-nav">
          <button className="rocksoul-btn" onClick={() => EventBus.emit('new-game')}>New Journey</button>
          <button className="rocksoul-btn" onClick={toggleQuestLog}>Quests</button>
          <button className="rocksoul-btn" onClick={toggleInventory}>Inventory</button>
          <button className="rocksoul-btn" onClick={() => EventBus.emit('scene-change', { targetScene: 'WorldMap' })}>Map</button>
        </nav>
        {gameState.showQuestLog && (
          <div className="rocksoul-panel">
            <h2>Quest Log</h2>
            {gameState.quests.map((q) => (
              <div key={q.id} className="rocksoul-quest">
                <h3>{q.title}</h3>
                <p>{q.description}</p>
                {q.objectives.map((obj, i) => (
                  <div key={i} className="rocksoul-objective">
                    {obj.type}: {obj.current}/{obj.required}
                  </div>
                ))}
                <div className="rocksoul-reward">Reward: {q.rewards.xp} XP, {q.rewards.gold} Gold</div>
              </div>
            ))}
          </div>
        )}
        {gameState.showInventory && (
          <div className="rocksoul-panel">
            <h2>Inventory</h2>
            {gameState.inventory.length === 0 ? (
              <p className="rocksoul-empty">Empty — your journey has yet to yield treasures.</p>
            ) : (
              gameState.inventory.map((item) => (
                <div key={item.id} className="rocksoul-item">
                  <span className={`rocksoul-rarity rocksoul-rarity-${item.rarity}`}>{item.rarity.toUpperCase()}</span>
                  <span>{item.name}</span>
                  <span className="rocksoul-item-type">{item.type}</span>
                </div>
              ))
            )}
          </div>
        )}
        <div className="rocksoul-region">
          Region: {gameState.region}
        </div>
      </div>
    </div>
  );
}

export default App;