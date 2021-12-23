import { Schema, model } from 'mongoose'

const mintingTransactionScheme = new Schema({
   ownerID: { type: String },
   transaction: { type: String, default: 'Minting' },
   nftID: { type: String, default: false },
   isBuyerPaid: { type: Boolean, default: false },
   isPaymentReceived: { type: Boolean, default: false },
   isNFTTransferred: { type: Boolean, default: false },
   dateCreated: { type: Date },
   datePaymentDeducted: { type: Date },
   datePaymentSent: { type: Date },
   dateNFTReceived: { type: Date },
})

export default model('MintingTransaction', mintingTransactionScheme, 'minting-transaction')
