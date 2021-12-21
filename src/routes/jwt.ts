import { Router } from 'express'
import { csrfAuth } from '../service/csrf'
import { getRefreshToken } from '../controller/jwt'

const router = Router()

router.get('/jwt/refresh-token', csrfAuth, getRefreshToken)

export default router
