const { formatEmoji } = require('discord.js');
const { Icons } = require('./emums/icons');

const ranges = [ {
    divider: 1E3,
    suffix: 'K',
}, {
    divider: 1E6,
    suffix: 'M',
}, {
    divider: 1E9,
    suffix: 'B',
} ];


const Utils = Object.freeze({
    NumberFormatWithLetter: (input) => {
        for (let index = ranges.length - 1; index >= 0; index--) {
            if (input > ranges[ index ].divider) {
                let quotient = input / ranges[ index ].divider;

                if (quotient < 10) {
                    quotient = Math.floor(quotient * 10) / 10;
                }
                else {
                    quotient = Math.floor(quotient);
                }

                return quotient.toString() + ranges[ index ].suffix;
            }
        }

        return input.toString();
    },
    HpEmoji: (hp, maxHp) => {
        let hpEmoji = '';
        const percentageOfMaxHp = (hp / maxHp) * 100;
        if (percentageOfMaxHp > 100) { hpEmoji = Icons.MoreThanFullHp; }
        else if (percentageOfMaxHp >= 75) { hpEmoji = Icons.FullHp; }
        else if (percentageOfMaxHp >= 50) { hpEmoji = Icons.SeventyFivePercentHp; }
        else if (percentageOfMaxHp >= 25) { hpEmoji = Icons.FiftyPercentHp; }
        else if (percentageOfMaxHp > 0) { hpEmoji = Icons.TwentyFivePercentHp; }
        else if (hp == 0) { hpEmoji = formatEmoji(Icons.DeadHp); }
        return hpEmoji;
    },
    FormatDescription: (desc, item) => {
        for (const element of Object.entries(item)) {
            if (typeof element[ 1 ] != 'string' || !element[ 1 ].includes('/') || element[ 0 ] == 'desc') continue;
            console.log(element[ 1 ]);
            item[ element[ 0 ] ] = element[ 1 ].split('/')[ 0 ];
        }
        return desc.replace(/{(\w+)}/g, (match, key) => {
            return item[ key ];
        });
    },
    FormatStatName: (stat) => {
        switch (stat) {
            case 'manaPerAttack': return 'Mana PER ATTACK';
            case 'maxHp': return 'Max HP';
            case 'magicStrength': return 'Magic STRENGTH';
            case 'magicDurability': return 'Magic DURABILITY';
            case 'atk': return 'Attack POWER';
            case 'speed': return 'Speed';
            case 'hp': return 'Current HP';
            case 'armor': return 'Armor';
            default: return stat.toUpperCase();
        }
    },
    ClampNumber: (number, min, max) => {
        return Math.max(min, Math.min(number, max));
    },
    CapitalizeFirstLetter: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
});

module.exports = { Utils };