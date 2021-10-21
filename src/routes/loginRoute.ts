import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { IMongoUser } from '../interfaces'
import { loginLimiter } from '../limiter'
import { parseForm, csrfAuthenticate} from '../csrfToken'

const router = Router()

router.post('/login', parseForm, csrfAuthenticate, loginLimiter,  (req, res, next) => {
    try {
        passport.authenticate('local', {session: false}, (error: Error, user: IMongoUser, info) => {
        if (error) return next(error)
        if(info) return res.status(200).send(info)
        if (!user) return res.status(200).send({message: "Something went wrong!"})

        const payload = {
            email: user.email,
            expires: Date.now() + parseInt('1000000')
        }
        
        req.login(payload, { session: false }, (err) => {
            if (err) return res.status(200).send({message: err})
            
            const token = jwt.sign(JSON.stringify(payload), 'secret')

            res.cookie('jwt', token, {httpOnly: true, sameSite: 'strict', secure: true})
            return res.status(200).send({message: 'Successfully login!'})
        })
    })(req, res, next)
    } catch (error) {
        if(error) throw error
    }
})

router.get('/logout', (req, res) => {
    try {
        res.clearCookie("jwt");
        req.logout()
        res.status(200).send({message: 'Successfully logout!'})
    } catch (error) {
        if(error) throw error
    }
})

export default router