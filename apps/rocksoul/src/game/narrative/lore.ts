export const COSMOS_NARRATIVE = {
  title: 'Rocksoul: Celitereal Chronicles',
  subtitle: 'A Cosmic MMORPG Adventure',
  prologue: [
    {
      chapter: 1,
      title: 'The Awakening',
      text: 'In the beginning, there was nothing but the Void — an endless expanse of darkness where no stone could stand and no soul could breathe.',
    },
    {
      chapter: 2,
      title: 'The First Stone',
      text: 'From the Void\'s abyss, the Primordial Core erupted — a blazing shard of pure cosmic rock that shattered the darkness into a million fragments.',
    },
    {
      chapter: 3,
      title: 'The Birth of Celitereal',
      text: 'The fragments coalesced into floating islands of stone, each imbued with a fragment of the Core\'s power. These islands became the Celitereal — the realm of rocks and souls.',
    },
    {
      chapter: 4,
      title: 'The Rockborn',
      text: 'From the fusion of stone and soul, the Rockborn emerged — beings of crystalline flesh and cosmic energy, destined to guard the Celitereal from the Void\'s return.',
    },
    {
      chapter: 5,
      title: 'The Void Devourer',
      text: 'But the Void was not destroyed — only wounded. From its depths rose the Void Devourer, an entity of consuming darkness that seeks to swallow every rock and every soul back into oblivion.',
    },
    {
      chapter: 6,
      title: 'The Soul Rocks',
      text: 'To stop the Devourer, the Rockborn shattered their own essence into Sacred Soul Rocks — twelve artifacts of immense power scattered across the Celitereal.',
    },
    {
      chapter: 7,
      title: 'The Call',
      text: 'You are the latest Rockborn, awakened by the resonance of a Soul Rock calling to you. The Celitereal needs you. Journey across the floating islands, gather the Soul Rocks, and banish the Void Devourer forever.',
    },
  ],
  factions: [
    {
      id: 'stoneguardians',
      name: 'Stone Guardians',
      description: 'Ancient Rockborn who have protected the Celitereal since the First Awakening. They dwell in the Obsidian Citadel at the center of the realm.',
      color: '#4a90d9',
      homeworld: 'Obsidian Citadel',
    },
    {
      id: 'voidwalkers',
      name: 'Void Walkers',
      description: 'Rockborn who have embraced the duality of stone and Void. They walk between dimensions, wielding both creation and destruction.',
      color: '#9b59b6',
      homeworld: 'The Rift Expanse',
    },
    {
      id: 'crystalkeepers',
      name: 'Crystal Keepers',
      description: 'Scholars and mystics who study the Soul Rocks and the cosmic energy they emit. They maintain the Crystal Sanctum where ancient knowledge is preserved.',
      color: '#1abc9c',
      homeworld: 'Crystal Sanctum',
    },
    {
      id: 'emberflame',
      name: 'Ember Flame',
      description: 'Warriors of the Cosmic Fire, born from the remnants of the Primordial Core. They fight with raw heat and unyielding will.',
      color: '#e67e22',
      homeworld: 'The Ember Throne',
    },
  ],
  worldLore: {
    regions: [
      {
        name: 'The Shattered Isles',
        description: 'The outermost islands of the Celitereal, fragmented by the Void\'s corruption. Only the bravest adventurers dare venture here.',
        levelRange: '1-20',
      },
      {
        name: 'The Obsidian Wastes',
        description: 'A barren expanse of black stone where the first Soul Rock was discovered. The ground trembles with ancient power.',
        levelRange: '20-40',
      },
      {
        name: 'The Crystal Sanctum',
        description: 'A luminous realm of towering crystal spires where the Crystal Keepers guard their knowledge and the second Soul Rock.',
        levelRange: '40-60',
      },
      {
        name: 'The Rift Expanse',
        description: 'A dimensional tear between the Celitereal and the Void. Void Walkers train here, and the third Soul Rock lies at its heart.',
        levelRange: '60-80',
      },
      {
        name: 'The Ember Throne',
        description: 'A volcanic fortress of fire and stone, home to the Ember Flame faction. The fourth Soul Rock burns at the throne\'s peak.',
        levelRange: '80-100',
      },
      {
        name: 'The Void Core',
        description: 'The dark heart of the Void Devourer. All twelve Soul Rocks must be gathered before the final journey to this dread realm.',
        levelRange: '100+',
      },
    ],
    events: [
      {
        id: 'the-great-fracture',
        name: 'The Great Fracture',
        description: 'When the Primordial Core shattered, reality itself cracked. The Celitereal was born from those fractures.',
        epoch: 0,
      },
      {
        id: 'the-first-awakening',
        name: 'The First Awakening',
        description: 'The first Rockborn emerged from the Core\'s fragments, becoming the guardians of the newborn Celitereal.',
        epoch: 1,
      },
      {
        id: 'the-void-corruption',
        name: 'The Void Corruption',
        description: 'The Void Devourer began its slow march across the islands, turning stone to dust and soul to shadow.',
        epoch: 2,
      },
      {
        id: 'the-rockborn-sealing',
        name: 'The Rockborn Sealing',
        description: 'The ancient Rockborn sacrificed their physical forms to create the twelve Soul Rocks, sealing the Devourer temporarily.',
        epoch: 3,
      },
      {
        id: 'your-awakening',
        name: 'Your Awakening',
        description: 'A new Rockborn stirs in the darkness, drawn by the pulse of a Soul Rock. Your journey begins.',
        epoch: 4,
      },
    ],
  },
};