import nodeMailer from 'nodemailer'
import { Router } from 'express'
import { authenticateJWT } from '../passportSetup'
import jwtDecode from 'jwt-decode'
import jwt from 'jsonwebtoken'
import User from '../user'

const router = Router()

const transporer = nodeMailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'heartweb09@gmail.com',
      pass: 'heartweb123',
   },
})

const secret = 'asdasdadawad3471984787d8sda'

router.get('/verify/email', authenticateJWT, async (req, res) => {
   const jwtCookie = req.cookies.jwt
   const decodedJwt: any = jwtDecode(jwtCookie)

   console.log(decodedJwt)

   const payload = {
      email: `${decodedJwt.email}`,
      expires: Date.now() + parseInt('1000000'),
   }

   const emailToken = jwt.sign(JSON.stringify(payload), secret)

   const url = `http://localhost:5000/verify/email/${emailToken}`

   try {
      const sendEmail = await transporer.sendMail({
         from: 'heartweb09@gmail.com',
         to: `${decodedJwt.email}`,
         subject: 'Confirm Email',
         html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      })
      if (sendEmail) res.status(200).send({ status: 200, message: 'Verification sent!' })
      if (!sendEmail)
         res.status(200).send({
            status: 500,
            message: 'Something went wrong from the server. Try again later.',
         })
   } catch (error) {
      if (error) throw error
   }
})

router.get('/verify/email/:token', async (req, res) => {
   const token = req.params.token
   const verify: any = jwt.verify(token, secret)

   if (verify?.expires > Date.now()) {
      const user = await User.findOneAndUpdate({ email: verify?.email }, { isVerified: true })
      if (!user)
         res.status(200).send({ status: 500, message: 'Something went wrong. Try again later.' })
      if (user) res.redirect('http://localhost:3000/login')
   } else {
      res.status(200).send({ status: 400, message: 'Link expired. Try again.' })
   }
})

export default router
