import { Router } from 'express'
import { csrfMainToken, parseForm } from './csrfToken'

const router = Router()

router.get('/token', csrfMainToken, (req, res) => {
    res.send(req.csrfToken())
})

router.post('/token', parseForm, csrfMainToken, (req, res) => {
    res.status(200).send('Valid request.')
    res.end()
})

export default router
