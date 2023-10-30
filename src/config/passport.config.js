import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { default as token } from 'jsonwebtoken'
import userService from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'

const PRIVATE_KEY = "GecciaKey";
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const localStrategy = local.Strategy;

const GITHUB_CLIENTID = `Iv1.aab353ee24213197`
const GITHUB_CLIENTSECRET = `8a4c4503b86d47071b849a0df302b3cedfbcc723`
const GITHUB_CALLBACKURL = `http://localhost:8080/login/githubcallback`

export const generateToken = user => token.sign({ user },PRIVATE_KEY, { expiresIn: '1d' })

const initializePassport = () => {
    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('register', new localStrategy({
        usernameField: 'email',
        passReqToCallback: true,
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, dob, role } = req.body
        try {
            let user = await userService.findOne({ email })
            if (user) return done(null, false, { message: 'The email already exists' })
            const newUser = {
                first_name,
                last_name,
                email,
                dob,
                password: createHash(password),
                role
            }
            user = await userService.create(newUser)
            
            return done(null, user)
        } catch (error) {
            return done({ message: `There was an error creating the user: ${error.message}` })
        }
    }));

    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userService.findOne({ email: username })

            if (!user) return done(null, false, { message: `The user doesn't exist` })
            if (!isValidPassword(user, password)) return done(null, false, { message: `The email and password do not match` })

            const { password: pass, _id, __v, ...userNoPass } = user._doc
            const jwt = generateToken(userNoPass)

            return done(null, jwt)
        } catch (error) {
            return done({ error: `Error login user: ${error}` })
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: GITHUB_CLIENTID,
        clientSecret: GITHUB_CLIENTSECRET,
        callbackURL: GITHUB_CALLBACKURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.findOne({ email: profile._json.email })
            const newUser = {
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                dob: '',
                password: ''
            }
            user = await userService.create(newUser)
            return done(null, user)
        } catch (error) {
            return done({ error: `Error creating user via github: ${error.message}` })
        }
    }));

    passport.serializeUser((user, done) => {
        try {
            done(null, user._id)
        } catch (error) {
            done({ error: error.message })
        }
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.findById(id)
            done(null, user)
        } catch (error) {
            done({ error: error.message })
        }
    });
}


const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        return token = req?.cookies['coderCookieToken']
    }
    return token
}

export default initializePassport;