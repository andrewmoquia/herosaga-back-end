import Transaction from '../model/transaction'
import { decodeJWT } from './jwt'
import User from '../model/user'

export const finalizeMintingNFTTransac = async (record: any, mintedNFt: any, next: any) => {
   try {
      const updatedRecord = await record.updateOne({
         nftID: mintedNFt.id,
         isNFTTransferred: true,
         dateNFTReceived: Date.now(),
      })
      if (updatedRecord) return record
   } catch (err) {
      if (err) next(err)
   }
}

export const transferPaymentForMintingBox = async (record: any, next: any) => {
   try {
      const sendPayment = await User.findOneAndUpdate(
         { username: 'totoypogi' },
         { $inc: { balance: +10 } }
      )
      if (sendPayment) {
         const updatedRecord = await record.updateOne({
            isPaymentReceive: true,
            datePaymentSend: Date.now(),
         })
         if (updatedRecord) return record
      }
   } catch (err) {
      if (err) next(err)
   }
}

export const deductBalanceForMintingBox = async (user: any, record: any, next: any) => {
   try {
      const deductedPayment = await user.updateOne({ $inc: { balance: -10 } })
      if (deductedPayment) {
         const updatedRecord = await record.updateOne({
            isBuyerPaid: true,
            dateBuyerPaid: Date.now(),
         })
         if (updatedRecord) return record
      }
   } catch (err) {
      if (err) next(err)
   }
}

export const createTransaction = async (user: any, next: any) => {
   try {
      const record = await new Transaction({
         ownerID: user.id,
         dateCreated: Date.now(),
      })
      const savedRecord = await record.save()
      if (savedRecord) return record
   } catch (err) {
      if (err) next(err)
   }
}

export const createNFTMintingTransaction = async (req: any, next: any) => {
   try {
      const decodedJWT: any = decodeJWT(req.cookies.jwt)
      const user = await User.findById({ _id: decodedJWT.id })
      //Create transaction record in database
      const record = await createTransaction(decodedJWT, next)
      //Deduct balance from buyer
      const paymentRecord = await deductBalanceForMintingBox(user, record, next)
      //Transfer payment to the system
      const updatedRecord = await transferPaymentForMintingBox(paymentRecord, next)
      return updatedRecord
   } catch (err) {
      if (err) next(err)
   }
}