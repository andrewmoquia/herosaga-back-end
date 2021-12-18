import { Router } from 'express'
import { authenticateJWTLogin } from '../service/passportSetup'
import * as cntrl from '../controller/user'
import { csrfAuthenticate } from '../utilities/csrf'
import * as lmtr from '../utilities/limiter'

const router = Router()

//Routes for login and logout
router.post('/login', lmtr.login, csrfAuthenticate, cntrl.loginUser)
router.get('/logout', cntrl.logoutUser)
router.get('/check-logged-in-user', authenticateJWTLogin, cntrl.checkLoggedUser)

//Routes for registration
router.post('/register', lmtr.registerLimit, csrfAuthenticate, cntrl.registerUser)

//Routes for verifying user
router.get('/verify/email', authenticateJWTLogin, cntrl.sendVerifURLToEmail)
router.get('/verify/email/:token', csrfAuthenticate, cntrl.verifyUser)

//TO-DO: Refractor forgot pw routes
router.post('/forgot-password', csrfAuthenticate, cntrl.forgotPassword)
router.post('/reset/password/:token', lmtr.forgotPW, csrfAuthenticate, cntrl.resetPassword)

export default router
