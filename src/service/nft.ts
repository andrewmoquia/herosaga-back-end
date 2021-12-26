import { RequestHandler } from 'express'
import NFT from '../model/nft'
import { decodeJWT } from './jwt'

const operatorsMap: any = {
   '>': '$gt',
   '>=': '$gte',
   '=': '$eq',
   '<': '$lt',
   '<=': '$lte',
}

const regEx = /\b(<|>|>=|=|<|<=)\b/g

export const searchNFTForSale: RequestHandler = async (req, res, next) => {
   try {
      const { rarity, sort, name, priceFilter, limit, page }: any = req.query
      const queryObject: any = {
         isForSale: true,
      }
      if (rarity) {
         queryObject.rarity = rarity
      }
      if (name) {
         queryObject.name = name
      }
      if (priceFilter) {
         const filters = priceFilter.replace(regEx, (match: any) => `-${operatorsMap[match]}-`)
         const [price, operator1, value1, operator2, value2] = filters.split('-')
         queryObject[price] = { [operator1]: value1, [operator2]: value2 }
      }
      let defaultSort = '-datePostedOnMarketplace'
      if (sort) {
         defaultSort = sort
      }
      let defaultPage = 1
      let defaultLimit = 10
      if (limit) {
         defaultLimit = parseInt(limit)
      }
      if (page) {
         defaultPage = parseInt(page)
      }
      const nfts: any = await NFT.find(queryObject)
         .select('id name rarity price attributes datePostedOnMarketplace')
         .sort(defaultSort)
         .limit(defaultLimit)
         .skip((defaultPage - 1) * defaultLimit)
      res.status(200).send({ nbhits: nfts.length, nfts })
      return res.end()
   } catch (err) {
      if (err) next(err)
   }
}

export const sendUsersNFT: RequestHandler = async (req, res, next) => {
   try {
      const { page, limit, sort }: any = req.query
      const decodedJWT: any = decodeJWT(req.cookies.jwt)
      let defaultSort = '-isForSale'
      if (sort) {
         defaultSort = sort
      }
      let defaultPage = 1
      let defaultLimit = 10
      if (limit) {
         defaultLimit = parseInt(limit)
      }
      if (page) {
         defaultPage = parseInt(page)
      }
      const userNFTs = await NFT.find({ ownerID: decodedJWT.id })
         .select('id name rarity attributes dateMinted isForSale')
         .sort(defaultSort)
         .limit(defaultLimit)
         .skip((defaultPage - 1) * defaultLimit)
      res.status(200).send({ nbhits: userNFTs.length, nfts: userNFTs })
      return res.end()
   } catch (err) {
      if (err) next(err)
   }
}
