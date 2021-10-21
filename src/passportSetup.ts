import User from './user'
import bcryptjs from 'bcryptjs'
import passportLocal from 'passport-local'
import passport from 'passport'
import { Router } from 'express'
import passportJWT from 'passport-jwt'

const router = Router()

const LocalStrategy = passportLocal.Strategy

const JWTStrategy = passportJWT.Strategy

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
    try {
        const user = await User.findOne({email: email}).exec()
        if(!user) return done(null, false, { message: "Invalid username or password!" })
        const passwordMatch = await bcryptjs.compare(password, user.password)
        if(passwordMatch) return done(null, user)
        if(!passwordMatch) return done(null, false, { message: "Invalid username or password!" })
    } catch (error) {
        return done(error)
    }
}))

// passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
//     try {
//         User.findOne({email: email}, (err: any, user: any) => {
//             if(err) throw err
//             if(!user) return done(null, false, { message: "Invalid username or password!" })
//             bcryptjs.compare(password, user.password, (err, result) => {
//                 if(err) throw err
//                 if(!result) return done(null, false, { message: "Invalid username or password!" })
//                 if(result) return done(null, user)
//             })
//         })
//     } catch (error) {
//          return done(error)
//     }
    
// }))

passport.use( new JWTStrategy({
        jwtFromRequest: (req: any) => req.cookies.jwt,
        secretOrKey: 'secret',
    },
    (jwtPayload: any, done: any) => {
        if (Date.now() > jwtPayload.expires) return done('jwt expired')
        return done(null, jwtPayload)
    }
))

export const authenticateJWT = passport.authenticate('jwt', {session: false})