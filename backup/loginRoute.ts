import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { IMongoUser } from '../src/utilities/interfaces'
import { login } from '../src/utilities/limiter'
import { csrfAuthenticate } from '../src/utilities/csrf'
import { authenticateJWT } from '../src/service/passportSetup'
import { endUserSession } from '../src/service/user'

const router = Router()

router.post('/login', login, csrfAuthenticate, (req, res, next) => {
   try {
      passport.authenticate('local', { session: false }, (error: Error, user: IMongoUser, info) => {
         if (error) return next(error)
         if (info) {
            res.status(200).send(info)
            return res.end()
         }
         if (!user) {
            res.status(200).send({ status: 500, message: 'Something went wrong!' })
            return res.end()
         }

         const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            expires: Date.now() + parseInt('1000000'),
         }

         req.logIn(payload, { session: false }, (err) => {
            if (err) {
               res.status(200).send({ status: 500, message: err })
               return res.end()
            }

            const token = jwt.sign(JSON.stringify(payload), 'secret')
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict', secure: true })

            if (user.isVerified) {
               res.status(200).send({ status: 200, message: 'Successfully login!' })
               return res.end()
            }
            if (!user.isVerified) {
               res.status(200).send({
                  status: 401,
                  message: 'You need to verify your account first!',
                  jwt: `${token}`,
               })
               return res.end()
            }
         })
      })(req, res, next)
   } catch (error) {
      if (error) throw error
   }
})

router.get('/logout', (req, res) => {
   try {
      return endUserSession(res, req, 'Successfully logout!')
   } catch (error) {
      if (error) return res.status(200).send({ msg: error }).end()
   }
})

router.get('/check-logged-in-user', authenticateJWT, (req, res) => {
   try {
      return endUserSession(res, req, 'User is not verified.')
   } catch (error) {
      if (error) return res.status(200).send({ msg: error }).end()
   }
})

export default router
