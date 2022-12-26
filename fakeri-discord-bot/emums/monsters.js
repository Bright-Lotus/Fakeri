const Monsters = [
    {
        Sklime: {
            id: 1,
            keywords: [
                {
                    displayName: 'Last Breath',
                    type: 'LastBreath',
                    subtype: 'split',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    ratio: 50,
                },
            ],
            minLvl: 1,
            // Xp the monster gives when killed
            baseXp: 50,
            gold: 20,
            stats: {
                armor: 10,
                atk: 30,
                hp: 50,
                magicDurability: 5,
                spd: 7,
            },
        },
        Firaey: {
            id: 2,
            keywords: [
                {
                    displayName: 'Flame Touch',
                    type: 'FlameTouch',
                    subtype: 'burn',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    ratio: 3,
                },
            ],
            minLvl: 3,
            // XP the monster gives when killed
            baseXp: 60,
            gold: 20,
            stats: {
                armor: 7,
                atk: 25,
                hp: 55,
                magicDurability: 10,
                spd: 15,
            },
        },
        Grormalis: {
            id: 3,
            keywords: [],
            minLvl: 5,
            // XP the monster gives when killed
            baseXp: 70,
            gold: 20,
            stats: {
                armor: 10,
                atk: 35,
                hp: 70,
                magicDurability: 10,
                spd: 5,
            },
        },
        Celerita: {
            id: 4,
            keywords: [],
            minLvl: 7,
            // XP the monster gives when killed
            baseXp: 80,
            gold: 30,
            stats: {
                armor: 10,
                atk: 55,
                hp: 80,
                magicDurability: 10,
                spd: 40,
            },
        },
        Rockolapis: {
            id: 4,
            keywords: [
                {
                    displayName: 'Hardened',
                    type: 'Hardened',
                    subtype: 'hardened',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    ratio: 50,
                },
            ],
            minLvl: 10,
            // XP the monster gives when killed
            baseXp: 90,
            gold: 30,
            stats: {
                armor: 40,
                atk: 35,
                hp: 100,
                magicDurability: 30,
                spd: 2,
            },
        },
        Tigrisae: {
            id: 5,
            keywords: [
                {
                    displayName: 'Elusive',
                    type: 'Elusive',
                    subtype: 'dodge',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    ratio: 40,
                },
            ],
            minLvl: 13,
            // XP the monster gives when killed
            baseXp: 100,
            gold: 40,
            stats: {
                armor: 40,
                atk: 65,
                hp: 120,
                magicDurability: 30,
                spd: 33,
            },
        },
        Rinja: {
            id: 6,
            keywords: [
                {
                    displayName: 'Elusive',
                    type: 'Elusive',
                    subtype: 'dodge',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    ratio: 50,
                },
            ],
            minLvl: 15,
            // XP the monster gives when killed
            baseXp: 110,
            gold: 40,
            stats: {
                armor: 40,
                atk: 80,
                hp: 140,
                magicDurability: 35,
                spd: 76,
            },
        },
        Aquatis: {
            id: 7,
            keywords: [],
            minLvl: 17,
            // XP the monster gives when killed
            baseXp: 120,
            gold: 50,
            stats: {
                armor: 60,
                atk: 85,
                hp: 150,
                magicDurability: 60,
                spd: 30,
            },
        },
        Monkyai: {
            id: 8,
            keywords: [],
            minLvl: 20,
            // XP the monster gives when killed
            baseXp: 130,
            gold: 50,
            stats: {
                armor: 70,
                atk: 95,
                hp: 165,
                magicDurability: 60,
                spd: 40,
            },
        },
        Rapidrus: {
            id: 9,
            keywords: [
                {
                    displayName: 'Fast',
                    type: 'Fast',
                    subtype: 'fast',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    // For fast keyword, it doesn't matter
                    ratio: 0,
                },
            ],
            minLvl: 23,
            // XP the monster gives when killed
            baseXp: 140,
            gold: 60,
            stats: {
                armor: 80,
                atk: 105,
                hp: 170,
                magicDurability: 60,
                spd: 999,
            },
        },
        Duelitrus: {
            id: 10,
            keywords: [
                {
                    displayName: 'Duelist',
                    type: 'Duelist',
                    subtype: 'duelist',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    // For fast keyword, it doesn't matter
                    ratio: 10,
                },
            ],
            minLvl: 47,
            // XP the monster gives when killed
            baseXp: 220,
            gold: 200,
            stats: {
                armor: 380,
                atk: 360,
                hp: 430,
                magicDurability: 350,
                spd: 450,
            },
        },
        Mavpiric: {
            id: 11,
            keywords: [
                {
                    displayName: 'Vampiric',
                    type: 'Vampiric',
                    subtype: 'vampiric',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    // For fast keyword, it doesn't matter
                    ratio: 30,
                },
            ],
            minLvl: 25,
            // XP the monster gives when killed
            baseXp: 160,
            gold: 60,
            stats: {
                armor: 100,
                atk: 130,
                hp: 160,
                magicDurability: 70,
                spd: 99,
            },
        },
        Jarringu: {
            id: 12,
            keywords: [],
            minLvl: 27,
            // XP the monster gives when killed
            baseXp: 170,
            gold: 80,
            stats: {
                armor: 120,
                atk: 150,
                hp: 180,
                magicDurability: 80,
                spd: 79,
            },
        },
        Duplusia: {
            id: 13,
            keywords: [
                {
                    displayName: 'Last Breath',
                    type: 'LastBreath',
                    subtype: 'split',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    ratio: 70,
                },
            ],
            minLvl: 30,
            // XP the monster gives when killed
            baseXp: 180,
            gold: 80,
            stats: {
                armor: 150,
                atk: 190,
                hp: 250,
                magicDurability: 140,
                spd: 24,
            },
        },
        Diaplicates: {
            id: 14,
            keywords: [
                {
                    displayName: 'Last Breath',
                    type: 'LastBreath',
                    subtype: 'split',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    ratio: 70,
                },
            ],
            minLvl: 30,
            // XP the monster gives when killed
            baseXp: 190,
            gold: 100,
            stats: {
                armor: 170,
                atk: 210,
                hp: 290,
                magicDurability: 180,
                spd: 50,
            },
        },
        Elusus: {
            id: 15,
            keywords: [
                {
                    displayName: 'Elusive',
                    type: 'Elusive',
                    subtype: 'elusive',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    ratio: 50,
                },
            ],
            minLvl: 33,
            // XP the monster gives when killed
            baseXp: 210,
            gold: 120,
            stats: {
                armor: 200,
                atk: 250,
                hp: 310,
                magicDurability: 200,
                spd: 120,
            },
        },
        Amoglosus: {
            id: 17,
            keywords: [],
            minLvl: 35,
            // XP the monster gives when killed
            baseXp: 210,
            gold: 120,
            stats: {
                armor: 220,
                atk: 280,
                hp: 340,
                magicDurability: 230,
                spd: 240,
            },
        },
        Rekiviak: {
            id: 18,
            keywords: [],
            minLvl: 37,
            // XP the monster gives when killed
            baseXp: 230,
            gold: 140,
            stats: {
                armor: 250,
                atk: 300,
                hp: 370,
                magicDurability: 260,
                spd: 260,
            },
        },
        Forctia: {
            id: 19,
            keywords: [
                {
                    displayName: 'Hardened',
                    type: 'Hardened',
                    subtype: 'hardened',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    ratio: 100,
                },
            ],
            minLvl: 40,
            // XP the monster gives when killed
            baseXp: 250,
            gold: 160,
            stats: {
                armor: 300,
                atk: 300,
                hp: 400,
                magicDurability: 280,
                spd: 260,
            },
        },
        Venienu: {
            id: 20,
            keywords: [
                {
                    type: 'PoisonousAttacks',
                    displayName: 'Poisonous Attacks',
                    subtype: 'burn',
                    ratio: 3,
                },
            ],
            minLvl: 43,
            // XP the monster gives when killed
            baseXp: 280,
            gold: 180,
            stats: {
                armor: 320,
                atk: 330,
                hp: 420,
                magicDurability: 280,
                spd: 300,
            },
        },
        Fighret: {
            id: 21,
            keywords: [
                {
                    displayName: 'Duelist',
                    type: 'Duelist',
                    subtype: 'duelist',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    // For fast keyword, it doesn't matter
                    ratio: 12,
                },
            ],
            minLvl: 45,
            // XP the monster gives when killed
            baseXp: 300,
            gold: 200,
            stats: {
                armor: 360,
                atk: 340,
                hp: 400,
                magicDurability: 280,
                spd: 400,
            },
        },
        Ruisu: {
            id: 22,
            keywords: [
                {
                    type: 'Plasmatic',
                    displayName: 'Plasmatic',
                    subtype: 'burn',
                    ratio: 2,
                },
            ],
            minLvl: 22,
            // XP the monster gives when killed
            baseXp: 222,
            gold: 222,
            stats: {
                armor: 222,
                atk: 222,
                hp: 222,
                magicDurability: 222,
                spd: 222,
            },
        },
        Farusive: {
            id: 23,
            keywords: [
                {
                    displayName: 'Elusive',
                    type: 'Elusive',
                    subtype: 'elusive',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    // For fast keyword, it doesn't matter
                    ratio: 50,
                },
            ],
            minLvl: 50,
            // XP the monster gives when killed
            baseXp: 240,
            gold: 220,
            stats: {
                armor: 420,
                atk: 370,
                hp: 440,
                magicDurability: 380,
                spd: 500,
            },
        },
        Nurmalus: {
            id: 24,
            keywords: [],
            minLvl: 53,
            // XP the monster gives when killed
            baseXp: 260,
            gold: 240,
            stats: {
                armor: 450,
                atk: 390,
                hp: 470,
                magicDurability: 400,
                spd: 520,
            },
        },
        Strakus: {
            id: 24,
            keywords: [],
            abilities: {
                type: 'ability',
                subtype: 'plasmaStrike',
                ratio: 60,
                displayName: 'Plasma Strike',
            },
            minLvl: 55,
            // XP the monster gives when killed
            baseXp: 290,
            gold: 270,
            stats: {
                armor: 480,
                atk: 420,
                hp: 500,
                magicDurability: 400,
                spd: 540,
            },
        },
        Magiaca: {
            id: 25,
            keywords: [],
            abilities: {
                type: 'ability',
                subtype: 'thunderStrike',
                ratio: 80,
                displayName: 'Thunder Strike',
            },
            minLvl: 57,
            // XP the monster gives when killed
            baseXp: 330,
            gold: 300,
            stats: {
                armor: 510,
                atk: 460,
                hp: 550,
                magicDurability: 470,
                spd: 550,
            },
        },
        Fastalaci: {
            id: 26,
            keywords: [
                {
                    type: 'Fast',
                    subtype: 'fast',
                    displayName: 'Fast',
                    ratio: 0,
                },
            ],
            minLvl: 63,
            // XP the monster gives when killed
            baseXp: 360,
            gold: 340,
            stats: {
                armor: 540,
                atk: 490,
                hp: 580,
                magicDurability: 500,
                spd: 590,
            },
        },
        Elitia: {
            id: 27,
            keywords: [
                {
                    type: 'Elite',
                    subtype: 'Elite',
                    displayName: 'Elite',
                    ratio: 0,
                },
            ],
            minLvl: 65,
            // XP the monster gives when killed
            baseXp: 390,
            gold: 370,
            stats: {
                armor: 570,
                atk: 520,
                hp: 610,
                magicDurability: 540,
                spd: 610,
            },
        },
        Furarivita: {
            id: 28,
            keywords: [
                {
                    displayName: 'Vampiric',
                    type: 'Vampiric',
                    subtype: 'vampiric',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    // For fast keyword, it doesn't matter
                    ratio: 40,
                },
            ],
            minLvl: 67,
            // XP the monster gives when killed
            baseXp: 430,
            gold: 410,
            stats: {
                armor: 610,
                atk: 560,
                hp: 660,
                magicDurability: 570,
                spd: 640,
            },
        },
        Furvitatos: {
            id: 29,
            keywords: [],
            abilities: {
                type: 'ability',
                subtype: 'vampiricStrike',
                ratio: 60,
                displayName: 'Vampiric Strike',
            },
            minLvl: 70,
            // XP the monster gives when killed
            baseXp: 460,
            gold: 440,
            stats: {
                armor: 650,
                atk: 600,
                hp: 700,
                magicDurability: 610,
                spd: 700,
            },
        },
        Icyatos: {
            id: 30,
            keywords: [],
            abilities: {
                type: 'cripple',
                subtype: 'armorCripple',
                ratio: 35,
            },
            minLvl: 73,
            // XP the monster gives when killed
            baseXp: 500,
            gold: 480,
            stats: {
                armor: 690,
                atk: 640,
                hp: 740,
                magicDurability: 660,
                spd: 740,
            },
        },
        Lavatos: {
            id: 31,
            keywords: [],
            abilities: {
                type: 'ability',
                subtype: 'lavaStrike',
                ratio: 80,
                displayName: 'Lava Strike',
            },
            minLvl: 75,
            // XP the monster gives when killed
            baseXp: 540,
            gold: 520,
            stats: {
                armor: 730,
                atk: 700,
                hp: 760,
                magicDurability: 690,
                spd: 770,
            },
        },
        Ignisia: {
            id: 32,
            keywords: [
                {
                    type: 'FlameTouch',
                    displayName: 'Flame Touch',
                    subtype: 'burn',
                    ratio: 3,
                },
            ],
            minLvl: 77,
            // XP the monster gives when killed
            baseXp: 600,
            gold: 530,
            stats: {
                armor: 740,
                atk: 770,
                hp: 760,
                magicDurability: 690,
                spd: 770,
            },
        },
        Laion: {
            id: 33,
            keywords: [
                {
                    displayName: 'Hardened',
                    type: 'Hardened',
                    subtype: 'hardened',
                    // Intensity of keyword or ability, for example, 50 means splits with 50% stats of the original
                    ratio: 100,
                },
            ],
            minLvl: 80,
            // XP the monster gives when killed
            baseXp: 640,
            gold: 570,
            stats: {
                armor: 800,
                atk: 770,
                hp: 800,
                magicDurability: 750,
                spd: 770,
            },
        },
        Letalenum: {
            id: 34,
            keywords: [
                {
                    type: 'PoisonousAttacks',
                    displayName: 'Poisonous Attacks',
                    subtype: 'bonusDmgAndBurn',
                    ratio: 4,
                },
            ],
            minLvl: 83,
            // XP the monster gives when killed
            baseXp: 700,
            gold: 600,
            stats: {
                armor: 840,
                atk: 820,
                hp: 840,
                magicDurability: 770,
                spd: 850,
            },
        },
        Juan: {
            id: 35,
            keywords: [],
            minLvl: 85,
            // XP the monster gives when killed
            baseXp: 740,
            gold: 640,
            stats: {
                armor: 880,
                atk: 860,
                hp: 880,
                magicDurability: 830,
                spd: 900,
            },
        },
        Comemiax: {
            id: 36,
            keywords: [],
            minLvl: 90,
            // XP the monster gives when killed
            baseXp: 900,
            gold: 800,
            stats: {
                armor: 990,
                atk: 960,
                hp: 1000,
                magicDurability: 950,
                spd: 999,
            },
        },
        Laluaura: {
            id: 37,
            keywords: [],
            minLvl: 90,
            // XP the monster gives when killed
            baseXp: 910,
            gold: 810,
            stats: {
                armor: 1000,
                atk: 970,
                hp: 1000,
                magicDurability: 950,
                spd: 999,
            },
        },
        Bananiana: {
            id: 38,
            keywords: [],
            minLvl: 93,
            // XP the monster gives when killed
            baseXp: 920,
            gold: 820,
            stats: {
                armor: 1010,
                atk: 980,
                hp: 1010,
                magicDurability: 970,
                spd: 999,
            },
        },
        Contiodusrespiatus: {
            id: 39,
            keywords: [],
            minLvl: 95,
            // XP the monster gives when killed
            baseXp: 930,
            gold: 830,
            stats: {
                armor: 1020,
                atk: 990,
                hp: 1020,
                magicDurability: 1000,
                spd: 999,
            },
        },
        Liuasu: {
            id: 40,
            keywords: [],
            minLvl: 100,
            // XP the monster gives when killed
            baseXp: 1000,
            gold: 1000,
            stats: {
                armor: 1040,
                atk: 1000,
                hp: 1100,
                magicDurability: 1050,
                spd: 2222,
            },
        },
    },
];

module.exports = { Monsters };