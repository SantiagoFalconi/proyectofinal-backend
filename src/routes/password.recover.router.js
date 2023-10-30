import { Router } from 'express'
import { validateNewPassword, sendEmail } from '../controllers/pass.recover.controller.js'
import { tokenValidate } from '../utils.js'
import { updateUser } from '../controllers/users.controller.js'

const router = Router();

router.get('/send_email/:email', sendEmail)

router.get('/:token', tokenValidate, (req, res) => {
    res.render('restorePassword', {token: req.params.token})
})

router.post('/password_change/:token', tokenValidate, validateNewPassword, updateUser)

export default router