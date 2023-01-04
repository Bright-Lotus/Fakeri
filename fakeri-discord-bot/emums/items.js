const { Abilities } = require('./abilities');

const Swords = Object.freeze({
    sword0: {
        name: 'Wooden Sword',
        price: 1,
        minLvl: 1,
        stats: {
            atk: 5,
            spd: 1,
        },
        perks: {},
    },
    sword1: {
        minLvl: 5,
        name: 'Concise Blade',
        stats: {
            atk: 10,
            spd: 7,
        },
        perks: {},
        price: 100,
    },
    sword2: {
        minLvl: 10,
        name: 'Sword of Rakutar',
        stats: {
            atk: 20,
            spd: 7,
        },
        perks: {},
        price: 200,
    },
    sword3: {
        minLvl: 15,
        name: 'Ancient Scimitar',
        stats: {
            atk: 30,
            spd: 20,
        },
        perks: {},
        price: 250,
    },
    sword4: {
        minLvl: 20,
        name: 'Zweihander',
        stats: {
            atk: 40,
            spd: 30,
        },
        perks: {},
        price: 400,
    },
    sword5: {
        minLvl: 25,
        name: 'Edge of Anhiliation',
        stats: {
            atk: 60,
            spd: 30,
        },
        perks: {
            perk1: {
                perk: 'execute',
                perkDesc: 'Ejecuta a los enemigos por debajo de **5%** HP.',
                perkName: 'Anhiliation Grasp',
                ratio: 5,
            },
        },
        price: 600,
    },
    sword6: {
        minLvl: 30,
        name: 'Katana of the Master',
        stats: {
            atk: 60,
            spd: 70,
        },
        perks: {},
        price: 700,
    },
    sword7: {
        minLvl: 35,
        name: 'Inferno Claymore',
        stats: {
            atk: 90,
            spd: 60,
        },
        perks: {
            perk1: {
                perk: 'burn',
                perkDesc: 'Tus ataques queman a los enemigos por **15% ATK**.',
                perkName: 'Infernal Feast',
                ratio: 15,
            },
        },
        price: 900,
    },
    sword8: {
        minLvl: 40,
        name: 'Reach of the Condemned',
        stats: {
            atk: 110,
            spd: 80,
        },
        perks: {
            perk1: {
                perk: 'mark',
                perkDesc:
                    'Tus ataques marcan a los enemigos, atacalos de nuevo para explotar la marca y hacer **20% de tu ATK**.',
                perkName: 'Condenmed Touch',
                ratio: 20,
            },
        },
        price: 1100,
    },
    sword9: {
        minLvl: 45,
        name: 'Antartic Excalibur',
        stats: {
            atk: 150,
            spd: 60,
        },
        perks: {
            perk1: {
                perk: 'freeze',
                perkDesc:
                    'Tus ataques congelan al enemigo, quitandoles **10 + 15% ATK** de armadura.',
                perkName: 'Frozen Clutches',
                ratio: '10/15',
            },
        },
        price: 1300,
    },
    sword10: {
        minLvl: 50,
        name: 'Frozen Blade of Arcturius',
        stats: {
            atk: 140,
            spd: 120,
        },
        perks: {
            perk1: {
                perk: 'freeze',
                perkDesc:
                    'Tus ataques congelan al enemigo, quitandoles **13 + 20% ATK** de armadura.',
                perkName: 'Ice Shatter',
                ratio: '13/20',
            },
        },
        price: 1600,
    },
    sword11: {
        minLvl: 55,
        name: 'Hellfire Thorn',
        stats: {
            atk: 170,
            spd: 140,
        },
        perks: {
            perk1: {
                perk: 'burn',
                perkDesc:
                    'Tus ataques incendian a los enemigos en fuego infernal por **15% de tu ATK**.',
                perkName: 'Hellfire Burning',
                ratio: 15,
            },
        },
        price: 1900,
    },
    sword12: {
        minLvl: 60,
        name: 'Blazing Rod of Firicus',
        stats: {
            atk: 200,
            spd: 180,
        },
        perks: {
            perk1: {
                perk: 'burn',
                perkDesc:
                    'Tus ataques encienden a los enemigos en fuego magico por **17% de tu ATK**.',
                perkName: 'Blazing Pyre',
                ratio: 17,
            },
        },
        price: 2300,
    },
    sword13: {
        minLvl: 65,
        name: 'Eternal Phoenix\'s Judgement',
        stats: {
            atk: 220,
            spd: 180,
        },
        perks: {
            perk1: {
                perk: 'burn',
                perkDesc:
                    'La llama del phoenix eterno inflama a tus enemigos por **23% de tu ATK** en cada ataque',
                perkName: 'The Wrath of Phoenix',
                ratio: 23,
            },
        },
        price: 2700,
    },
    sword14: {
        minLvl: 70,
        name: 'Epic Cutlass',
        stats: {
            atk: 260,
            spd: 150,
        },
        perks: {},
        price: 3000,
    },
    sword15: {
        minLvl: 75,
        name: 'Glorious Rapier of Velox',
        stats: {
            atk: 280,
            spd: 230,
        },
        perks: {
            perk1: {
                perk: 'gainSpd',
                perkDesc: 'Tus gloriosos ataques te dan **1 de SPEED** permanente.',
                perkName: 'Glorious Gains',
                ratio: 1,
            },
        },
        price: 3300,
    },
    sword16: {
        minLvl: 80,
        name: 'Sword of Experts',
        stats: {
            atk: 300,
            spd: 250,
        },
        perks: {},
        price: 3500,
    },
    sword17: {
        minLvl: 85,
        name: 'Completely Regular and Normal Weapon',
        stats: {
            atk: 350,
            spd: 250,
        },
        perks: {},
        price: 3700,
    },
    sword18: {
        minLvl: 90,
        name: 'Duelist Blade',
        stats: {
            atk: 400,
            spd: 270,
        },
        perks: {
            perk1: {
                perk: 'gainAtk',
                perkDesc: 'Tus valientes ataques te dan **0.5 de ATK** permanente.',
                perkName: 'Duelist Virtue',
                ratio: 0.5,
            },
        },
        price: 4000,
    },
    sword19: {
        minLvl: 95,
        name: 'I ran out of names help',
        stats: {
            atk: 420,
            spd: 350,
        },
        perks: {},
        price: 4200,
    },
    sword20: {
        minLvl: 100,
        name: 'Dagger of the Rich',
        stats: {
            atk: 450,
            spd: 340,
        },
        perks: {
            perk1: {
                perk: 'gainGold',
                perkDesc:
                    'Tus ataques llenos de riqueza te dan **4 de ORO** permanente.',
                perkName: 'Rich Money',
                ratio: 4,
            },
        },
        price: 5000,
    },
});

const Wands = Object.freeze({
    wand1: {
        minLvl: 1,
        price: 100,
        name: 'Stone Wand',
        stats: {
            magicStrength: 10,
            mana: 10,
        },
        perks: {},
    },
    wand2: {
        minLvl: 5,
        price: 250,
        name: 'Arcane Focus',
        stats: {
            magicStrength: 20,
            mana: 20,
        },
        perks: {
            perk1: {
                perk: 'gainMagicCombat',
                perkDesc:
                    'Tus ataques te dan **4 de Magic STRENGTH** hasta matar al enemigo.',
                perkName: 'Focused Power',
                ratio: 4,
            },
        },
    },
    wand3: {
        minLvl: 10,
        price: 400,
        name: 'Crystal Scepter',
        stats: {
            magicStrength: 30,
            mana: 25,
        },
        perks: {},
    },
    wand4: {
        minLvl: 15,
        price: 600,
        name: 'Magical Rod',
        stats: {
            magicStrength: 45,
            mana: 30,
        },
        perks: {},
    },
    wand5: {
        minLvl: 20,
        price: 900,
        name: 'Celestial Wand',
        stats: {
            magicStrength: 60,
            mana: 35,
        },
        perks: {
            perk1: {
                perk: 'starStrike',
                perkDesc:
                    'Tus ataques hacen **10% de Magic STRENGTH** adicional con el poder de las estrellas.',
                perkName: 'Stars Aid',
                ratio: 10,
            },
        },
    },
    wand6: {
        minLvl: 25,
        price: 1200,
        name: 'Frostfire Bracer',
        stats: {
            magicStrength: 80,
            mana: 40,
        },
        perks: {
            perk1: {
                perk: 'freezeFire',
                perkDesc:
                    'Tus ataques le quitan **5% de Magic STRENGTH** de armadura al enemigo; Haces 10 de daño extra.',
                perkName: 'Fire of the Cold',
                ratio: '5/10',
            },
        },
    },
    wand7: {
        minLvl: 30,
        price: 1500,
        name: 'F.M. Rod',
        stats: {
            magicStrength: 110,
            mana: 45,
        },
        perks: {},
    },
    wand8: {
        minLvl: 30,
        price: 1700,
        name: 'Witch\'s Wand',
        stats: {
            magicStrength: 130,
            mana: 55,
        },
        perks: {},
    },
    wand9: {
        minLvl: 35,
        price: 2000,
        name: 'Shard of the Archangel\'s Staff',
        stats: {
            magicStrength: 155,
            mana: 60,
        },
        perks: {
            perk1: {
                perk: 'mark',
                perkDesc:
                    'Tus ataques marcan a los enemigos, atacalos de nuevo para explotar la marca y hacer **30% de tu Magic STRENGTH**.',
                perkName: 'Archangel\'s Touch',
                ratio: 30,
            },
        },
    },
    wand10: {
        minLvl: 40,
        price: 2200,
        name: 'Mystical Scepter',
        perks: {},
        stats: {
            magicStrength: 170,
            mana: 70,
        },
    },
    wand11: {
        minLvl: 45,
        price: 2400,
        name: 'Elemental Catalyst',
        stats: {
            magicStrength: 200,
            mana: 60,
        },
        perks: {
            perk1: {
                perk: 'natureStrike',
                perkDesc:
                    'Tus ataques hacen **20% de Magic STRENGTH** adicional con el poder de Gaia.',
                perkName: 'Power of Mother Nature',
                ratio: 20,
            },
        },
    },
    wand12: {
        minLvl: 50,
        name: 'Furious Fire Rod',
        stats: {
            magicStrength: 240,
            mana: 70,
        },
        price: 2700,
        perks: {
            perk1: {
                perk: 'burn',
                perkDesc:
                    'Tus ataques queman en fuego furioso a los enemigos por **25% Magic STRENGTH**.',
                perkName: 'Mad Furious Third Degree Burn',
                ratio: 25,
            },
        },
    },
    wand13: {
        minLvl: 55,
        name: 'Calmed Fire Rod',
        stats: {
            magicStrength: 270,
            mana: 80,
        },
        price: 3000,
        perks: {
            perk1: {
                perk: 'burn',
                perkDesc:
                    'Tus ataques queman en fuego calmado a los enemigos por **30% Magic STRENGTH**.',
                perkName: 'Real Chill First Degree Burn',
                ratio: 30,
            },
        },
    },
    wand14: {
        minLvl: 60,
        name: 'Mad Crazy Ice Wand',
        price: 3300,
        stats: {
            magicStrength: 300,
            mana: 85,
        },
        perks: {
            perk1: {
                perk: 'freeze',
                perkDesc:
                    'Tus ataques congelan al enemigo en hielo loco, quitandoles **10 + 20% Magic STRENGTH** de armadura.',
                perkName: 'Extremely Crazy Frrrreeze',
                ratio: '10/20',
            },
        },
    },
    wand15: {
        minLvl: 65,
        name: 'Nothing Special Wand',
        price: 3500,
        stats: {
            magicStrength: 315,
            mana: 100,
        },
        perks: {},
    },
    wand16: {
        minLvl: 70,
        name: 'Power Scepter',
        price: 3700,
        stats: {
            magicStrength: 350,
            mana: 90,
        },
        perks: {
            perk1: {
                perk: 'gainMgc',
                perkDesc: 'Tus ataques succionan el alma de tu enemigo; Gana **0.5 de Magic STRENGTH** permanente.',
                perkName: 'Soul Siphon',
                ratio: 0.5,
            },
        },
    },
    wand17: {
        minLvl: 75,
        price: 4000,
        name: 'Thunderous Baton',
        stats: {
            magicStrength: 400,
            mana: 90,
        },
        perks: {
            perk1: {
                perk: 'thunderStrike',
                perkDesc:
                    'Tus ataques hacen **20% de Magic STRENGTH** adicional con el poder del TRUENO.',
                perkName: 'Electrical Attack',
                ratio: 20,
            },
        },
    },
    wand18: {
        minLvl: 80,
        price: 4200,
        name: 'Sunny Bane of Albus',
        perks: {
            perk1: {
                perk: 'sunStrike',
                perkDesc:
                    'Tus ataques hacen **25% de Magic STRENGTH** adicional con el poder del SOL',
                perkName: 'Sun Burn',
                ratio: 25,
            },
        },
        stats: {
            magicStrength: 420,
            mana: 120,
        },
    },
    wand19: {
        minLvl: 85,
        price: 4500,
        name: 'Special Wand of Sabrina',
        perks: {},
        stats: {
            magicStrength: 470,
            mana: 140,
        },
    },
    wand20: {
        minLvl: 90,
        price: 4800,
        name: 'Wealthy Scepter of Zatanna',
        perks: {
            perk1: {
                perk: 'gainGold',
                perkDesc:
                    'Tus ataques te dan **4 de ORO** permanente.',
                perkName: 'Zatanna\'s Grasp',
                ratio: 4,
            },
        },
        stas: {
            magicStrength: 500,
            mana: 160,
        },
    },
    wand21: {
        minLvl: 95,
        price: 5000,
        name: 'Ancient Staff of Ragabon',
        stats: {
            magicStrength: 530,
            mana: 170,
        },
        perks: {
            perk1: {
                perk: 'gainSpd',
                perkDesc: 'Tus gloriosos ataques te dan **40 de SPEED** permanente.',
                perkName: 'Ragabon\'s Clutches',
                ratio: 40,
            },
        },
    },
    wand22: {
        minLvl: 100,
        price: 100,
        name: 'Free Wand',
        stats: {
            magicStrength: 540,
            mana: 180,
        },
        perks: {},
    },
});

const Bows = Object.freeze({
    bow1: {
        price: 1,
        minLvl: 1,
        name: 'Basic Bow',
        stats: {
            atk: 7,
            spd: 10,
        },
        perks: {},
    },
    bow2: {
        price: 100,
        minLvl: 5,
        name: 'Competent Bow',
        stats: {
            atk: 12,
            spd: 20,
        },
        perks: {},
    },
    bow3: {
        price: 300,
        minLvl: 10,
        stats: {
            atk: 17,
            spd: 27,
        },
        perks: {},
        name: 'Advanced Bow',
    },
    bow4: {
        price: 600,
        minLvl: 15,
        stats: {
            atk: 23,
            spd: 40,
        },
        name: 'Frostbite',
        perks: {
            perk1: {
                perk: 'freeze',
                perkDesc:
                    'Tus ataques congelan al enemigo, quitandoles **5 + 12% ATK** de armadura.',
                perkName: 'Cold Bite of the Winter',
                ratio: '5/12',
            },
        },
    },
    bow5: {
        price: 800,
        minLvl: 20,
        stats: {
            atk: 40,
            spd: 40,
        },
        name: 'Powerful Crossbow',
        perks: {},
    },
    bow6: {
        price: 1100,
        minLvl: 25,
        stats: {
            atk: 40,
            spd: 65,
        },
        name: 'Light Slingshot',
        perks: {},
    },
    bow7: {
        price: 1300,
        minLvl: 30,
        stats: {
            atk: 55,
            spd: 75,
        },
        name: 'Blazing Fury',
        perks: {
            perk1: {
                perk: 'burn',
                perkDesc: 'Tus ataques queman a los enemigos por **15% ATK**.',
                perkName: 'Blaze Touch',
                ratio: 15,
            },
        },
    },
    bow8: {
        price: 1600,
        minLvl: 35,
        stats: {
            atk: 70,
            spd: 100,
        },
        perks: {
            perk1: {
                perk: 'execute',
                perkDesc: 'Ejecuta a los enemigos por debajo de **5%** HP.',
                perkName: 'Clutches of the Deathbringer',
                ratio: 5,
            },
        },
        name: 'The Deathbringer',
    },
    bow9: {
        price: 1900,
        minLvl: 40,
        stats: {
            atk: 85,
            spd: 115,
        },
        name: 'Divine Fury',
        perks: {
            perk1: {
                perk: 'burn',
                perkDesc: 'Tus ataques queman a los enemigos con fuego divino por **25% ATK**.',
                perkName: 'Divine Cleanse',
                ratio: 25,
            },
        },
    },
    bow10: {
        price: 2200,
        minLvl: 45,
        stats: {
            atk: 100,
            spd: 140,
        },
        name: 'Reinforced Magical Longbow',
        perks: {
            perk1: {
                perk: 'freezeFire',
                perkDesc:
                    'Tus ataques le quitan **5% de ATK** de armadura al enemigo; Haces 10 de daño extra.',
                perkName: 'Magical Imbued Arrows',
                ratio: '5/10',
            },
        },
    },
    bow11: {
        price: 2400,
        minLvl: 50,
        stats: {
            atk: 130,
            spd: 160,
        },
        name: 'Ancestral Recurve Bow',
        perks: {},
    },
    bow12: {
        price: 2700,
        minLvl: 55,
        stats: {
            atk: 160,
            spd: 160,
        },
        perks: {
            perk1: {
                perk: 'mark',
                perkDesc:
                    'Tus ataques marcan a los enemigos, atacalos de nuevo para explotar la marca y hacer **30% de tu ATK**.',
                perkName: 'Sticky Bomb',
                ratio: 30,
            },
        },
        name: 'Technological Crossbow',
    },
    bow13: {
        price: 2900,
        minLvl: 60,
        stats: {
            atk: 180,
            spd: 200,
        },
        name: 'Tactical Bow',
        perks: {},
    },
    bow14: {
        price: 3200,
        minLvl: 65,
        stats: {
            atk: 200,
            spd: 220,
        },
        perks: {
            perk1: {
                perk: 'thunderStrike',
                perkDesc:
                    'Tus ataques hacen **20% de ATK** adicional con el poder de ZEUS.',
                perkName: 'Zeus\'s Bless',
                ratio: 20,
            },
        },
        name: 'Thunderstrike Short Bow',
    },
    bow15: {
        price: 3425,
        minLvl: 70,
        stats: {
            atk: 250,
            spd: 210,
        },
        name: 'Infinity Compound Bow',
        perks: {},
    },
    bow16: {
        price: 3600,
        minLvl: 75,
        stats: {
            atk: 260,
            spd: 270,
        },
        name: 'Starfall',
        perks: {
            perk1: {
                perk: 'starStrike',
                perkDesc:
                    'Tus ataques hacen **30% de ATK** adicional con el poder de las estrellas.',
                perkName: 'Star rain',
                ratio: 30,
            },
        },
    },
    bow17: {
        price: 3900,
        minLvl: 80,
        stats: {
            atk: 280,
            spd: 300,
        },
        name: 'Awesome Bow of Thoth',
        perks: {
            perk1: {
                perk: 'gainAtk',
                perkDesc: 'Tus asombrosos ataques te dan **0.5 de ATK** permanente.',
                perkName: 'Awesomeness Gift',
                ratio: 0.5,
            },
        },
    },
    bow18: {
        price: 3100,
        minLvl: 85,
        stats: {
            atk: 310,
            spd: 320,
        },
        name: 'Recurve Bow of Albus',
        perks: {},
    },
    bow19: {
        price: 3400,
        minLvl: 90,
        stats: {
            atk: 340,
            spd: 340,
        },
        name: 'Ancient Bow of Wealth',
        perks: {
            perk1: {
                perk: 'gainGold',
                perkDesc:
                    'Tus ataques llenos de riqueza te dan **5 de ORO** permanente.',
                perkName: 'Rich Get Richer',
                ratio: 5,
            },
        },
    },
    bow20: {
        price: 3600,
        minLvl: 95,
        stats: {
            atk: 360,
            spd: 380,
        },
        name: 'Imma be honest',
        perks: {},
    },
    bow21: {
        price: 3900,
        minLvl: 100,
        stats: {
            atk: 380,
            spd: 420,
        },
        name: 'I ran out of bow names',
        perks: {},
    },
});

const ArmorPlates = Object.freeze({
    armorPlate1: {
        price: 1,
        minLvl: 1,
        name: 'Stone Plate',
        stats: {
            armor: 10,
            magicDurability: 6,
        },
        perks: {},
    },
    armorPlate2: {
        price: 150,
        minLvl: 5,
        name: 'Turtle Carapace',
        stats: {
            armor: 20,
            magicDurability: 10,
            maxHp: 20,
        },
        perks: {},
    },
    armorPlate3: {
        price: 400,
        minLvl: 10,
        name: 'Toximail',
        stats: {
            armor: 30,
            magicDurability: 20,
            maxHp: 35,
        },
        perks: {
            perk1: {
                perk: 'thornmail',
                perkDesc:
                    'Cuanto tu enemigo te ataque, le devuelves **5 + 20% ARMOR** de daño.',
                perkName: 'Deadly Toxins',
                ratio: '5/20',
            },
        },
    },
    armorPlate4: {
        price: 650,
        name: 'Hardened Cuirass',
        stats: {
            armor: 50,
            magicDurability: 20,
            maxHp: 55,
        },
        perks: {},
        minLvl: 15,
    },
    armorPlate5: {
        price: 1000,
        name: 'Haunted Hauberk',
        minLvl: 20,
        stats: {
            armor: 70,
            magicDurability: 35,
            maxHp: 60,
        },
    },
    armorPlate6: {
        price: 1400,
        name: 'Glacial Placket',
        minLvl: 25,
        stats: {
            armor: 90,
            magicDurability: 50,
            maxHp: 80,
        },
        perks: {
            perk1: {
                perk: 'freeze',
                perkDesc:
                    'Los ataques de tu enemigo lo congelan, quitandoles **7% de tu ARMOR** al enemigo.',
                perkName: 'Polar Revenge',
                ratio: 7,
            },
        },
    },
    armorPlate7: {
        price: 1750,
        name: 'Ironmail',
        stats: {
            armor: 110,
            magicDurability: 60,
            maxHp: 90,
        },
        minLvl: 30,
        perks: {},
    },
    armorPlate8: {
        price: 2150,
        name: 'Flaming Carapace',
        minLvl: 35,
        stats: {
            armor: 130,
            magicDurability: 75,
            maxHp: 105,
        },
        perks: {
            perk1: {
                perk: 'thornmail',
                perkDesc:
                    'Cuanto tu enemigo te ataque, los quemas, devolviendoles **8 + 21% ARMOR** de daño.',
                perkName: 'Blazing Flames',
                ratio: '8/21',
            },
        },
    },
    armorPlate9: {
        price: 2400,
        minLvl: 40,
        name: 'Reinforced Iron Plate',
        stats: {
            armor: 160,
            magicDurability: 70,
            maxHp: 100,
        },
        perks: {},
    },
    armorPlate10: {
        price: 2700,
        minLvl: 45,
        name: 'Ancient Metal Plating',
        stats: {
            armor: 180,
            magicDurability: 80,
            maxHp: 110,
        },
        perks: {},
    },
    armorPlate11: {
        price: 3100,
        minLvl: 50,
        name: 'Spiky Hauberk',
        stats: {
            armor: 205,
            magicDurability: 70,
            maxHp: 135,
        },
        perks: {
            perk1: {
                perk: 'thornmail',
                perkDesc:
                    'Cuanto tu enemigo te ataque, le devuelves **10 + 23% ARMOR** de daño.',
                perkName: 'Pointy Stuff',
                ratio: '10/23',
            },
        },
    },
    armorPlate12: {
        price: 3500,
        minLvl: 55,
        name: 'Titanic Armor',
        stats: {
            armor: 215,
            magicDurability: 80,
            maxHp: 150,
        },
        perks: {
            perk1: {
                perk: 'gainArmor',
                perkDesc: 'Cuando tu enemigo te ataque, recibes **0.4 de ARMOR** permanente.',
                perkName: 'Syphon of the Titans',
                ratio: 0.4,
            },
        },
    },
    armorPlate13: {
        price: 3800,
        minLvl: 60,
        name: 'Reinforced Titanium Carapace',
        stats: {
            armor: 240,
            magicDurability: 80,
            maxHp: 175,
        },
        perks: {},
    },
    armorPlate14: {
        price: 3100,
        minLvl: 65,
        name: 'Remarkable Hauberk of Hyperion',
        stats: {
            armor: 260,
            magicDurability: 100,
            maxHp: 190,
        },
        perks: {},
    },
    armorPlate15: {
        price: 3500,
        minLvl: 70,
        name: 'Alive Armor of Mnemosyne',
        stats: {
            armor: 280,
            magicDurability: 120,
            maxHp: 200,
        },
        perks: {
            perk1: {
                perk: 'thornmail',
                perkDesc:
                    'Cuanto tu enemigo te ataque, la armadura lo atacara de vuelta, haciendole **15 + 25% ARMOR** de daño.',
                perkName: 'Revenge of Mnemosyne',
                ratio: '15/25',
            },
        },
    },
    armorPlate16: {
        price: 3900,
        minLvl: 75,
        name: 'Placket of the Dead',
        stats: {
            armor: 300,
            magicDurability: 120,
            maxHp: 190,
        },
        perks: {
            perk1: {
                perk: 'mark',
                perkDesc:
                    'Los ataques de tus enemigos los marcan, atacalos para explotar la marca y hacer **25% de tu ARMOR**.',
                perkName: 'Death\'s Embrace',
                ratio: 25,
            },
        },
    },
    armorPlate17: {
        price: 4300,
        minLvl: 80,
        name: 'Burglar\'s Breastplate',
        stats: {
            armor: 330,
            magicDurability: 150,
            maxHp: 185,
        },
        perks: {
            perk1: {
                perk: 'gainGold',
                perkDesc:
                    'Los ataques de tus enemigos hace que tu armadura les robe **4 de ORO**.',
                perkName: 'Thief\'s Mastery',
                ratio: 4,
            },
        },
    },
    armorPlate18: {
        price: 4600,
        minLvl: 85,
        name: 'Strong Armor Plate',
        stats: {
            armor: 350,
            magicDurability: 160,
            maxHp: 200,
        },
        perks: {},
    },
    armorPlate19: {
        price: 4900,
        minLvl: 90,
        name: 'Shadowsteel',
        stats: {
            armor: 370,
            magicDurability: 180,
            maxHp: 200,
        },
        perks: {
            perk1: {
                perk: 'dodge',
                perkDesc:
                    'Cada ataque de tu enemigo, hay un chance del 40% que tu armadura te envuelva en sombras, esquivando el ataque.',
                perkName: 'Shadows Embrace',
                ratio: 40,
            },
        },
    },
    armorPlate20: {
        price: 5200,
        minLvl: 95,
        name: 'Diamon Hauberk',
        stats: {
            armor: 410,
            magicDurability: 170,
            maxHp: 220,
        },
    },
    armorPlate21: {
        price: 5500,
        minLvl: 100,
        name: 'Reinforced Diamond Armor',
        stats: {
            armor: 450,
            magicDurability: 190,
            maxHp: 250,
        },
    },
});

const EnchanterAbilityOrbs = Object.freeze({
    abilityOrb1: {
        ratio: '50/50-75',
        ability: 'strike',
        requiredMana: '175',
        staticMana: '175',
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe inflige **__{ratio}% Magic STRENGTH__** (**50%** - **75%** ✳️) a cualquier enemigo.',
        name: 'Basic Strike I',
        price: 1,
        minLvl: 1,
    },
    abilityOrb2: {
        ratio: '60/60-80',
        ability: 'strike',
        requiredMana: 190,
        staticMana: 190,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe inflige **__{ratio}% Magic STRENGTH__** (**60%** - **80%** ✳️) a cualquier enemigo.',
        name: 'Advanced Strike II',
        price: 200,
        // minLvl should increment by 2
        minLvl: 3,
    },
    // Generate an abilityOrb object
    abilityOrb3: {
        ratio: '70/70-90',
        ability: 'strike',
        // requiredMana should increment by a number between 100 and 150
        requiredMana: 290,
        staticMana: 290,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe inflige **{ratio}% Magic STRENGTH** (**70%** - **90%** ✳️) a cualquier enemigo.',
        name: 'Arcane Strike III',
        price: 350,
        minLvl: 5,
    },
    abilityOrb4: {
        ratio: '80/80-100',
        burnRatio: '5',
        ability: 'burnStrike',
        requiredMana: 400,
        staticMana: 400,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe inflige **{ratio}% Magic STRENGTH** (**80%** - **100%** ✳️) a cualquier enemigo y los quema por **{burnRatio}% Magic STRENGTH**.',
        name: 'Fire Orb I',
        price: 500,
        minLvl: 7,
    },
    abilityOrb5: {
        ratio: '85/85-100',
        burnRatio: '6',
        ability: 'burnStrike',
        requiredMana: 420,
        staticMana: 420,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe inflige **{ratio}% Magic STRENGTH** (**85%** - **100%** ✳️) a cualquier enemigo y los quema por **{burnRatio}% Magic STRENGTH**.',
        name: 'Fire Orb II',
        price: 650,
        minLvl: 9,
    },
    abilityOrb6: {
        ratio: '85/85-100',
        burnRatio: '8',
        ability: 'burnStrike',
        requiredMana: 430,
        staticMana: 430,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe inflige **{ratio}% Magic STRENGTH** (**85%** - **100%** ✳️) a cualquier enemigo y los quema por **{burnRatio}% Magic STRENGTH**.',
        name: 'Fire Orb III',
        price: 800,
        minLvl: 11,
    },
    abilityOrb7: {
        ratio: '40/40-70',
        ability: 'heal',
        requiredMana: 300,
        staticMana: 300,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe cura a cualquier aliado por **{ratio}% Magic STRENGTH** (**40%** - **70%** ✳️).',
        name: 'Vita I',
        price: 600,
        minLvl: 13,
    },
    abilityOrb8: {
        ratio: '50/50-80',
        ability: 'heal',
        requiredMana: 300,
        staticMana: 300,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe cura a cualquier aliado por **{ratio}% Magic STRENGTH** (**50%** - **80%** ✳️).',
        name: 'Vita II',
        price: 750,
        minLvl: 15,
    },
    abilityOrb9: {
        ratio: '60/60-85',
        ability: 'healUpgraded',
        requiredMana: 350,
        staticMana: 350,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe cura a cualquier aliado por **{ratio}% Magic STRENGTH** (**60%** - **85%** ✳️), los cura **25%** extra si estan por debajo del **30%** de la vida.',
        name: 'Vita III',
        price: 800,
        minLvl: 17,
    },
    abilityOrb10: {
        ratio: '35/35-100',
        ability: 'healRevive',
        requiredMana: 400,
        staticMana: 400,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe revive a una alido y lo cura por **{ratio}% Magic STRENGTH** (**35%** - **100%** ✳️), si estan vivos, los cura por la misma cantidad.',
        name: 'Vita Nova I',
        price: 900,
        minLvl: 19,
    },
    abilityOrb11: {
        ratio: '50/40-100',
        ability: 'healRevive',
        requiredMana: 450,
        staticMana: 450,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe revive a una alido y lo cura por **{ratio}% Magic STRENGTH** (**40%** - **100%** ✳️), si estan vivos, los cura por la misma cantidad.',
        name: 'Vita Nova II',
        price: 1000,
        minLvl: 21,
    },
    abilityOrb12: {
        ratio: '65/50-100',
        ability: 'healRevive',
        requiredMana: 550,
        staticMana: 550,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe revive a una alido y lo cura por **{ratio}% Magic STRENGTH** (**50%** - **100%** ✳️), si estan vivos, los cura por la misma cantidad.',
        name: 'Vita Nova III',
        price: 1100,
        minLvl: 23,
    },
    abilityOrb13: {
        ratio: '80/80-100',
        ability: 'healRevive',
        requiredMana: 650,
        staticMana: 650,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe revive a una alido y lo cura por **{ratio}% Magic STRENGTH** (**50%** - **100%** ✳️), si estan vivos, los cura por la misma cantidad.',
        name: 'Vita Nova IV',
        price: 1200,
        minLvl: 25,
    },
    abilityOrb14: {
        ratio: '30/30-45',
        ability: 'empowerAlly',
        attacks: '3',
        requiredMana: 300,
        staticMana: 300,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe aumenta la **Stat Principal** de un aliado por **{ratio}% Magic STRENGTH** (**30%** - **45%** ✳️) por **{attacks}** ataques.',
        name: 'Fortis I',
        price: 600,
        minLvl: 27,
    },
    abilityOrb15: {
        ratio: '45/45-75',
        ability: 'empowerAlly',
        attacks: '4',
        requiredMana: 375,
        staticMana: 375,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe aumenta la **Stat Principal** de un aliado por **{ratio}% Magic STRENGTH** (**45%** - **75%** ✳️) por **{attacks}** ataques.',
        name: 'Fortis II',
        price: 750,
        minLvl: 29,
    },
    abilityOrb16: {
        ratio: '60/60-80',
        ability: 'empowerAlly',
        attacks: '4',
        requiredMana: 475,
        staticMana: 475,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe aumenta la **Stat Principal** de un aliado por **{ratio}% Magic STRENGTH** (**60%** - **80%** ✳️) por **{attacks}** ataques.',
        name: 'Fortis III',
        price: 850,
        minLvl: 31,
    },
    abilityOrb17: {
        ratio: '80/80-110',
        ability: 'empowerAlly',
        attacks: '5',
        requiredMana: 575,
        staticMana: 575,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe aumenta la **Stat Principal** de un aliado por **{ratio}% Magic STRENGTH** (**80%** - **110%** ✳️) por **{attacks}** ataques.',
        name: 'Fortis IV',
        price: 1000,
        minLvl: 33,
    },
    abilityOrb18: {
        ratio: '30/30-60',
        ability: 'weaken',
        requiredMana: 300,
        staticMana: 300,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe reduce la **Armor** de un enemigo por **{ratio}% Magic STRENGTH** (**20%** - **60%** ✳️).',
        name: 'Vulnera I',
        price: 300,
        minLvl: 35,
    },
    abilityOrb19: {
        ratio: '33/33-66',
        ability: 'weaken',
        requiredMana: 370,
        staticMana: 370,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe reduce la **Armor** de un enemigo por **{ratio}% Magic STRENGTH** (**33%** - **66%** ✳️).',
        name: 'Vulnera II',
        price: 400,
        minLvl: 37,
    },
    abilityOrb20: {
        ratio: '40/40-80',
        ability: 'weaken',
        requiredMana: 450,
        staticMana: 450,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe reduce la **Armor** de un enemigo por **{ratio}% Magic STRENGTH** (**40%** - **80%** ✳️).',
        name: 'Vulnera III',
        price: 500,
        minLvl: 39,
    },
    abilityOrb21: {
        ratio: '30/30-60',
        ability: 'weakenPower',
        requiredMana: 300,
        staticMana: 300,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe reduce el **ATK** de un enemigo por **{ratio}% Magic STRENGTH** (**30%** - **60%** ✳️).',
        name: 'Debilis I',
        price: 300,
        minLvl: 41,
    },
    abilityOrb22: {
        ratio: '33/33-66',
        ability: 'weakenPower',
        requiredMana: 370,
        staticMana: 370,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe reduce el **ATK** de un enemigo por **{ratio}% Magic STRENGTH** (**33%** - **66%** ✳️).',
        name: 'Debilis II',
        price: 400,
        minLvl: 43,
    },
    abilityOrb23: {
        ratio: '40/40-80',
        ability: 'weakenPower',
        requiredMana: 450,
        staticMana: 450,
        targetClass: 'enchanter',
        target: 'enemy',
        desc: 'Esta orbe reduce el **ATK** de un enemigo por **{ratio}% Magic STRENGTH** (**40%** - **80%** ✳️).',
        name: 'Debilis III',
        price: 500,
        minLvl: 45,
    },
    abilityOrb24: {
        ratio: '15/15-60',
        ability: 'empowerMana',
        attacks: '3',
        requiredMana: 300,
        staticMana: 300,
        targetClass: 'enchanter',
        target: 'self',
        desc: 'Esta orbe aumenta el **Mana PER ATTACK** tuyo por **{ratio}% Magic STRENGTH** (**30%** - **60%** ✳️) por **{attacks}** ataques.',
        name: 'Arcana I',
        price: 300,
        minLvl: 47,
    },
    abilityOrb25: {
        ratio: '20/20-70',
        ability: 'empowerMana',
        attacks: '3',
        requiredMana: 370,
        staticMana: 370,
        targetClass: 'enchanter',
        target: 'self',
        desc: 'Esta orbe aumenta el **Mana PER ATTACK** tuyo por **{ratio}% Magic STRENGTH** (**40%** - **70%** ✳️) por **{attacks}** ataques.',
        name: 'Arcana II',
        price: 400,
        minLvl: 49,
    },
    abilityOrb26: {
        ratio: '25/25-80',
        ability: 'empowerMana',
        attacks: '4',
        requiredMana: 450,
        staticMana: 450,
        targetClass: 'enchanter',
        target: 'self',
        desc: 'Esta orbe aumenta el **Mana PER ATTACK** tuyo por **{ratio}% Magic STRENGTH** (**40%** - **80%** ✳️) por **{attacks}** ataques.',
        name: 'Arcana III',
        price: 500,
        minLvl: 51,
    },
    abilityOrb27: {
        ratio: '30/30-60',
        ability: 'empowerAllyMana',
        attacks: '3',
        requiredMana: 300,
        staticMana: 300,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe aumenta el **Mana PER ATTACK** de un aliado por **{ratio}% Magic STRENGTH** (**30%** - **60%** ✳️) por **{attacks}** ataques.',
        name: 'Manamune I',
        price: 300,
        minLvl: 53,
    },
    abilityOrb28: {
        ratio: '40/40-70',
        ability: 'empowerAllyMana',
        attacks: '3',
        requiredMana: 370,
        staticMana: 370,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe aumenta el **Mana PER ATTACK** de un aliado por **{ratio}% Magic STRENGTH** (**40%** - **70%** ✳️) por **{attacks}** ataques.',
        name: 'Manamune II',
        price: 400,
        minLvl: 55,
    },
    abilityOrb29: {
        ratio: '50/50-80',
        ability: 'empowerAllyMana',
        attacks: '4',
        requiredMana: 450,
        staticMana: 450,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe aumenta el **Mana PER ATTACK** de un aliado por **{ratio}% Magic STRENGTH** (**50%** - **80%** ✳️) por **{attacks}** ataques.',
        name: 'Manamune III',
        price: 500,
        minLvl: 57,
    },
    abilityOrb30: {
        ratio: '20/20-80',
        ability: 'protectAlly',
        requiredMana: 300,
        staticMana: 300,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe le da **{ratio}% Magic STRENGTH** (**20%** - **80%** ✳️) de **ARMOR** a un aliado.',
        name: 'Turtle\'s Carapace I',
        price: 300,
        minLvl: 59,
    },
    abilityOrb31: {
        ratio: '30/30-90',
        ability: 'protectAlly',
        requiredMana: 370,
        staticMana: 370,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe le da **{ratio}% Magic STRENGTH** (**30%** - **90%** ✳️) de **ARMOR** a un aliado.',
        name: 'Turtle\'s Carapace II',
        price: 400,
        minLvl: 61,
    },
    abilityOrb32: {
        ratio: '40/40-100',
        ability: 'protectAlly',
        requiredMana: 450,
        staticMana: 450,
        targetClass: 'enchanter',
        target: 'ally',
        desc: 'Esta orbe le da **{ratio}% Magic STRENGTH** (**40%** - **100%** ✳️) de **ARMOR** a un aliado.',
        name: 'Turtle\'s Carapace III',
        price: 500,
        minLvl: 63,
    },
});

const WarriorAbilityOrbs = Object.freeze({
    abilityOrb1: {
        ratio: '20/20-80',
        ability: 'empowerAttack',
        attacks: '3',
        requiredMana: 300,
        staticMana: 300,
        targetClass: 'warrior',
        target: 'self',
        desc: 'Esta orbe aumenta el **ATK** tuyo por **{ratio}% Attack POWER** (**20%** - **80%** ✳️)** por **{attacks}** ataques.',
        minLvl: 1,
        price: 200,
        name: 'Fury of the Tiger I',
    },
});

const Consumables = Object.freeze({
    consumable1: {
        amount: 50,
        name: 'Small Vitalizer',
        price: 75,
        type: 'heal',
    },
    consumable2: {
        amount: 125,
        name: 'Bigger Vitalizer',
        price: 120,
        type: 'heal',
    },
    consumable3: {
        amount: 250,
        name: 'Large Vitalizer',
        price: 200,
        type: 'heal',
    },
    consumable4: {
        amount: 500,
        name: 'Life Restorer',
        price: 300,
        type: 'heal',
    },
    consumable5: {
        amount: 40,
        name: 'Small Mana Potion',
        price: 55,
        type: 'mana',
    },
    consumable6: {
        amount: 120,
        name: 'Bigger Mana Potion',
        price: 120,
        type: 'mana',
    },
    consumable7: {
        amount: 350,
        name: 'Tears of the Gods',
        price: 200,
        type: 'mana',
    },
    consumable8: {
        amount: 350,
        name: 'Jugo de Papaya',
        price: 250,
        type: 'heal',
    },
});

module.exports = { Swords, Wands, Bows, ArmorPlates, EnchanterAbilityOrbs, WarriorAbilityOrbs, Consumables };
