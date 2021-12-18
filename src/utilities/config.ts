import dotenv from 'dotenv'

dotenv.config()

export const config = {
   PORT: process.env.PORT,
   DATABASE: process.env.DATABASE,
   JWT_SECRET: process.env.JWT_SECRET,
}
