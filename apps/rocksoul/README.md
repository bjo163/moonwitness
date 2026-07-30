# Rocksoul — Celitereal Chronicles

A cosmic MMORPG adventure set in the Celitereal — a realm of floating rock islands suspended in cosmic energy. Gather the twelve Sacred Soul Rocks, battle the Void Devourer, and restore balance to the Celitereal.

## Overview

Rocksoul is a Phaser 3-based cosmic MMORPG built on Next.js with React integration. Explore floating island regions, battle Void Wraiths and corrupted Stone Golems, interact with NPC factions, complete quests, and uncover the lore of the Rockborn.

## Features

- **Cosmic MMORPG World** — Explore six distinct regions across the Celitereal
- **Faction System** — Join the Stone Guardians, Void Walkers, Crystal Keepers, or Ember Flame
- **Quest System** — Ten narrative-driven quests with objectives and rewards
- **Combat System** — Real-time combat against Void creatures and corrupted beings
- **Inventory** — Collect weapons, armor, accessories, and materials
- **HUD** — Health, mana, level, and gold display with minimap
- **World Map** — Navigate between regions on the Celitereal map
- **Dialogue System** — Interact with NPCs for lore and quest progression
- **Narrative Lore** — Rich cosmic backstory with seven chapters of world history

## Game Data

| Category | Count | Location |
|----------|-------|----------|
| Regions | 6 | `src/game/narrative/lore.ts` |
| Quests | 10 | `src/game/data/quests.ts` |
| NPCs | 4 | `src/game/data/npcs.ts` |
| Items | 14 | `src/game/data/items.ts` |
| Enemies | 9 | `src/game/data/enemies.ts` |
| Scenes | 7 | `src/game/scenes/` |

## Architecture

```
src/
├── pages/              Next.js pages
│   ├── index.tsx       Landing page with MMORPG metadata
│   ├── _app.tsx        App wrapper
│   └── _document.tsx   HTML document
├── App.tsx             Main React controller
├── PhaserGame.tsx      Phaser game bridge
├── game/
│   ├── main.ts         Phaser game entry point & config
│   ├── EventBus.ts     React ↔ Phaser event bus
│   ├── types/          TypeScript type definitions
│   ├── narrative/      World lore and cosmic history
│   ├── data/           Quests, NPCs, items, enemies
│   └── scenes/         Phaser game scenes
│       ├── Boot.ts     Asset preloading scene
│       ├── Preloader.ts  Loading screen with narrative
│       ├── MainMenu.ts  Cosmic MMORPG main menu
│       ├── Game.ts      Core gameplay scene
│       ├── WorldMap.ts  Region navigation map
│       ├── Dialogue.ts  NPC dialogue system
│       ├── GameOver.ts  Game over screen
│       └── HUD.ts       Head-up display
└── styles/             CSS stylesheets
```

## Controls

| Key | Action |
|-----|--------|
| ↑ ↓ ← → | Move player |
| E | Interact with NPC |
| Q | Toggle quest log |
| ESC | Return to menu |
| Click | UI interactions |

## Narrative

> *"You are the latest Rockborn, awakened by the resonance of a Soul Rock calling to you. The Celitereal needs you. Journey across the floating islands, gather the Soul Rocks, and banish the Void Devourer forever."*

## Setup

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:8080`.

## Build

```bash
npm run build
```

The production build outputs to the `dist` folder.

## Created by MoonWitness

Rocksoul is part of the MoonWitness OS ecosystem — a modular, cosmic-themed application platform.
