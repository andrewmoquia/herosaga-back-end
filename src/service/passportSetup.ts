import User from '../model/user'
import bcryptjs from 'bcryptjs'
import passportLocal from 'passport-local'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import { config } from '../utilities/config'
import { resSendMsg } from './user'
const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy

//TO-DO: Attach user's password hash to the jwt.
//If the user password has been changed, revoked the jwt validation.
//Add refresh token to validate user actions aside from session token.

//Use Local Stategy to authenticate the user's credentials
passport.use(
   new LocalStrategy(
      {
         usernameField: 'username',
         passwordField: 'password',
      },
      async (username, password, done) => {
         try {
            const user = await User.findOne({ username: username }).exec()
            if (user) {
               const passwordMatch = await bcryptjs.compare(password, user.password)
               return passwordMatch
                  ? done(null, user)
                  : done(null, false, { status: 400, message: 'Invalid username or password!' })
            } else {
               return done(null, false, { status: 400, message: 'Invalid username or password!' })
            }
         } catch (err) {
            return done(err)
         }
      }
   )
)

//Use JWT to verify the user's session validity
passport.use(
   new JWTStrategy(
      {
         jwtFromRequest: (req: any) => req.cookies.jwt,
         secretOrKey: `${config.JWT_SECRET}`,
      },
      (jwtPayload: any, done: any) => {
         return Date.now() > jwtPayload.expires && jwtPayload.purpose === 'Login User'
            ? done('jwt expired')
            : done(null, jwtPayload)
      }
   )
)

//Authenticate user's session using JWt
export const authenticateJWTLogin = (req: any, res: any, next: any) => {
   //This is session less meaning to stored session in database
   passport.authenticate('jwt', { session: false }, (err, user, info) => {
      const userData: any = {
         id: user.id,
         username: user.username,
         email: user.email,
      }
      return err
         ? next(err)
         : info
         ? resSendMsg(res, 400, 'Invalid credentials.')
         : user.isVerified
         ? res.status(200).send({ status: 200, message: 'Successfully login!', userData })
         : !user.isVerified
         ? next()
         : resSendMsg(res, 500, 'Something went wrong. Try again later.')
   })(req, res, next)
}
