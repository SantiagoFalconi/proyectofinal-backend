import { Router } from 'express'
import viewsRouter from '../routes/views.routes.js'
import sessionRouter from '../routes/sessions.router.js'
import productsRouter from '../routes/products.router.js'
import cartsRouter from '../routes/carts.router.js'
import usersRouter from '../routes/users.router.js'
import mockRouter from '../routes/mock.router.js'
import loggerRouter from '../routes/logger.router.js'
import pass_recoverRouter from '../routes/password.recover.router.js'


const routes = Router()

routes.use('/api/session', sessionRouter)
routes.use('/api/products', productsRouter)
routes.use('/api/carts', cartsRouter)
routes.use('/api/users', usersRouter)
routes.use('/', viewsRouter)
routes.use('/mockingproducts', mockRouter)
routes.use('/loggerTest', loggerRouter)
routes.use('/password_recover', pass_recoverRouter)

export default routes;