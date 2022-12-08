const { getFirestore, doc, setDoc, getDocs, collection, increment } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { xpManager } = require('../handlers/xpHandler.js');
const { goldManager } = require('../handlers/goldHandler.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


module.exports = {
    name: 'questCompleted',
    once: false,
    async execute(mission, message, week) {
        const weeklyQuestsSnap = await getDocs(collection(db, '/Event'));
        weeklyQuestsSnap.forEach(async quests => {
            const querySnapshot = await getDocs(collection(db, `/${message.author.id}/EventQuestProgression/Weekly`));
            querySnapshot.forEach(async document => {
                if (document.id == 'Milestones' || document.id != week) return;

                let current = document.data().mission0;
                if (!current) { current = 0; }
                if ((current + 1) == 5) {
                    await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/Week1`), { ['mission0']: (0) }, { merge: true });
                    return;
                }
                await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/Week1`), { ['mission0']: (current + 1) }, { merge: true });
            });
        });
        await goldManager('give', mission.rewards.gold, message.author);
        await setDoc(doc(db, `${message.author.id}/PlayerInfo`), { ['xpBonus']: increment(mission.rewards.xpBonus) }, { merge: true });
    },
};