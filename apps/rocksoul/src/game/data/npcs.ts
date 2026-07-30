import { Npc } from '../types';

export const NPCS: Npc[] = [
  {
    id: 'npc_kai',
    name: 'Kai',
    title: 'Stone Guardian Elder',
    faction: 'stoneguardians',
    dialogue: [
      'Welcome, Rockborn. I have felt your awakening through the pulse of the Soul Rock.',
      'The Void Devourer grows stronger with each passing epoch. We need you — the Celitereal\'s last hope.',
      'Take this blade, forged from the first Stone ever to exist. It has waited for one such as you.',
      'Seek out the other factions. Unity is the only weapon against the Void.',
      'May the Core\'s light guide your path, young Rockborn.',
    ],
    quests: ['q001', 'q004'],
    position: { x: 100, y: 400 },
  },
  {
    id: 'npc_zyr',
    name: 'Zyr',
    title: 'Void Walker Champion',
    faction: 'voidwalkers',
    dialogue: [
      'You feel the pull of the Void, don\'t you? It beckons to all Rockborn.',
      'I have walked the edges of reality. The Devourer is not just an enemy — it is a inevitability.',
      'But even inevitability can be challenged. Will you join us, or stand against us?',
      'The Rift Expanse holds power that the Stone Guardians cannot comprehend.',
      'Choose wisely, Rockborn. TheVoid will not wait for the indecisive.',
    ],
    quests: ['q004', 'q007'],
    position: { x: 700, y: 200 },
  },
  {
    id: 'npc_elara',
    name: 'Elara',
    title: 'Crystal Keeper Archivist',
    faction: 'crystalkeepers',
    dialogue: [
      'Ah, a new Rockborn! The Soul Rocks have summoned you, I see.',
      'Knowledge is the first weapon against the Void. Every Soul Rock carries a fragment of ancient wisdom.',
      'The Crystal Sanctum holds secrets that predate the Celitereal itself.',
      'I sense great power within you. The Devourer should be afraid.',
      'Go forth, Rockborn. Return with the Soul Rocks, and the Crystal Keepers will stand beside you.',
    ],
    quests: ['q004', 'q006'],
    position: { x: 450, y: 150 },
  },
  {
    id: 'npc_rax',
    name: 'Rax',
    title: 'Ember Flame Champion',
    faction: 'emberflame',
    dialogue: [
      'HA! Another Rockborn! Feel the heat of the Ember Throne!',
      'I have fought the Void\'s minions for centuries. The fire of the Primordial Core burns in my veins.',
      'The fourth Soul Rock will test your mettle. Only the strongest may claim it.',
      'Join the Flame! Together, we will burn the Void to ashes!',
      'You have the fire within you, Rockborn. Now prove it in combat!',
    ],
    quests: ['q004', 'q008'],
    position: { x: 600, y: 550 },
  },
];