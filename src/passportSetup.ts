import User from './user'
import bcryptjs from 'bcryptjs'
import passportLocal from 'passport-local'
import passport from 'passport'
import passportJWT from 'passport-jwt'

const LocalStrategy = passportLocal.Strategy

const JWTStrategy = passportJWT.Strategy

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
               return done(null, false, { status: 200, message: 'Invalid username or password!' })
            const passwordMatch = await bcryptjs.compare(password, user.password)
            if (passwordMatch) return done(null, user)
            if (!passwordMatch)
               return done(null, false, { status: 200, message: 'Invalid username or password!' })
         } catch (error) {
            return done(error)
         }
      }
   )
)

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

export const authenticateJWT = (req: any, res: any, next: any) => {
   passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) return next(err)
      if (info) return res.status(200).send({ status: 400, message: 'Invalid credentials.' })
      if (user.isVerified)
         return res.status(200).send({
            status: 200,
            message: 'Successfully login!',
            user: {
               username: user.username,
               email: user.email,
            },
         })
      if (!user.isVerified) return next()
      if (!user)
         return res
            .status(200)
            .send({ status: 500, message: 'Something went wrong. Try again later.' })
   })(req, res, next)
}
