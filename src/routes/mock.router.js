import { Router } from 'express'
import { generateProducts } from '../controllers/mockProduct.controller.js'

const router = Router();

router.get('/', generateProducts)

export default router;