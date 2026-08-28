import { describe, it, expect } from 'vitest'
import {
  ProductCategory,
  ProductTemplate,
  ProductProduct,
  ProductPricelist
} from '../src/index.ts'
import productAddon from '../src/index.js'

describe('@moon/product Addon (#21)', () => {
  it('exports addon manifest with base dependency', () => {
    expect(productAddon.name).toBe('product')
    expect(productAddon.depends).toContain('base')
    expect(productAddon.models.length).toBe(4)
  })

  it('defines product models with delegation inheritance', () => {
    expect(ProductCategory._name).toBe('product.category')
    expect(ProductTemplate._name).toBe('product.template')
    expect(ProductProduct._name).toBe('product.product')
    expect(ProductProduct._inherits).toEqual({ 'product.template': 'productTmplId' })
    expect(ProductPricelist._name).toBe('product.pricelist')
  })
})
