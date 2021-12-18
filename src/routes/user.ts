import { Router } from 'express'
import { authenticateJWTLogin } from '../service/passportSetup'
import * as cntrl from '../controller/user'
import { csrfAuthenticate } from '../utilities/csrf'
import * as limiter from '../utilities/limiter'

const router = Router()

router.post('/login', limiter.login, csrfAuthenticate, cntrl.loginUser)
router.get('/logout', cntrl.logoutUser)
router.get('/check-logged-in-user', authenticateJWTLogin, cntrl.checkLoggedUser)

router.post('/register', limiter.registerLimit, csrfAuthenticate, cntrl.registerUser)

export default router
