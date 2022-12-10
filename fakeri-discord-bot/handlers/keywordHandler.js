const { getFirestore, doc, updateDoc, increment } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function keywordHandler(keyword, keywordSubtype, enemy, user, args) {
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
                };
                for (const key in enemy) {
                    const property = enemy[key];
                    if (key == 'enemyId' || key == 'turn' || key == 'enemyUnique' || key == 'keywords' || key == 'enemyHp' || key == 'enemyElite') continue;
                    finalEnemy[key] = Math.floor(property / 100 * args.ratio);
                }
                finalEnemy.enemyHp = finalEnemy.enemyMaxHp;
                for (let i = 0; i < 2; i++) {
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [`battles.battle${finalEnemy.enemyUnique}`]: finalEnemy,
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        ['battles.amount']: increment(1),
                    }, { merge: true });
                    finalEnemy.enemyUnique += 1;
                }
                return Promise.resolve({ enemySplitted: true });
            }
            break;
        }

        case 'Hardened':
            break;

        case 'Elusive':
            break;

        default:
            break;
    }
}

module.exports = { keywordHandler };