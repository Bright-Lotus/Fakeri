const { getFirestore, doc, setDoc, getDocs, collection } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../main.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


module.exports = {
    name: 'questCompleted',
    once: false,
    async execute(quest, message) {
        const weeklyQuestsSnap = await getDocs(collection(db, '/Event'));
        weeklyQuestsSnap.forEach(async quests => {
            const querySnapshot = await getDocs(collection(db, `/${message.author.id}/EventQuestProgression/Weekly`));
            querySnapshot.forEach(async document => {
                let current = document.data().mission0;
                if (!current) { current = 0; }
                if ((current + 1) == 5) {
                    await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/Week1`), { ['mission0']: (0) }, { merge: true });
                    return;
                }
                await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/Week1`), { ['mission0']: (current + 1) }, { merge: true });
            });
        });
    },
};