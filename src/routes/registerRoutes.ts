import { Router } from 'express'
import User from '../user'
import bcryptjs from 'bcryptjs'
import { csrfAuthenticate, parseForm } from '../csrfToken'
import { registerLimit } from '../limiter'

const router = Router()

router.post('/register', registerLimit, parseForm, csrfAuthenticate, async (req, res) => {
   const { email, username, password, confirmPassword } = req.body
   if (!email || !username || !password || !confirmPassword) {
      res.send({ status: 400, message: 'All field required' })
   } else if (password != confirmPassword) {
      res.send({ status: 400, message: "Password don't match." })
   } else {
      const user = await User.findOne({ $or: [{ username: username }, { email: email }] })
      if (user) res.status(200).send({ status: 400, message: 'User exist already!' })
      if (!user) {
         bcryptjs.genSalt(12, (err, salt) => {
            //Generate a salt.
            if (err) throw err
            //Hash the password.
            bcryptjs.hash(password, salt, async (err, hash) => {
               if (err) throw err
               const user = await new User({
                  username,
                  email,
                  password: hash,
                  googleId: null,
                  provider: 'email',
               })
               if (!user)
                  res.status(200).send({
                     status: 500,
                     message: 'Something went wrong. Try again later.',
                  })
               user.save((err: any) => {
                  if (err) throw err
                  res.status(200).send({ status: 200, message: 'Account successfully created.' })
               })
            })
         })
      }
   }
})

export default router
