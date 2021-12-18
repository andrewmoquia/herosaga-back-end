import { Router } from 'express'
import { authenticateJWTLogin } from '../service/passportSetup'
import * as cntrl from '../controller/user'
import { csrfAuthenticate } from '../utilities/csrf'
import * as limiter from '../utilities/limiter'

const router = Router()

//Routes for login and logout
router.post('/login', limiter.login, csrfAuthenticate, cntrl.loginUser)
router.get('/logout', cntrl.logoutUser)
router.get('/check-logged-in-user', authenticateJWTLogin, cntrl.checkLoggedUser)

//Routes for registration
router.post('/register', limiter.registerLimit, csrfAuthenticate, cntrl.registerUser)

//Routes for verifying user
router.get('/verify/email', authenticateJWTLogin, cntrl.sendVerifURLToEmail)
router.get('/verify/email/:token', csrfAuthenticate, cntrl.verifyUser)

export default router
