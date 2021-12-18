import { endUserSession, resSendMsg, authenticateLogin } from '../service/user'

export const loginUser = (req: any, res: any, next: any) => {
   try {
      authenticateLogin(req, res, next)
   } catch (err) {
      if (err) return resSendMsg(res, 500, err)
   }
}

export const logoutUser = (req: any, res: any) => {
   try {
      return endUserSession(res, req, 'Successfully logout!')
   } catch (err) {
      if (err) return resSendMsg(res, 500, err)
   }
}

export const checkLoggedUser = (req: any, res: any) => {
   try {
      return endUserSession(res, req, 'User is not verified.')
   } catch (err) {
      if (err) return resSendMsg(res, 500, err)
   }
}
