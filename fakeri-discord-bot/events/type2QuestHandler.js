const { getFirestore, doc, setDoc, getDocs, collection, orderBy, query } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, chatInputApplicationCommandMention } = require('discord.js');
const { CommandIds } = require('../emums/commandIds.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: 'messageReactionAdd',
    once: false,
    execute: async function (reaction, user) {
        // When a reaction is received, check if the structure is partial
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            }
            catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.user` may be undefined/null
                return;
            }
        }
        if (reaction.me) return;

        // Now the message has been cached and is fully available
        console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
        // The reaction is now also fully available and the properties will be reflected accurately:
        console.log(`${reaction.count} user(s) have given the same reaction to this message!`);

        const missionsQuery = query(collection(db, '/Event'), orderBy('quest0'));
        const weeklyQuestsSnap = await getDocs(missionsQuery);
        weeklyQuestsSnap.forEach(async (docSnap) => {
            if (!docSnap.id.includes('QuestsWeek')) return;
            const week = docSnap.id.substring(6);

            if (!docSnap.data()?.quest1) return;
            for (let i = 1; i < 6; i++) {
                console.log(docSnap.data()[ `quest${i}` ], i);

                const mission = docSnap.data()[ `quest${i}` ];
                const querySnapshot = await getDocs(collection(db, `/${user.id}/EventQuestProgression/Weekly`));
                /* Quest Types:
                1 = Send Message | DONE
                2 = React with emoji to messages
                3 = Send message with certain letter | DONE
                4 = Completion quest
                5 = Send message with certain content | DONE
                6 = Custom mission */
                if (mission?.type == 2) {
                    querySnapshot.forEach(async (document) => {
                        if (document.id == 'Milestones' || document.id != week) return;
                        if (document.data()?.locked) return;
                        let current = document.data()[ `mission${i}` ];
                        if (!current) { current = 0; }
                        const missionGoal = docSnap.data()[ `quest${i}` ].goal;
                        const quest = docSnap.data()[ `quest${i}` ];

                        if (current >= missionGoal) {
                            await setDoc(doc(db, `${user.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (missionGoal) }, { merge: true });
                            return;
                        }
                        const targetChannels = quest?.targetChannel?.split('|') || [ reaction.message.channelId ];
                        console.log(targetChannels, 'debug');
                        if (!targetChannels.some((channel) => reaction.message.channelId == channel)) {
                            return;
                        }

                        if (reaction.emoji.name != quest.targetReaction) {
                            return;
                        }

                        if ((current + 1) >= missionGoal) {
                            reaction.message.client.emit('questCompleted', mission, user, week);
                            const completedEmbed = new EmbedBuilder()
                                .setTitle('Has completado una mision!')
                                .setColor('#00FF48')
                                .setDescription(`Se te han sido dadas las recompensas. (${chatInputApplicationCommandMention('event quests', CommandIds.Event)})`);
                            user.send({ embeds: [ completedEmbed ] });
                        }

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
                        await setDoc(doc(db, `${user.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (current + 1) }, { merge: true });
                    });
                }

            }
        });
    },
};