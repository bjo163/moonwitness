import { describe, it, expect } from 'vitest'
import {
  StockLocation,
  StockWarehouse,
  StockPicking,
  StockMove,
  StockQuant
} from '../src/index.ts'
import stockAddon from '../src/index.js'

describe('@moon/stock Addon (#23)', () => {
  it('exports addon manifest with base and product dependencies', () => {
    expect(stockAddon.name).toBe('stock')
    expect(stockAddon.depends).toContain('base')
    expect(stockAddon.depends).toContain('product')
    expect(stockAddon.models.length).toBe(5)
  })

  it('defines stock location, warehouse, move and quant models', () => {
    expect(StockLocation._name).toBe('stock.location')
    expect(StockWarehouse._name).toBe('stock.warehouse')
    expect(StockPicking._name).toBe('stock.picking')
    expect(StockMove._name).toBe('stock.move')
    expect(StockQuant._name).toBe('stock.quant')
  })
})
