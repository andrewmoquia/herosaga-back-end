export const filterBrightness = { filter: 'brightness(0%)' }

export const spriteBg: any = {
   adventurer: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-adventurer.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   civilian: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-civilian.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   ghost: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-ghost.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   warrior: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-warrior.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   arabianfighter: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-arabianfighter.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   devil: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-devil.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   pirate: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-pirate.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   roshan: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-roshan.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   herald: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-herald.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   magician: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-magician.webp)',
      width: 'calc(128px/4)',
      height: 'calc(208px/4)',
      backgroundRepeat: 'no-repeat',
   },
   monk: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-monk.webp)',
      width: 'calc(128px/4)',
      height: 'calc(208px/4)',
      backgroundRepeat: 'no-repeat',
   },
   vampire: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-vampire.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   darklord: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-darklord.webp)',
      width: 'calc(128px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   scarletangel: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-scarletangel.webp)',
      width: 'calc(192px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   shiva: {
      background: 'url(https://herosaga.netlify.app/images/heroes/6NxhqSG/sprite-shiva.webp)',
      width: 'calc(168px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
   titan: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-titan.webp)',
      width: 'calc(160px/4)',
      height: 'calc(224px/4)',
      backgroundRepeat: 'no-repeat',
   },
   bahamut: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-bahamut.webp)',
      width: 'calc(384px/4)',
      height: 'calc(384px/4)',
      backgroundRepeat: 'no-repeat',
   },
   leviathan: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-leviathan.webp)',
      width: 'calc(384px/4)',
      height: 'calc(384px/4)',
      backgroundRepeat: 'no-repeat',
   },
   phoenix: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-phoenix.webp)',
      width: 'calc(384px/4)',
      height: 'calc(384px/4)',
      backgroundRepeat: 'no-repeat',
   },
   siren: {
      background: 'url(https://herosaga.netlify.app/images/heroes/sprite-siren.webp)',
      width: 'calc(312px/4)',
      height: 'calc(192px/4)',
      backgroundRepeat: 'no-repeat',
   },
}

export const heroesData: any = [
   {
      name: 'Adventurer',
      rarity: 'Common',
      sprite: {
         basic: { ...spriteBg.adventurer },
         wFilter: { ...spriteBg.adventurer, ...filterBrightness },
         wAnim: {
            ...spriteBg.adventurer,
            animation: 'sprite-idle-s 0.5s steps(4) infinite,  roulette 3s linear',
         },
      },
   },
   {
      name: 'Civilian',
      rarity: 'Common',
      sprite: {
         basic: { ...spriteBg.civilian },
         wFilter: { ...spriteBg.civilian, ...filterBrightness },
         wAnim: {
            ...spriteBg.civilian,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Ghost',
      rarity: 'Common',
      sprite: {
         basic: { ...spriteBg.ghost },
         wFilter: { ...spriteBg.ghost, ...filterBrightness },
         wAnim: {
            ...spriteBg.ghost,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Warrior',
      rarity: 'Common',
      sprite: {
         basic: { ...spriteBg.warrior },
         wFilter: { ...spriteBg.warrior, ...filterBrightness },
         wAnim: {
            ...spriteBg.warrior,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Arabian Fighter',
      rarity: 'Uncommon',
      sprite: {
         basic: { ...spriteBg.arabianfighter },
         wFilter: { ...spriteBg.arabianfighter, ...filterBrightness },
         wAnim: {
            ...spriteBg.arabianfighter,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Roshan',
      rarity: 'Uncommon',
      sprite: {
         basic: { ...spriteBg.roshan },
         wFilter: { ...spriteBg.roshan, ...filterBrightness },
         wAnim: {
            ...spriteBg.roshan,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Devil',
      rarity: 'Uncommon',
      sprite: {
         basic: { ...spriteBg.devil },
         wFilter: { ...spriteBg.devil, ...filterBrightness },
         wAnim: {
            ...spriteBg.devil,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Pirate',
      rarity: 'Uncommon',
      sprite: {
         basic: { ...spriteBg.pirate },
         wFilter: { ...spriteBg.pirate, ...filterBrightness },
         wAnim: {
            ...spriteBg.pirate,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Herald',
      rarity: 'Rare',
      sprite: {
         basic: { ...spriteBg.herald },
         wFilter: { ...spriteBg.herald, ...filterBrightness },
         wAnim: {
            ...spriteBg.herald,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Magician',
      rarity: 'Rare',
      sprite: {
         basic: { ...spriteBg.magician },
         wFilter: { ...spriteBg.magician, ...filterBrightness },
         wAnim: {
            ...spriteBg.magician,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Monk',
      rarity: 'Rare',
      sprite: {
         basic: { ...spriteBg.monk },
         wFilter: { ...spriteBg.monk, ...filterBrightness },
         wAnim: {
            ...spriteBg.monk,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Vampire',
      rarity: 'Rare',
      sprite: {
         basic: { ...spriteBg.vampire },
         wFilter: { ...spriteBg.vampire, ...filterBrightness },
         wAnim: {
            ...spriteBg.vampire,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Darklord',
      rarity: 'Epic',
      sprite: {
         basic: { ...spriteBg.darklord },
         wFilter: { ...spriteBg.darklord, ...filterBrightness },
         wAnim: {
            ...spriteBg.darklord,
            animation: 'sprite-idle-s 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Scarletangel',
      rarity: 'Epic',
      sprite: {
         basic: { ...spriteBg.scarletangel },
         wFilter: { ...spriteBg.scarletangel, ...filterBrightness },
         wAnim: {
            ...spriteBg.scarletangel,
            animation: 'sprite-idle-xl 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Shiva',
      rarity: 'Epic',
      sprite: {
         basic: { ...spriteBg.shiva },
         wFilter: { ...spriteBg.shiva, ...filterBrightness },
         wAnim: {
            ...spriteBg.shiva,
            animation: 'sprite-idle-l 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Titan',
      rarity: 'Epic',
      sprite: {
         basic: { ...spriteBg.titan },
         wFilter: { ...spriteBg.titan, ...filterBrightness },
         wAnim: {
            ...spriteBg.titan,
            animation: 'sprite-idle-m 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Bahamut',
      rarity: 'Legendary',
      sprite: {
         basic: { ...spriteBg.bahamut },
         wFilter: { ...spriteBg.bahamut, ...filterBrightness },
         wAnim: {
            ...spriteBg.bahamut,
            animation: 'sprite-idle-xxxl 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Leviathan',
      rarity: 'Legendary',
      sprite: {
         basic: { ...spriteBg.leviathan },
         wFilter: { ...spriteBg.leviathan, ...filterBrightness },
         wAnim: {
            ...spriteBg.leviathan,
            animation: 'sprite-idle-xxxl 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Siren',
      rarity: 'Legendary',
      sprite: {
         basic: { ...spriteBg.siren },
         wFilter: { ...spriteBg.siren, ...filterBrightness },
         wAnim: {
            ...spriteBg.siren,
            animation: 'sprite-idle-xxl 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
   {
      name: 'Phoenix',
      rarity: 'Legendary',
      sprite: {
         basic: { ...spriteBg.phoenix },
         wFilter: { ...spriteBg.phoenix, ...filterBrightness },
         wAnim: {
            ...spriteBg.phoenix,
            animation: 'sprite-idle-xxxl 0.5s steps(4) infinite, roulette 3s linear',
         },
      },
   },
]

export const starStyleOnRoulette = [
   'mint-box-star s-ct-left star-glow-anim-1',
   'mint-box-star s-ct-right star-glow-anim-2',
   'mint-box-star s-cb-left star-glow-anim-2',
   'mint-box-star s-cb-right star-glow-anim-1',
   'mint-box-star s-cl-top star-glow-anim-2',
   'mint-box-star s-cl-bottom star-glow-anim-1',
   'mint-box-star s-cr-top star-glow-anim-1',
   'mint-box-star s-cr-bottom star-glow-anim-2',
   'mint-box-star s-l-top star-glow-anim-1',
   'mint-box-star s-l-bottom star-glow-anim-2',
   'mint-box-star s-lt-left star-glow-anim-2',
   'mint-box-star s-lt-right star-glow-anim-1',
   'mint-box-star s-lb-left star-glow-anim-1',
   'mint-box-star s-lb-right star-glow-anim-2',
   'mint-box-star s-r-top star-glow-anim-2',
   'mint-box-star s-r-bottom star-glow-anim-1',
   'mint-box-star s-rt-left star-glow-anim-2',
   'mint-box-star s-rt-right star-glow-anim-1',
   'mint-box-star s-rb-left star-glow-anim-1',
   'mint-box-star s-rb-right star-glow-anim-2',
]
