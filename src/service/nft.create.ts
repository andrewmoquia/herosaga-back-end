import { nftRarityChances, nftCharacters, nftAttributes } from '../utilities/nft'
import { INFTCharacters, INFTAttributes } from '../utilities/interfaces'
import NFT from '../model/nft'
import { decodeJWT } from './jwt'
import { createNFTMintingTransaction, finalizeMintingNFTTransac } from './transactions'

export const generateRandomNFTStats = (mintedRarity: string) => {
   //Get the attributes of minted rarity
   const rarityAttrib: any = nftAttributes[mintedRarity as keyof INFTAttributes]
   //Generate nft attributes with random stats value between min and max of attribute based on rarity
   const mintedAttributes = Object.keys(rarityAttrib).reduce((prevAttr: any, attr: any) => {
      const randomAttribValue =
         Math.floor(Math.random() * (rarityAttrib[attr].max - rarityAttrib[attr].min + 1)) +
         rarityAttrib[attr].min
      const tempAttrib = { [attr]: randomAttribValue }
      return { ...prevAttr, ...tempAttrib }
   }, {})
   return mintedAttributes
}

export const generateRandomNFTChar = (mintedRarity: string) => {
   const nftChar: any = nftCharacters[mintedRarity as keyof INFTCharacters]
   const totalCharRarity = Object.keys(nftChar).length
   const randomChar = Math.floor(Math.random() * totalCharRarity) + 1
   return nftChar[randomChar]
}

export const generateRandomNFTRarity = (box: any) => {
   const randomNum = Math.floor(Math.random() * 100) + 1
   if (box === 'silver') {
      return randomNum <= nftRarityChances.silver.common
         ? 'common'
         : randomNum > nftRarityChances.silver.common &&
           randomNum <= nftRarityChances.silver.uncommon
         ? 'uncommon'
         : randomNum > nftRarityChances.silver.uncommon && randomNum <= nftRarityChances.silver.rare
         ? 'rare'
         : 'epic'
   } else if (box === 'gold') {
      return randomNum <= nftRarityChances.gold.uncommon
         ? 'uncommon'
         : randomNum > nftRarityChances.gold.uncommon && randomNum <= nftRarityChances.gold.rare
         ? 'rare'
         : randomNum > nftRarityChances.gold.rare && randomNum <= nftRarityChances.gold.epic
         ? 'epic' + `${randomNum}`
         : 'legendary'
   } else {
      return randomNum <= nftRarityChances.diamond.rare
         ? 'rare'
         : randomNum > nftRarityChances.diamond.rare && randomNum <= nftRarityChances.diamond.epic
         ? 'epic'
         : 'legendary'
   }
}

export const registerMintedNFT = async (
   req: any,
   res: any,
   next: any,
   attribs: any,
   rarity: any,
   name: any,
   transaction: any
) => {
   try {
      const decodedJWT: any = await decodeJWT(req.cookies.jwt)
      const mintedNFt = await new NFT({
         ownerID: decodedJWT.id,
         name,
         rarity,
         attributes: {
            physicalAttack: attribs.physicalAttack,
            magicAttack: attribs.magicAttack,
            speed: attribs.speed,
            defense: attribs.defense,
            health: attribs.health,
         },
         dateMinted: Date.now(),
      })
      //T0-DO: After successfully creating the nft model,
      //update the transaction to be successful before saving in the database.
      const finalTransaction = await finalizeMintingNFTTransac(transaction, mintedNFt, next)
      if (finalTransaction) {
         return mintedNFt.save((err: Error) => {
            if (err) next(err)
            res.status(200).send({
               status: 200,
               message: 'Sucessfully minted an NFT.',
               payload: mintedNFt,
            })
            return res.end()
         })
      }
   } catch (err) {
      next(err)
   }
}

export const createNFT = async (req: any, res: any, next: any) => {
   try {
      //Create transaction record for every minting
      const transaction = await createNFTMintingTransaction(req, next)
      if (transaction) {
         //Generate nft rarity based on box
         const mintedRarity = generateRandomNFTRarity(req.params.box)
         //Generate nft stats based on rarity
         const generateAttributes = generateRandomNFTStats(mintedRarity)
         //Generate nft character based on rarity
         const mintedCharacter = await generateRandomNFTChar(mintedRarity)
         //Register created nft to the database
         return await registerMintedNFT(
            req,
            res,
            next,
            generateAttributes,
            mintedRarity,
            mintedCharacter,
            transaction
         )
      }
   } catch (err) {
      next(err)
   }
}
