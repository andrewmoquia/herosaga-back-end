import { decodeJWT } from './jwt'
import User from '../model/user'
import Transaction from '../model/transaction'

export const finalizeMintingNFTTransac = async (
   res: any,
   next: any,
   transaction: any,
   mintedNFt: any
) => {
   try {
      const updateTransaction = await transaction.updateOne({
         nftID: mintedNFt.id,
         isCompleted: true,
         'mintTransaction.isNFTTransferred': true,
         'mintTransaction.isActive': false,
      })
      if (updateTransaction) {
         res.status(200).send({
            status: 200,
            message: 'Sucessfully minted an NFT.',
            payload: mintedNFt,
         })
         return res.end()
      }
   } catch (err) {
      if (err) next(err)
   }
}

export const transferPaymentForMintingBox = async (transaction: any, next: any) => {
   try {
      const updateUser = await User.findOneAndUpdate(
         { username: 'totoypogi' },
         { $inc: { balance: +10 } }
      )
      if (updateUser) {
         const updateTransaction = await transaction.updateOne({
            'mintTransaction.isPaymentReceived': true,
         })
         if (updateTransaction) return transaction
      }
   } catch (err) {
      if (err) next(err)
   }
}

export const deductBalanceForMintingBox = async (
   user: any,
   transaction: any,
   next: any,
   box: any
) => {
   try {
      let balanceToDeduct = -10
      if (box === 'wooden') {
         balanceToDeduct = -10
      } else if (box === 'silver') {
         balanceToDeduct = -20
      } else {
         balanceToDeduct = -30
      }
      const updateUser = await user.updateOne({ $inc: { balance: balanceToDeduct } })
      if (updateUser) {
         const updateTransaction = await transaction.updateOne({
            'mintTransaction.isPaymentSent': true,
         })
         if (updateTransaction) return transaction
      }
   } catch (err) {
      if (err) next(err)
   }
}

export const createTransaction = async (user: any, next: any) => {
   try {
      const transaction = await new Transaction({
         recipientID: user.id,
         transaction: 'Mint',
         mintTransaction: {
            isPaymentSent: false,
            isPaymentReceived: false,
            isNFTTransferred: false,
            isActive: true,
         },
      })
      const saveTransaction = await transaction.save()
      if (saveTransaction) return transaction
   } catch (err) {
      if (err) next(err)
   }
}

export const createNFTMintingTransaction = async (req: any, next: any) => {
   try {
      const { box } = req.params
      const decodedJWT: any = decodeJWT(req.cookies.jwt)
      const user = await User.findById({ _id: decodedJWT.id })
      //Create transaction record in database
      const transaction = await createTransaction(user, next)
      //Deduct balance from buyer
      const nextTransaction = await deductBalanceForMintingBox(user, transaction, next, box)
      //Transfer payment to the system
      const updatedTransaction = await transferPaymentForMintingBox(nextTransaction, next)
      return updatedTransaction
   } catch (err) {
      if (err) next(err)
   }
}
