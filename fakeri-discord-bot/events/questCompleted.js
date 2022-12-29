const { goldManager } = require('../handlers/goldHandler.js');
const { getFirestore, doc, updateDoc, getDocs, collection, increment } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { starManager } = require('../handlers/starHandler.js');
const { EmbedBuilder } = require('discord.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


module.exports = {
    name: 'questCompleted',
    once: false,
    async execute(mission, user, week) {
        const querySnapshot = await getDocs(collection(db, `/${user.id}/EventQuestProgression/Weekly`));
        querySnapshot.forEach(async document => {
            console.log(document.data(), document.id);
            if (document.id == 'Milestones' || document.id != week) return;
            user.client.emit('type10QuestProgress', user, user.client);
            if (week == 'Nora' || week == 'Arissa' || week == 'Abe' || week == 'Lyra') {
                if (mission?.onComplete) {
                    if (mission?.onComplete.function == 'setActiveDialog') {
                        for (const target of mission?.onComplete.targets || []) {
                            const [targetCharacter, targetDialog] = [target.split('/')[0], target.split('/')[1]];
                            await updateDoc(doc(db, user.id, 'EventDialogProgression'), {
                                [`${targetCharacter}.activeDialog`]: targetDialog,
                            }, { merge: true });
                            const completedInstructorEmbed = new EmbedBuilder()
                                .setTitle(`Has completado una mision de ${week}!`)
                                .setColor('#00FF48')
                                .setDescription(`Habla con ${week} de nuevo!`);
                            user.send({ embeds: [completedInstructorEmbed] });
                        }
                    }
                }
                await goldManager('give', Number(mission.rewards.gold), user);
                await starManager('give', Number(mission.rewards.stars), user);
                await updateDoc(doc(db, `${user.id}/PlayerInfo`), { ['xpBonus']: increment(Number(mission.rewards.xpBonus)) }, { merge: true });
                return;
            }
            let current = document.data().mission0;
            if (!current) { current = 0; }
            if ((current + 1) == 5) {
                await updateDoc(doc(db, `${user.id}/EventQuestProgression/Weekly/${week}`), { ['mission0']: (0) }, { merge: true });
                await updateDoc(doc(db, `${user.id}/PlayerInfo`), { ['xpBonus']: increment(12) }, { merge: true });
                await goldManager('give', 100, user);

                return;
            }
            await updateDoc(doc(db, `${user.id}/EventQuestProgression/Weekly/${week}`), { ['mission0']: increment(1) }, { merge: true });
        });
        await goldManager('give', Number(mission.rewards.gold), user);
        await updateDoc(doc(db, `${user.id}/PlayerInfo`), { ['xpBonus']: increment(Number(mission.rewards.xpBonus)) }, { merge: true });
    },
};