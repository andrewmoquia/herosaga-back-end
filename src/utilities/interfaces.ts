export interface IMongoUser {
   _id: string
   username: String
   password: String
   email: String
   isVerified: Boolean
   googleId: String
   provider: String
   _v: number
}

export interface INFTCharacters {
   common: {
      1: string
      2: string
      3: string
      4: string
   }
   uncommon: {
      1: string
      2: string
      3: string
      4: string
   }
   rare: {
      1: string
      2: string
      3: string
      4: string
   }
   epic: {
      1: string
      2: string
      3: string
      4: string
   }
   legendary: {
      1: string
      2: string
      3: string
      4: string
   }
}

export interface INFTAttributes {
   common: {
      physicalAttack: {
         min: Number
         max: Number
      }
      magicAttack: {
         min: Number
         max: Number
      }
      health: {
         min: Number
         max: Number
      }
      defense: {
         min: Number
         max: Number
      }
      speed: {
         min: Number
         max: Number
      }
   }
   uncommon: {
      physicalAttack: {
         min: Number
         max: Number
      }
      magicAttack: {
         min: Number
         max: Number
      }
      health: {
         min: Number
         max: Number
      }
      defense: {
         min: Number
         max: Number
      }
      speed: {
         min: Number
         max: Number
      }
   }
   rare: {
      physicalAttack: {
         min: Number
         max: Number
      }
      magicAttack: {
         min: Number
         max: Number
      }
      health: {
         min: Number
         max: Number
      }
      defense: {
         min: Number
         max: Number
      }
      speed: {
         min: Number
         max: Number
      }
   }
   epic: {
      physicalAttack: {
         min: Number
         max: Number
      }
      magicAttack: {
         min: Number
         max: Number
      }
      health: {
         min: Number
         max: Number
      }
      defense: {
         min: Number
         max: Number
      }
      speed: {
         min: Number
         max: Number
      }
   }
   legendary: {
      physicalAttack: {
         min: Number
         max: Number
      }
      magicAttack: {
         min: Number
         max: Number
      }
      health: {
         min: Number
         max: Number
      }
      defense: {
         min: Number
         max: Number
      }
      speed: {
         min: Number
         max: Number
      }
   }
}
