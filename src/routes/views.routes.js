import { Router } from 'express'
import passport from 'passport'
import { productsView, productByIdView, loginView, logoutView, realTimeProducts, registerView, publicAccess, privateAccess, chat, adminDashboard, myCart } from '../controllers/views.controller.js'
import { isUser, isAdmin } from '../controllers/sessions.controller.js'

const router = Router();

router.get('/products', privateAccess, productsView)
router.get('/products/:pid', productByIdView)
router.get('/realtimeproducts', passport.authenticate('current', { session: false }), realTimeProducts)
router.get('/myCart/:cid', myCart)
router.get('/api/session/register', publicAccess, registerView)
router.get('/api/session/login', publicAccess, loginView)
router.get('/api/session/logout', logoutView)
router.get('/chat', passport.authenticate('current', { session: false }), isUser, chat)
router.get('/api/admin-dashboard', passport.authenticate('current', { session: false }), isAdmin, adminDashboard)

export default router;