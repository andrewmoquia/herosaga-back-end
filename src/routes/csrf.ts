import { Router } from 'express'
import { csrfAuth } from '../service/csrf'
import { createCSRFToken } from '../controller/csrf'

const router = Router()

router.get('/getToken', csrfAuth, createCSRFToken)

export default router
