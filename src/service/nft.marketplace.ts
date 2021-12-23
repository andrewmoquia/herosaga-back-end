import User from '../model/user'
import NFT from '../model/nft'
import BuyingTransacion from '../model/transac.buying'
import SellingTransaction from '../model/transac.selling'
import { decodeJWT } from './jwt'
import { resSendMsg } from './user'

export const createSellingTransaction = async (next: any, user: any, nftID: any, price: any) => {
   try {
      const transaction = await new SellingTransaction({
         sellerID: user.id,
         nftID,
         price,
      })
      const saveTransaction = await transaction.save()
      if (saveTransaction) return transaction
   } catch (err) {
      return next(err)
   }
}

export const sellNFT = async (res: any, next: any, nft: any, transaction: any) => {
   try {
      const sellNFT = await nft.updateOne({ isForSale: true, datePostedOnMarketplace: Date.now() })
      if (sellNFT) {
         const updateTransaction = await transaction.updateOne({ dateCreated: Date.now() })
         if (updateTransaction) {
            return resSendMsg(res, 200, 'Your NFT is now posted in marketplace.')
         }
      }
   } catch (err) {
      return next(err)
   }
}

export const sellNFTOnMarketplace = async (req: any, res: any, next: any) => {
   try {
      const user: any = await decodeJWT(req.cookies.jwt)
      const nftID = req.params.id
      const price = req.params.price
      const nft = await NFT.findById({ _id: nftID })
      const findTransaction = await SellingTransaction.findOne({ nftID, isActive: true })

      if (user.id !== nft.ownerID) {
         return resSendMsg(res, 200, 'You"re not the owner of this NFT!')
      }
      if (nft && !findTransaction) {
         //Create transaction record
         const transaction = await createSellingTransaction(next, user, nftID, price)
         //Update status for sale of nft
         return await sellNFT(res, next, nft, transaction)
      } else if (findTransaction) {
         return resSendMsg(res, 400, 'NFT is on sale already!')
      } else {
         return resSendMsg(res, 200, 'NFT not found!')
      }
   } catch (err) {
      return next(err)
   }
}

export const createBuyingTransaction = async (next: any, user: any, transacRef: any) => {
   const createBuyerTransac = await new BuyingTransacion({
      sellerTransactionReference: transacRef.id,
      buyerID: user.id,
      nftID: transacRef.nftID,
      price: transacRef.price,
      sellerID: transacRef.sellerID,
      dateCreated: Date.now(),
   })
   const saveBuyerTransac = await createBuyerTransac.save()
   if (saveBuyerTransac) return createBuyerTransac
}

export const deductPaymentForBuying = async (
   next: any,
   user: any,
   price: any,
   buyerTransaction: any
) => {
   try {
      const updateBuyer = await user.updateOne({ $inc: { balance: -price } })
      if (updateBuyer) {
         const updateTransac = await buyerTransaction.updateOne({ isPaymentDeducted: true })
         if (updateTransac) return buyerTransaction
      }
   } catch (err) {
      return next(err)
   }
}

export const transferPaymentToSeller = async (
   next: any,
   buyTransaction: any,
   sellTransaction: any
) => {
   try {
      const findSeller = await User.findByIdAndUpdate(
         { _id: buyTransaction.sellerID },
         { $inc: { balance: +buyTransaction.price } }
      )
      if (findSeller) {
         const updateBuyerTransac = await buyTransaction.updateOne({ isPaymentSent: true })
         const updateSellerTransac = await sellTransaction.updateOne({ isPaymentReceived: true })
         if (updateBuyerTransac && updateSellerTransac) {
            return buyTransaction
         }
      }
   } catch (err) {
      return next(err)
   }
}

export const transferNFTToBuyer = async (
   res: any,
   next: any,
   nft: any,
   user: any,
   sellerTransacRecord: any,
   buyerTransacRecord: any
) => {
   try {
      const updateNFT = await nft.updateOne({
         ownerID: user.id,
         isForSale: false,
         $unset: { datePostedOnMarketplace: '' },
      })
      if (updateNFT) {
         const updateSellerTransac = await sellerTransacRecord.updateOne({
            isNFTTransferred: true,
            isCompleted: true,
            isActive: false,
         })
         const updateBuyerTransac = await buyerTransacRecord.updateOne({
            isNFTTransferred: true,
            isCompleted: true,
         })
         if (updateSellerTransac && updateBuyerTransac) {
            return resSendMsg(res, 200, 'Successfully bought a NFT, check your storage.')
         }
      }
   } catch (err) {
      return next(err)
   }
}

export const buyNFTOnMarketplace = async (req: any, res: any, next: any) => {
   try {
      const nftID = req.params.id
      const decodedJWT: any = await decodeJWT(req.cookies.jwt)
      const nft = await NFT.findById({ _id: nftID })
      const user = await User.findById({ _id: decodedJWT.id })
      const transacRef = await SellingTransaction.findOne({ nftID, isActive: true })

      if (!transacRef) {
         return resSendMsg(res, 200, 'This NFT has been sold.')
      }
      if (user.balance < transacRef.price) {
         return resSendMsg(res, 200, 'Not enough balance.')
      }
      if (user.id === transacRef.sellerID) {
         return resSendMsg(res, 200, 'This is your item.')
      }
      if (transacRef && user && nft) {
         //Create buy transaction if not on process or for sale
         const buyerTransac = await createBuyingTransaction(next, decodedJWT, transacRef)
         //Deduct payment of buyer
         const payDeducTransaction = await deductPaymentForBuying(
            next,
            user,
            transacRef.price,
            buyerTransac
         )
         //Transfer payment to seller
         const paySellerTransac = await transferPaymentToSeller(
            next,
            payDeducTransaction,
            transacRef
         )
         //Tranfer NFT
         if (paySellerTransac) {
            return await transferNFTToBuyer(res, next, nft, user, transacRef, buyerTransac)
         }
      } else {
         return resSendMsg(res, 200, 'No NFT found.')
      }
   } catch (err) {
      return next(err)
   }
}

export const cancelSellOfNFT = async (req: any, res: any, next: any) => {
   try {
      const nftID = req.params.id
      const user: any = decodeJWT(req.cookies.jwt)
      const transaction = await SellingTransaction.findOne({ nftID, isActive: true })

      if (transaction) {
         if (transaction.sellerID !== user.id) {
            return resSendMsg(res, 200, 'You"re not the owner of this NFT.')
         }
         const nft = await NFT.findById({ _id: nftID })
         //Update nft status not for sale
         const unsellNFT: any = await nft.updateOne({
            isForSale: false,
            $unset: { datePostedOnMarketplace: '' },
         })
         if (unsellNFT) {
            const deleteTransaction = await transaction.remove()
            if (deleteTransaction) {
               return resSendMsg(res, 200, 'NFT successfully unsold.')
            }
         }
      } else {
         return resSendMsg(res, 200, 'No transaction found.')
      }
   } catch (err) {
      return next(err)
   }
}
