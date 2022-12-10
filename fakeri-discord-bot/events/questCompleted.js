const { getFirestore, doc, setDoc, getDocs, collection, increment } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { goldManager } = require('../handlers/goldHandler.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


module.exports = {
    name: 'questCompleted',
    once: false,
    async execute(mission, message, week) {
        const querySnapshot = await getDocs(collection(db, `/${message.author.id}/EventQuestProgression/Weekly`));
        querySnapshot.forEach(async document => {
            console.log(document.data(), document.id);
            if (document.id == 'Milestones' || document.id != week) return;
            let current = document.data().mission0;
            if (!current) { current = 0; }
            if ((current + 1) == 5) {
                await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { ['mission0']: (0) }, { merge: true });
                await setDoc(doc(db, `${message.author.id}/PlayerInfo`), { ['xpBonus']: increment(12) }, { merge: true });
                await goldManager('give', 100, message.author);

                return;
            }
            await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { ['mission0']: increment(1) }, { merge: true });
        });
        await goldManager('give', mission.rewards.gold, message.author);
        await setDoc(doc(db, `${message.author.id}/PlayerInfo`), { ['xpBonus']: increment(mission.rewards.xpBonus) }, { merge: true });
    },
};