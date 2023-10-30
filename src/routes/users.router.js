import { Router } from 'express'
import passport from 'passport'
import { changeUserRole, deleteUser, getUserByEmail, getAll, deleteInactiveUsers } from '../controllers/users.controller.js'
import { UsersController } from '../controllers/users.controller.js';
import { isAdmin } from '../controllers/sessions.controller.js';
import uploader from '../utils/multer.js'

const router = Router();

const usersController = new UsersController();

router.get('/', getAll)

router.get('/:email', getUserByEmail)

router.put('/premium/:uid', passport.authenticate('current', { session: false }), isAdmin, changeUserRole)

router.post('/:uid/products', uploader('products').array('documents'), async (req, res) => {
    const { uid } = req.params;
    const user = await usersController.updateUserDocuments(uid, req.files);
    res.send( { messege: 'User products updated', user });
}); 

router.post('/:uid/profiles', uploader('profiles').array('documents'), async (req, res) => {
    const { uid } = req.params;
    const user = await usersController.updateUserDocuments(uid, req.files);
    res.send( { messege: 'User profile updated', user });
}); 

router.post('/:uid/documents', uploader('documents').array('documents'), async (req, res) => {
    const { uid } = req.params;
    const user = await usersController.updateUserDocuments(uid, req.files);
    res.send( { messege: 'User documents updated', user });
}); 
router.delete('/delete/:uid', passport.authenticate('current', { session: false }), deleteUser)

router.delete('/deleteInactiveUsers', passport.authenticate('current', { session: false }), isAdmin, deleteInactiveUsers)

export default router;