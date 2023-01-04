const { getFirestore, doc, setDoc, getDocs, collection, orderBy, query } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, chatInputApplicationCommandMention } = require('discord.js');
const { CommandIds } = require('../emums/commandIds.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: 'type9QuestProgress',
    once: false,
    execute: async function(user, client) {
        for (let index = 0; index < 2; index++) {

            const missionsQuery = query(collection(db, (index == 0) ? '/Event' : user.id), orderBy('quest0'));
            const weeklyQuestsSnap = await getDocs(missionsQuery);
            const querySnapshot = await getDocs(collection(db, `/${user.id}/EventQuestProgression/Weekly`));

            weeklyQuestsSnap.forEach(async (docSnap) => {
                if (!docSnap.id.includes('Quests')) return;
                const week = docSnap.id.substring(6);

                if (!docSnap.data()?.quest0) return;
                for (let i = 1; i < 6; i++) {

                    const mission = docSnap.data()[ `quest${(index == 1) ? i - 1 : i}` ];
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
                    10 = Complete a quest | DONE
                    */
                    if (mission?.type == 9) {
                        querySnapshot.forEach(async (document) => {
                            if (document.id == 'Milestones' || document.id != week) return;
                            if (document.data()?.locked) return;
                            let current = document.data()[ `mission${(index == 1) ? i - 1 : i}` ];
                            const missionGoal = docSnap.data()[ `quest${(index == 1) ? i - 1 : i}` ].goal;
                            const quest = docSnap.data()[ `quest${(index == 1) ? i - 1 : i}` ];

                            if (current >= missionGoal) {
                                console.log('Goal reached');
                                await setDoc(doc(db, `${user.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (missionGoal) }, { merge: true });
                                return;
                            }
                            if (!current) { current = 0; }

                            if ((current + 1) == Math.ceil((25 / 100) * missionGoal)) {
                                const progressEmbed = new EmbedBuilder()
                                    .setTitle('Has hecho progreso en una mision!')
                                    .setColor('#00FF06')
                                    .setDescription(`Has alcanzado el 25% en una mision. (${current + 1}/${missionGoal})`);

                                user.send({ embeds: [ progressEmbed ] });
                            }
                            else if ((current + 1) == Math.ceil((50 / 100) * missionGoal)) {
                                const progressEmbed = new EmbedBuilder()
                                    .setTitle('Has hecho progreso en una mision!')
                                    .setColor('#00284A')
                                    .setDescription(`Has alcanzado el 50% en una mision. (${current + 1}/${missionGoal})`);

                                user.send({ embeds: [ progressEmbed ] });
                            }
                            else if ((current + 1) == Math.ceil((75 / 100) * missionGoal)) {
                                const progressEmbed = new EmbedBuilder()
                                    .setTitle('Has hecho progreso en una mision!')
                                    .setColor('#0066BC')
                                    .setDescription(`Has alcanzado el 75% en una mision. (${current + 1}/${missionGoal})`);

                                user.send({ embeds: [ progressEmbed ] });
                            }
                            console.log(current + 1, quest.position);
                            await setDoc(doc(db, `${user.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (current + 1) }, { merge: true });
                            if ((current + 1) >= missionGoal) {
                                const __message = { author: user };
                                client.emit('questCompleted', mission, user, week);
                                const completedEmbed = new EmbedBuilder()
                                    .setTitle('Has completado una mision!')
                                    .setColor('#00FF48')
                                    .setDescription(`Se te han sido dadas las recompensas. (${chatInputApplicationCommandMention('event quests', CommandIds.Event)})`);
                                user.send({ embeds: [ completedEmbed ] });
                            }
                        });
                    }

                }
            });
        }
    },
};