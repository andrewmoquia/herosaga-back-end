import { createNFT } from '../service/nft.create'
import { sellNFTOnMarketplace, buyNFTOnMarketplace } from '../service/nft.marketplace'
import { asyncWrapper } from '../middleware/async'

export const mintNFT = asyncWrapper(async (req: any, res: any, next: any) => {
   return await createNFT(req, res, next)
})

export const sellNFT = asyncWrapper(async (req: any, res: any) => {
   return await sellNFTOnMarketplace(req, res)
})

export const buyNFT = asyncWrapper(async (req: any, res: any) => {
   return await buyNFTOnMarketplace(req, res)
})
