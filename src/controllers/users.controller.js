import { userRepository } from '../repositories/index.js'
import userDTO from '../dao/dtos/user.dto.js'
import { sendEmail } from '../utils/sendEmails.js'
import { UserMongoMgr } from '../dao/managers/user.mongo.js'
import { io } from '../app.js'

const user_repository = userRepository

export const getAll = async (req, res) => {
    try {
        const users = await user_repository.getAll()
        const users_dto = users.map(user => {
            return new userDTO(user._doc)
        })
        res.status(200).send({ payload: "successfully", users_dto })
    } catch (error) {
        res.status(400).send({ payload: "Error", error: error.message })
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params
        const user = await user_repository.getUserByEmail(email)
        res.status(200).send({ payload: "successfully", user })
    } catch (error) {
        res.status(400).send({ payload: "Error", error: error.message })
    }
}

export const addCartToUser = async (req, res) => {
    try {
        const { id, email } = req
        if (!id || !email) throw new Error("id or email missing")

        const user = await user_repository.addCartToUser(id, email)
        res.status(200).send({ payload: "successfully", user })
    } catch (error) {
        res.status(400).send({ payload: "Error", error: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { email, data } = req
        const result = await user_repository.updateUser(email, data)
        res.status(200).send({ payload: "successfully", result })
    } catch (error) {
        res.status(400).send({ payload: "Error", error: error.message })
    }
}

export const changeUserRole = async (req, res) => {
    try {
        const { uid } = req.params
        const user = await user_repository.getUserById(uid)
        const { email } = user._doc
        const { role } = user._doc
        let roleChangeTo = 'user'

        if (role === 'admin') return res.status(400).send({ payload: "Error", message: "You cannot change the role of an admin" })
        if (role === 'user') {
            const requiredDocuments = ['id', 'adress', 'account state']
            const userDocuments = user.documents || []
            const hasAllDocuments = requiredDocuments.every(requiredDoc => {
                return userDocuments.some(userDocument => userDocument.name.includes(requiredDoc))
            })
            if (!hasAllDocuments) return res.status(400).send({ payload: "Error", message: "You do not have the necessary documents to change role to premium" })
            roleChangeTo = 'premium';
        }

        await user_repository.updateUser(email, { role: roleChangeTo })
        return res.status(200).send({ payload: "success", message: `The role was changed to ${roleChangeTo} correctly.` })
    } catch (error) {
        return res.status(400).send({ payload: "Error", error: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params
        if (!uid) res.status(400).send({ payload: "Error", message: "An id is required to delete a user" })
        user_repository.deleteUser(uid)
        io.emit('adminBoard')
        res.status(204).send({ payload: "Success", message: "The user was deleted" })
    } catch (error) {
        res.status(400).send({ payload: "Error", error: error.message })
    }
}

export const deleteInactiveUsers = async (req, res) => {
    try {
        const today = new Date()
        today.setDate(today.getDate() - 2)
        const twoDaysBefore = today.toISOString();
        const inactiveUsers = await user_repository.getInactiveUsers(twoDaysBefore)
        if (!inactiveUsers) res.status(404).send({ payload: "Not Found", message: "There are no inactive users" })
        const { acknowledged, deletedCount } = await user_repository.deleteInactiveUsers(twoDaysBefore)
        if (!acknowledged) res.status(400).send({ payload: "Error", message: "There was an error trying to delete inactive users" })
        inactiveUsers.map(user => {
            const { email } = user
            const subject = 'Account Inactive'
            const message = 'Your account has been deleted due to inactivity'
            sendEmail(email, subject, message)
        })

        res.status(200).send({ payload: "Success", message: `${deletedCount} inactive users were removed` })
    } catch (error) {
        res.status(400).send({ payload: "Error", error: error.message })
    }
}

export class UsersController {

    usersManager;

    constructor(){
        this.usersManager = new UserMongoMgr()
    }

    async updateUserDocuments (id, files){
        try {
            const user = await this.usersManager.getUserByID(id)
            const documents = user.documents || [];
            const newDocuments = [...documents,...files.map(file => ({name: file.originalname, referece: file.path}))];
            return await user.updateOne({ documents : newDocuments});
        } catch (e) {
            res.json({ error: e});
        }
    }
}

export const setLastConnection = async (req, res, next) => {
    const { email } = req.session.req.body
    await user_repository.setLastConnection(email)
    next();
}