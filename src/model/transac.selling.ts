import { Schema, model } from 'mongoose'

const sellingTransacSchema = new Schema({
   sellerID: { type: String },
   nftID: { type: String },
   dateCreated: { type: Date },
   price: { type: Number },
   isPaymentReceived: { type: Boolean, default: false },
   isNFTTransferred: { type: Boolean, default: false },
   isCompleted: { type: Boolean, default: false },
   isActive: { type: Boolean, default: true },
   dateCompleted: { type: Date },
})

export default model('SellingTransaction', sellingTransacSchema, 'selling-transaction')
