import { describe, expect, it } from 'vitest'
import WxAssertion from '../src/models/wx-assertion.js'
import WxContent from '../src/models/wx-content.js'
import WxFigure from '../src/models/wx-figure.js'
import WxLexicalOccurrence from '../src/models/wx-lexical-occurrence.js'
import WxPassage from '../src/models/wx-passage.js'
import WxScripture from '../src/models/wx-scripture.js'
import WxTraditionUnit from '../src/models/wx-tradition-unit.js'
import WxTransmissionLink from '../src/models/wx-transmission-link.js'
import { sha256String } from '../src/services/hash.js'

const asContext = (getModel: (name: string) => unknown) => ({ getModel }) as any

describe('Witness canonical domain graph contracts (#51-#54)', () => {
  it('registers canonical models without exposing them as public CRUD data', () => {
    expect(WxScripture._public).not.toBe(true)
    expect(WxPassage._public).not.toBe(true)
    expect(WxFigure._public).not.toBe(true)
    expect(WxAssertion._public).not.toBe(true)
    expect((WxContent as any).getFieldDefs(WxContent)).toHaveProperty('derivedFromContentId')
  })

  it('admits only the four normative Revelation families', async () => {
    await expect(WxScripture.beforeSave!(WxScripture, asContext(() => null), {
      name: 'Unknown sacred text', type: 'canonical', sourceClass: 'REVELATION', canonicalCode: 'PHILOSOPHY'
    })).rejects.toThrow('QURAN, TAWRAT, ZABUR, or INJIL')
    await expect(WxScripture.beforeSave!(WxScripture, asContext(() => null), {
      name: 'Later work', type: 'additional', sourceClass: 'REVELATION', canonicalCode: 'INJIL'
    })).rejects.toThrow('cannot claim the REVELATION source class')
    await expect(WxScripture.beforeSave!(WxScripture, asContext(() => null), {
      name: 'Al-Quran', type: 'canonical', sourceClass: 'REVELATION', canonicalCode: 'quran'
    })).resolves.toBeUndefined()
  })

  it('requires content to target a canonical entity or passage and seals its text', async () => {
    await expect(WxContent.beforeSave!(WxContent, asContext(() => null), { text: 'text' })).rejects.toThrow(
      'Content must target an entity or passage'
    )

    const values: Record<string, unknown> = { passageId: 10, text: 'source text' }
    await WxContent.beforeSave!(WxContent, asContext(() => null), values)
    expect(values.checksum).toBe(sha256String('source text'))
  })

  it('rejects parent records from another scripture or tradition corpus', async () => {
    const parent = { scriptureId: 2, corpusId: 2 }
    const getModel = (name: string) => ({
      fetch: async () => [parent],
      _name: name
    })

    await expect(
      WxPassage.beforeSave!(WxPassage, asContext(getModel), { scriptureId: 1, parentId: 20 })
    ).rejects.toThrow('same scripture')
    await expect(
      WxTraditionUnit.beforeSave!(WxTraditionUnit, asContext(getModel), { corpusId: 1, parentId: 20 })
    ).rejects.toThrow('same corpus')
  })

  it('binds lexical spans to source content and computes their fragment checksum', async () => {
    const values: Record<string, unknown> = {
      contentId: 4,
      startOffset: 1,
      endOffset: 4
    }
    const content = { fetch: async () => [{ text: 'source' }] }
    await WxLexicalOccurrence.beforeSave!(
      WxLexicalOccurrence,
      asContext(() => content),
      values
    )
    expect(values.fragmentChecksum).toBe(sha256String('our'))
  })

  it('rejects duplicate transmission sequence positions within one chain', async () => {
    const linkModel = { fetch: async () => [{ id: 9 }] }
    await expect(
      WxTransmissionLink.beforeSave!(
        WxTransmissionLink,
        asContext(() => linkModel),
        { chainId: 3, sequence: 2 }
      )
    ).rejects.toThrow('duplicate sequence')
  })
})
