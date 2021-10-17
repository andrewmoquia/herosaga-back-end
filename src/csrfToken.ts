import csrf from 'csurf'
import bodyParser from 'body-parser'

export const parseForm = bodyParser.urlencoded({extended: false})

//Setup csrf route middleware
export const csrfMainToken = csrf({ cookie: {
    key: 'a.s',
    sameSite: 'none',
    secure: false,
    httpOnly: false,
    maxAge: 60 * 30 //30 minutes
}})

//Setup csrf route middleware
export const csrfLoginToken = csrf({ cookie: {
    key: 'l.t',
    sameSite: 'none',
    secure: false,
    httpOnly: false,
    maxAge: 60 * 30 //30 minutes
}})