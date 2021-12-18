import * as srvc from '../service/user'

export const loginUser = (req: any, res: any, next: any) => {
   try {
      srvc.authenticateLogin(req, res, next)
   } catch (err) {
      if (err) return srvc.resSendMsg(res, 500, err)
   }
}

export const logoutUser = (req: any, res: any) => {
   try {
      srvc.endUserSession(res, req, 'Successfully logout!')
   } catch (err) {
      if (err) return srvc.resSendMsg(res, 500, err)
   }
}

export const checkLoggedUser = (req: any, res: any) => {
   try {
      srvc.endUserSession(res, req, 'User is not verified.')
   } catch (err) {
      if (err) return srvc.resSendMsg(res, 500, err)
   }
}

export const registerUser = (req: any, res: any) => {
   try {
      srvc.findAndRegisterUser(res, req.body)
   } catch (err) {
      if (err) return srvc.resSendMsg(res, 500, err)
   }
}

export const sendVerifURLToEmail = (req: any, res: any) => {
   try {
      srvc.createUrlVerifToken(req, res)
   } catch (err) {
      if (err) return srvc.resSendMsg(res, 500, err)
   }
}

export const verifyUser = (req: any, res: any) => {
   try {
      srvc.updateVerifyStatOfUser(res, req.params.token)
   } catch (err) {
      if (err) return srvc.resSendMsg(res, 500, err)
   }
}
