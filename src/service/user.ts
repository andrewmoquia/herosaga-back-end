import passport from 'passport'
import { IMongoUser } from '../utilities/interfaces'
import { createJWTToken } from '../service/jwt'
import User from '../model/user'
import bcryptjs from 'bcryptjs'

export const endUserSession = (res: any, req: any, msg: any) => {
   res.clearCookie('jwt')
   req.logout()
   res.status(200).send({ status: 200, message: msg })
   return res.end()
}

export const resSendMsg = (res: any, stat: number, msg: any) => {
   res.status(200).send({ status: stat, message: msg })
   return res.end()
}

export const authenticateLogin = (req: any, res: any, next: any) => {
   passport.authenticate('local', { session: false }, (err: Error, user: IMongoUser, info) => {
      if (err) return next(err)
      if (info) return resSendMsg(res, 400, info.message)
      if (!user) return resSendMsg(res, 500, 'Something went wrong!')

      const payload = {
         id: user._id,
         username: user.username,
         email: user.email,
         expires: Date.now() + parseInt('1000000'),
      }
      const token = createJWTToken(payload)

      req.logIn(payload, { session: false }, (err: any) => {
         if (err) return resSendMsg(res, 500, err)
         if (user.isVerified) {
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict', secure: true })
            return resSendMsg(res, 200, 'Successfully login!')
         }
         if (!user.isVerified) {
            res.status(200).send({
               status: 401,
               message: 'You need to verify your account first!',
               jwt: `${token}`,
            })
            return res.end()
         }
      })
   })(req, res, next)
}

export const findUserRegistration = async (res: any, data: any) => {
   const { username, email } = data
   const user = await User.findOne({ $or: [{ username }, { email }] })
   return user.username === username
      ? resSendMsg(res, 400, 'Username taken!')
      : user.email === email
      ? resSendMsg(res, 400, 'Email is already registered!')
      : 'proceed'
}

export const checkPasswordRegistration = (res: any, data: any) => {
   const { email, username, password, confirmPassword } = data
   return !email || !username || !password || !confirmPassword
      ? resSendMsg(res, 400, 'All fields required')
      : password != confirmPassword
      ? resSendMsg(res, 400, "Password don't match.")
      : 'proceed'
}

export const addUserToDatabase = (res: any, data: any) => {
   const { email, username, password } = data
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
               return resSendMsg(res, 200, 'Account successfully created.')
            })
         } catch (error) {
            if (error) {
               return resSendMsg(res, 500, error)
            }
         }
      })
   })
}
