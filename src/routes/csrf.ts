import { Router } from 'express'
import { createCSRFToken } from '../controller/csrf'
import { csrfAuth } from '../service/csrf'

const router = Router()

router.get('/getToken', csrfAuth, createCSRFToken)

export default router
