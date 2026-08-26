import StockLocation from './stock-location.js'
import StockWarehouse from './stock-warehouse.js'
import StockPicking from './stock-picking.js'
import StockMove from './stock-move.js'
import StockQuant from './stock-quant.js'

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
