import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
   username: { type: String, required: true, unique: true },
   password: { type: String, required: false },
   email: { type: String, required: true, unique: true },
   isVerified: { type: Boolean, default: false },
   googleId: { type: String, required: false },
   provider: { type: String, required: true },
})

export default model('User', UserSchema, 'users')
