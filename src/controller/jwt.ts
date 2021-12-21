import { generateRefreshToken } from '../service/jwt'
import { resSendServerErrorMsg } from '../service/user'

export const getRefreshToken = async (req: any, res: any) => {
   try {
      return await generateRefreshToken()
   } catch (err) {
      return await resSendServerErrorMsg(res, err)
   }
}
