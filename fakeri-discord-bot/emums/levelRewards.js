const EnchanterTitles = Object.freeze({
    Apprentice: {
        reward: 'abilityOrb',
        displayName: 'Apprentice',
        orb: {
            ratio: '25/25-50',
            ability: 'weaken',
            requiredMana: '170',
            target: 'enemy',
            desc: 'Esta orbe le quita **__{ratio}% (**25%** - **75%** ✳️)% de tu MGC STR__** de ATK a un enemigo.',
            name: 'Mordida del Hielo Antartico',
            id: 1,
            minLvl: 6,
        },
    },
    ArcaneBeginner: {
        displayName: 'Arcane Beginner',
        reward: 'xpBonus',
        amount: 30,
    },
    ArcaneApprentice: {
        displayName: 'Arcane Apprentice',
        reward: 'emblem',
        type: 'Overwhelm',
    },
    ArcaneExpert: {
        displayName: 'Arcane Expert',
        reward: 'gold',
        amount: 400,
    },
    AdvancedEnchanter: {
        displayName: 'Advanced Enchanter',
        reward: 'emblem',
        type: 'Echoes',
    },
    MagicArtsExpert: {
        displayName: 'Magic Arts Expert',
        reward: 'emblem',
        type: 'Quickshot',
    },
    FullyQualifiedEnchanter: {
        displayName: 'Fully Qualified Enchanter',
        reward: 'xpBonus',
        amount: 50,
    },
    PowerfulWizard: {
        displayName: 'Powerful Wizard',
        reward: 'emblem',
        type: 'Titan',
    },
});

const WarriorTitles = Object.freeze({
    Apprentice: {
        level: 2,
        reward: 'sword',
        displayName: 'Apprentice',
        sword: {
            name: 'Espada de Hierro',
            id: 1,
            minLvl: 6,
            stats: {
                atk: 30,
                spd: 20,
            },
            perks: {
                perk1: {
                    perk: 'sharp',
                    ratio: 20,
                    perkDesc: 'Te da **20** de daño adicional en tus ataques.',
                },
            },
        },
    },
    SwordsmanBeginner: {
        level: 3,
        displayName: 'Swordsman Beginner',
        reward: 'xpBonus',
        amount: 30,
    },
    SwordsmanApprentice: {
        level: 4,
        displayName: 'Swordsman Apprentice',
        reward: 'emblem',
        type: 'Overwhelm',
    },
    SwordsmanExpert: {
        displayName: 'Swordsman Expert',
        reward: 'gold',
        amount: 400,
    },
    AdvancedWarrior: {
        displayName: 'Advanced Warrior',
        reward: 'emblem',
        type: 'Echoes',
    },
    WarfareExpert: {
        displayName: 'Warfare Expert',
        reward: 'emblem',
        type: 'Quickshot',
    },
    FullyQualifiedWarrior: {
        displayName: 'Fully Qualified Warrior',
        reward: 'xpBonus',
        amount: 30,
    },
    PowerfulWarlord: {
        displayName: 'Powerful Warlord',
        reward: 'emblem',
        type: 'Titan',
    },
});

const ArcherTitles = Object.freeze({
    Apprentice: {
        level: 2,
        reward: 'bow',
        displayName: 'Apprentice',
        bow: {
            name: 'Strong Bow',
            minLvl: 6,
            stats: {
                atk: 25,
                spd: 40,
            },
            perks: {
                perk1: {
                    perk: 'sharp',
                    ratio: 20,
                    perkDesc: 'Te da **20** de daño adicional en tus ataques.',
                },
            },
        },
    },
    ArcherBeginner: {
        level: 3,
        displayName: 'Archer Beginner',
        reward: 'xpBonus',
        amount: 30,
    },
    ArcherApprentice: {
        level: 4,
        displayName: 'Archer Apprentice',
        reward: 'emblem',
        type: 'Overwhelm',
    },
    ArcherExpert: {
        displayName: 'Archer Expert',
        reward: 'gold',
        amount: 400,
    },
    AdvancedArcher: {
        displayName: 'Advanced Marksman',
        reward: 'emblem',
        type: 'Echoes',
    },
    WarfareExpert: {
        displayName: 'Bowman Expert',
        reward: 'emblem',
        type: 'Quickshot',
    },
    FullyQualifiedWarrior: {
        displayName: 'Fully Qualified Archer',
        reward: 'xpBonus',
        amount: 30,
    },
    PowerfulWarlord: {
        displayName: 'Powerful Marksman',
        reward: 'emblem',
        type: 'Titan',
    },
});

module.exports = { WarriorTitles, EnchanterTitles, ArcherTitles };