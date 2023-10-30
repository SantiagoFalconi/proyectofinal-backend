import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import { default as jwt } from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PRIVATE_KEY = "GecciaKey";

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)
export const isTheOldPassword = (old_password, new_password) => bcrypt.compareSync(old_password, new_password)
export const tokenValidate = (req, res, next) => {
    try {
        const token = req.params.token
        jwt.verify(token, PRIVATE_KEY)
        const data = jwt.decode(token)
        req.email = data.email
        next()
    } catch (e){
        if(e.name === "TokenExpiredError"){
            return res.render('regenerateEmail', {email: req.params.email})
        }

        throw new Error(`There was an error validating the token ${e.message}`)
    }
}


export default __dirname;