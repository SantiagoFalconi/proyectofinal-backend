import userDTO from '../dao/dtos/user.dto.js'
import { productsRepository, userRepository } from '../repositories/index.js'

const product_repository = productsRepository
const users_repository = userRepository

export const register = async (req, res) => {
    res.status(201).send({ status: 'success', message: "The user has been registered", payload: req.body})
}

export const failRegister = async (req, res) => {
    res.status(400).send({ status: 'error', error: 'There was an error registering the user' })
}

export const login = async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'error', message: 'Invalid credentials' })
    res.cookie('coderCookieToken', req.user, { httpOnly: true }).send({ status: "success", message: "cookie set" })
}

export const failLogin = async (req, res) => {
res.status(401).send({ status: "error", error: 'failed Login', message: res.message })
}

export const logout = async (req, res) => {
    req.session.destroy(err => {
        if (!err){
            req.logger.error(err)
            res.redirect('/api/session/login')
        } else res.send({ status: 'Logout ERROR', body: err })
        
    })
}

export const current = async (req, res) => {
    const currentUser = new userDTO(req.user.user)
    res.status(200).send({currentUser: currentUser})
}

export const isOwnCart = async (req, res, next) => {
    const { cid, pid } = req.params
    const { role, email } = req.user.user
    const user = await users_repository.getUserByEmail(email)

    if (!user._doc.cart){
        throw new Error("The user does not have a cart created")
    }

    const cartId = user._doc.cart.toString()

    if(cartId !== cid){
        req.logger.warning('You dont have permissions')
        throw new Error("The product cannot be added because the cart is not your own")
    }

    const product = await product_repository.getProductById(pid)

    if(role === 'premium' && product._doc.owner.createdBy !== email){
        req.logger.warning('You dont have permissions')
        throw new Error("You cannot add your own products to the cart")
    }

    next()
}

export const isOwnProduct = async (req, res) => {
    const { email } = req.user.user
    const { pid } = req.params
    if(!pid) res.status(400).send("A product id is required")

    const prod = await product_repository.getProductById(pid)
    const owner_email = prod._doc.owner.createdBy
    if(email === owner_email){
        return true
    }
    req.logger.warning('You dont have permissions')
    res.status(400).send("The product cannot be added because the product is not your own")
}   

export const isAdmin = async (req, res, next) => {
    if(req.user.user.role === 'admin'){
        return next();
    }
    req.logger.warning('Not admin / no permissions')
    res.status(403).send("You do not have enough permissions")
}

export const isPremium = async (req, res, next) => {
    if(req.user.user.role === 'premium'){
        return next();
    }
    req.logger.warning('Not premium / no permissions')
    res.status(403).send("You do not have enough permissions")
}

export const isUser = async (req, res, next) => {
    if(req.user.user.role === 'user'){
        return next();
    }
    req.logger.warning('Not a user / does not have user permissions')
    res.status(403).send("You do not have user permissions to perform this action")
}

export const isUserOrPremium = async (req, res, next) => {
    if(req.user.user.role === 'user' || req.user.user.role === 'premium'){
        return next();
    }
    req.logger.warning('You are not a user or premium / you do not have user permissions')
    res.status(403).send("You do not have user permissions to perform this action")
}

export const isAdminOrPremium = async (req, res, next) => {
    if (req.user.user.role === 'admin'){
        return next()
    }

    if (req.user.user.role === 'premium'){
        if(await isOwnProduct(req, res)){
            return next()
        }
    }
    req.logger.warning('You dont have permissions')
    res.status(400).send("The product cannot be deleted because the product is not your own or you do not have sufficient permissions")
}