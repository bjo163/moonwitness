import ProductCategory from './product-category.js'
import ProductTemplate from './product-template.js'
import ProductProduct from './product-product.js'
import ProductPricelist from './product-pricelist.js'

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
