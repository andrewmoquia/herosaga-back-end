import { config } from '../utilities/config'
import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'

export const createJWTToken = (payload: any) => {
   const token = jwt.sign(JSON.stringify(payload), `${config.JWT_SECRET}`)
   return token
}

export const decodeJWT = (jwtCookie: any) => {
   return jwtDecode(jwtCookie)
}

export const verifyToken = (token: any) => {
   return jwt.verify(token, `${config.JWT_SECRET}`)
}
