export default class productDTO{
    constructor(product){
        this.title = product.newProduct.title
        this.description = product.newProduct.description
        this.price = product.newProduct.price
        this.status = product.newProduct.status
        this.code = product.newProduct.code
        this.stock = product.newProduct.stock
        this.category = product.newProduct.category
        this.owner = product.newProduct.owner
    }
}