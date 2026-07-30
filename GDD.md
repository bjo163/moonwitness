# Cosmic Idle: Game Design Document (GDD)

*Version: 1.0*
*Status: Living Document (Single Source of Truth)*

---

## 1. Vision & Concept
**Cosmic Idle** is a 2D Retro RPG that blends the engaging progression systems of modern idle/incremental games with the rich world-building, monster taming, and strategic turn-based combat of classic JRPGs (inspired by Golden Sun and Pokémon). The game is designed to be played in both active bursts and passive idle sessions, seamlessly bridging web technologies (React) with a robust game canvas (Phaser 3).

## 2. Core Gameplay Loop
The player's journey revolves around a deeply satisfying cycle of exploration, combat, and progression:
1. **Explore:** Navigate 2D top-down maps (Phaser), interact with NPCs (FSM AI), and discover new zones.
2. **Engage:** Encounter wild monsters or boss battles. Transition to the CTB (Conditional Turn-Based) combat screen (React UI + Phaser VFX).
3. **Progress:** Gain EXP, level up monsters, acquire loot, and earn the universal currency (NUR).
4. **Upgrade:** Use NUR and materials to forge new equipment, unlock passive skill trees, and evolve monsters.
5. **Idle:** Leave the game running (or offline) to accumulate resources via "Auto-Battle" or "Idle Nodes" based on the highest cleared progression.

## 3. World & Setting
The game takes place in **Aethelgard**, a fragmented world floating in the cosmic void.
- **Regions:** Split into floating continents, each representing different elemental themes (e.g., The Verdant Shards (Nature), The Ashen Peaks (Fire), The Void Wastes (Dark)).
- **Tone:** A mix of high fantasy and cosmic mystery. Vibrant pixel art contrasts with profound cosmic lore.

## 4. Story & Lore
The universe was shattered by an ancient calamity known as *The Great Fracture*. The player assumes the role of an *Astral Weaver*, one of the few beings capable of traversing the cosmic rifts between continents. 
- **The Main Goal:** Piece together the fragmented continents by defeating the *Void Aberrations* (Bosses) guarding the dimensional anchors.
- **Narrative Delivery:** Delivered via modular Dialogue Systems (i18n supported) during NPC interactions, item descriptions, and environmental storytelling.

## 5. Characters
- **The Protagonist (Astral Weaver):** A silent protagonist, highly customizable through equipment and classes.
- **Mayor Thomas:** The first major NPC in the starting town (Oakhaven). Guides the player through initial quests.
- **The Wandering Merchant:** A mysterious figure offering rare items in exchange for cosmic fragments.
- **Void Aberrations:** The primary antagonists; corrupted elemental titans.

## 6. Progression System
A deeply mathematical, highly rewarding system governing all entities:
- **Player:** Levels up to gain Attribute Points (allocated to base stats) and Skill Points (used in a massive passive skill tree).
- **Monsters:** Gain EXP via battle. They possess Base Stats, Individual Values (IVs), Effort Values (EVs), and can evolve at specific levels or affinity thresholds.
- **Difficulty Scaling:** Procedural scaling for New Game+ and infinite dungeon modes, driven by external JSON progression tables.

## 7. Battle System
- **Engine:** Conditional Turn-Based (CTB) system (akin to Final Fantasy X). Speed determines turn frequency.
- **Mechanics:** 
  - Elemental weaknesses and resistances.
  - Active skills (Magic, Physical, Buffs) costing MP.
  - *Hit Stop* and *Screen Shake* VFX emphasize critical impacts.
- **Presentation:** A split architecture where Phaser handles the visual representation (sprites, VFX, animations) and React handles the menus (Action commands, HP bars).

## 8. Economy
- **NUR (Universal Currency):** Used for everything from buying potions to upgrading gear. Earned via battles and quests.
- **Crafting Materials:** Dropped by specific monster types. Used at the Blacksmith.
- **Cosmic Shards:** Premium/Rare currency for high-tier evolutions or specific passive tree nodes.

## 9. Monster System
Inspired heavily by classic taming games:
- **Data-Driven:** All species, base stats, and learnsets are defined in `monsters.json`.
- **Instances:** Each caught monster has a unique UUID, randomized IVs, and tracks its own EVs.
- **Evolutions:** Branched evolution paths based on level requirements and affinity levels.

## 10. Quest System
A dynamic, multi-tiered objective tracker:
- **Types:** Story Quests, Side Quests, and Daily Quests.
- **Objectives:** `KILL_MONSTER`, `COLLECT_ITEM`, `TALK_TO_NPC`, `REACH_LEVEL`.
- **Workflow:** Defined entirely in `quests.json`. The `QuestSystem` listens to global `EventBus` events to automatically increment progress and handle rewards without hardcoding logic.

## 11. Map Structure
- **Format:** Tiled Map Editor JSON format.
- **Layers:** 
  - `Tile Layer (Ground/Walls)` for rendering.
  - `Collision Layer` for physics boundaries.
  - `Object Layer` for NPC spawn points, map transition zones (teleports), and interactive loot.
- **Management:** `MapSystem` parses these JSONs and dynamically loads the required tilesets and spawns `NpcFSM` entities.

## 12. UI Flow (React Architecture)
Since we mandate *React ONLY for UI, Phaser ONLY for Gameplay*:
- **HUD:** Always-on overlay showing Player HP, NUR, and active buffs.
- **Menus:** 
  - `InventoryScreen`: Grid-based, supports sorting/filtering, drag-and-drop equipping.
  - `StatsScreen`: Detailed view of IVs/EVs and attribute point allocation.
  - `QuestLog`: Accordion-style list of Active and Completed quests.
  - `BattleUI`: Action ring/menu that appears when combat starts.

## 13. Save System (Production-Ready)
- **Architecture:** Serializes the `Game Store` into JSON.
- **Features:** 
  - Versioned saves to handle schema changes.
  - SHA-256 Hashing to prevent basic save editing/cheating.
  - Multiple slots (Auto-save and Manual save).
  - Base64 encoding.
- **Migration:** Capable of upgrading `v1.0` saves to `v1.1` structures seamlessly.

## 14. Technical Architecture
- **Framework:** Next.js (React) + TypeScript + TailwindCSS.
- **Game Engine:** Phaser 3 (WebGL rendering).
- **State Management:** Zustand (Single source of truth for both React and Phaser).
- **Data Layer:** Zod + JSON (100% Data-Driven content).
- **Communication:** Global `EventBus` (Decoupled architecture).

## 15. Asset Pipeline
Designed for parallel team development:
- **Folder Structure:** Segregated `public/assets/` (sprites, maps, audio, locales).
- **Naming Conventions:** Strict snake_case prefixes (`spr_`, `bgm_`, `ts_`).
- **Localization:** `i18n` JSON files (`en.json`, `id.json`). No hardcoded UI text.
- **Workflow:** Artists drop PNGs, Designers edit JSONs, Programmers maintain systems. No code recompilation needed for content updates.

## 16. Milestone Roadmap
1. **Milestone 1: Core Systems (Completed)**
   - Engine initialization, Data-Driven refactor, Save System, NPC AI, VFX System.
2. **Milestone 2: Visual & Interface Integration (Next)**
   - React UI implementation (Inventory, Quests, HUD).
   - Phaser Scene integration (Tilemap rendering, Player movement camera).
3. **Milestone 3: Combat Loop**
   - Connecting the CTB Battle Engine to the visual UI and VFX.
4. **Milestone 4: Content Alpha**
   - Populating `monsters.json` and `items.json` with initial playable content.
5. **Milestone 5: Beta & Polish**
   - Balancing, audio integration, and bug fixing.
