import passport from 'passport'
import { IMongoUser } from '../utilities/interfaces'
import { createJWTToken } from '../service/jwt'

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
         isVerified: user.isVerified,
         expires: Date.now() + parseInt('1000000'),
      }
      const token = createJWTToken(payload)

      req.logIn(payload, { session: false }, (err: any) => {
         if (err) return resSendMsg(res, 500, err)

         res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict', secure: true })
         if (user.isVerified) return resSendMsg(res, 200, 'Successfully login!')
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
