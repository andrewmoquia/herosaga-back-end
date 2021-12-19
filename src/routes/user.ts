import { Router } from 'express'
import { authenticateJWTLogin } from '../service/passportSetup'
import * as cntrl from '../controller/user'
import { csrfAuth } from '../service/csrf'
import * as lmtr from '../utilities/limiter'

const router = Router()

//Routes for login and logout
router.post('/login', lmtr.login, csrfAuth, cntrl.loginUser)
router.get('/logout', cntrl.logoutUser)
router.get('/check-logged-in-user', authenticateJWTLogin, cntrl.checkLoggedUser)

//Routes for registration
router.post('/register', lmtr.registerLimit, csrfAuth, cntrl.registerUser)

//Routes for verifying user
router.get('/verify/email', authenticateJWTLogin, cntrl.sendVerifURLToEmail)
router.get('/verify/email/:token', csrfAuth, cntrl.verifyUser)

//Routes for forgot password reset
router.post('/forgot-password', csrfAuth, cntrl.forgotPassword)
router.post('/reset/password/:token', lmtr.forgotPW, csrfAuth, cntrl.resetPassword)

export default router
