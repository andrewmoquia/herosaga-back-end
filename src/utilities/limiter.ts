import rateLimit from 'express-rate-limit'
import MongoStore from 'rate-limit-mongo'
import { config } from './config'

//Add limit to all request base on this condition
export const limiter = rateLimit({
   store: new MongoStore({
      uri: `${config.DATABASE}`,
      collectionName: 'serverLimit',
      expireTimeMs: 15 * 60 * 1000, // 15 minutes
      errorHandler: console.error.bind(null, 'rate-limit-mongo'),
   }),
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 300, // limit each IP to 200 requests per windowMs
})

export const login = rateLimit({
   store: new MongoStore({
      uri: `${config.DATABASE}`,
      collectionName: 'loginLimit',
      expireTimeMs: 15 * 60 * 1000, // 15 minutes
      errorHandler: console.error.bind(null, 'rate-limit-mongo'),
   }),
   windowMs: 10 * 60 * 1000, // 15 minutes
   max: 200, // limit each IP requests per windowMs
   statusCode: 200,
   message: {
      status: 429,
      message: 'You have exceeded the maximum attempt to login. Try again later.',
   },
})

export const verifyEmailLimiter = rateLimit({
   store: new MongoStore({
      uri: `${config.DATABASE}`,
      collectionName: 'verifyEmailLimit',
      expireTimeMs: 1 * 60 * 1000, // 1 minute
      errorHandler: console.error.bind(null, 'rate-limit-mongo'),
   }),
   windowMs: 1 * 60 * 1000, // 15 minutes
   max: 10, // limit each IP requests per windowMs
   statusCode: 200,
   message: {
      status: 429,
      message: 'You have exceeded the maximum attempt to verify email. Try again later.',
   },
})

export const registerLimit = rateLimit({
   store: new MongoStore({
      uri: `${config.DATABASE}`,
      collectionName: 'registerLimit',
      expireTimeMs: 24 * 60 * 60 * 1000, // 1 minute
      errorHandler: console.error.bind(null, 'rate-limit-mongo'),
   }),
   windowMs: 24 * 60 * 60 * 1000, // 24 hours
   max: 100, // limit each IP requests per windowMs
   statusCode: 200,
   message: {
      status: 429,
      message: 'You have exceeded the maximum attempt to create account. Try again tomorrow.',
   },
})

export const forgotPW = rateLimit({
   store: new MongoStore({
      uri: `${config.DATABASE}`,
      collectionName: 'forgotPasswordLimit',
      expireTimeMs: 1 * 60 * 60 * 1000, // 1 minute
      errorHandler: console.error.bind(null, 'rate-limit-mongo'),
   }),
   windowMs: 1 * 60 * 60 * 1000, // 24 hours
   max: 100, // limit each IP requests per windowMs
   statusCode: 200,
   message: {
      status: 429,
      message: 'You have exceeded the maximum attempt to reset password. Try again in a minute.',
   },
})
