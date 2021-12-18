import { Router } from 'express'
import { authenticateJWT } from '../service/passportSetup'
import * as lgnCntrl from '../controller/user'
import { csrfAuthenticate } from '../utilities/csrf'
import * as limiter from '../utilities/limiter'

const router = Router()

router.post('/login', limiter.login, csrfAuthenticate, lgnCntrl.loginUser)
router.get('/logout', lgnCntrl.logoutUser)
router.get('/check-logged-in-user', authenticateJWT, lgnCntrl.checkLoggedUser)

export default router
