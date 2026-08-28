import StockLocation from './stock-location.ts'
import StockWarehouse from './stock-warehouse.ts'
import StockPicking from './stock-picking.ts'
import StockMove from './stock-move.ts'
import StockQuant from './stock-quant.ts'

export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export {
  StockLocation,
  StockWarehouse,
  StockPicking,
  StockMove,
  StockQuant
}

export default {
  name: 'stock',
  description: 'Inventory, double-entry stock moves, and warehouse logistics',
  depends: ['base', 'product'],
  models: [
    StockLocation,
    StockWarehouse,
    StockPicking,
    StockMove,
    StockQuant
  ]
}
