import { Schema, model } from 'mongoose'

const transactionSchema = new Schema({
   ownerID: { type: String },
   nftID: { type: String, default: false },
   isBuyerPaid: { type: Boolean, default: false },
   isPaymentReceive: { type: Boolean, default: false },
   isNFTTransferred: { type: Boolean, default: false },
   dateCreated: { type: Date },
   dateBuyerPaid: { type: Date },
   datePaymentSend: { type: Date },
   dateNFTReceived: { type: Date },
})

export default model('Transaction', transactionSchema, 'transaction')
