import { cartsRepository, productsRepository } from '../repositories/index.js'
import { ticketMongoMgr } from '../dao/managers/ticket.mongo.js'
import { ticketProcess } from './ticket.controller.js'

const cart_repository = cartsRepository
const product_repository = productsRepository
const ticket_mgr = new ticketMongoMgr()

export const purchase = async (req, res) => {
    const { cid } = req.params
    const { email } = req.user.user
    const purchase_cart = await cart_repository.getCartsById(cid)
    
    if (purchase_cart.products.length === 0 || !purchase_cart.products){
        throw new Error({status: 'error', message: 'The cart is empty'})
    }
    const cart_products = Object.values(purchase_cart.products)
    const productsToUpdate = [];
    for (const prod of cart_products) {
        const product = await product_repository.getProductById(prod.product.id);

        if (!product) {
            productsToUpdate.push({id: product.id, status: 'No process', message: 'Product not found' });
            continue;
        }

        if (prod.quantity > product.stock) {
            productsToUpdate.push({id: product.id, status: 'No process', title: product.title ,message: 'There is not enough stock' });
            continue;
        }

        product.quantity = product.stock - prod.quantity
        productsToUpdate.push({id: product._id, status: 'success', newStock: product.quantity, amount: product.price, quantity: prod.quantity});
    }

    const successProducts = productsToUpdate.filter(prod => prod.status === 'success')
    if(successProducts.length === 0){
        throw new Error({status: 'error', message: 'No item could be purchased, there is no stock or they do not exist'})
    }

    const noProcessProducts = productsToUpdate.filter(prod => prod.status === 'No process')
    
    for (const prod of successProducts) {
        try{
            await product_repository.updateProduct(prod.id, {stock: prod.newStock})
            await cart_repository.deleteProductInCart(cid, prod.id)
        } catch(error){
            return new Error({error: error.message})
        }
    }
    
    const newTicket = ticketProcess(email, successProducts)
    try {
        const successTicket = await ticket_mgr.createTicket(newTicket)
        res.status(200).send({status: 'success', message: 'The purchase was made successfully!', ticket: successTicket, noProcessProducts})
    } catch (error) {
        req.logger.error(error)
        return new Error({status: 'fail', error: error.message})
    }
}