import { Router } from 'express'
import User from '../model/user'
import bcryptjs from 'bcryptjs'
import { csrfAuthenticate } from './csrf'
import { registerLimit } from '../utilities/limiter'

const router = Router()

//Handle registration process
router.post('/register', registerLimit, csrfAuthenticate, async (req, res) => {
   const { email, username, password, confirmPassword } = req.body
   //Return if has missing credentials
   if (!email || !username || !password || !confirmPassword) {
      res.send({ status: 400, message: 'All fields required' })
      return res.end()
   }
   //Return if password is not same as confirm password
   if (password != confirmPassword) {
      res.send({ status: 400, message: "Password don't match." })
      return res.end()
   }
   try {
      //Find user in the database return if existing
      const user = await User.findOne({ $or: [{ username: username }, { email: email }] })
      if (user.username === username) {
         res.status(200).send({ status: 400, message: 'Username taken!' })
         return res.end()
      }
      if (user.email === email) {
         res.status(200).send({ status: 400, message: 'Email is already registered!' })
         return res.end()
      }
   } catch (error) {
      //Generate a salt.
      bcryptjs.genSalt(12, (err, salt) => {
         if (err) throw err
         //Hash the password.
         bcryptjs.hash(password, salt, async (err, hash) => {
            if (err) throw err
            try {
               //Create new user in the database
               const newUser = await new User({
                  username,
                  email,
                  password: hash,
                  provider: 'email',
               })
               newUser.save((err: any) => {
                  if (err) throw err
                  res.status(200).send({
                     status: 200,
                     message: 'Account successfully created.',
                  })
                  return res.end()
               })
            } catch (error) {
               if (error) {
                  res.status(200).send({
                     status: 500,
                     message: 'Something went wrong. Try again later',
                  })
                  return res.end()
               }
            }
         })
      })
   }
})

export default router
