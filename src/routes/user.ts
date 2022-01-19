import { Router } from 'express'
import { authenticateJWTLogin } from '../service/passportSetup'
import * as cntrl from '../controller/user'
// import { csrfAuth } from '../service/csrf'

const router = Router()

//Routes for login and logout
// router.post('/login', lmtr.login, csrfAuth, cntrl.loginUser)
router.put('/login', cntrl.loginUser)
router.get('/logout', cntrl.logoutUser)
router.get('/check-logged-in-user', authenticateJWTLogin, cntrl.checkLoggedUser)

//Routes for registration
router.post('/register', cntrl.registerUser)

//Routes for verifying user
router.get('/verify/email', cntrl.sendVerifURLToEmail)
router.get('/verify/email/:token', cntrl.verifyUser)

//Routes for forgot password reset
router.put('/forgot-password', cntrl.forgotPassword)
router.put('/reset/password/:token', cntrl.resetPassword)
router.put('/change/password', cntrl.changePassword)

router.get('/user/transactions/get-all', cntrl.getUserTransaction)
router.get('/user/balance', cntrl.getUserBalance)

export default router
