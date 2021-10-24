import nodeMailer from 'nodemailer'
import { Router } from 'express'
import { csrfAuthenticate, parseForm } from '../csrfToken'
import jwt from 'jsonwebtoken'
import User from '../user'
import bcryptjs from 'bcryptjs'
import { forgotPasswordLimit } from '../limiter'

const router = Router()

const transporer = nodeMailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'heartweb09@gmail.com',
      pass: 'heartweb123',
   },
})

const secret = 'asdasdadawad3471984787d8sda'

router.post('/forgot-password', parseForm, csrfAuthenticate, async (req, res) => {
   const { username } = req.body
   const user = await User.findOne({ username: username }).exec()
   if (!user) res.status(200).send({ status: 400, message: 'User does nose exist!' })
   if (user) {
      const payload = {
         email: `${user.email}`,
         expires: Date.now() + parseInt('1000000'),
      }
      const emailToken = jwt.sign(JSON.stringify(payload), secret)

      const url = `http://localhost:3000/reset-password/${emailToken}`

      try {
         const sendEmail = await transporer.sendMail({
            from: 'heartweb09@gmail.com',
            to: `${user.email}`,
            subject: 'Reset Password',
            html: `Please click this to reset your password: <a href="${url}">${url}</a>`,
         })
         if (sendEmail) res.status(200).send({ message: 'Forgot password request sent!' })
         if (!sendEmail)
            res.status(200).send({
               message: 'Something went wrong from the server. Try again later.',
            })
      } catch (error) {
         if (error) throw error
      }
   }
})

router.post(
   '/forgot-password/:token',
   forgotPasswordLimit,
   parseForm,
   csrfAuthenticate,
   async (req, res) => {
      const token = req.params.token
      const verify: any = jwt.verify(token, secret)

      const { password, confirmPassword } = req.body

      if (password !== confirmPassword)
         res.status(200).send({ status: 400, message: "Password don't match!" })

      if (password === confirmPassword && verify?.expires > Date.now()) {
         bcryptjs.genSalt(12, (err, salt) => {
            if (err) throw err
            //Hash the password.
            bcryptjs.hash(password, salt, async (err, hash) => {
               if (err) throw err
               const user = await User.findOneAndUpdate(
                  { email: verify?.email },
                  { password: hash }
               )
               if (!user)
                  res.status(200).send({
                     status: 300,
                     message: 'Something went wrong. Try again later.',
                  })
               if (user)
                  res.status(200).send({ status: 200, message: 'Password successfully reset.' })
            })
         })
      } else {
         res.status(200).send({ message: 'Link expired. Try again.' })
      }
   }
)

export default router
