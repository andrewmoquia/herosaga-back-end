import nodeMailer from 'nodemailer'

export const transporer = nodeMailer.createTransport({
   service: 'gmail',
   name: 'incumons.heroku.app',
   auth: {
      user: 'heartweb09@gmail.com',
      pass: 'heartweb123',
   },
})
