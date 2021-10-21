import rateLimit from 'express-rate-limit'

//Add limit to all request base on this condition
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 300 // limit each IP to 200 requests per windowMs
})

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100, // limit each IP requests per windowMs
    statusCode: 200,
    message : {
        status: 429,
        message: "You have exceeded the maximum attempt to login. Try again later later.",
    }
})  