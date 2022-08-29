import { ActivityType } from "discord.js"

export const BOT = {
  USERNAME: `Harth Stonebrew`,
  AVATAR: `https://jjdev.io/hearthbot/img/harth.png`,
  ACTIVITIES: [
    {weight: 6, type: ActivityType.Playing, name: `Hearthstone`},
    {weight: 6, type: ActivityType.Watching, name: `over the Inn`},
    {weight: 2, type: ActivityType.Playing, name: `World of Warcraft`},
    {weight: 2, type: ActivityType.Playing, name: `Heroes of the Storm`},
    {weight: 1, type: ActivityType.Watching, name: `Sarge eat a block of cheese`},
  ],
  ACTIVITY_ROTATION_TIMEOUT: 1000 * 60 * 10,
}

export const EMBED = {
  EMOJI: {
    ATTACK: `<:attack:385274433830649869>`,
    HEALTH: `<:health:385274434203680788>`,
    WEAPON_ATTACK: `<:weapon_attack:385567336272363530>`,
    WEAPON_HEALTH: `<:weapon_dur:385567315330072586>`,
    MANA: {
      0: `<:mana0:385574759351451658>`,
      1: `<:mana1:385574809830031370>`,
      2: `<:mana2:385574815094013953>`,
      3: `<:mana3:385574820223647744>`,
      4: `<:mana4:385574827299307540>`,
      5: `<:mana5:385574836833091585>`,
      6: `<:mana6:385569303916707850>`,
      7: `<:mana7:385569309855973377>`,
      8: `<:mana8:385569314431827981>`,
      9: `<:mana9:385569321126068235>`,
      10: `<:mana10:385569326935310366>`,
      11: `<:mana11:385569332836433921>`,
      12: `<:mana12:385569338780024832>`,
      25: `<:mana25:385569346229108737>`
    }
  },
  RARITIES: {
    LEGENDARY: {
      color: 0xFDB90E,
      emoji: `<:legendary:385572444024340491>`,
      dust: `1600`,
    },
    EPIC: {
      color: 0x893BA0,
      emoji: `<:epic:385572450634825729>`,
      dust: `400`,
    },
    RARE: {
      color: 0x337FDF,
      emoji: `<:rare:385572473401376778>`,
      dust: `100`,
    },
    COMMON: {
      color: 0x8D9695,
      emoji: `<:common:385572456443936779>`,
      dust: `40`,
    },
    FREE: {
      color: 0x8D9695,
      emoji: `<:common:385572456443936779>`,
      dust: `0`,
    }
  },
  CLASSES: {
    DRUID: {
      color: 0x7A4929,
      icon: `https://jjdev.io/hearthbot/img/Druid.png`
    },
    HUNTER: {
      color: 0x027c00,
      icon: `https://jjdev.io/hearthbot/img/Hunter.png`
    },
    MAGE: {
      color: 0x006eff,
      icon: `https://jjdev.io/hearthbot/img/Mage.png`
    },
    PALADIN: {
      color: 0xcec400,
      icon: `https://jjdev.io/hearthbot/img/Paladin.png`
    },
    PRIEST: {
      color: 0xc9c9c9,
      icon: `https://jjdev.io/hearthbot/img/Priest.png`
    },
    ROGUE: {
      color: 0x474747,
      icon: `https://jjdev.io/hearthbot/img/Rogue.png`
    },
    SHAMAN: {
      color: 0x42ffe5,
      icon: `https://jjdev.io/hearthbot/img/Shaman.png`
    },
    WARLOCK: {
      color: 0x8855b2,
      icon: `https://jjdev.io/hearthbot/img/Warlock.png`
    },
    WARRIOR: {
      color: 0xa80000,
      icon: `https://jjdev.io/hearthbot/img/Warrior.png`
    },
    DEMON_HUNTER: {
      color: 0x173836,
      icon: `https://jjdev.io/hearthbot/img/DemonHunter.png`
    },
    NEUTRAL: {
      color: 0x34363B,
      icon: ``
    }
  }
}

export const DONATE_LINK = `https://www.buymeacoffee.com/hydroto`
export const DONATE_CHANCE = 50