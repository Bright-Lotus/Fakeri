const { getFirestore, doc, setDoc, getDocs, collection, query, orderBy } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, chatInputApplicationCommandMention } = require('discord.js');
const { CommandIds } = require('../emums/commandIds.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: 'messageCreate',
    once: false,
    execute: async function(message) {
        if (message.content.lenght < 4) return;
        for (let index = 0; index < 2; index++) {

            const client = message.client;
            if (message.author.bot) return;

            const missionsQuery = query(collection(db, (index == 0) ? '/Event' : message.author.id), orderBy('quest0'));
            const weeklyQuestsSnap = await getDocs(missionsQuery);
            const querySnapshot = await getDocs(collection(db, `/${message.author.id}/EventQuestProgression/Weekly`));

            weeklyQuestsSnap.forEach(async (docSnap) => {
                if (!docSnap.id.includes('Quests')) return;
                const week = docSnap.id.substring(6);

                if (!docSnap.data()?.quest1) return;
                for (let i = 1; i < 6; i++) {

                    const mission = docSnap.data()[ `quest${i}` ];
                    /* Quest Types:
                    1 = Send Message | DONE
                    2 = React with emoji to messages | DONE
                    3 = Send message with certain letter | DONE
                    4 = Completion quest | DONE
                    5 = Send message with certain content | DONE
                    6 = Emote in channel | DONE
                    7 = Participate in a gift drop | DONE
                    8 = Kill a monster | DONE
                    9 = Level up | DONE */
                    switch (mission?.type) {
                        case 1:

                            querySnapshot.forEach(async (document) => {
                                if (document.id == 'Milestones' || document.id != week) return;
                                if (document.data()?.locked) return;

                                let current = document.data()[ `mission${i}` ];
                                const missionGoal = docSnap.data()[ `quest${i}` ].goal;
                                const quest = docSnap.data()[ `quest${i}` ];
                                const targetChannels = quest?.targetChannel.split('|');
                                const filter = (id) => message.channelId == id;

                                if (!targetChannels.some(filter)) {
                                    return;
                                }

                                if (current >= missionGoal) {
                                    console.log('Goal reached');
                                    await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (missionGoal) }, { merge: true });
                                    return;
                                }
                                if (!current) { current = 0; }

                                if ((current + 1) == Math.ceil((25 / 100) * missionGoal)) {
                                    const progressEmbed = new EmbedBuilder()
                                        .setTitle('Has hecho progreso en una mision!')
                                        .setColor('#00FF06')
                                        .setDescription(`Has alcanzado el 25% en una mision. (${current + 1}/${missionGoal})`);

                                    message.author.send({ embeds: [ progressEmbed ] });
                                }
                                else if ((current + 1) == Math.ceil((50 / 100) * missionGoal)) {
                                    const progressEmbed = new EmbedBuilder()
                                        .setTitle('Has hecho progreso en una mision!')
                                        .setColor('#00284A')
                                        .setDescription(`Has alcanzado el 50% en una mision. (${current + 1}/${missionGoal})`);

                                    message.author.send({ embeds: [ progressEmbed ] });
                                }
                                else if ((current + 1) == Math.ceil((75 / 100) * missionGoal)) {
                                    const progressEmbed = new EmbedBuilder()
                                        .setTitle('Has hecho progreso en una mision!')
                                        .setColor('#0066BC')
                                        .setDescription(`Has alcanzado el 75% en una mision. (${current + 1}/${missionGoal})`);

                                    message.author.send({ embeds: [ progressEmbed ] });
                                }
                                console.log(current + 1, quest.position);
                                await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (current + 1) }, { merge: true });
                                if ((current + 1) >= missionGoal) {
                                    client.emit('questCompleted', mission, message.author, week);
                                    const completedEmbed = new EmbedBuilder()
                                        .setTitle('You have completed a quest!')
                                        .setColor('#00FF48')
                                        .setDescription(`Se te han sido dadas las recompensas. (${chatInputApplicationCommandMention('event quests', CommandIds.Event)})`);
                                    message.author.send({ embeds: [ completedEmbed ] });
                                }
                            });
                            break;
                        // Quest Type 2 handler is in type2QuesHandler file

                        case 3:
                            querySnapshot.forEach(async (document) => {
                                if (document.id == 'Milestones' || document.id != week) return;
                                if (document.data()?.locked) return;

                                let current = document.data()[ `mission${i}` ];
                                if (!current) { current = 0; }
                                const missionGoal = docSnap.data()[ `quest${i}` ].goal;
                                const quest = docSnap.data()[ `quest${i}` ];

                                if (current == missionGoal) {
                                    await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (missionGoal) }, { merge: true });
                                    return;
                                }

                                if (message.content.toLowerCase().includes(quest.targetLetter.toLowerCase())) {
                                    if ((current + 1) >= missionGoal) {
                                        client.emit('questCompleted', mission, message.author, week);
                                        const completedEmbed = new EmbedBuilder()
                                            .setTitle('Has completado una mision!')
                                            .setColor('#00FF48')
                                            .setDescription(`Se te han sido dadas las recompensas. (${chatInputApplicationCommandMention('event quests', CommandIds.Event)})`);
                                        message.author.send({ embeds: [ completedEmbed ] });
                                    }

                                    if ((current + 1) == Math.ceil((25 / 100) * missionGoal)) {
                                        const progressEmbed = new EmbedBuilder()
                                            .setTitle('Has hecho progreso en una mision!')
                                            .setColor('#00FF06')
                                            .setDescription(`Has alcanzado el 25% en una mision. (${current + 1}/${missionGoal})`);

                                        message.author.send({ embeds: [ progressEmbed ] });
                                    }
                                    else if ((current + 1) == Math.ceil((50 / 100) * missionGoal)) {
                                        const progressEmbed = new EmbedBuilder()
                                            .setTitle('Has hecho progreso en una mision!')
                                            .setColor('#00284A')
                                            .setDescription(`Has alcanzado el 50% en una mision. (${current + 1}/${missionGoal})`);

                                        message.author.send({ embeds: [ progressEmbed ] });
                                    }
                                    else if ((current + 1) == Math.ceil((75 / 100) * missionGoal)) {
                                        const progressEmbed = new EmbedBuilder()
                                            .setTitle('Has hecho progreso en una mision!')
                                            .setColor('#0066BC')
                                            .setDescription(`Has alcanzado el 75% en una mision. (${current + 1}/${missionGoal})`);

                                        message.author.send({ embeds: [ progressEmbed ] });
                                    }
                                    await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (current + 1) }, { merge: true });
                                }
                            });
                            break;
                        // Type 4 handler is in completed quest event

                        case 5:
                            querySnapshot.forEach(async document => {
                                if (document.id == 'Milestones' || document.id != week) return;
                                if (document.data()?.locked) return;

                                let current = document.data()[ `mission${i}` ];
                                if (!current) { current = 0; }
                                const missionGoal = docSnap.data()[ `quest${i}` ].goal;
                                const quest = docSnap.data()[ `quest${i}` ];

                                if (current >= missionGoal) {
                                    await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (missionGoal) }, { merge: true });
                                    return;
                                }


                                const targetCount = [];
                                if (message.content.toLowerCase() == quest.targetContent[ 0 ].toLowerCase()) {
                                    for (const key of quest.targetContent) {
                                        targetCount.push(key);
                                    }

                                    targetCount[ 0 ] = 'passed';

                                    for (let count = 1; count < targetCount.length; count++) {
                                        const filter = m => m.content.toLowerCase().includes(quest.targetContent[ count ].toLowerCase());
                                        const collector = message.channel.createMessageCollector({ filter, time: 7000 });
                                        collector.on('collect', m => {
                                            console.log(`Collected ${m.content}`);
                                            targetCount[ count ] = 'passed';
                                        });

                                        collector.on('end', async collected => {
                                            console.log(`Collected ${collected.size} items`);
                                            const allEqual = arr => arr.every(v => v === arr[ 0 ]);
                                            if (allEqual(targetCount)) {
                                                if ((current + 1) >= missionGoal) {
                                                    client.emit('questCompleted', mission, message.author, week);
                                                    const completedEmbed = new EmbedBuilder()
                                                        .setTitle('Has completado una mision!')
                                                        .setColor('#00FF48')
                                                        .setDescription(`Se te han sido dadas las recompensas. (${chatInputApplicationCommandMention('event quests', CommandIds.Event)})`);
                                                    message.author.send({ embeds: [ completedEmbed ] });
                                                }

                                                if ((current + 1) == Math.ceil((25 / 100) * missionGoal)) {
                                                    const progressEmbed = new EmbedBuilder()
                                                        .setTitle('Has hecho progreso en una mision!')
                                                        .setColor('#00FF06')
                                                        .setDescription(`Has alcanzado el 25% en una mision. (${current + 1}/${missionGoal})`);

                                                    message.author.send({ embeds: [ progressEmbed ] });
                                                }
                                                else if ((current + 1) == Math.ceil((50 / 100) * missionGoal)) {
                                                    const progressEmbed = new EmbedBuilder()
                                                        .setTitle('Has hecho progreso en una mision!')
                                                        .setColor('#00284A')
                                                        .setDescription(`Has alcanzado el 50% en una mision. (${current + 1}/${missionGoal})`);

                                                    message.author.send({ embeds: [ progressEmbed ] });
                                                }
                                                else if ((current + 1) == Math.ceil((75 / 100) * missionGoal)) {
                                                    const progressEmbed = new EmbedBuilder()
                                                        .setTitle('Has hecho progreso en una mision!')
                                                        .setColor('#0066BC')
                                                        .setDescription(`Has alcanzado el 75% en una mision. (${current + 1}/${missionGoal})`);

                                                    message.author.send({ embeds: [ progressEmbed ] });
                                                }
                                                await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (current + 1) }, { merge: true });
                                            }
                                        });
                                    }
                                }
                                // lmao yo await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [`mission${i}`]: (current + 1) }, { merge: true });
                            });
                            break;

                        case 6: {
                            const msgSticker = message?.stickers.first()?.name || 0;
                            if (msgSticker == 0) break;

                            querySnapshot.forEach(async (document) => {
                                if (document.id == 'Milestones' || document.id != week) return;
                                if (document.data()?.locked) return;
                                let current = document.data()[ `mission${i}` ];
                                const missionGoal = docSnap.data()[ `quest${i}` ].goal;
                                const quest = docSnap.data()[ `quest${i}` ];

                                if (msgSticker != 'emotiza insana') return;
                                const targetChannels = quest?.targetChannel?.split('|') || [ message.channelId ];
                                if (!targetChannels.some((channel) => message.channelId == channel)) {
                                    return;
                                }

                                if (current >= missionGoal) {
                                    console.log('Goal reached');
                                    await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (missionGoal) }, { merge: true });
                                    return;
                                }
                                if (!current) { current = 0; }

                                if ((current + 1) >= missionGoal) {
                                    client.emit('questCompleted', mission, message.author, week);
                                    const completedEmbed = new EmbedBuilder()
                                        .setTitle('Has completado una mision!')
                                        .setColor('#00FF48')
                                        .setDescription(`Se te han sido dadas las recompensas. (${chatInputApplicationCommandMention('event quests', CommandIds.Event)})`);
                                    message.author.send({ embeds: [ completedEmbed ] });
                                }

                                if ((current + 1) == Math.ceil((25 / 100) * missionGoal)) {
                                    const progressEmbed = new EmbedBuilder()
                                        .setTitle('Has hecho progreso en una mision!')
                                        .setColor('#00FF06')
                                        .setDescription(`Has alcanzado el 25% en una mision. (${current + 1}/${missionGoal})`);

                                    message.author.send({ embeds: [ progressEmbed ] });
                                }
                                else if ((current + 1) == Math.ceil((50 / 100) * missionGoal)) {
                                    const progressEmbed = new EmbedBuilder()
                                        .setTitle('Has hecho progreso en una mision!')
                                        .setColor('#00284A')
                                        .setDescription(`Has alcanzado el 50% en una mision. (${current + 1}/${missionGoal})`);

                                    message.author.send({ embeds: [ progressEmbed ] });
                                }
                                else if ((current + 1) == Math.ceil((75 / 100) * missionGoal)) {
                                    const progressEmbed = new EmbedBuilder()
                                        .setTitle('Has hecho progreso en una mision!')
                                        .setColor('#0066BC')
                                        .setDescription(`Has alcanzado el 75% en una mision. (${current + 1}/${missionGoal})`);

                                    message.author.send({ embeds: [ progressEmbed ] });
                                }
                                await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [ `mission${quest.position}` ]: (current + 1) }, { merge: true });
                            });
                            break;
                        }

                        default:
                            break;
                    }

                }
            });
        }
    },
};