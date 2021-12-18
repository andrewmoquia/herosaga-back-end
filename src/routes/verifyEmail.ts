import nodeMailer from 'nodemailer'
import { Router } from 'express'
import { authenticateJWTLogin } from '../service/passportSetup'
import jwtDecode from 'jwt-decode'
import jwt from 'jsonwebtoken'
import User from '../model/user'

const router = Router()

const transporer = nodeMailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'heartweb09@gmail.com',
      pass: 'heartweb123',
   },
})

const secret = 'asdasdadawad3471984787d8sda'

router.get('/verify/email', authenticateJWTLogin, async (req, res) => {
   //Get the jwt cookie with user's info from the user's web browser
   const jwtCookie = req.cookies.jwt
   //Decode the cookie
   const decodedJwt: any = jwtDecode(jwtCookie)
   //Create jwt cookie with user's email address
   const payload = {
      email: `${decodedJwt.email}`,
      expires: Date.now() + parseInt('1000000'),
   }
   const emailToken = jwt.sign(JSON.stringify(payload), secret)
   const url = `http://localhost:3000/verify/account/${emailToken}`
   //Send the new jwt cookie to the email of the user
   try {
      const sendEmail = await transporer.sendMail({
         from: 'heartweb09@gmail.com',
         to: `${decodedJwt.email}`,
         subject: 'Confirm Email',
         html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      })
      if (sendEmail) {
         res.status(200).send({
            status: 200,
            message: 'Verification sent! Check your email inbox or spam folder.',
         })
         return res.end()
      }
   } catch (error) {
      res.status(200).send({
         status: 500,
         message: 'Something went wrong from the server. Try again later.',
      })
      return res.end()
   }
})

router.get('/verify/email/:token', async (req, res) => {
   const token = req.params.token
   const verify: any = jwt.verify(token, secret)

   if (verify?.expires > Date.now()) {
      const user = await User.findOneAndUpdate({ email: verify?.email }, { isVerified: true })
      if (!user) {
         res.status(200).send({ status: 500, message: 'Something went wrong. Try again later.' })
         return res.end()
      }
      if (user) {
         res.status(200).send({
            status: 200,
            message: 'Account verified. You can now login. Redirecting to login page...',
         })
         return res.end()
      }
   } else {
      res.status(200).send({ status: 400, message: 'Link expired. Try again.' })
      return res.end()
   }
})

export default router
