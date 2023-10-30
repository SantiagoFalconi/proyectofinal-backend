import { Router } from 'express'
import passport from 'passport'
import { addProduct, deleteProduct, getProductById, pagination, updateProduct } from '../controllers/products.controller.js'
import { isAdminOrPremium } from '../controllers/sessions.controller.js'
import errorHandlebar from '../errors/index.js'

const router = Router();

router.get('/:limit?/:page?/:sort?', pagination)
router.get('/:pid', getProductById)
router.post('/', passport.authenticate('current', { session: false }), isAdminOrPremium, addProduct, errorHandlebar)
router.put('/:pid', passport.authenticate('current', { session: false }), isAdminOrPremium, updateProduct)
router.delete('/:pid', passport.authenticate('current', { session: false }), isAdminOrPremium, deleteProduct)

export default router;