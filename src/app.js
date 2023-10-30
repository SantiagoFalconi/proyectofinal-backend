import express from "express";
import handlebars from 'express-handlebars'
import mongoose from "mongoose";
import __dirname from './utils.js'
import { Server } from 'socket.io'
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import routes from './routes/index.js'
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { addLogger } from "./utils/logger.js";
import env from "./config/config.js"

const PORT = env.PORT || 8080;
const app = express();
const MONGO = `mongodb+srv://sfalconi:geccia@cluster0.j9zkkpu.mongodb.net/ecommerce`
const serverMongo = app.listen(8080, () => {console.log(`Server is listening on port ${PORT}`)})
mongoose.connect(MONGO, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

export const io = new Server(serverMongo)

app.use(express.static(__dirname+'/public'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: "GecciaSecret",
    resave: false,
    saveUninitialized: false
}))

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Geccia',
            description: 'Documentacion API Ecommerce CoderHouse'
        }
    },
    apis:[`./src/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)

initializePassport();
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(addLogger)
app.use('/', routes)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

