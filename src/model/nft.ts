import { Schema, model } from 'mongoose'

const NFTSchema = new Schema({
   ownerID: { type: String, required: true },
   name: { type: String, required: true },
   rarity: { type: String, required: true },
   attributes: {
      physicalAttack: { type: Number, required: true },
      magicAttack: { type: Number, required: true },
      speed: { type: Number, required: true },
      defense: { type: Number, required: true },
      health: { type: Number, required: true },
   },
   isForSale: { type: Boolean, default: false },
   sellPrice: { type: Number },
   dateMinted: { type: Date },
   datePostedOnMarketplace: { type: Date },
})

export default model('NFT', NFTSchema, 'nft')
