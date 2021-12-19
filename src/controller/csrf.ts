import { resSendMsg } from '../service/user'
import { sendCSRFToken } from '../service/csrf'

export const createCSRFToken = (req: any, res: any) => {
   try {
      sendCSRFToken(req, res)
   } catch (error) {
      if (error) throw error
      return resSendMsg(res, 500, 'Something went wrong! Please try again later.')
   }
}
