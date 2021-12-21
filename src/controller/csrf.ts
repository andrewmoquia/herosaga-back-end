import { resSendServerErrorMsg } from '../service/user'
import { sendCSRFToken } from '../service/csrf'

export const createCSRFToken = async (req: any, res: any) => {
   try {
      return await sendCSRFToken(req, res)
   } catch (err) {
      if (err) throw err
      return await resSendServerErrorMsg(res, err)
   }
}
