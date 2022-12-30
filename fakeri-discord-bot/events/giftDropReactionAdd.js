const { getFirestore, doc, updateDoc, getDoc, arrayUnion, increment, Timestamp } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, AttachmentBuilder, Events, underscore } = require('discord.js');
const { xpManager } = require('../handlers/xpHandler.js');
const path = require('node:path');
const { Colors } = require('../emums/colors.js');
const { goldManager } = require('../handlers/goldHandler.js');
const { Utils } = require('../utils.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: Events.MessageReactionAdd,
    once: false,
    execute: async function(reaction, usr) {
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

        if (usr.bot) return;
        // Now the message has been cached and is fully available
        // The reaction is now also fully available and the properties will be reflected accurately:
        const channels = await getDoc(doc(db, 'Event/GiftDrops'));
        if (channels.exists()) {

            if (!channels.data()?.activeDrop) return;

            const activeDrop = channels.data().activeDrop;
            for await (const openMsg of activeDrop.openMsgs) {

                if (activeDrop.destroyed) return;
                if (reaction.message.id == openMsg) {
                    if (reaction.emoji.name == '🎁' && activeDrop.opened) {
                        if (usr.bot) return;
                        if (activeDrop.usersRewarded.some(member => member.includes(usr.id))) return;

                        const docSnap = await getDoc(doc(db, usr.id, 'PlayerInfo'));
                        if (docSnap.exists()) {
                            const xpBonus = docSnap.data().xpBonus;
                            const baseXp = 300;
                            const finalXp = baseXp + (baseXp * (xpBonus - activeDrop.multiplier));

                            const rewardEmbed = new EmbedBuilder()
                                .setTitle('Gift Drop Rewards!')
                                .setDescription('Aqui estan tus recompensas!')
                                .setColor('Blue')
                                .addFields(
                                    { name: underscore('XP'), value: `${finalXp} XP (XP Bonus applied)` },
                                    { name: underscore('Gold'), value: '50 GOLD' },
                                );
                            usr.send({ embeds: [ rewardEmbed ] });

                            xpManager('give', baseXp, usr);
                            goldManager('give', 50, usr);

                            await updateDoc(doc(db, 'Event/GiftDrops'), {
                                [ 'activeDrop.usersRewarded' ]: arrayUnion(usr.id),
                            }, { merge: true });
                            return;
                        }
                    }
                }
            }
            if (activeDrop.opened) return;
            if (activeDrop.pendingRewards.find(userId => userId == usr.id) != undefined) return;
            if (reaction.emoji.name != '🫳') return;

            for await (const msg of activeDrop.messages) {
                if (reaction.message.id == msg) {
                    console.log(`Reaction added to a gift drop message: ${usr.id} ${usr.tag}`);
                    await updateDoc(doc(db, 'Event/GiftDrops'), {
                        [ 'activeDrop.pendingRewards' ]: arrayUnion(usr.id),
                    }, { merge: true });

                    if (activeDrop.progress + 1 == activeDrop.goal) {

                        reaction.message.channel.sendTyping();
                        const giftOpenedEmbed = new EmbedBuilder()
                            .setTitle('Goal achieved! 🎉')
                            .setDescription('The gift has opened!\nThe rewards have been given to everyone who helped open it')
                            .setColor(Colors[ Utils.CapitalizeFirstLetter(activeDrop.giftColor) ])
                            .addFields(
                                { name: 'If you didn\'t help open the gift...', value: 'React with 🎁 to this message to claim your rewards!' },
                            );

                        const rewarded = [];

                        const filePath = path.join(__dirname, '..', 'assets', 'giftVideos', 'giftOpenColors', `${activeDrop.giftColor}_open_day.mp4`);
                        for await (const channelID of activeDrop.channels) {
                            const channel = await usr.client.channels.fetch(channelID);
                            await channel.send({
                                embeds: [ giftOpenedEmbed ],
                                files: [ new AttachmentBuilder(filePath, { name: `gift_open_${activeDrop.giftColor}.mp4` }) ],
                            }).then(async message => {
                                await updateDoc(doc(db, 'Event/GiftDrops'), {
                                    [ 'activeDrop.openMsgs' ]: arrayUnion(message.id),
                                }, { merge: true });

                                message.react('🎁');
                            });
                        }
                        setInterval(async () => {
                            await updateDoc(doc(db, 'Event/GiftDrops'), {
                                [ 'activeDrop.multiplier' ]: increment(0.05),
                            }, { merge: true });
                        }, 36e5);
                        const users = (await getDoc(doc(db, 'Event/GiftDrops'))).data().activeDrop.pendingRewards || [];
                        users.forEach(async userID => {
                            const playerInfo = await getDoc(doc(db, userID, 'PlayerInfo'));
                            const user = await reaction.client.users.fetch(userID);
                            if (playerInfo.exists()) {
                                const xpBonus = playerInfo.data().xpBonus;
                                const baseXp = 300;
                                const finalXp = baseXp + (baseXp * xpBonus);


                                const rewardEmbed = new EmbedBuilder()
                                    .setTitle('Gift Drop Rewards!')
                                    .setDescription('Thanks for helping open the gift, here are your rewards:')
                                    .setColor(Colors[ Utils.CapitalizeFirstLetter(activeDrop.giftColor) ])
                                    .addFields(
                                        { name: underscore('XP'), value: `${finalXp} XP (XP Bonus applied)` },
                                        { name: underscore('Gold'), value: '50 GOLD' },
                                    );
                                user.send({ embeds: [ rewardEmbed ] });

                                xpManager('give', baseXp, user);
                                goldManager('give', 50, user);

                                reaction.client.emit('type7QuestProgress', usr, reaction.client);

                                rewarded.push(userID);
                                await updateDoc(doc(db, 'Event/GiftDrops'), {
                                    [ 'activeDrop.usersRewarded' ]: rewarded,
                                }, { merge: true });
                            }
                        });

                        await updateDoc(doc(db, 'Event/GiftDrops'), {
                            [ 'activeDrop.opened' ]: true,
                        }, { merge: true });
                    }

                    await updateDoc(doc(db, 'Event/GiftDrops'), {
                        [ 'activeDrop.progress' ]: activeDrop.pendingRewards.length + 1,
                    }, { merge: true });
                }
            }
        }
    },
};