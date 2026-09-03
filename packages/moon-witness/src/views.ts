import type { ViewManifest } from '@moon/orm'

export const views: Record<string, ViewManifest> = {
  'wx.scripture': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'BookOpen',
    table: {
      columns: ['name', 'canonicalCode', 'booksCount', 'versesCount'],
      searchKeys: ['name', 'canonicalCode'],
    },
    form: {
      title: 'DIVINE SCRIPTURE',
      sections: [
        { title: 'Scripture', columns: 2, fields: ['name', 'canonicalCode', 'sourceClass', 'type'] },
        { title: 'Statistics', columns: 2, fields: ['booksCount', 'versesCount'] },
        { title: 'Description', columns: 1, fields: ['description'] },
      ],
    },
  },

  'wx.tradition': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'ScrollText',
    table: {
      columns: ['name', 'author', 'totalItems', 'category'],
      searchKeys: ['name', 'author'],
    },
    form: {
      title: 'HADITH COMPENDIUM',
      sections: [
        { title: 'Compendium', columns: 2, fields: ['name', 'slug', 'author', 'category'] },
        { title: 'Statistics', columns: 2, fields: ['totalItems'] },
        { title: 'Description', columns: 1, fields: ['description'] },
      ],
    },
  },

  'wx.asmaul.husna': {
    defaultView: 'table',
    accentColor: 'cyan',
    icon: 'Sparkles',
    table: {
      columns: ['number', 'nameArabic', 'nameLatin', 'translationId', 'meaning'],
      searchKeys: ['nameArabic', 'nameLatin', 'translationId', 'meaning'],
    },
    form: {
      title: 'ASMAUL HUSNA',
      sections: [
        { title: 'Divine Name', columns: 2, fields: ['number', 'nameArabic', 'nameLatin'] },
        { title: 'Meaning', columns: 1, fields: ['translationId', 'translationEn', 'meaning', 'quranReference'] },
      ],
    },
  },
}
