const { getFirestore, doc, setDoc, getDocs, collection } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder } = require('discord.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: 'messageReactionAdd',
    once: false,
    execute: async function(reaction) {
        // When a reaction is received, check if the structure is partial
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            }
            catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }
        if (reaction.me) return;

        // Now the message has been cached and is fully available
        console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
        // The reaction is now also fully available and the properties will be reflected accurately:
        console.log(`${reaction.count} user(s) have given the same reaction to this message!`);

        const weeklyQuestsSnap = await getDocs(collection(db, '/Event'));
        weeklyQuestsSnap.forEach(async (docSnap) => {
            if (!docSnap.id.includes('QuestsWeek')) return;
            const week = docSnap.id.substring(6);

            if (!docSnap.data()?.quest1) return;
            for (let i = 1; i < 6; i++) {
                console.log(docSnap.data()[`quest${i}`], i);

                const mission = docSnap.data()[`quest${i}`];
                const querySnapshot = await getDocs(collection(db, `/${reaction.message.author.id}/EventQuestProgression/Weekly`));
                /* Quest Types:
                1 = Send Message | DONE
                2 = React with emoji to messages
                3 = Send message with certain letter | DONE
                4 = Completion quest
                5 = Send message with certain content | DONE
                6 = Custom mission */
                const message = reaction.message;
                if (mission?.type == 2) {
                    querySnapshot.forEach(async (document) => {
                        if (document.id == 'Milestones' || document.id != week) return;
                        let current = document.data()[`mission${i}`];
                        if (!current) { current = 0; }
                        const missionGoal = docSnap.data()[`quest${i}`].goal;
                        const quest = docSnap.data()[`quest${i}`];

                        if (current >= missionGoal) {
                            await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [`mission${quest.position}`]: (missionGoal) }, { merge: true });
                            return;
                        }

                        if (reaction.message.channelId != quest.targetChannel) {
                            return;
                        }

                        if (reaction.emoji.name != quest.targetReaction) {
                            return;
                        }

                        if ((current + 1) >= missionGoal) {
                            reaction.message.client.emit('questCompleted', mission, message);
                            message.author.send('You have completed a quest!');
                        }

                        if ((current + 1) == Math.ceil((25 / 100) * missionGoal)) {
                            const progressEmbed = new EmbedBuilder()
                                .setTitle('You have made progress on a quest!')
                                .setColor('#00FF06')
                                .setDescription(`You have reached 25% on a quest. (${current + 1}/${missionGoal})`);

                            message.author.send({ embeds: [progressEmbed] });
                        }
                        else if ((current + 1) == Math.ceil((50 / 100) * missionGoal)) {
                            const progressEmbed = new EmbedBuilder()
                                .setTitle('You have made progress on a quest!')
                                .setColor('#00284A')
                                .setDescription(`You have reached 50% on a quest. (${current + 1}/${missionGoal})`);

                            message.author.send({ embeds: [progressEmbed] });
                        }
                        else if ((current + 1) == Math.ceil((75 / 100) * missionGoal)) {
                            const progressEmbed = new EmbedBuilder()
                                .setTitle('You have made progress on a quest!')
                                .setColor('#0066BC')
                                .setDescription(`You have reached 75% on a quest. (${current + 1}/${missionGoal})`);

                            message.author.send({ embeds: [progressEmbed] });
                        }
                        await setDoc(doc(db, `${message.author.id}/EventQuestProgression/Weekly/${week}`), { [`mission${quest.position}`]: (current + 1) }, { merge: true });
                    });
                }

            }
        });
    },
};