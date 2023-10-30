import { Router } from 'express'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { current, failLogin, failRegister, login, logout, register } from '../controllers/sessions.controller.js'
import { setLastConnection } from '../controllers/users.controller.js'

const router = Router();
router.use(cookieParser())

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), register)
router.get('/failregister', failRegister)
router.post('/login', passport.authenticate('login', { session: false, failureRedirect: '/api/session/faillogin' }), setLastConnection, login)
router.get('/faillogin', failLogin)
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/api/session/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
})
router.get('/logout', setLastConnection, logout)
router.get('/current', passport.authenticate('current', { session: false }), current)

export default router;
