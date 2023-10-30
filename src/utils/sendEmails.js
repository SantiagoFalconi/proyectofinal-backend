import env from '../config/config.js'
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport(env.mailing);

export const sendEmail = (email, subject, html) => {
    try {
        transport.sendMail({
            from: `From <${env.mailing.auth.user}>`,
            to: email,
            subject: subject,
            html: ` <h1>${html}</h1>`,
        });
    } catch (error) {
        res.json({error: error})
    }
}