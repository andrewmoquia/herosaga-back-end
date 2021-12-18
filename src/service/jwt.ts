// import { config } from '../utilities/config'
import jwt from 'jsonwebtoken'

export const createJWTToken = (payload: any) => {
   const token = jwt.sign(JSON.stringify(payload), 'secret')
   return token
}
