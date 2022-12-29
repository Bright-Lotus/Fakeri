const { getFirestore, doc, updateDoc, increment, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { WarriorTitles, EnchanterTitles } = require('../emums/levelRewards.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function starManager(action, amount, user) {
    amount = Number(amount);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        if (action == 'give') {
            const playerInfo = await getDoc(doc(db, user.id, 'PlayerInfo'));
            if (playerInfo.exists()) {
                const playerCurrentStars = playerInfo.data().instructor.level.currentStars;
                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                    ['instructor.level.stars']: increment(amount),
                }, { merge: true });
                if (playerCurrentStars + amount > playerInfo.data().instructor.level.starsForNextTitle) {
                    let titles;
                    switch (playerInfo.data().class) {
                        case 'warrior':
                            titles = Object.values(WarriorTitles);
                            break;
                        case 'enchanter':
                            titles = Object.values(EnchanterTitles);
                            break;
                        case 'archer':
                            break;
                        default:
                            break;
                    }
                    const nextTitle = titles[playerInfo.data().instructor.level.titleLevel - 1];
                    switch (nextTitle.reward) {
                        case 'sword': {
                            let sword = nextTitle.sword;


                            const docSnap = await getDoc(doc(db, user.id, 'PlayerInfo/Inventory/Equipment'));
                            let itemAmount;
                            if (docSnap.exists()) {
                                itemAmount = docSnap.data()?.['swords'].amount;
                            }

                            sword = { ...sword, id: itemAmount + 1 };
                            await updateDoc(doc(db, user.id, 'PlayerInfo/Inventory/Equipment'), {
                                ['swords']: { ...docSnap.data()?.['swords'], amount: itemAmount + 1, [`sword${itemAmount + 1}`]: sword },
                            }, { merge: true });
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['instructor.level.titleName']: nextTitle.displayName,
                            }, { merge: true });
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['instructor.level.titleLevel']: increment(1),
                            }, { merge: true });
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['instructor.level.currentStars']: 0,
                            }, { merge: true });
                            break;
                        }
                        case 'xpBonus': {
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['instructor.level.titleName']: nextTitle.displayName,
                            }, { merge: true });
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['xpBonus']: increment(nextTitle.amount),
                            }, { merge: true });
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['instructor.level.currentStars']: 0,
                            }, { merge: true });
                            break;
                        }
                        case 'gold': {
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['instructor.level.titleName']: nextTitle.displayName,
                            }, { merge: true });
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['gold']: increment(nextTitle.amount),
                            }, { merge: true });
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['instructor.level.currentStars']: 0,
                            }, { merge: true });
                            break;
                        }
                        case 'abilityOrb': {
                            let abilityOrb = nextTitle.abilityOrb;


                            const docSnap = await getDoc(doc(db, user.id, 'PlayerInfo/Inventory/Equipment'));
                            let itemAmount;
                            if (docSnap.exists()) {
                                itemAmount = docSnap.data()?.['abilityOrbs'].amount;
                            }

                            abilityOrb = { ...abilityOrb, id: itemAmount + 1 };
                            await updateDoc(doc(db, user.id, 'PlayerInfo/Inventory/Equipment'), {
                                ['swords']: { ...docSnap.data()?.['swords'], amount: itemAmount + 1, [`sword${itemAmount + 1}`]: abilityOrb },
                            }, { merge: true });
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['instructor.level.titleName']: nextTitle.displayName,
                            }, { merge: true });
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['instructor.level.titleLevel']: increment(1),
                            }, { merge: true });
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                ['instructor.level.currentStars']: 0,
                            }, { merge: true });
                            break;
                        }
                    }
                }
                return resolve(playerCurrentStars + amount);
            }
        }
    });
}

module.exports = { starManager };