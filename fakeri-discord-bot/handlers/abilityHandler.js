const { getFirestore, updateDoc, getDoc, doc, increment, arrayUnion } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { Abilities } = require('../emums/abilities.js');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const { formatEmoji } = require('discord.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function ability(abilityID, enemy, user) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const playerInfo = await getDoc(doc(db, user.id, 'PlayerInfo'));
        let abilityOrb;
        const playerEquipment = await getDoc(doc(db, user.id, 'PlayerInfo/Inventory/Equipment'));
        if (playerEquipment.exists()) {
            abilityOrb = playerEquipment.data().abilityOrbs[`abilityOrb${abilityID}`];
            if (playerInfo.data().stats.mana < abilityOrb.requiredMana) {
                return reject(ErrorEmbed(EventErrors.NotEnoughMana, `Necesitas **${abilityOrb.requiredMana - playerInfo.data().stats.mana}** ${formatEmoji('1045827771311599696')} mas para cargar este orbe.`));
            }
        }
        if (playerInfo.exists()) {
            switch (abilityOrb.ability) {
                case Abilities.EmpoweredAttacks: {
                    const playerAtk = playerInfo.data().stats.atk;
                    const attacks = Number(abilityOrb.attacks.split('/')[0]);
                    const atkRatio = Number(abilityOrb.ratio.split('/')[0]) + 100;
                    const finalAtkAmount = Math.round((playerAtk / 100) * atkRatio);
                    const activeBuffs = {
                        buff: `increasedAtk:${playerAtk}`,
                        attacks: attacks,
                    };
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        ['stats.atk']: finalAtkAmount,
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        ['stats.mana']: increment(-Math.abs(abilityOrb.requiredMana)),
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        ['activeBuffs']: arrayUnion(activeBuffs),
                    }, { merge: true });
                    break;
                }

                case '':
                    break;

                case '2':
                    console.log('a');
                    break;

                default:
                    break;
            }
        }
    });
}

module.exports = { ability };