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
   const matchPw = srvc.checkPasswordRegistration(res, req.body)
   if (matchPw === 'proceed') {
      try {
         const user: any = srvc.findUserRegistration(res, req.body)
         if (user === 'proceed') {
            srvc.addUserToDatabase(res, req.body)
         }
      } catch (err) {
         if (err) return srvc.resSendMsg(res, 500, err)
      }
   }
}
