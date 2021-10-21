import { Router } from 'express'
import User from '../user'
import bcryptjs from 'bcryptjs'
import { csrfAuthenticate, parseForm } from '../csrfToken'

const router = Router()

router.get('/signup', csrfAuthenticate, (req, res) => {
    res.send(req.csrfToken())
})

router.post('/signup', parseForm,  csrfAuthenticate, (req, res)=> {
    const {email, username, password, confirmPassword} = req.body;
    if(!email || !username || !password || !confirmPassword) {
        res.send({message: 'All field required', csrfToken: req.csrfToken()})
    } else if (password != confirmPassword) {
        res.send({message: 'Password don\'t match.', csrfToken: req.csrfToken()})
    } else {
        User.findOne({$or: [{username: username}, {email: email}]}, (err: any, data: any) => {
            if (err) throw err
            if (data) res.send({message: 'User exist already.', csrfToken: req.csrfToken()})
            if (!data) {
                //Generate a salt.
                bcryptjs.genSalt(12, (err, salt) => {
                    if(err) throw err
                    //Hash the password.
                    bcryptjs.hash(password, salt, (err, hash) => {
                        if(err) throw err
                        new User({
                            username,
                            email,
                            password: hash,
                            googleId: null,
                            provider: 'email'
                             //Save user in db.
                        }).save((err: any, data: any) => {
                            if(err) throw err
                            //Redirect user to login page.
                            res.redirect('/login')
                        })
                    })
                })
            }
        })
    }
})

export default router