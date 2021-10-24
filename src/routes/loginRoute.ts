import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { IMongoUser } from '../interfaces'
import { loginLimiter } from '../limiter'
import { parseForm, csrfAuthenticate } from '../csrfToken'
import { authenticateJWT } from '../passportSetup'

const router = Router()

router.post('/login', loginLimiter, parseForm, csrfAuthenticate, (req, res, next) => {
   try {
      passport.authenticate('local', { session: false }, (error: Error, user: IMongoUser, info) => {
         if (error) return next(error)
         if (info) return res.status(200).send(info)
         if (!user) return res.status(200).send({ status: 500, message: 'Something went wrong!' })

         const payload = {
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            expires: Date.now() + parseInt('1000000'),
         }

         req.login(payload, { session: false }, (err) => {
            if (err) res.status(200).send({ status: 500, message: err })
            const token = jwt.sign(JSON.stringify(payload), 'secret')
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict', secure: true })
            if (user.isVerified)
               res.status(200).send({ status: 200, message: 'Successfully login!' })
            if (!user.isVerified)
               res.status(200).send({
                  status: 401,
                  message: 'You need to verify your account first!',
               })
         })
      })(req, res, next)
   } catch (error) {
      if (error) throw error
   }
})

router.get('/logout', (req, res) => {
   try {
      res.clearCookie('jwt')
      req.logout()
      res.status(200).send({ status: 200, message: 'Successfully logout!' })
   } catch (error) {
      if (error) throw error
   }
})

router.get('/check-logged-in-user', authenticateJWT, (req, res) => {
   try {
      res.clearCookie('jwt')
      req.logout()
      res.status(200).send({ status: 401, message: 'User is not verified.' })
   } catch (error) {
      if (error) throw error
   }
})

export default router
