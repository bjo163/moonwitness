import { Vertex, fields, type Ctx } from '@moon/orm'
import { sha256String } from '../services/hash.ts'

const OFFSET_SCHEME_SELECTION: Array<[string, string]> = [
  ['UNICODE_CODEPOINT', 'Unicode Code Point'],
  ['TOKEN_INDEX', 'Token Index']
]

/** Exact lexical span bound to a content revision and passage. */
export default class WxLexicalOccurrence extends Vertex {
  static _name = 'wx.lexical.occurrence'
  static _description = 'Witness Lexical Occurrence Span'

  lexemeId = fields.Many2one({ comodel: 'wx.lexeme', required: true, index: true })
  contentId = fields.Many2one({ comodel: 'wx.content', required: true, index: true })
  passageId = fields.Many2one({ comodel: 'wx.passage', required: true, index: true })
  offsetScheme = fields.Selection({ selection: OFFSET_SCHEME_SELECTION, required: true, index: true })
  startOffset = fields.Integer({ required: true })
  endOffset = fields.Integer({ required: true })
  fragmentChecksum = fields.Char({ size: 64, index: true })
  tokenizerVersion = fields.Char({ size: 80 })
  sourceId = fields.Many2one({ comodel: 'wx.source', index: true })
  provenanceId = fields.Many2one({ comodel: 'wx.provenance', index: true })
  active = fields.Boolean({ default: true, index: true })

  static async beforeSave(
    modelClass: typeof Vertex,
    env: Ctx,
    values: Record<string, unknown>
  ): Promise<void> {
    const start = Number(values.startOffset)
    const end = Number(values.endOffset)
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start) {
      throw new Error('Lexical occurrence offsets must be a non-negative ordered span')
    }
    if (values.fragmentChecksum || !values.contentId || !env.getModel) return
    const Content = env.getModel('wx.content')
    if (!Content) return
    const [content] = await (Content as any).fetch(Content, env, [['id', '=', values.contentId]])
    if (typeof content?.text !== 'string') return
    values.fragmentChecksum = sha256String(content.text.slice(start, end))
    void modelClass
  }
}
