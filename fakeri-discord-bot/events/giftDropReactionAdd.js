const { getFirestore, doc, updateDoc, getDoc, arrayUnion, increment, Timestamp } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../main.js');
const { EmbedBuilder, AttachmentBuilder, Events, underscore } = require('discord.js');
const { xpManager } = require('../handlers/xpHandler.js');
const path = require('node:path');
const { Colors } = require('../emums/colors.js');
const { goldManager } = require('../handlers/goldHandler.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: Events.MessageReactionAdd,
    once: false,
    execute: async function (reaction, usr) {
        // When a reaction is received, check if the structure is partial
        console.log(reaction, 'logdebug');
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

        if (usr.bot) return;
        // Now the message has been cached and is fully available
        console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
        // The reaction is now also fully available and the properties will be reflected accurately:
        console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
        const channels = await getDoc(doc(db, 'Event/GiftDrops'));
        if (channels.exists()) {

            if (!channels.data()?.activeDrop) return;

            const activeDrop = channels.data().activeDrop;
            activeDrop.openMsgs.forEach(async openMsg => {
                if (activeDrop.destroyed) return;
                if (reaction.message.id == openMsg) {
                    if (reaction.emoji.name == '🎁' && activeDrop.opened) {
                        if (usr.bot) return;
                        console.log(activeDrop.usersRewarded);
                        if (activeDrop.usersRewarded.some(member => member.includes(usr.id))) return;

                        const docSnap = await getDoc(doc(db, usr.id, 'PlayerInfo'));
                        if (docSnap.exists()) {
                            const xpBonus = docSnap.data().xpBonus;
                            const baseXp = 300;
                            const finalXp = baseXp + (baseXp * (xpBonus - activeDrop.multiplier));
                            console.log(finalXp, 'log', xpBonus, baseXp);

                            const rewardEmbed = new EmbedBuilder()
                                .setTitle('Gift Drop Rewards!')
                                .setDescription('Aqui estan tus recompensas!')
                                .setColor('Blue')
                                .addFields(
                                    { name: underscore('XP'), value: `${finalXp} XP (XP Bonus applied)` },
                                    { name: underscore('Gold'), value: '50 GOLD' },
                                );
                            usr.send({ embeds: [rewardEmbed] });

                            xpManager('give', baseXp, usr);
                            goldManager('give', 50, usr);

                            await updateDoc(doc(db, 'Event/GiftDrops'), {
                                ['activeDrop.usersRewarded']: arrayUnion(usr.id),
                            }, { merge: true });
                            return;
                        }
                    }
                }
            });
            if (activeDrop.opened) return;
            if (activeDrop.pendingRewards.find(userId => userId == usr.id) != undefined) return;
            if (reaction.emoji.name != '🫳') return;

            activeDrop.messages.forEach(async msg => {
                if (reaction.message.id == msg) {
                    await updateDoc(doc(db, 'Event/GiftDrops'), {
                        ['activeDrop.pendingRewards']: arrayUnion(usr.id),
                    }, { merge: true });

                    console.log(activeDrop.pendingRewards.length + 1, 'gfsdgasg');
                    if (activeDrop.progress + 1 == activeDrop.goal) {

                        reaction.message.channel.sendTyping();
                        const giftOpenedEmbed = new EmbedBuilder()
                            .setTitle('Goal achieved! 🎉')
                            .setDescription('The gift has opened!\nThe rewards have been given to everyone who helped open it')
                            .setColor(Colors[activeDrop.giftColor])
                            .addFields(
                                { name: 'If you didn\'t help open the gift...', value: 'React with 🎁 to this message to claim your rewards!' },
                            );

                        const rewarded = [];

                        const filePath = path.join(__dirname, '..', 'assets', 'giftVideos', 'giftOpenColors', `${activeDrop.giftColor}_open_day.mp4`);
                        await reaction.message.reply({
                            embeds: [giftOpenedEmbed],
                            files: [new AttachmentBuilder(filePath, { name: `gift_open_${activeDrop.giftColor}.mp4` })],
                        }).then(async message => {
                            await updateDoc(doc(db, 'Event/GiftDrops'), {
                                ['activeDrop.openMsgs']: arrayUnion(message.id),
                            }, { merge: true });

                            setInterval(async () => {
                                await updateDoc(doc(db, 'Event/GiftDrops'), {
                                    ['activeDrop.multiplier']: increment(0.05),
                                }, { merge: true });
                            }, 36e5);

                            message.react('🎁');
                            const users = (await getDoc(doc(db, 'Event/GiftDrops'))).data().activeDrop.pendingRewards || [];
                            users.forEach(async userID => {
                                const playerInfo = await getDoc(doc(db, userID, 'PlayerInfo'));
                                const user = await reaction.client.users.fetch(userID);
                                if (playerInfo.exists()) {
                                    const xpBonus = playerInfo.data().xpBonus;
                                    const baseXp = 300;
                                    const finalXp = baseXp + (baseXp * xpBonus);
                                    console.log(finalXp, 'log', xpBonus, baseXp);


                                    const rewardEmbed = new EmbedBuilder()
                                        .setTitle('Gift Drop Rewards!')
                                        .setDescription('Thanks for helping open the gift, here are your rewards:')
                                        .setColor(Colors[activeDrop.giftColor])
                                        .addFields(
                                            { name: underscore('XP'), value: `${finalXp} XP (XP Bonus applied)` },
                                            { name: underscore('Gold'), value: '50 GOLD' },
                                        );
                                    user.send({ embeds: [rewardEmbed] });

                                    xpManager('give', baseXp, user);
                                    goldManager('give', 50, user);

                                    rewarded.push(userID);
                                    await updateDoc(doc(db, 'Event/GiftDrops'), {
                                        ['activeDrop.usersRewarded']: rewarded,
                                    }, { merge: true });
                                }
                            });
                        });

                        await updateDoc(doc(db, 'Event/GiftDrops'), {
                            ['activeDrop.opened']: true,
                        }, { merge: true });
                    }

                    await updateDoc(doc(db, 'Event/GiftDrops'), {
                        ['activeDrop.progress']: activeDrop.pendingRewards.length + 1,
                    }, { merge: true });
                }
            });
        }
    },
};