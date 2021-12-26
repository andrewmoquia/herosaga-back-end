import { Schema, model } from 'mongoose'

const transactionSchema = new Schema({
   recipientID: { type: String },
   nftID: { type: String },
   sellPrice: { type: Number },
   isCompleted: { type: Boolean, default: false },
   createdAt: { type: Date, default: Date.now() },
   transaction: { type: String },
   buyTransaction: {
      isPaymentDeducted: { type: Boolean },
      isPaymentSent: { type: Boolean },
      isNFTTransferred: { type: Boolean },
      isActive: { type: Boolean },
   },
   sellTransaction: {
      isPaymentReceived: { type: Boolean },
      isNFTTransferred: { type: Boolean },
      isActive: { type: Boolean },
   },
   mintTransaction: {
      isPaymentSent: { type: Boolean },
      isPaymentReceived: { type: Boolean },
      isNFTTransferred: { type: Boolean },
      isActive: { type: Boolean },
   },
})

export default model('Transaction', transactionSchema, 'transaction')
