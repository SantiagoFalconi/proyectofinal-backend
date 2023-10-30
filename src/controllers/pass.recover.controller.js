import { pass_recover_repo } from '../repositories/index.js'
import { createHash, isTheOldPassword } from '../utils.js'
import { userRepository } from '../repositories/index.js'

const user_repository = userRepository
const pass_recover = pass_recover_repo

export const sendEmail = async (req, res) => {
    const email = req.params.email
    if(!email){
        throw new Error('An email is needed to recover the password')
    }
    try{
        await pass_recover.sendEmail(email)
        res.status(200).send({message: 'Email sent'})
    } catch(error){
        res.status(400).send({error: error.message})
    }
}

export const validateNewPassword = async (req, res, next) => {
    const user = user_repository.getUserByEmail(req.email) 
    const { new_password } = req.body
    if (isTheOldPassword(user.password, new_password)) return ({ message: `You can't use the old password` })
    next()
}

export const hashPassword = async (req, res, next) => {
    const { new_password } = req.body
    const hashedPassword = createHash(new_password[0])
    req.data = hashedPassword
    next()
}
