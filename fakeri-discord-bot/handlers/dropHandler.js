const { AttachmentBuilder, EmbedBuilder, time, TimestampStyles } = require('discord.js');
const { Colors } = require('../emums/colors.js');
const path = require('node:path');
const { getFirestore, Timestamp, doc, getDoc, updateDoc, arrayUnion } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function giftsDrop(client) {
    const timeoutArray = [];
    const channels = await getDoc(doc(db, 'Event/GiftDrops'));
    const msgs = [];
    const dropChannels = [];
    const giftColors = [ 'Blue', 'Green', 'Red', 'Pink', 'Ourple', 'Yellow' ];
    const randomItem = giftColors[ Math.floor(Math.random() * giftColors.length) ];
    if (channels.exists()) {
        Object.entries(channels.data()).forEach(async channel => {
            for (let index = 0; index < 2; index++) {
                if (channel[ 0 ] == 'activeDrop') return;
                const guildId = channel[ 0 ];

                const giftDropsDaily = channel[ 1 ].daily;
                let giftDropsChannel;
                try {
                    await client.guilds.fetch(guildId).then(async guild => {
                        await guild.channels.fetch(channel[ 1 ].channel).then(dropsChannel => giftDropsChannel = dropsChannel);
                    });
                }
                catch (e) {
                    console.log('');
                }

                if (giftDropsChannel == undefined) return;

                const dropDay = new Timestamp(giftDropsDaily.day.seconds, giftDropsDaily.day.nanoseconds).toDate();
                const dropNight = new Timestamp(giftDropsDaily.night.seconds, giftDropsDaily.night.nanoseconds).toDate();

                const dropTime = (index == 0) ? dropDay : dropNight;

                // TODO: Night animations (index == 0) ? 'day' : 'day';
                const dropTimeVerbal = 'day';

                dropDay.setDate(new Date().getDate());
                dropDay.setMonth(new Date().getMonth());
                dropDay.setFullYear(new Date().getFullYear());

                dropNight.setDate(new Date().getDate());
                dropNight.setMonth(new Date().getMonth());
                dropNight.setFullYear(new Date().getFullYear());

                // Negative means event is yet to come
                // Positive means event has happened

                const date2 = new Date().getTime();
                const diffDay = (+date2) - (+dropTime);
                if (new Date().getHours() > dropTime.getHours()) return;
                // for later console.log(Math.abs(diffDay) - 36e5);


                const timeout1 = setTimeout((diff, dropsChannel) => {
                    if (Math.sign(Math.abs(diff) - 36e5) == -1) return;
                    console.log('Thy event is an hour');
                    dropsChannel.sendTyping();
                    const portalBlue = new EmbedBuilder()
                        .setTitle('Un portal ha aparecido en el cielo! 🧿')
                        .setDescription(`Podria haber un drop en ${time(Math.floor(dropTime.getTime() / 1000), TimestampStyles.RelativeTime)}`)
                        .setColor('#1370E4');

                    dropsChannel.send({
                        embeds: [ portalBlue ],
                        files: [ new AttachmentBuilder('https://files.catbox.moe/p57xmr.mp4', { name: 'portal_blue.mp4' }) ],
                    });
                }, Math.abs(diffDay) - 36e5, diffDay, giftDropsChannel);

                const timeout2 = setTimeout((diff) => {
                    if (Math.sign(Math.abs(diff) - 18e5) == -1) return;
                    console.log('Thy event is half hour');
                }, Math.abs(diffDay) - 18e5, diffDay, giftDropsChannel);

                const timeout3 = setTimeout(async (dropsChannel) => {

                    const playerCount = await (await getDoc(doc(db, 'Event/Players'))).data().members.length;
                    const goal = Math.floor(playerCount * 0.6) - 1;
                    const giftEmbed = new EmbedBuilder()
                        .setTitle('Un regalo ha caido del portal! 🎁')
                        .setDescription(`Necesitamos **${goal}** personas que ayuden a abrirlo! 🫳`)
                        .setColor(Colors[ randomItem ]);
                    console.log('Thy event is now');
                    dropsChannel.sendTyping();

                    const fallVideoFilePath = path.join(__dirname, '..', 'assets', 'giftVideos', 'giftFallColors', `${randomItem.toLowerCase()}_fall_${dropTimeVerbal}.mp4`);
                    dropsChannel.send({ embeds: [ giftEmbed ], files: [ new AttachmentBuilder(fallVideoFilePath, { name: `gift_fall_${randomItem.toLowerCase()}.mp4` }) ] })
                        .then(async msg => {
                            const endTime = new Date();
                            const giftEnd = new Date();

                            endTime.setHours(endTime.getHours() + 6);
                            giftEnd.setHours(giftEnd.getHours() + 4);

                            await msg.react('🫳');
                            msgs.push(msg.id);
                            dropChannels.push(dropsChannel.id);
                            await updateDoc(doc(db, 'Event/GiftDrops'), {
                                [ 'activeDrop' ]: {
                                    progress: 0,
                                    goal: goal,
                                    totalEnd: Timestamp.fromDate(endTime),
                                    giftTimeout: Timestamp.fromDate(giftEnd),
                                    messages: msgs,
                                    channels: dropChannels,
                                    opened: false,
                                    destroyed: false,
                                    usersRewarded: [],
                                    pendingRewards: [],
                                    multiplier: 0.0,
                                    openMsgs: [],
                                    giftColor: randomItem.toLowerCase(),
                                },
                            }, { merge: true });
                        });

                    setTimeout(async (dropChannel) => {
                        const portalLaserNoParticles = new EmbedBuilder()
                            .setTitle('Another portal has appeared in the heights of the sky! 🌫️')
                            .setDescription('Portal experts say it may become dangerous\nPortal experts also say it\'s emanating a kind of Dark Energy/Magic.')
                            .setColor('#DE00FF');

                        dropChannel.send({ embeds: [ portalLaserNoParticles ] });

                        setTimeout((giftDropChannel) => {
                            const portalLaserParticles = new EmbedBuilder()
                                .setTitle('UPDATE: The pink portal seems to be charging up! 🌩️')
                                .setDescription('Analysis show high energy signatures meaning certain destruction\n\n"We don\'t know what may come out of that portal, but something really destructive for sure"\n\n"The path that this... thing will most likely take, is going to hit and obliterate the gift, also obliterating it\'s insides."\n- Nakthiji (Portal Analysis Team)')
                                .setColor('#DE00FF');

                            giftDropChannel.send({ embeds: [ portalLaserParticles ] });


                        }, 18e5, dropChannel);

                        setTimeout(async (giftChannel) => {
                            const __destructionVideoFilePath = path.join(__dirname, '..', 'assets', 'giftVideos', 'giftDestructionColors', randomItem.toLowerCase(), `${randomItem.toLowerCase()}_gift_${dropTimeVerbal}_destruction_v${Math.floor(Math.random() * 3)}.mp4`);
                            const destructionEmbed = new EmbedBuilder()
                                .setTitle('El regalo ha sido destruido')
                                .setDescription('Ya no es posible reclamar recompensas')
                                .setColor('#DE00FF');
                            /* TODO: Night animations files: [new AttachmentBuilder(destructionVideoFilePath, { name: `gift_destruction_${randomItem.toLowerCase()}.mp4` })]*/
                            giftChannel.send({ embeds: [ destructionEmbed ] });
                            await updateDoc(doc(db, 'Event/GiftDrops'), {
                                [ 'activeDrop.destroyed' ]: true,
                            }, { merge: true });
                        }, 36e5, dropChannel);

                    }, 36e5 * 5, dropsChannel);
                    await updateDoc(doc(db, 'Event/Timeouts'), {
                        [ 'timestamps' ]: arrayUnion({
                            timeoutDate: Timestamp.fromMillis(new Date().setHours(new Date().getHours() + 5)),
                            type: 'giftDestruction',
                            dropChannel: giftDropsChannel.id,
                        }),
                    }, { merge: true });
                }, Math.abs(diffDay), giftDropsChannel);

                timeoutArray.push(timeout1, timeout2, timeout3);
            }
        });
    }
    return timeoutArray;
}

module.exports = { giftsDrop };
