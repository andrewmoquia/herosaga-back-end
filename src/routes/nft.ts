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

//ROUTEs TO-DO:
//Get all nft that is on sale with filter method
//Get nft info when click selected
//Show all nft in user's inventory
router.get('/nft/get-all', cntrl.getAllNFT)
router.get('/user/nft/get-all', cntrl.getAllUserNFT)

export default router
