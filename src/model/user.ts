import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
   username: { type: String, required: true, unique: true },
   password: { type: String, required: false },
   email: { type: String, required: true, unique: true },
   isVerified: { type: Boolean, default: true },
   googleId: { type: String, required: false },
   provider: { type: String, required: true },
   balance: { type: Number, default: 10000 },
})

export default model('User', UserSchema, 'users')
