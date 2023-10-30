import DaoFactory from '../dao/factory/factory.js'
import CartsRepository from './carts.repository.js'
import ProductsRepository from './products.repository.js'
import UsersRepository from './users.repository.js'
import MessagesRepository from './messages.repository.js'
import Pass_recoverRepository from './pass.recover.repository.js'

const carts = DaoFactory.getCartDao()
const products = DaoFactory.getProductDao()
const user = DaoFactory.getUserDao()
const messages = DaoFactory.getMessageDao()
const pass_recover = DaoFactory.getPassRecover()

export const cartsRepository = new CartsRepository(carts)
export const productsRepository = new ProductsRepository(products)
export const userRepository = new UsersRepository(user)
export const messagesRepository = new MessagesRepository(messages)
export const pass_recover_repo = new Pass_recoverRepository(pass_recover)