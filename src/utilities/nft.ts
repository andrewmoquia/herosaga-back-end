import * as intfc from '../utilities/interfaces'

export const nftRarityChances = {
   silver: {
      common: 90, //90%
      uncommon: 96, //6%
      rare: 99, //3%
      epic: 100, //1%
   },
   gold: {
      uncommon: 90, //90%
      rare: 96, //5%
      epic: 99, //4%
      legendary: 100, //1%
   },
   diamond: {
      rare: 45, //45%
      epic: 75, //30%
      legendary: 100, //25%
   },
}

export const nftCharacters: intfc.INFTCharacters = {
   common: {
      1: 'Adventurer',
      2: 'Civilian',
      3: 'Warrior',
      4: 'Ghost',
   },
   uncommon: {
      1: 'Devil',
      2: 'Roshan',
      3: 'Arabian Fighter',
      4: 'Pirate',
   },
   rare: {
      1: 'Vampire',
      2: 'Monk',
      3: 'Magician',
      4: 'Herald',
   },
   epic: {
      1: 'Darklord',
      2: 'Scarletangel',
      3: 'Titan',
      4: 'Shiva',
   },
   legendary: {
      1: 'Bahamut',
      2: 'Siren',
      3: 'Phoenix',
      4: 'Leviathan',
   },
}

export const nftAttributes: intfc.INFTAttributes = {
   common: {
      physicalAttack: {
         min: 10,
         max: 15,
      },
      magicAttack: {
         min: 10,
         max: 15,
      },
      health: {
         min: 100,
         max: 150,
      },
      defense: {
         min: 20,
         max: 30,
      },
      speed: {
         min: 40,
         max: 60,
      },
   },
   uncommon: {
      physicalAttack: {
         min: 15,
         max: 20,
      },
      magicAttack: {
         min: 15,
         max: 20,
      },
      health: {
         min: 150,
         max: 200,
      },
      defense: {
         min: 30,
         max: 40,
      },
      speed: {
         min: 50,
         max: 70,
      },
   },
   rare: {
      physicalAttack: {
         min: 20,
         max: 35,
      },
      magicAttack: {
         min: 20,
         max: 30,
      },
      health: {
         min: 200,
         max: 250,
      },
      defense: {
         min: 40,
         max: 50,
      },
      speed: {
         min: 60,
         max: 70,
      },
   },
   epic: {
      physicalAttack: {
         min: 35,
         max: 50,
      },
      magicAttack: {
         min: 35,
         max: 45,
      },
      health: {
         min: 300,
         max: 350,
      },
      defense: {
         min: 50,
         max: 70,
      },
      speed: {
         min: 70,
         max: 80,
      },
   },
   legendary: {
      physicalAttack: {
         min: 50,
         max: 70,
      },
      magicAttack: {
         min: 45,
         max: 65,
      },
      health: {
         min: 350,
         max: 450,
      },
      defense: {
         min: 70,
         max: 100,
      },
      speed: {
         min: 80,
         max: 100,
      },
   },
}
