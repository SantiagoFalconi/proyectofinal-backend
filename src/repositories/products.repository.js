export default class productsRepository{
    constructor(dao){
        this.dao = dao;
    }

    addProduct = async (newProduct) => {
        const prodAdded = await this.dao.addProduct(newProduct);
        return prodAdded
    }

    getProducts = async () => {
        const products = await this.dao.getProducts();
        return products;
    }

    getProductById = async (id) => {
        const product = await this.dao.getProductById(id);
        return product;
    }

    getProductByCode = async (code) => {
        const product = await this.dao.getProductByCode(code)
        return product;
    }
    
    updateProduct = async (id, data) => {
        const productUpdated = await this.dao.updateProduct(id, data)
        return productUpdated
    }

    deleteProduct = async (id) => {
        const productDeleted = await this.dao.deleteProduct(id);
        return productDeleted;
    }
}