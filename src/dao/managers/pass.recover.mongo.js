import env from '../../config/config.js'
import { default as token } from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport(env.mailing);

const PRIVATE_KEY = "GecciaKey";

export class pass_recover_mongo{
    async sendEmail(email){
        const jwt = this.createJwt(email)
        try {
            transport.sendMail({
                from: `Coder test <${env.mailing.auth.user}>`,
                to: email,
                subject: 'Reset Password',
                html: ` <h1>To reset your password click on "Reset Password"</h1>
                        <hr>
                        <button><a href="http://localhost:${env.PORT}/password_recover/${jwt}">Reset Password</button>`,
            });
        } catch (error) {
            res.json({error: error})
        }
    }

    createJwt(email){
        return token.sign({ email }, PRIVATE_KEY, { expiresIn: '1h' })
    }
}