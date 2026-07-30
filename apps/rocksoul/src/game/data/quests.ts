import { Quest } from '../types';

export const QUESTS: Quest[] = [
  {
    id: 'q001',
    title: 'The Awakening',
    description: 'Wake up and speak with the elder Stone Guardian near the starting island.',
    lore: 'You have been dormant for ages, buried beneath layers of cosmic dust. Now the pulse of a Soul Rock stirs you.',
    status: 'available',
    objectives: [
      { type: 'talk', target: 'Stone Guardian Kai', current: 0, required: 1 },
    ],
    rewards: { xp: 100, gold: 50 },
  },
  {
    id: 'q002',
    title: 'First Blood',
    description: 'Defeat 5 Void Wraiths that have been plaguing the Shattered Isles.',
    lore: 'The Void Wraiths are the Devourer\'s first servants — hollow shells of corrupted rock and lost soul.',
    status: 'available',
    objectives: [
      { type: 'kill', target: 'Void Wraith', current: 0, required: 5 },
    ],
    rewards: { xp: 200, gold: 75 },
  },
  {
    id: 'q003',
    title: 'The Lost Soul Rock',
    description: 'Retrieve the first Soul Rock from the depths of the Obsidian Wastes.',
    lore: 'The first Soul Rock pulses beneath the Obsidian Wastes, guarded by the Ancient Golem. Only the worthy may claim it.',
    status: 'available',
    objectives: [
      { type: 'kill', target: 'Ancient Golem', current: 0, required: 1 },
      { type: 'collect', target: 'Soul Rock Fragment', current: 0, required: 1 },
    ],
    rewards: { xp: 500, gold: 200, item: 'rocksblade' },
  },
  {
    id: 'q004',
    title: 'Gathering the Shards',
    description: 'Collect 3 Soul Shards scattered across the Celitereal.',
    lore: 'Soul Shards are fragments of Rockborn essence. Each one carries a memory of the ancient guardians.',
    status: 'available',
    objectives: [
      { type: 'collect', target: 'Soul Shard', current: 0, required: 3 },
    ],
    rewards: { xp: 350, gold: 100 },
  },
  {
    id: 'q005',
    title: 'Alliance of Stone',
    description: 'Visit all four factions and earn their recognition.',
    lore: 'The Celitereal thrives on unity. Each faction holds a piece of the path to defeating the Void Devourer.',
    status: 'available',
    objectives: [
      { type: 'talk', target: 'Stone Guardian Kai', current: 0, required: 1 },
      { type: 'talk', target: 'Void Walker Zyr', current: 0, required: 1 },
      { type: 'talk', target: 'Crystal Keeper Elara', current: 0, required: 1 },
      { type: 'talk', target: 'Ember Champion Rax', current: 0, required: 1 },
    ],
    rewards: { xp: 1000, gold: 500, item: 'soulcharm' },
  },
  {
    id: 'q006',
    title: 'The Crystal Sanctum',
    description: 'Penetrate the Crystal Sanctum and retrieve the second Soul Rock.',
    lore: 'The Crystal Keepers have long protected the second Soul Rock. Proving your worth is the only way in.',
    status: 'available',
    objectives: [
      { type: 'kill', target: 'Crystal Sentinel', current: 0, required: 3 },
      { type: 'talk', target: 'Crystal Keeper Elara', current: 0, required: 1 },
    ],
    rewards: { xp: 800, gold: 350, item: 'crystalshield' },
  },
  {
    id: 'q007',
    title: 'Into the Rift',
    description: 'Brave the Rift Expanse and confront the Void Walker Zyr in battle.',
    lore: 'Void Walker Zyr seeks to claim the third Soul Rock for the Void. You must stop them.',
    status: 'available',
    objectives: [
      { type: 'kill', target: 'Void Walker Zyr', current: 0, required: 1 },
      { type: 'collect', target: 'Void Soul Rock', current: 0, required: 1 },
    ],
    rewards: { xp: 1200, gold: 600, item: 'voidstaff' },
  },
  {
    id: 'q008',
    title: 'The Ember Throne',
    description: 'Ascend the Ember Throne and claim the fourth Soul Rock from the Flame Guardian.',
    lore: 'The Ember Flame\'s champion guards the fourth Soul Rock with unyielding fire. Prove your strength.',
    status: 'available',
    objectives: [
      { type: 'kill', target: 'Flame Guardian', current: 0, required: 1 },
    ],
    rewards: { xp: 1500, gold: 800, item: 'emberarmor' },
  },
  {
    id: 'q009',
    title: 'The Final Convergence',
    description: 'Gather all twelve Soul Rocks and descend into the Void Core.',
    lore: 'With all Soul Rocks united, the path to the Void Core opens. The fate of the Celitereal rests in your hands.',
    status: 'available',
    objectives: [
      { type: 'collect', target: 'Soul Rock', current: 0, required: 12 },
    ],
    rewards: { xp: 10000, gold: 5000, item: 'primordialfragment' },
  },
  {
    id: 'q010',
    title: 'Ending the Devourer',
    description: 'Confront the Void Devourer and banish it from the Celitereal forever.',
    lore: 'The Void Devourer awaits at the edge of reality. This is the final battle. The Celitereal\'s fate — and yours — will be sealed.',
    status: 'available',
    objectives: [
      { type: 'kill', target: 'Void Devourer', current: 0, required: 1 },
    ],
    rewards: { xp: 50000, gold: 10000, item: 'primordialfragment' },
  },
];