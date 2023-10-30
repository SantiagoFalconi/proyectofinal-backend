import { Router } from 'express'
import { getLogs } from '../controllers/logger.controller.js'

const router = Router();

router.get('/', getLogs)

export default router;