import { createNFT } from '../service/nft.create'
import * as srvc from '../service/nft.marketplace'
import { asyncWrapper } from '../middleware/async'
import { searchNFTForSale, sendUsersNFT } from '../service/nft'

export const mintNFT = asyncWrapper(async (req: any, res: any, next: any) => {
   return await createNFT(req, res, next)
})

export const sellNFT = asyncWrapper(async (req: any, res: any, next: any) => {
   return await srvc.sellNFTOnMarketplace(req, res, next)
})

export const buyNFT = asyncWrapper(async (req: any, res: any, next: any) => {
   return await srvc.buyNFTOnMarketplace(req, res, next)
})

export const cancelSell = asyncWrapper(async (req: any, res: any, next: any) => {
   return await srvc.cancelSellOfNFT(req, res, next)
})

export const getAllNFT = asyncWrapper(async (req: any, res: any, next: any) => {
   return searchNFTForSale(req, res, next)
})

export const getAllUserNFT = async (req: any, res: any, next: any) => {
   return sendUsersNFT(req, res, next)
}
