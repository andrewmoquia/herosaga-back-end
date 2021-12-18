import csrf from 'csurf'

//Setup csrf route middleware
export const csrfAuthenticate = csrf({
   cookie: {
      key: 'a.s',
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      maxAge: 60 * 30, //30 minutes
   },
})
