import ProductCategory from './product-category.ts'
import ProductTemplate from './product-template.ts'
import ProductProduct from './product-product.ts'
import ProductPricelist from './product-pricelist.ts'

export { loadDemoData } from './demo-data.ts'
export { views } from './views.ts'
export {
  ProductCategory,
  ProductTemplate,
  ProductProduct,
  ProductPricelist
}

export default {
  name: 'product',
  description: 'Product and service catalog',
  depends: ['base'],
  models: [
    ProductCategory,
    ProductTemplate,
    ProductProduct,
    ProductPricelist
  ]
}
