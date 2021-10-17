import User from '../user'
import bcryptjs from 'bcryptjs'
import passportLocal from 'passport-local'
import passport from 'passport'
import { Router } from 'express'
import { IMongoUser } from 'src/interfaces'

const router = Router()

const LocalStrategy = passportLocal.Strategy

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({email: email}, (err: any, user: any) => {
        if(err) throw err
        if(!user) return done(null, false, { message: "Invalid username or password!" })
        bcryptjs.compare(password, user.password, (err, result) => {
            if(err) throw err
            if(!result) return done(null, false, { message: "Invalid username or password!" })
            if(result) return done(null, user)
        })
    })
}))

router.post('/login',  (req, res, next) => {
    passport.authenticate('local',  (err: Error, user: IMongoUser, info) => {
        if (err) return next(err)
        if (info) return res.send(info)
        if (!user) return res.send({message: "Something went wrong!"})
        if(user) {
            req.logIn(user, { session: false }, async (err) => {
                if (err) return next(err)
            })
        } else {
            res.send({message: 'Account not authorized!'})
        }
        if(req.isAuthenticated()) {
            const user: any = req.user
            const userData = {
                id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                provider: user.provider,
                googleId: user.googleId
            }
            res.send(userData)
        } else {
            res.redirect('/login')
        }
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.session.destroy( (err) => {
        if(err) throw err
        res.send({message: 'Successfully logout!'})
    })
})

export default router