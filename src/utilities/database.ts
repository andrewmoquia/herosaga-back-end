import mongoose from 'mongoose'
import { config } from './config'
;(async () => {
   try {
      const db = await mongoose.connect(`${config.DATABASE}`)
      console.log(`Database '${db.connection.name}' is connected.`)
   } catch (error) {
      console.log(error)
   }
})()
