import csrf from 'csurf'

//Setup csrf route middleware
export const csrfAuth = csrf({
   cookie: {
      key: 'a.s',
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      maxAge: 60 * 30, //10 minutes
   },
})

export const sendCSRFToken = (req: any, res: any) => {
   res.send(req.csrfToken())
   return res.end()
}
