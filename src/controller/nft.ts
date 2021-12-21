import * as srvc from '../service/nft'
import { resSendServerErrorMsg } from '../service/user'

export const mintNFT = async (req: any, res: any) => {
   try {
      return await srvc.createNFT(req, res)
   } catch (err) {
      return await resSendServerErrorMsg(res, err)
   }
}
