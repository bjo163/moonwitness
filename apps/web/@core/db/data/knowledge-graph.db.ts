
export const mockKnowledgeGraphResponse = {
  success: true,
  data: {
    entityTypes: [
      { id: "prophets", n: "Prophets", i: "Users", c: "25", col: "text-secondary" },
      { id: "verses", n: "Qur'an Verses", i: "BookOpen", c: "6,236", col: "text-warning" },
      { id: "hadith", n: "Hadith", i: "Scroll", c: "75,234", col: "text-knowledge" },
      { id: "historical", n: "Historical Events", i: "Map", c: "12,842", col: "text-success" },
      { id: "civilizations", n: "Civilizations", i: "Globe2", c: "96", col: "text-knowledge" },
      { id: "locations", n: "Locations", i: "Map", c: "1,842", col: "text-secondary" },
      { id: "astronomy", n: "Astronomical Events", i: "Telescope", c: "2,143", col: "text-warning" },
      { id: "concepts", n: "Concepts", i: "Lightbulb", c: "3,218", col: "text-primary" },
      { id: "people", n: "People", i: "Users", c: "5,421", col: "text-danger" },
      { id: "books", n: "Books & Sources", i: "Book", c: "2,776", col: "text-secondary" },
    ],
    statistics: {
      totalEntities: "59,567",
      totalConnections: "128,842",
      activeRelations: "342,118",
      dataSources: "1,248",
      lastUpdated: "2 min ago",
    },
    topEntities: [
      { id: "quran", n: "Qur'an", c: "6,236", i: "BookOpen", col: "text-warning" },
      { id: "muhammad", n: "Muhammad (SAW)", c: "4,821", i: "Users", col: "text-secondary" },
      { id: "albaqarah", n: "Al-Baqarah (2)", c: "3,248", i: "BookOpen", col: "text-warning" },
      { id: "ibrahim", n: "Ibrahim (AS)", c: "2,974", i: "Users", col: "text-secondary" },
      { id: "makkah", n: "Makkah", c: "2,613", i: "Map", col: "text-success" },
    ],
    selectedEntity: {
      id: "ibrahim",
      name: "Ibrahim (AS)",
      type: "Prophet",
      description: "Prophet Ibrahim (AS) is known as the Khalilullah (Friend of Allah). He was a prophet, leader, and the forefather of many prophets and nations. His story is mentioned in many verses in the Qur'an.",
      connections: {
        total: 128,
        breakdown: [
          { n: "Qur'an Verses", c: "156", i: "BookOpen", col: "text-secondary" },
          { n: "Hadiths", c: "241", i: "Book", col: "text-knowledge" },
          { n: "Historical Events", c: "38", i: "Map", col: "text-success" },
          { n: "Locations", c: "17", i: "Globe2", col: "text-secondary" },
          { n: "People", c: "23", i: "Users", col: "text-danger" },
          { n: "Concepts", c: "42", i: "Lightbulb", col: "text-primary" },
        ]
      },
      verses: [
        {
          arabic: "إِنِّي جَاعِلُكَ لِلنَّاسِ إِمَامًا",
          reference: "Surah Al-Baqarah (2:124)",
          translation: 'And [mention] when Ibrahim was tried by his Lord with commands and he fulfilled them. He said, "Indeed, I will make you a leader for the people."',
        }
      ],
      hadiths: [
        {
          reference: "Sahih Bukhari 3456",
          text: "\"Ibrahim was neither a Jew nor a Christian 'but he was a true monotheist (Muslim)'.\""
        }
      ]
    }
  }
};
