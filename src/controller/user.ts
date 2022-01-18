import * as srvc from '../service/user'
import { resSendMsg } from '../service/user'

export const loginUser = async (req: any, res: any, next: any) => {
   try {
      return await srvc.authenticateLogin(req, res, next)
   } catch (err) {
      return await srvc.resSendServerErrorMsg(res, err)
   }
}

export const logoutUser = async (req: any, res: any) => {
   try {
      return await srvc.endUserSession(res, req, 'Successfully logout!')
   } catch (err) {
      return await srvc.resSendServerErrorMsg(res, err)
   }
}

export const checkLoggedUser = async (req: any, res: any) => {
   try {
      return await srvc.startUserSession(req, res)
   } catch (err) {
      return await srvc.resSendServerErrorMsg(res, err)
   }
}

export const registerUser = async (req: any, res: any) => {
   try {
      return await srvc.findAndRegisterUser(res, req.body)
   } catch (err) {
      return await srvc.resSendServerErrorMsg(res, err)
   }
}

export const sendVerifURLToEmail = async (req: any, res: any) => {
   try {
      return await srvc.createUrlVerifToken(req, res)
   } catch (err) {
      return await srvc.resSendServerErrorMsg(res, err)
   }
}

export const verifyUser = async (req: any, res: any) => {
   try {
      return await srvc.updateVerifyStatOfUser(res, req.params.token)
   } catch (err) {
      return await srvc.resSendServerErrorMsg(res, err)
   }
}

export const forgotPassword = async (req: any, res: any) => {
   try {
      return await srvc.sendResetLinkToEmail(req, res)
   } catch (err) {
      return await srvc.resSendServerErrorMsg(res, err)
   }
}

export const resetPassword = async (req: any, res: any) => {
   try {
      return await srvc.resetUserPassword(req, res)
   } catch (err) {
      return await srvc.resSendServerErrorMsg(res, err)
   }
}

export const getUserTransaction = async (req: any, res: any, next: any) => {
   try {
      return srvc.sendUserTransaction(req, res, next)
   } catch (err) {
      return await srvc.resSendServerErrorMsg(res, err)
   }
}

export const changePassword = async (req: any, res: any) => {
   try {
      return await srvc.changeUserPassword(req, res)
   } catch (err) {
      if (err) resSendMsg(res, 500, 'Something went wrong. Please try again later')
   }
}
