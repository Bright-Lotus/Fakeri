const { getFirestore, doc, updateDoc, increment, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { formatEmoji } = require('discord.js');
const { Icons } = require('../emums/icons.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function keywordHandler(keyword, keywordSubtype, enemy, user, args) {
    if (keywordSubtype === 'burn') {
        const burnDamage = ((enemy.enemyAtk / 100) * args.ratio) - await (await getDoc(doc(db, user.id, 'PlayerInfo'))).data().stats.magicDurability * 0.2;
        await updateDoc(doc(db, user.id, 'PlayerInfo'), {
            [ 'stats.hp' ]: increment(-Math.abs(burnDamage)),
        }, { merge: true });
        return Promise.resolve({ damageReceived: burnDamage, bonusDmgEmoji: formatEmoji(Icons[ keyword ]) });
    }
    switch (keyword) {
        case 'LastBreath': {
            if (keywordSubtype == 'split') {
                console.log(enemy);
                const finalEnemy = {
                    enemyId: enemy.enemyId,
                    enemyHp: 'placeholder',
                    enemyMaxHp: 'placeholder',
                    enemyAtk: 'placeholder',
                    enemyArmor: 'placeholder',
                    enemySpd: 'placeholder',
                    enemyMagicDurability: 'placeholder',
                    enemyElite: 0,
                    enemyUnique: enemy.enemyUnique,
                    enemyXp: 'placeholder',
                    enemyGold: 'placeholder',
                    turn: 'player',
                    keywords: [],
                    debuffs: [],
                    turnsUntilAbility: 3,
                };
                for (const key in enemy) {
                    const property = enemy[ key ];
                    if (key == 'enemyId' || key == 'turn' || key == 'enemyUnique' || key == 'keywords' || key == 'enemyHp' || key == 'enemyElite' || key == 'debuffs') continue;
                    finalEnemy[ key ] = Math.floor(property / 100 * args.ratio);
                }
                finalEnemy.enemyHp = finalEnemy.enemyMaxHp;
                for (let i = 0; i < 2; i++) {
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [ `battles.battle${finalEnemy.enemyUnique}` ]: finalEnemy,
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [ 'battles.amount' ]: increment(1),
                    }, { merge: true });
                    finalEnemy.enemyUnique += 1;
                }
                return Promise.resolve({ enemySplitted: true });
            }
            break;
        }

        case 'Elusive': {
            const dodgeChance = (Math.random() * 100) < args.ratio;
            if (dodgeChance) {
                return Promise.resolve({ dodged: true });
            }
            return Promise.resolve({ damageDone: 0, reducedDmgEmoji: formatEmoji(Icons.Elusive) });
        }

        case 'Hardened': {
            return Promise.resolve({ damageDone: -Math.abs(args.ratio), reducedDmgEmoji: formatEmoji(Icons.Hardened) });
        }

        case 'Vampiric': {
            const healingAmount = Math.round(args.damageDealt / 100 * args.ratio);
            return Promise.resolve({ damageReceived: 0, healed: healingAmount });
        }

        case 'ability': {
            if (keywordSubtype.includes('Strike')) {
                const damageAmount = Math.round(enemy.enemyAtk / 100) * args.ratio;
                const magicDurability = await (await getDoc(doc(db, user.id, 'PlayerInfo'))).data().stats.magicDurability;
                let finalDamageAmount = damageAmount - (magicDurability / 2);
                if (Math.sign(finalDamageAmount) == -1) {
                    finalDamageAmount = 0;
                }
                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                    [ 'stats.hp' ]: increment(-Math.abs(finalDamageAmount)),
                }, { merge: true });
                if (keywordSubtype.includes('vampiric')) {
                    return Promise.resolve({ damageReceived: finalDamageAmount, healed: damageAmount, bonusDmgEmoji: formatEmoji(Icons.Ability) });
                }
                return Promise.resolve({ damageReceived: finalDamageAmount, bonusDmgEmoji: formatEmoji(Icons.Ability) });
            }
            break;
        }

        case 'elite': {
            const damage = (Math.round(enemy.enemyAtk / 100) * args.ratio) - await (await getDoc(doc(db, user.id, 'PlayerInfo'))).data().stats.magicDurability * 0.4;
            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                [ 'stats.hp' ]: increment(-Math.abs(damage)),
            }, { merge: true });
            return Promise.resolve({ damageReceived: damage, bonusDmgEmoji: formatEmoji(Icons.Elite) });
        }

        default:
            break;
    }
}

module.exports = { keywordHandler };