import nodeMailer from 'nodemailer'

export const transporer = nodeMailer.createTransport({
   host: 'smtp.gmail.com',
   port: 578,
   service: 'gmail',
   requireTLS: true,
   name: 'incumons.heroku.app',
   auth: {
      user: 'heartweb09@gmail.com',
      pass: 'heartweb123',
   },
   from: 'no-reply@gmail.com',
})
