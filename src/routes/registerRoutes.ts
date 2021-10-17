import { Router } from 'express'
import User from '../user'
import bcryptjs from 'bcryptjs'
import { csrfMainToken, parseForm } from '../csrfToken'

const router = Router()

router.get('/signup', csrfMainToken, (req, res) => {
    res.send(req.csrfToken())
})

router.post('/signup', parseForm,  csrfMainToken, (req, res)=> {
    const {email, username, password, confirmPassword} = req.body;
    if(!email || !username || !password || !confirmPassword) {
        res.send({message: 'All field required', csrfToken: req.csrfToken()})
    } else if (password != confirmPassword) {
        res.send({message: 'Password don\' match.', csrfToken: req.csrfToken()})
    } else {
        // res.send({message: 'All credentials are valid.', csrfToken: req.csrfToken()})
        User.findOne({$or: [{username: username}, {email: email}]}, (err: any, data: any) => {
            if(err) throw err
            if(data) {
                res.send({message: 'User exist already.', csrfToken: req.csrfToken()})
            } else {
                //Generate a salt.
                bcryptjs.genSalt(12, (err, salt) => {
                    if(err) throw err
                    //Hash the password.
                    bcryptjs.hash(password, salt, (err, hash) => {
                        if(err) throw err
                        const newUser = new User({
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