import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'wx.scripture': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'BookOpen',
    table: {
      columns: ['name', 'code', 'language', 'totalBooks', 'totalVerses'],
      searchKeys: ['name', 'code'],
    },
    form: {
      title: 'DIVINE SCRIPTURE',
      sections: [
        { title: 'Scripture', columns: 2, fields: ['name', 'code', 'language'] },
        { title: 'Statistics', columns: 2, fields: ['totalBooks', 'totalVerses'] },
        { title: 'Description', columns: 1, fields: ['description'] },
      ],
    },
  },

  'wx.tradition': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'ScrollText',
    table: {
      columns: ['name', 'compiler', 'totalHadiths', 'era'],
      searchKeys: ['name', 'compiler'],
    },
    form: {
      title: 'HADITH COMPENDIUM',
      sections: [
        { title: 'Compendium', columns: 2, fields: ['name', 'compiler', 'era'] },
        { title: 'Statistics', columns: 2, fields: ['totalHadiths', 'totalChapters'] },
        { title: 'Description', columns: 1, fields: ['description'] },
      ],
    },
  },

  'wx.asmaul.husna': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'Sparkles',
    table: {
      columns: ['number', 'name', 'arabic', 'transliteration', 'meaning'],
      searchKeys: ['name', 'transliteration', 'meaning'],
    },
    form: {
      title: 'ASMAUL HUSNA',
      sections: [
        { title: 'Divine Name', columns: 2, fields: ['number', 'name', 'arabic', 'transliteration'] },
        { title: 'Meaning', columns: 1, fields: ['meaning', 'description'] },
      ],
    },
  },
}
