import * as srvc from '../service/user'

export const loginUser = (req: any, res: any, next: any) => {
   try {
      srvc.authenticateLogin(req, res, next)
   } catch (err) {
      srvc.resSendServerErrorMsg(res, err)
   }
}

export const logoutUser = (req: any, res: any) => {
   try {
      srvc.endUserSession(res, req, 'Successfully logout!')
   } catch (err) {
      srvc.resSendServerErrorMsg(res, err)
   }
}

export const checkLoggedUser = (req: any, res: any) => {
   try {
      srvc.endUserSession(res, req, 'User is not verified.')
   } catch (err) {
      srvc.resSendServerErrorMsg(res, err)
   }
}

export const registerUser = (req: any, res: any) => {
   try {
      srvc.findAndRegisterUser(res, req.body)
   } catch (err) {
      srvc.resSendServerErrorMsg(res, err)
   }
}

export const sendVerifURLToEmail = (req: any, res: any) => {
   try {
      srvc.createUrlVerifToken(req, res)
   } catch (err) {
      srvc.resSendServerErrorMsg(res, err)
   }
}

export const verifyUser = (req: any, res: any) => {
   try {
      srvc.updateVerifyStatOfUser(res, req.params.token)
   } catch (err) {
      srvc.resSendServerErrorMsg(res, err)
   }
}

export const forgotPassword = (req: any, res: any) => {
   try {
      srvc.sendResetLinkToEmail(req, res)
   } catch (err) {
      srvc.resSendServerErrorMsg(res, err)
   }
}

export const resetPassword = (req: any, res: any) => {
   try {
      srvc.resetUserPassword(req, res)
   } catch (err) {
      srvc.resSendServerErrorMsg(res, err)
   }
}
