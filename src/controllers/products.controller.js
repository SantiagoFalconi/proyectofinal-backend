import { io } from '../app.js'
import productDTO from '../dao/dtos/product.dto.js'
import productsModel from '../dao/models/products.model.js'
import formatResponse from '../dao/managers/formatResponse.js'
import { productsRepository } from '../repositories/index.js'
import CustomError from '../errors/CustomError.js'
import EError from '../errors/enums.js'
import { generateProductErrorInfo } from '../errors/info.js'
import { sendEmail } from '../utils/sendEmails.js';

const product_repository = productsRepository

export const pagination = async (req, res) => {
    let { limit, page, sort } = req.params
    let objSort = {}

    if(sort){
        objSort = {price: sort}
    }

    const options = { 
        limit: limit ? parseInt(page) : 10,
        page: page ? parseInt(page) : 1,
        sort: objSort
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`
    
    try {
        const paginate = await productsModel.paginate(req.body, options)
        const response = formatResponse(paginate, options, baseUrl, 'success')
        res.status(200).send(response)
    } catch (error) {
        const response = formatResponse(paginate, options, baseUrl, 'error')
        res.status(400).send(response)
    }
}

export const addProduct = async (req, res) => {
    const owner_email = req.user.user.email
    const newProduct = req.body
    const { title, description, code, price, status, stock, category, owner} = newProduct
    try {
        if (!title || !description || !code || !price || !status || !stock || !category){
            CustomError.createError({
                name: 'Product Error',
                cause: generateProductErrorInfo({newProduct}),
                code: EError.INVALID_TYPES_ERROR,
                message: 'Error trying to create a new Product'
            })
        }
        if ( 
            typeof title        !== "string" || 
            typeof description  !== "string" || 
            typeof code         !== "string" || 
            typeof category     !== "string"
        ){
            throw new Error("Verify that title, description, code or category are of type string")
        }
        if ( 
            typeof price !== "number" || 
            typeof stock !== "number"
        ){
            throw new Error("Verify that price or stock are of type number")
        }
        if ( 
            typeof owner !== "object"
        ){
            throw new Error("Verify that owner is an object")
        }
        
        const product = await product_repository.getProductByCode(code)
        if(product){
            throw new Error('Code already exists')
        } 
        
        newProduct.owner.createdBy = owner_email
        const prodAdded = await product_repository.addProduct(new productDTO({newProduct}))
        const products = await product_repository.getProducts() 
        io.emit('updateproducts', products) 
        res.status(201).send({status: "success", product: prodAdded })
    } catch(error){
        req.logger.error(error)
        res.status(400).send({error})
    }
} 

export const getProductById = async (req, res) => {
    const pid = req.params.pid
    try {
        const products = await product_repository.getProductById(pid)
        res.status(200).send(products);
    } catch (error) {
        req.logger.error(error)
        res.status(400).send({error: error.message})
    }
}

export const updateProduct = async (req, res) => {
    const { pid } = req.params
    const bodyToUpdate = req.body
    try {
        const productExist = await product_repository.getProductById(pid)
        if(!productExist){
            throw new Error("The product you want to update does not exist")
        }

        const statusUpdate = await product_repository.updateProduct(pid, bodyToUpdate)
        const products = await product_repository.getProducts() 
        io.emit('updateproducts', products)
        res.status(200).send({message: statusUpdate});
    } catch (error) {
        req.logger.error(error)
        res.status(400).send({error: error.message})
    }
}

export const deleteProduct = async (req, res) => {
    const { pid } = req.params
    try {
        const productExist = await product_repository.getProductById(pid)
        if(!productExist){
            throw new Error("The product you want to delete does not exist")
        }

        const statusDelete = await product_repository.deleteProduct(pid)
        const products = await product_repository.getProducts() 
        const { owner, title } = productExist._doc
        if (owner.role === 'premium'){
            const subject = `Removed Product`
            const message = `Your product ${title} has been eliminated`
            sendEmail(owner.createdBy, subject, message)
        }
        io.emit('updateproducts', products) 
        res.status(200).send({message: statusDelete})
    } catch(error){
        req.logger.error(error)
        res.status(404).send({error: error.message})
    }
}