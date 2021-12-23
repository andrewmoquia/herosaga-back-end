import { Router } from 'express'
// import { csrfAuth } from '../service/csrf'
// import { authenticateJWTLogin } from '../service/passportSetup'
import * as cntrl from '../controller/nft'

const router = Router()

//TO-DO: Allow minting multiple boxes at the same time
router.get('/mint/box/:box', cntrl.mintNFT)
router.get('/sell/nft/:id/:price', cntrl.sellNFT)
router.get('/cancel/sell/nft/:id', cntrl.cancelSell)
router.get('/buy/nft/:id', cntrl.buyNFT)

export default router
