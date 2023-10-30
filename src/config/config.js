import dotenv from 'dotenv'

dotenv.config()

export default {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    mailing: {
        service: process.env.MAIL_SERVICE,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAILING_USER,
            pass: process.env.MAILING_PASSWORD,
        },
    },
}