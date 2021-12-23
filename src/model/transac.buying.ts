import { Schema, model } from 'mongoose'

export const buyTransactionSchema = new Schema({
   sellerTransactionReference: { type: String },
   buyerID: { type: String },
   sellerID: { type: String },
   nftID: { type: String },
   price: { type: Number },
   isPaymentSent: { type: Boolean },
   isPaymentDeducted: { type: Boolean },
   isNFTTransferred: { type: Boolean },
   dateCreated: { type: Date },
   isCompleted: { type: Boolean, default: false },
})

export default model('BuyTransaction', buyTransactionSchema, 'buy-transaction')
