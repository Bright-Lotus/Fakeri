const { getFirestore, doc, setDoc, getDocs, collection, updateDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder } = require('discord.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: 'messageCreate',
    once: false,
    execute: async function(message) {
        if (message.author.bot) return;

        if (message.partial) {
            message.fetch()
                .then(async fullMessage => {
                    console.log(fullMessage);
                    await setDoc(doc(db, `${message.author.id}/EventmilestoneProgression/Weekly/Week1`), { mission1: 101 }, { merge: true });
                })
                .catch(error => {
                    console.log('Something went wrong when fetching the message: ', error);
                });
        }
        else {
            const querySnapshot = await getDocs(collection(db, `/${message.author.id}/EventQuestProgression/Milestones`));
            querySnapshot.forEach(async milestones => {
                for (let i = 1; i < 6; i++) {
                    if (!milestones.data()[`milestone${i}`]) return;
                    const milestone = milestones.data()[`milestone${i}`];
                    let current = milestones.data()[`milestone${i}`].current;
                    if (!current) { current = 0; }
                    const milestoneGoal = milestones.data()[`milestone${i}`].goal;
                    const targetCount = [];

                    switch (milestone?.type) {
                        case 1:


                            if (current == milestoneGoal) {
                                return;
                            }

                            if ((current + 1) >= milestoneGoal) {
                                await updateDoc(doc(db, `${message.author.id}/EventQuestProgression/Milestones/Milestones`), { [`milestone${i}.current`]: (0) }, { merge: true });
                                const completedEmbed = new EmbedBuilder()
                                    .setTitle('You have completed a milestone!')
                                    .setColor('#00FF06')
                                    .setDescription(`The milestone has now resetted. (0/${milestoneGoal})`);
                                return message.author.send({ embeds: [completedEmbed] });
                            }

                            if ((current + 1) == Math.ceil((25 / 100) * milestoneGoal)) {
                                const progressEmbed = new EmbedBuilder()
                                    .setTitle('You have made progress on a milestone!')
                                    .setColor('#00284A')
                                    .setDescription(`You have reached 25% on a milestone. (${current + 1}/${milestoneGoal})`);

                                message.author.send({ embeds: [progressEmbed] });
                            }
                            else if ((current + 1) == Math.ceil((50 / 100) * milestoneGoal)) {
                                const progressEmbed = new EmbedBuilder()
                                    .setTitle('You have made progress on a milestone!')
                                    .setColor('#0066BC')
                                    .setDescription(`You have reached 50% on a milestone. (${current + 1}/${milestoneGoal})`);

                                message.author.send({ embeds: [progressEmbed] });
                            }
                            else if ((current + 1) == Math.ceil((75 / 100) * milestoneGoal)) {
                                const progressEmbed = new EmbedBuilder()
                                    .setTitle('You have made progress on a milestone!')
                                    .setColor('#008AFF')
                                    .setDescription(`You have reached 75% on a milestone. (${current + 1}/${milestoneGoal})`);

                                message.author.send({ embeds: [progressEmbed] });
                            }
                            await updateDoc(doc(db, `${message.author.id}/EventQuestProgression/Milestones/Milestones`), { [`milestone${i}.current`]: (current + 1) }, { merge: true });
                            break;
                        // milestone Type 2 handler is in reactionAdd (messageReactionAdd.js) event file

                        case 3:

                            if (current == milestoneGoal) {
                                return;
                            }

                            if (message.content.toLowerCase().includes(milestone.targetLetter.toLowerCase())) {
                                if ((current + 1) >= milestoneGoal) {
                                    await updateDoc(doc(db, `${message.author.id}/EventQuestProgression/Milestones/Milestones`), { [`milestone${i}.current`]: (0) }, { merge: true });
                                    const completedEmbed = new EmbedBuilder()
                                        .setTitle('You have completed a milestone!')
                                        .setColor('#00FF06')
                                        .setDescription(`The milestone has now resetted. (0/${milestoneGoal})`);
                                    return message.author.send({ embeds: [completedEmbed] });
                                }

                                if ((current + 1) == Math.ceil((25 / 100) * milestoneGoal)) {
                                    const progressEmbed = new EmbedBuilder()
                                        .setTitle('You have made progress on a milestone!')
                                        .setColor('#00284A')
                                        .setDescription(`You have reached 25% on a milestone. (${current + 1}/${milestoneGoal})`);

                                    message.author.send({ embeds: [progressEmbed] });
                                }
                                else if ((current + 1) == Math.ceil((50 / 100) * milestoneGoal)) {
                                    const progressEmbed = new EmbedBuilder()
                                        .setTitle('You have made progress on a milestone!')
                                        .setColor('#0066BC')
                                        .setDescription(`You have reached 50% on a milestone. (${current + 1}/${milestoneGoal})`);

                                    message.author.send({ embeds: [progressEmbed] });
                                }
                                else if ((current + 1) == Math.ceil((75 / 100) * milestoneGoal)) {
                                    const progressEmbed = new EmbedBuilder()
                                        .setTitle('You have made progress on a milestone!')
                                        .setColor('#008AFF')
                                        .setDescription(`You have reached 75% on a milestone. (${current + 1}/${milestoneGoal})`);

                                    message.author.send({ embeds: [progressEmbed] });
                                }
                                await updateDoc(doc(db, `${message.author.id}/EventQuestProgression/Milestones/Milestones`), { [`milestone${i}.current`]: (current + 1) }, { merge: true });
                            }
                            break;

                        case 4:
                            break;

                        case 5:
                            if (message.content.toLowerCase() == milestone.targetContent[0].toLowerCase()) {
                                for (const key of milestone.targetContent) {
                                    targetCount.push(key);
                                }

                                targetCount[0] = 'passed';

                                for (let index = 1; index < targetCount.length; index++) {
                                    const filter = m => !!(m.content.toLowerCase().includes(milestone.targetContent[index].toLowerCase()));
                                    const collector = message.channel.createMessageCollector({ filter, time: 7000 });
                                    collector.on('collect', m => {
                                        console.log(`Collected ${m.content}`);
                                        targetCount[index] = 'passed';
                                    });

                                    collector.on('end', async collected => {
                                        console.log(`Collected ${collected.size} items`);
                                        console.log(targetCount);
                                        const allEqual = arr => arr.every(v => v === arr[0]);
                                        if (allEqual(targetCount)) {
                                            if ((current + 1) >= milestoneGoal) {
                                                await updateDoc(doc(db, `${message.author.id}/EventQuestProgression/Milestones/Milestones`), { [`milestone${i}.current`]: (0) }, { merge: true });
                                                const completedEmbed = new EmbedBuilder()
                                                    .setTitle('You have completed a milestone!')
                                                    .setColor('#00FF06')
                                                    .setDescription(`The milestone has now resetted. (0/${milestoneGoal})`);
                                                return message.author.send({ embeds: [completedEmbed] });
                                            }

                                            if ((current + 1) == Math.ceil((25 / 100) * milestoneGoal)) {
                                                const progressEmbed = new EmbedBuilder()
                                                    .setTitle('You have made progress on a milestone!')
                                                    .setColor('#00284A')
                                                    .setDescription(`You have reached 25% on a milestone. (${current + 1}/${milestoneGoal})`);

                                                message.author.send({ embeds: [progressEmbed] });
                                            }
                                            else if ((current + 1) == Math.ceil((50 / 100) * milestoneGoal)) {
                                                const progressEmbed = new EmbedBuilder()
                                                    .setTitle('You have made progress on a milestone!')
                                                    .setColor('#0066BC')
                                                    .setDescription(`You have reached 50% on a milestone. (${current + 1}/${milestoneGoal})`);

                                                message.author.send({ embeds: [progressEmbed] });
                                            }
                                            else if ((current + 1) == Math.ceil((75 / 100) * milestoneGoal)) {
                                                const progressEmbed = new EmbedBuilder()
                                                    .setTitle('You have made progress on a milestone!')
                                                    .setColor('#008AFF')
                                                    .setDescription(`You have reached 75% on a milestone. (${current + 1}/${milestoneGoal})`);

                                                message.author.send({ embeds: [progressEmbed] });
                                            }
                                            await updateDoc(doc(db, `${message.author.id}/EventQuestProgression/Milestones/Milestones`), { [`milestone${i}.current`]: (current + 1) }, { merge: true });
                                        }
                                    });
                                }
                            }
                            break;

                        case 6:
                            break;

                        default:
                            break;
                    }
                }
            });
        }
    },
};