const { getFirestore, doc, updateDoc, increment, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const { Icons } = require('../emums/icons.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function goldManager(action, amount, user) {
    amount = Number(amount);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        if (action == 'give') {
            const playerSnap = await getDoc(doc(db, user.id, 'PlayerInfo'));
            if (playerSnap.exists()) {
                const playerGold = playerSnap.data().gold;
                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                    ['gold']: increment(amount),
                }, { merge: true });
                return resolve(playerGold + amount);
            }
        }
        else if (action == 'buy') {
            const playerInfo = await getDoc(doc(db, user.id, 'PlayerInfo'));
            if (playerInfo.exists()) {
                const playerGold = playerInfo.data().gold;
                if (amount > playerGold) {
                    const embed = ErrorEmbed(EventErrors.NotEnoughGold, `Oro que tienes: ${playerGold} ${Icons.Gold}\nOro que necesitas: ${amount} ${Icons.Gold}`);
                    console.log('Transaction failed! | Not enough gold | at goldHandler.js - line 30');
                    return reject({ errorEmbed: embed, errorCode: EventErrors.NotEnoughGold });
                }
                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                    ['gold']: increment(-Math.abs(amount)),
                }, { merge: true });
                console.log('Transaction completed! at goldHandler.js - line 35');
                return resolve(playerGold - amount);
            }
        }
    });
}

module.exports = { goldManager };