import nodeMailer from 'nodemailer'

export const transporer = nodeMailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'heartweb09@gmail.com',
      pass: 'heartweb123',
   },
})
