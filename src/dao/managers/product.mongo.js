import productsModel from "../models/products.model.js";

export class ProductMongoMgr{
    async addProduct(newProduct){
        try {
            const prodAdded = await productsModel.create(newProduct)
            return prodAdded
        }catch(error){
            return new Error({error: error.message})
        }
    }

    async getProducts(){
        try{
            const products = await productsModel.find().lean();
            return products
        }catch(error){
            return new Error({error: error.message})
        }
    }

    async getProductById(id){
        try{
            const product = await productsModel.findOne({ _id: id })
            return product
        }catch(error){
            return new Error({error: error.message})
        }
    }

    async getProductByCode(code){
        try{
            const product = await productsModel.findOne({ code: code })
            return product
        }catch(error){
            return new Error({error: error.message})
        }
    }

    async updateProduct(id, data){
        try{
            const updatedProduct = await productsModel.updateOne({_id: id}, data)
            return updatedProduct
        } catch(error){
            return new Error({error: error.message})
        }
    }

    async deleteProduct(id){
        try{
            return await productsModel.deleteOne({ _id: id})
        }catch(error){
            return new Error({error: error.message})
        }
    }
} 