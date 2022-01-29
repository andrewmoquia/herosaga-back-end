import passport from 'passport'
import { IMongoUser } from '../utilities/interfaces'
import { createJWTToken, decodeJWT, verifyToken } from '../service/jwt'
import User from '../model/user'
import bcryptjs from 'bcryptjs'
import { transporer } from '../utilities/transporter'
import { RequestHandler } from 'express'
import Transaction from '../model/transaction'
import { mintBoxData } from '../utilities/mintBoxData'
import { navMenuLogoData } from '../utilities/navMenuLogoData'
import { userNFTfilterData, marketFilterData } from '../utilities/filtersData'
import {
   filterBrightness,
   spriteBg,
   heroesData,
   starStyleOnRoulette,
} from '../utilities/heroesDataCSS'

export const saveCookieForVerification = async (res: any, req: any, user: any) => {
   const payload = {
      email: user.email,
      purpose: 'Request for user verification',
      expires: Date.now() + parseInt('100000000000'),
   }
   const token = createJWTToken(payload)
   await req.logIn(payload, { session: false }, (err: any) => {
      if (err) return resSendMsg(res, 500, err)
      if (!user.isVerified) {
         res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
            domain: 'incumons.herokuapp.com',
         })
         return resSendMsg(res, 200, 'Successfully sent request token!')
      }
   })
}

export const endUserSession = (res: any, req: any, msg: any) => {
   res.cookie('jwt', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      domain: 'incumons.herokuapp.com',
   })
   res.send({
      status: 200,
      message: msg,
   })
   return res.end()
}

export const resSendMsg = (res: any, stat: number, msg: any) => {
   res.status(200).send({ status: stat, message: msg })
   return res.end()
}

export const resSendServerErrorMsg = (res: any, err: any) => {
   if (err) throw err
   return resSendMsg(res, 500, 'Server error! Please try again later.')
}

export const findUserByID = async (res: any, _id: any) => {
   const user = await User.findOne({ _id })
   return user ? user : resSendMsg(res, 400, 'User does not exist!')
}

export const findUserByUsername = async (res: any, username: any) => {
   const user = await User.findOne({ username })
   return user ? user : resSendMsg(res, 400, 'User does not exist!')
}

export const startUserSession = async (req: any, res: any) => {
   const decodedJWT: any = await decodeJWT(req.cookies.jwt)
   const foundUser = await findUserByID(res, decodedJWT.id)
   const user = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      balance: foundUser.balance,
   }
   res.status(200).send({
      status: 200,
      message: 'Successfully login!',
      user,
      mintBoxData,
      navMenuLogoData,
      starStyleOnRoulette,
      filterBrightness,
      spriteBg,
      heroesData,
      userNFTfilterData,
      marketFilterData,
   })
   return res.end()
}

export const reqLoginUser = async (req: any, res: any, payload: any, user: any) => {
   const token = createJWTToken(payload)
   await req.logIn(payload, { session: false }, (err: any) => {
      if (err) return resSendMsg(res, 500, err)
      if (user.isVerified) {
         res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            path: '/',
            domain: 'incumons.herokuapp.com',
         })
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
}

export const authenticateLogin = async (req: any, res: any, next: any) => {
   await passport.authenticate(
      'local',
      { session: false },
      async (err: Error, user: IMongoUser, info) => {
         if (err) return next(err)
         if (info) return resSendMsg(res, 400, info.message)
         if (!user) return resSendMsg(res, 500, 'Something went wrong!')
         const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            purpose: 'Login User',
            expires: Date.now() + parseInt('100000000000'),
         }
         reqLoginUser(req, res, payload, user)
      }
   )(req, res, next)
}

export const addUserToDatabase = (res: any, data: any) => {
   const { email, username, password } = data
   bcryptjs.genSalt(12, (err, salt) => {
      if (err) throw err
      bcryptjs.hash(password, salt, async (err, hash) => {
         if (err) throw err
         const newUser = await new User({
            username,
            email,
            password: hash,
            provider: 'email',
         })
         return await newUser.save((err: any) => {
            if (err) throw err
            return resSendMsg(res, 200, 'Account successfully created.')
         })
      })
   })
}

export const findUserRegistration = async (res: any, data: any) => {
   const { username, email } = data
   const user = await User.findOne({ $or: [{ username }, { email }] })
   return user === null
      ? addUserToDatabase(res, data)
      : user && user.username === username
      ? resSendMsg(res, 400, 'Username taken!')
      : user && user.email === email
      ? resSendMsg(res, 400, 'Email is already registered!')
      : resSendMsg(res, 500, 'Something went wrong. Try again later.')
}

export const findAndRegisterUser = async (res: any, data: any) => {
   const { email, username, password, confirmPassword } = data
   return !email || !username || !password || !confirmPassword
      ? resSendMsg(res, 400, 'All fields required')
      : password != confirmPassword
      ? resSendMsg(res, 400, "Password don't match.")
      : await findUserRegistration(res, data)
}

export const sendURLToEmail = async (res: any, verificationURL: any, msg: any, userEmail: any) => {
   const sendEmail = await transporer.sendMail({
      from: 'heartweb09@gmail.com',
      to: `${userEmail}`,
      subject: `${msg[3]}`,
      html: `${msg[1]}: <a href="${verificationURL}">${verificationURL}</a>`,
   })
   return sendEmail ? resSendMsg(res, 200, msg[2]) : resSendMsg(res, 500, 'Something went wrong!')
}

export const createUrlVerifToken = async (req: any, res: any) => {
   try {
      const decodedJwt: any = await decodeJWT(req.cookies.jwt)
      const payload = {
         email: `${decodedJwt.email}`,
         purpose: 'Account Verification',
         expires: Date.now() + parseInt('1000000'),
      }
      const emailToken = createJWTToken(payload)
      const url = `https://incumons.netlify.app/verify/account/${emailToken}`
      const msg = {
         1: 'Please click this to confirm your email',
         2: 'Verification sent! Check your email inbox or spam folder.',
         3: 'Verify your account.',
      }
      return await sendURLToEmail(res, url, msg, decodedJwt.email)
   } catch (err) {
      resSendMsg(res, 200, 'Invalid request.')
   }
}

export const updateVerifyStatOfUser = async (res: any, token: any) => {
   const jwtToken: any = verifyToken(token)
   if (jwtToken.expires > Date.now() && jwtToken.purpose === 'Account Verification') {
      const user = await User.findOneAndUpdate({ email: jwtToken?.email }, { isVerified: true })
      return !user
         ? resSendMsg(res, 500, 'Something went wrong. Try again later.')
         : resSendMsg(res, 200, 'Account verified. You can now login. Redirecting to login page...')
   } else {
      return resSendMsg(res, 400, 'Link expired. Try again.')
   }
}

export const createResetPwLink = async (res: any, payload: any, userEmail: any) => {
   const emailToken = createJWTToken(payload)
   const url = `https://incumons.netlify.app/reset/password/${emailToken}`
   const msg = {
      1: 'Please click this to reset your password',
      2: 'Forgot password request sent! Check your email inbox or spam folder.',
      3: 'Reset Password Request',
   }
   await sendURLToEmail(res, url, msg, userEmail)
}

export const sendResetLinkToEmail = async (req: any, res: any) => {
   const { username } = req.body
   const user: any = await findUserByUsername(res, username)
   if (user) {
      const payload = {
         email: `${user.email}`,
         purpose: 'Password Reset',
         expires: Date.now() + parseInt('1000000'),
      }
      return await createResetPwLink(res, payload, user.email)
   }
}

export const processResetUserPassword = (res: any, password: any, vrfiedToken: any) => {
   bcryptjs.genSalt(12, (err, salt) => {
      if (err) throw err
      bcryptjs.hash(password, salt, async (err, hash) => {
         if (err) throw err
         const user = await User.findOneAndUpdate({ email: vrfiedToken?.email }, { password: hash })
         return user
            ? resSendMsg(res, 200, 'Password successfully reset.')
            : resSendMsg(res, 500, 'Something went wrong. Try again later.')
      })
   })
}

export const resetUserPassword = async (req: any, res: any) => {
   const { password, confirmPassword } = req.body
   const vrfiedToken: any = verifyToken(req.params.token)
   return password !== confirmPassword
      ? resSendMsg(res, 400, "Password don't match!")
      : password === confirmPassword &&
        vrfiedToken.expires > Date.now() &&
        vrfiedToken.purpose === 'Password Reset'
      ? processResetUserPassword(res, password, vrfiedToken)
      : resSendMsg(res, 400, 'Link expired. Try again.')
}

export const sendUserTransaction: RequestHandler = async (req, res, next) => {
   try {
      const user: any = decodeJWT(req.cookies.jwt)
      const { createdAt, isCompleted, page, transaction }: any = req.query
      const queryObject: any = {
         recipientID: user.id,
      }
      const resData: any = {}
      const pageLimit = 9
      let defaultPage = 1
      const defaultCreatedAt = -1
      const defaultIsCompleted = -1
      let createdAtSortOrder: any = -1
      let isCompletedSortOrder: any = -1

      if (createdAt) {
         if (createdAt.charAt(0) != '-') {
            createdAtSortOrder = 1
         }
      }
      if (isCompleted) {
         if (isCompleted.charAt(0) != '-') {
            isCompletedSortOrder = 1
         }
      }
      if (transaction) {
         queryObject.transaction = transaction
      }
      if (page) {
         defaultPage = (page - 1) * pageLimit
      }

      console.time('Finding all transactions speed')
      await Transaction.aggregate([
         { $match: queryObject },
         {
            $sort: {
               createdAt: createdAtSortOrder || defaultCreatedAt,
               isCompleted: isCompletedSortOrder || defaultIsCompleted,
            },
         },
         { $skip: defaultPage },
         { $limit: pageLimit },
      ])
         .then((respond) => {
            resData.transacsHits = respond.length
            resData.transacs = respond
            resData.page = page
         })
         .catch((err) => {
            if (err) {
               res.status(200).send({
                  status: 500,
                  message: 'Something went wrong! Please try again later.',
               })
               res.end()
            }
         })
      console.timeEnd('Finding all transactions speed')

      console.time('Counting all transactions speed')
      await Transaction.aggregate([{ $match: queryObject }])
         .count('recipientID')
         .then((respond) => {
            resData.transacsTotal = respond[0].recipientID
            resData.totalPage = Math.ceil(resData.transacsTotal / pageLimit)
         })
         .catch((err) => {
            if (err) {
               res.status(200).send({
                  status: 204,
                  message: 'No transactions found.',
               })
               return res.end()
            }
            return
         })
      console.timeEnd('Counting all transactions speed')

      res.status(200).send({ status: 200, payload: { ...resData } })
      return res.end()
   } catch (err) {
      return next(err)
   }
}

export const changeUserPassword = async (req: any, res: any) => {
   const { password, newPw, confirmNewPw } = req.body
   const checkPwValidation = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,32}$'
   )
   //Check if new password is valid
   if (!checkPwValidation.test(newPw)) {
      return resSendMsg(res, 400, 'New password is weak.')
   }
   //Check if new password is match with confirm password
   if (newPw !== confirmNewPw) {
      return resSendMsg(res, 400, "Confirm password and old password don't match.")
   }
   //Proceed to change user password
   const decodedJWT: any = decodeJWT(req.cookies.jwt)
   const user = await User.findById(decodedJWT.id)
   if (user) {
      const matchPassword: any = await bcryptjs.compare(password, user.password)
      if (matchPassword) {
         bcryptjs.genSalt(12, (err, salt) => {
            if (err) resSendMsg(res, 500, 'Something went wrong. Please try again later.')
            bcryptjs.hash(newPw, salt, async (err, hash) => {
               if (err) resSendMsg(res, 500, 'Something went wrong. Please try again later.')
               const updateUser = await user.updateOne({
                  password: hash,
               })
               return updateUser
                  ? resSendMsg(res, 200, 'Successfully changed password.')
                  : resSendMsg(res, 500, 'Something went wrong. Please try again later.')
            })
         })
      } else {
         resSendMsg(res, 400, 'Wrong old password.')
      }
   } else {
      resSendMsg(res, 500, 'Something went wrong. Please try again later.')
   }
}

export const checkUserBalance = async (req: any, res: any) => {
   try {
      const decodedJWT: any = await decodeJWT(req.cookies.jwt)
      const user = await findUserByID(res, decodedJWT.id)
      res.status(200).send({
         status: 200,
         balance: user.balance,
      })
      return res.end()
   } catch (err) {
      if (err) return resSendMsg(res, 500, 'Something went wrong. Please try again later.')
   }
}
