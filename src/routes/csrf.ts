import csrf from 'csurf'
import { Router } from 'express'

const router = Router()

//Setup csrf route middleware
export const csrfAuthenticate = csrf({
   cookie: {
      key: 'a.s',
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      maxAge: 60 * 30, //30 minutes
   },
})

router.get('/getToken', csrfAuthenticate, (req, res) => {
   try {
      res.send(req.csrfToken())
      return res.end()
   } catch (error) {
      if (error) throw error
      return res.end()
   }
})

export default router
