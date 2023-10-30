import product_cartDTO from '../dao/dtos/product.cart.dto.js'
import { cartsRepository, productsRepository, userRepository } from '../repositories/index.js'

const cart_repository = cartsRepository
const product_repository = productsRepository
const user_repository = userRepository

export const getCarts = async (req, res) => {
    try {
        const carts = await cart_repository.getCarts();
        res.status(200).send(carts)
    } catch(error){
        req.logger.error(error)
        res.status(400).send({error: error.message})
    }
}

export const getCartsById = async (req, res) => {
    try {
        const cid = req.params.cid
        const cartById = await cart_repository.getCartsById(cid);
        res.status(200).send({ cartById })
    } catch(error){
        req.logger.error(error)
        res.status(400).send({error: error.message})
    }
}

export const createCart = async (req, res) => {
    try {
        const statusCart = await cart_repository.createCart();
        const cid = statusCart._id.toString()
        const { email } = req.user.user
        const userUpdated = await user_repository.addCartToUser(cid, email)  

        res.status(201).send({status: 'success', message: statusCart, userUpdated})
    } catch(error) {
        req.logger.error(error)
        res.status(400).send({error: error.message})
    }
}

export const addProductToCart = async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    try {
        if(!cid){
            throw new Error('Cart ID is required')
        }
        if(!pid){
            throw new Error('Product ID is required')
        }

        const cart = await cart_repository.getCartsById(cid);
        if(!cart){
            throw new Error('Cart not found')
        } 

        const product = await product_repository.getProductById(pid)
        if(!product){
            throw new Error(`Product doesn't exist`)
        }

        const cart_products = cart.products.toObject()
        const prodInCart = cart_products.find(prod => prod.product._id.toString() === pid)
        if(prodInCart){
            const prodIndex = cart_products.findIndex(prod => prod.product._id.toString() === pid)
            cart.products[prodIndex].quantity += 1
        } else {
            cart.products.push(new product_cartDTO(product))
        }

        await cart_repository.saveCart(cart)
        const cart_id = cart._doc._id.toString()
        res.status(200).send({status: 'success', productAdded: product, inCart: cart_id})
    } catch(error){
        req.logger.error(error)
        res.status(400).send({error: error.message})
    }
}

export const updateQuantityProducts = async (req, res) => {
    try{
        const { cid, pid } = req.params
        const { quantity } = req.body

        if(!cid){
            throw new Error('Cart ID is required')
        }
        if(!pid){
            throw new Error('Product ID is required')
        }

        const cart = await cart_repository.getCartsById(cid);
        if(!cart){
            throw new Error('Cart not found')
        } 

        const product = await product_repository.getProductById(pid)
        if(!product){
            throw new Error(`Product doesn't exist`)
        }

        const result = await cart_repository.updateQuantityProducts(cid, pid, quantity)
        res.status(200).send(result)
    }catch(error){
        req.logger.error(error)
        res.status(400).send({error: error.message})
    }
}

export const deleteProductInCart = async (req, res) => {
    try{
        const { cid, pid } = req.params

        if(!cid){
            throw new Error('Cart ID is required')
        }
        if(!pid){
            throw new Error('Product ID is required')
        }

        const cart = await cart_repository.getCartsById(cid);
        if(!cart){
            throw new Error('Cart not found')
        } 

        const product = await product_repository.getProductById(pid)
        if(!product){
            throw new Error(`Product doesn't exist`)
        }

        const result = await cart_repository.deleteProductInCart(cid, pid)
        res.status(204).send({status: result, productDeleted: product, inCart: cid})
    }catch(error){
        req.logger.error(error)
        res.status(400).send({error: error.message})
    }
}

export const deleteAllProducts = async (req, res) => {
    try{
        const { cid } = req.params

        if(!cid){
            throw new Error('Cart ID is required')
        }

        const result = await cart_repository.deleteAllProducts(cid)
        res.status(204).send(result)
    }catch(error){
        req.logger.error(error)
        res.status(400).send({error: error.message})
    }
}