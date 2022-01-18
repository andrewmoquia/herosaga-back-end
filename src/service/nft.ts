import { RequestHandler } from 'express'
import NFT from '../model/nft'
import { decodeJWT } from './jwt'
import { resSendMsg } from './user'
import Transaction from '../model/transaction'

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
      const user: any = decodeJWT(req.cookies.jwt)
      const { rarity, sort, heroes, priceFilter, page }: any = req.query
      let toBeSort = 'datePostedOnMarketplace'
      let defaultPage = 0
      const defaultLimit = 10
      let sortOrder: any = -1
      const resData: any = {}
      const query: any = { isForSale: true, ownerID: { $ne: user.id } }

      if (rarity) {
         query.rarity = rarity
      }
      if (sort) {
         if (sort.charAt(0) != '-') {
            toBeSort = sort
            sortOrder = 1
         } else {
            toBeSort = sort.slice(1)
         }
      }
      if (heroes) {
         query.name = heroes.charAt(0).toUpperCase() + heroes.slice(1)
      }
      if (priceFilter) {
         const filters = priceFilter.replace(regEx, (match: any) => `-${operatorsMap[match]}-`)
         const [sellPrice, operator1, value1, operator2, value2] = filters.split('-')
         if (operator1) {
            query[sellPrice] = { [operator1]: parseInt(value1) }
         }
         if (operator2) {
            query[sellPrice][operator2] = parseInt(value2)
         }
      }
      if (page) {
         defaultPage = (page - 1) * defaultLimit
      }

      console.time()
      await NFT.aggregate([
         { $match: query },
         { $sort: { [toBeSort]: sortOrder } },
         { $skip: defaultPage },
         { $limit: 10 },
      ])
         .then((respond) => {
            resData.nbHits = respond.length
            resData.nfts = respond
            resData.page = page
         })
         .catch((err) => {
            if (err) {
               res.status(200).send({
                  status: 500,
                  message: 'Something went wrong or no NFT found. Please try .',
               })
               return res.end()
            }
            return
         })
      console.timeEnd()

      console.time()
      await NFT.aggregate([{ $match: query }])
         .count('id')
         .then((respond) => {
            resData.nftTotal = respond[0].id
            resData.totalPage = Math.ceil(resData.nftTotal / 10)
         })
         .catch((err) => {
            if (err) {
               res.status(200).send({
                  status: 204,
                  message: 'No NFT found.',
               })
               return res.end()
            }
            return
         })
      console.timeEnd()

      res.status(200).send({ status: 200, payload: { ...resData } })
      return res.end()
   } catch (err) {
      if (err) return next(err)
   }
}

export const sendUsersNFT: RequestHandler = async (req, res, next) => {
   try {
      const { page, sort, rarity }: any = req.query
      const decodedJWT: any = decodeJWT(req.cookies.jwt)
      let toBeSort = 'dateMinted'
      let sortOrder: any = -1
      let defaultPage = 0
      const resData: any = {}
      const query: any = {
         ownerID: decodedJWT.id,
      }

      if (
         (rarity && rarity === 'common') ||
         rarity === 'uncommon' ||
         rarity === 'rare' ||
         rarity === 'epic' ||
         rarity === 'legendary'
      ) {
         query.rarity = rarity
      }
      if (sort) {
         if (sort.charAt(0) != '-') {
            toBeSort = sort
            sortOrder = 1
         } else {
            toBeSort = sort.slice(1)
         }
      }
      if (page) {
         defaultPage = (page - 1) * 10
      }

      console.time()
      await NFT.aggregate([
         { $match: query },
         { $sort: { [toBeSort]: sortOrder } },
         { $skip: defaultPage },
         { $limit: 10 },
      ])
         .then((respond) => {
            resData.nbHits = respond.length
            resData.nfts = respond
            resData.page = page
         })
         .catch((err) => {
            if (err) {
               res.status(200).send({
                  status: 500,
                  message: 'Something went wrong! Please try again later.',
               })
               res.end()
            }
            return
         })
      console.timeEnd()

      console.time()
      await NFT.aggregate([{ $match: query }])
         .count('ownerID')
         .then((respond) => {
            resData.nftTotal = respond[0].ownerID
            resData.totalPage = Math.ceil(resData.nftTotal / 10)
         })
         .catch((err) => {
            if (err) {
               res.status(200).send({
                  status: 204,
                  message: 'No NFT found.',
               })
               return res.end()
            }
            return
         })
      console.timeEnd()

      res.status(200).send({ status: 200, payload: { ...resData } })
      return res.end()
   } catch (err) {
      if (err) return next(err)
   }
}

const resSendPayload = (res: any, payload: any) => {
   res.status(200).send({ status: 200, payload })
   return res.end()
}

export const sendMPNFTToUser = async (req: any, res: any) => {
   const nftID = req.params.id

   console.time('Finding one transaction speed')
   const transaction = await Transaction.findOne({
      nftID,
      'buyTransaction.isActive': true,
   })
   console.timeEnd('Finding one transaction speed')

   if (!transaction) {
      console.time('Finding one NFT speed')
      const nft = await NFT.findOne({ _id: nftID, isForSale: true })
      console.timeEnd('Finding one NFT speed')

      return nft ? resSendPayload(res, nft) : resSendMsg(res, 204, 'Sold.')
   } else {
      return resSendMsg(res, 204, 'Sold.')
   }
}

export const sendUserNFTToUser = async (req: any, res: any) => {
   const nftID = req.params.id
   console.log(nftID)
   const user: any = decodeJWT(req.cookies.jwt)

   console.time('Finding user one nft speed')
   const nft = await NFT.findOne({ _id: nftID, ownerID: user.id })
   console.log(nft)
   console.timeEnd('Finding user one nft speed')

   return nft ? resSendPayload(res, nft) : resSendMsg(res, 204, 'No NFT found.')
}
