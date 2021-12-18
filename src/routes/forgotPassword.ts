import nodeMailer from 'nodemailer'
import { Router } from 'express'
import { csrfAuthenticate } from './csrf'
import jwt from 'jsonwebtoken'
import User from '../model/user'
import bcryptjs from 'bcryptjs'
import { forgotPasswordLimit } from '../utilities/limiter'

const router = Router()

const transporer = nodeMailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'heartweb09@gmail.com',
      pass: 'heartweb123',
   },
})

const secret = 'asdasdadawad3471984787d8sda'

//Handle generation of request url for changing of password
router.post('/forgot-password', csrfAuthenticate, async (req, res) => {
   const { username } = req.body
   //Find the username in the database
   const user = await User.findOne({ username: username }).exec()
   if (!user) {
      res.status(200).send({ status: 400, message: 'User does not exist!' })
      return res.end()
   }
   if (user) {
      //Create jwt token with one minute expiration
      const payload = {
         email: `${user.email}`,
         expires: Date.now() + parseInt('1000000'),
      }
      const emailToken = jwt.sign(JSON.stringify(payload), secret)
      //Create the private url to reset the password
      const url = `http://localhost:3000/reset/password/${emailToken}`
      //Send the private url to the user's email
      try {
         const sendEmail = await transporer.sendMail({
            from: 'heartweb09@gmail.com',
            to: `${user.email}`,
            subject: 'Reset Password',
            html: `Please click this to reset your password: <a href="${url}">${url}</a>`,
         })
         if (sendEmail) {
            res.status(200).send({ status: 200, message: 'Forgot password request sent!' })
            return res.end()
         }
         if (!sendEmail) {
            res.status(200).send({
               status: 500,
               message: 'Something went wrong from the server. Try again later.',
            })
            return res.end()
         }
      } catch (error) {
         if (error) throw error
      }
   }
})

//Handle changing of password in the database
router.post('/reset/password/:token', forgotPasswordLimit, csrfAuthenticate, async (req, res) => {
   const token = req.params.token
   //Verify the jwt token
   try {
      const verify: any = jwt.verify(token, secret)
      const { password, confirmPassword } = req.body
      if (password !== confirmPassword) {
         res.status(200).send({ status: 400, message: "Password don't match!" })
         return res.end()
      }
      if (password === confirmPassword && verify?.expires > Date.now()) {
         bcryptjs.genSalt(12, (err, salt) => {
            if (err) throw err
            //Hash the password.
            bcryptjs.hash(password, salt, async (err, hash) => {
               if (err) throw err
               //Update the user's password in the database
               const user = await User.findOneAndUpdate(
                  { email: verify?.email },
                  { password: hash }
               )
               if (!user) {
                  res.status(200).send({
                     status: 500,
                     message: 'Something went wrong. Try again later.',
                  })
                  return res.end()
               }
               if (user) {
                  res.status(200).send({ status: 200, message: 'Password successfully reset.' })
                  return res.end()
               }
            })
         })
      } else {
         res.status(200).send({ status: 400, message: 'Link expired. Try again.' })
         return res.end()
      }
   } catch (error) {
      res.status(200).send({ status: 403, message: error })
      return res.end()
   }
})

export default router
