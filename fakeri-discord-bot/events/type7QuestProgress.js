const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder } = require('discord.js');
const { getFirestore, doc, setDoc, getDocs, collection } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: 'type7QuestProgress',
    once: false,
    execute: async function(user, client) {
        for (let index = 0; index < 2; index++) {

            const query = (index == 0) ? '/Event' : user.id;
            const weeklyQuestsSnap = await getDocs(collection(db, query));
            const querySnapshot = await getDocs(collection(db, `/${user.id}/EventQuestProgression/Weekly`));

            weeklyQuestsSnap.forEach(async (docSnap) => {
                if (!docSnap.id.includes('Quests')) return;
                const week = docSnap.id.substring(6);

                if (!docSnap.data()?.quest1) return;
                for (let i = 1; i < 6; i++) {

                    const mission = docSnap.data()[`quest${i}`];
                    /* Quest Types:
                    1 = Send Message | DONE
                    2 = React with emoji to messages | DONE
                    3 = Send message with certain letter | DONE
                    4 = Completion quest | DONE
                    5 = Send message with certain content | DONE
                    6 = Emote in channel | DONE
                    7 = Participate in a gift drop | DONE
                    8 = Kill a monster | DONE
                    9 = Level up | DONE
                    */
                    if (mission?.type == 7) {
                        querySnapshot.forEach(async (document) => {
                            if (document.id == 'Milestones' || document.id != week) return;
                            let current = document.data()[`mission${i}`];
                            const missionGoal = docSnap.data()[`quest${i}`].goal;
                            const quest = docSnap.data()[`quest${i}`];

                            if (current >= missionGoal) {
                                console.log('Goal reached');
                                await setDoc(doc(db, `${user.id}/EventQuestProgression/Weekly/${week}`), { [`mission${quest.position}`]: (missionGoal) }, { merge: true });
                                return;
                            }
                            if (!current) { current = 0; }

                            if ((current + 1) == Math.ceil((25 / 100) * missionGoal)) {
                                const progressEmbed = new EmbedBuilder()
                                    .setTitle('You have made progress on a quest!')
                                    .setColor('#00FF06')
                                    .setDescription(`You have reached 25% on a quest. (${current + 1}/${missionGoal})`);

                                user.send({ embeds: [progressEmbed] });
                            }
                            else if ((current + 1) == Math.ceil((50 / 100) * missionGoal)) {
                                const progressEmbed = new EmbedBuilder()
                                    .setTitle('You have made progress on a quest!')
                                    .setColor('#00284A')
                                    .setDescription(`You have reached 50% on a quest. (${current + 1}/${missionGoal})`);

                                user.send({ embeds: [progressEmbed] });
                            }
                            else if ((current + 1) == Math.ceil((75 / 100) * missionGoal)) {
                                const progressEmbed = new EmbedBuilder()
                                    .setTitle('You have made progress on a quest!')
                                    .setColor('#0066BC')
                                    .setDescription(`You have reached 75% on a quest. (${current + 1}/${missionGoal})`);

                                user.send({ embeds: [progressEmbed] });
                            }
                            console.log(current + 1, quest.position);
                            await setDoc(doc(db, `${user.id}/EventQuestProgression/Weekly/${week}`), { [`mission${quest.position}`]: (current + 1) }, { merge: true });
                            if ((current + 1) >= missionGoal) {
                                const message = { author: user };
                                client.emit('questCompleted', mission, message.author, week);
                                user.send('You have completed a quest!');
                            }
                        });
                    }

                }
            });
        }
    },
};