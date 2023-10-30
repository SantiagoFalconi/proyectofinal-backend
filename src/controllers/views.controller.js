import { io } from '../app.js'
import productsModel from '../dao/models/products.model.js'
import { productsRepository, messagesRepository, userRepository, cartsRepository } from '../repositories/index.js'

const messages_repository = messagesRepository
const product_repository = productsRepository
const users_repository = userRepository
const cart_repository = cartsRepository

export const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products');
    next();
}

export const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/api/session/login');
    next();
}

export const productsView = async (req, res) => {
    try {
        const user = req.session.user
        const { page } = req.query
        const products = await productsModel.paginate(
            {},
            {
                limit: 3,
                lean: true,
                page: page ?? 1
            }
    )
    res.render('productsPage', { products, user })
    } catch (error) {
        req.logger.error(error)
        res.status(400).send(error.message)
    }
}

export const productByIdView = async (req, res) => {
    try {
        const { pid } = req.params
        const product = await product_repository.getProductById(pid)
        const prod = product.toObject()
        res.render('product', { product: prod })
    } catch (error) {
        req.logger.error(error)
        res.status(400).send(error.message)
    }
}

export const realTimeProducts = async (req, res) => {
    const cartId = req.user.user.cart
    const products = await product_repository.getProducts();
    res.render('realTimeProducts', { products, cartId })
}

export const myCart = async (req, res) => {
    const { cid } = req.params
    const cartById = await cart_repository.getCartsById(cid);
    const prods = cartById.products.toObject()
    res.render('cart', { prods })
}

export const registerView = async (req, res) => {
    res.render('register')
}

export const loginView = async (req, res) => {
    res.render('login')
}

export const logoutView = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            req.logger.error(err)
            return res.status(500).send({status: 'error', error: `Couldn't logout: ${err.message}`})
        } 
        res.redirect('/api/session/login')
    })
}

export const chat = async (req, res) => {
    io.on('connection', (socket) => {
        socket.on('message', async (data) => {
            socket.emit('')
            await messages_repository.addMessage(data)
            const messages = await messages_repository.getMessages();
            io.emit('messageLogs', messages)
        })
        socket.on('authenticated', (data) => {
            socket.broadcast.emit('newUserConnected', data)
        })
    })
    res.render('chat', {})
}

export const adminDashboard = async (req, res) => {
    const users = await users_repository.getAll()
    res.render('adminBoard', { users })
}