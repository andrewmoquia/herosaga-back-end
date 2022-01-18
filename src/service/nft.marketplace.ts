import User from '../model/user'
import NFT from '../model/nft'
import Transaction from '../model/transaction'
import { decodeJWT } from './jwt'
import { resSendMsg } from './user'

export const createSellingTransaction = async (
   next: any,
   recipientID: any,
   nftID: any,
   sellPrice: any
) => {
   try {
      const transaction = await new Transaction({
         recipientID,
         nftID,
         sellPrice,
         transaction: 'Sell',
         sellTransaction: {
            isPaymentReceived: false,
            isNFTTransferred: false,
         },
      })
      const saveTransaction = await transaction.save()
      return saveTransaction
   } catch (err) {
      return next(err)
   }
}

export const sellNFT = async (res: any, next: any, nft: any, transac: any, sellPrice: any) => {
   try {
      const sellNFT = await nft.updateOne({
         isForSale: true,
         datePostedOnMarketplace: Date.now(),
         sellPrice,
      })
      if (sellNFT) {
         const updateTransac = await transac.updateOne({ 'sellTransaction.isActive': true })
         if (updateTransac) {
            return resSendMsg(res, 200, 'Your NFT is now posted in marketplace.')
         }
      }
   } catch (err) {
      return next(err)
   }
}

export const sellNFTOnMarketplace = async (req: any, res: any, next: any) => {
   try {
      const seller: any = await decodeJWT(req.cookies.jwt)
      const nftID = req.params.id
      const sellPrice = req.params.price
      const nft = await NFT.findById({ _id: nftID })
      if (nft) {
         if (seller.id !== nft.ownerID) {
            return resSendMsg(res, 200, "You're not the owner of this NFT!")
         }
         const findTransaction = await Transaction.findOne({
            nftID,
            'sellTransaction.isActive': true,
         })
         if (!findTransaction) {
            //Create transaction record
            const transaction = await createSellingTransaction(next, seller.id, nftID, sellPrice)
            //Update status for sale of nft
            return await sellNFT(res, next, nft, transaction, sellPrice)
         } else {
            return resSendMsg(res, 400, 'NFT is on sale already!')
         }
      } else {
         return resSendMsg(res, 200, 'NFT not found!')
      }
   } catch (err) {
      return next(err)
   }
}

export const createBuyingTransaction = async (next: any, buyerID: any, nftID: any) => {
   try {
      const buyTransac = await new Transaction({
         recipientID: buyerID,
         nftID,
         transaction: 'Buy',
         buyTransaction: {
            isActive: true,
            isPaymentDeducted: false,
            isPaymentSent: false,
            isNFTTransferred: false,
         },
      })
      const saveBuyTransac = await buyTransac.save()
      if (saveBuyTransac) return buyTransac
   } catch (err) {
      return next(err)
   }
}

export const deductPaymentForBuying = async (
   next: any,
   buyer: any,
   sellPrice: Number,
   buyerTransac: any
) => {
   try {
      const updateBuyer = await buyer.updateOne({ $inc: { balance: -sellPrice } })
      if (updateBuyer) {
         const updateBuyerTransac = await buyerTransac.updateOne({
            'buyTransaction.isPaymentDeducted': true,
         })
         if (updateBuyerTransac) return buyerTransac
      }
   } catch (err) {
      return next(err)
   }
}

export const transferPaymentToSeller = async (
   next: any,
   seller: any,
   price: any,
   sellerTransac: any,
   buyerTransac: any
) => {
   try {
      const findSeller = await seller.updateOne({ $inc: { balance: +price } })
      if (findSeller) {
         const updateSellerTransac = await sellerTransac.updateOne({
            'sellTransaction.isPaymentReceived': true,
         })
         const updateBuyerTransac = await buyerTransac.updateOne({
            'buyTransaction.isPaymentSent': true,
         })
         if (updateSellerTransac && updateBuyerTransac) return buyerTransac
      }
   } catch (err) {
      return next(err)
   }
}

export const transferNFTToBuyer = async (
   res: any,
   next: any,
   nft: any,
   buyerID: any,
   sellerTransac: any,
   buyerTransac: any
) => {
   try {
      const updateNFT = await nft.updateOne({
         ownerID: buyerID,
         isForSale: false,
         $unset: { datePostedOnMarketplace: '', sellPrice: '' },
      })
      if (updateNFT) {
         const updateSellerTransac = await sellerTransac.updateOne({
            isCompleted: true,
            'sellTransaction.isNFTTransferred': true,
            'sellTransaction.isActive': false,
         })
         const updateBuyerTransac = await buyerTransac.updateOne({
            isCompleted: true,
            'buyTransaction.isNFTTransferred': true,
            'buyTransaction.isActive': false,
         })
         if (updateSellerTransac && updateBuyerTransac) {
            return resSendMsg(res, 200, 'Successsfully bought, check your inventory.')
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
      const sellerTransac = await Transaction.findOne({
         nftID,
         'sellTransaction.isActive': true,
      })
      if (sellerTransac) {
         const { sellPrice, recipientID } = sellerTransac
         const nft = await NFT.findById({ _id: nftID })
         const buyer = await User.findById({ _id: decodedJWT.id })
         const seller = await User.findById({ _id: recipientID })
         if (buyer && seller) {
            if (buyer.id === recipientID) {
               return resSendMsg(res, 200, 'This is your item.')
            }
            if (buyer.balance < sellPrice) {
               return resSendMsg(res, 200, 'Not enough balance.')
            }
         }
         if (nft) {
            //Create buy transaction if not on process or for sale
            const buyerTransac = await createBuyingTransaction(next, buyer.id, nft._id)
            //Deduct payment of buyer
            const updatedBuyerTransac = await deductPaymentForBuying(
               next,
               buyer,
               sellPrice,
               buyerTransac
            )
            //Transfer payment to seller
            const finalBuyerTransac = await transferPaymentToSeller(
               next,
               seller,
               sellPrice,
               sellerTransac,
               updatedBuyerTransac
            )
            //Tranfer NFT
            return await transferNFTToBuyer(
               res,
               next,
               nft,
               buyer.id,
               sellerTransac,
               finalBuyerTransac
            )
         } else {
            return resSendMsg(res, 200, 'No NFT found.')
         }
      } else {
         return resSendMsg(res, 200, 'This NFT has been sold or not currently on marketplace.')
      }
   } catch (err) {
      return next(err)
   }
}

export const cancelSellOfNFT = async (req: any, res: any, next: any) => {
   try {
      const nftID = req.params.id
      const user: any = decodeJWT(req.cookies.jwt)
      const transaction = await Transaction.findOne({
         nftID,
         'sellTransaction.isActive': true,
      })
      if (transaction) {
         const buyerTransac = await Transaction.findOne({ nftID, 'buyTransaction.isActive': true })
         if (buyerTransac) {
            return resSendMsg(res, 200, 'Buying in process can"t be unsell.')
         }
         if (transaction.recipientID !== user.id) {
            return resSendMsg(res, 200, 'You"re not the owner of this NFT.')
         }
         //Update nft status not for sale
         const updateNFT = await NFT.findByIdAndUpdate(
            { _id: nftID },
            {
               isForSale: false,
               $unset: { datePostedOnMarketplace: '', sellPrice: '' },
            }
         )
         if (updateNFT) {
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
