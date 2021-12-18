import User from '../model/user'
import bcryptjs from 'bcryptjs'
import passportLocal from 'passport-local'
import passport from 'passport'
import passportJWT from 'passport-jwt'

const LocalStrategy = passportLocal.Strategy

const JWTStrategy = passportJWT.Strategy

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
            if (!user)
               return done(null, false, { status: 400, message: 'Invalid username or password!' })
            const passwordMatch = await bcryptjs.compare(password, user.password)
            if (passwordMatch) return done(null, user)
            if (!passwordMatch)
               return done(null, false, { status: 400, message: 'Invalid username or password!' })
         } catch (error) {
            return done(error)
         }
      }
   )
)

//Use JWT to verify the user's session validity
passport.use(
   new JWTStrategy(
      {
         jwtFromRequest: (req: any) => req.cookies.jwt,
         secretOrKey: 'secret',
      },
      (jwtPayload: any, done: any) => {
         if (Date.now() > jwtPayload.expires) return done('jwt expired')
         return done(null, jwtPayload)
      }
   )
)

//Authenticate user's session using JWt
export const authenticateJWTLogin = (req: any, res: any, next: any) => {
   //This is session less meaning to stored session in database
   passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) return next(err)
      if (info) return res.status(200).send({ status: 400, message: 'Invalid credentials.' })
      //If user is verified send the user's info
      if (user.isVerified)
         return res.status(200).send({
            status: 200,
            message: 'Successfully login!',
            user: {
               id: user.id,
               username: user.username,
               email: user.email,
            },
         })
      //If user is not yet verified proceed to the next arguments
      if (!user.isVerified) return next()
      if (!user)
         return res
            .status(200)
            .send({ status: 500, message: 'Something went wrong. Try again later.' })
   })(req, res, next)
}
