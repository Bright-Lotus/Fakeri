const { getFirestore, doc, getDoc, updateDoc, increment, setDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function healthManager(action, user, amount, options) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        if (action == 'damage') {
            const playerInfo = await getDoc(doc(db, user.id, 'PlayerInfo'));
            if (playerInfo.exists()) {
                const finalHp = playerInfo.data().stats.hp - amount;
                console.log(finalHp, 'logdebug', amount, playerInfo.data().stats.hp);
                if (finalHp <= 0) {
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        ['dead']: true,
                    }, { merge: true });
                    await setDoc(doc(db, user.id, '/ActiveBattles'), { ['battles']: [] }, { merge: true });

                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        ['stats.hp']: 0,
                    }, { merge: true });
                    return resolve({ dead: true });
                }

                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                    ['stats.hp']: finalHp,
                }, { merge: true });
                return resolve({ remainingHp: finalHp });
            }
        }
        else if (action == 'revive') {
            const playerInfo = await getDoc(doc(db, user.id, 'PlayerInfo'));
            if (playerInfo.exists()) {
                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                    ['stats.hp']: playerInfo.data().stats.maxHp,
                }, { merge: true });
                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                    ['dead']: false,
                }, { merge: true });
                return resolve();
            }
        }
    });
}

module.exports = { healthManager };
