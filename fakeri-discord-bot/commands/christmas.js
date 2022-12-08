const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const sizeOf = require('image-size');

const { firebaseConfig } = require('../firebaseConfig.js');

const { getFirestore, collection, getDocs, Timestamp } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Informacion acerca de cosas evento.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('quests')
                .setDescription('Lists your quests.')
                .addStringOption(option =>
                    option.setName('category')
                        .setDescription('Category of the mission (Weekly or Milestone) and if applicable, which week.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Week 1', value: 'Week 1' },
                            { name: 'Week 2', value: 'Week 2' },
                            { name: 'Milestones', value: 'Milestones' },
                        ),
                )
                .addStringOption(option => option.setName('arguments').setDescription('Additional arguments.'))),
    execute: async function(interaction) {
        await event(interaction);
    },
    contextMenuExecute: async function(interaction, selected) {
        await quests(interaction, selected, true);
    },
};

async function event(interaction) {
    if (interaction.options.getSubcommand() === 'quests') {
        await quests(interaction, interaction.options.getString('category'), false);
    }
    if (interaction.options.getSubcommand() === 'test') {
        const giftEventTime = new Date(Date.now());
        const christmasChannel = interaction.guild.channels.cache.get('1032013306631827546');
        giftEventTime.setHours(giftEventTime.getHours() + 1);
        christmasChannel.send(`<t:${Math.floor(giftEventTime.getTime() / 1000)}:R>`);
        const giftEmbed = new EmbedBuilder()
            .setTitle('A gift has fallen from the sky! 🎁')
            .setDescription('React with 🫳 to open it! We have to reach 10 helpers!')
            .setColor('#137FE4');

        const portalBlue = new EmbedBuilder()
            .setTitle('A mysterious portal has appeared in the sky! 🧿')
            .setDescription(`Preliminar analysis tell something may come out of it <t:${Math.floor(giftEventTime.getTime() / 1000)}:R>`)
            .setColor('#137FE4');

        const portalLaserNoParticles = new EmbedBuilder()
            .setTitle('Another portal has appeared in the heights of the sky! 🌫️')
            .setDescription(`Portal experts say it may become dangerous <t:${Math.floor(giftEventTime.getTime() / 1000)}:R>\nPortal experts also say it's emanating a kind of Dark Energy/Magic.`)
            .setColor('#DE00FF');

        const portalLaserParticles = new EmbedBuilder()
            .setTitle('UPDATE: The pink portal is charging a laser! 🌩️')
            .setDescription('Analysis show high energy signatures meaning a probable laser of destruction\n\n"The path that the laser will take, is going to hit and obliterate the gift, also obliterating the reward."\n- Nakthiji (Portal Analysis Team)')
            .setColor('#DE00FF');

        christmasChannel.send({ embeds: [giftEmbed], files: [new AttachmentBuilder('https://files.catbox.moe/hgnbea.mp4', { name: 'gift_fall_blue.mp4' })] }).then(msg => {
            msg.react('🫳');
        });
        const giftOpenedEmbed = new EmbedBuilder()
            .setTitle('Goal achieved! 🎉')
            .setDescription('The gift has opened! The rewards have been given to everyone who helped open it')
            .setColor('#137FE4')
            .addFields(
                { name: 'If you didn\'t react before...', value: 'React with 🎁 to this message to claim your rewards!' },
            );
        christmasChannel.send({
            embeds: [giftOpenedEmbed],
            files: [new AttachmentBuilder('https://files.catbox.moe/jy0dyu.mp4', { name: 'opening_gift.mp4' })],
        }).then(msg => {
            msg.react('🎁');
        });

        christmasChannel.send({
            embeds: [portalBlue],
            files: [new AttachmentBuilder('https://files.catbox.moe/p57xmr.mp4', { name: 'portal_blue.mp4' })],
        });

        christmasChannel.send({
            embeds: [portalLaserNoParticles],
            files: [new AttachmentBuilder('https://files.catbox.moe/36rc24.mp4', { name: 'portal_laser.mp4' })],
        });

        christmasChannel.send({
            embeds: [portalLaserParticles],
            files: [new AttachmentBuilder('https://files.catbox.moe/ttxpld.mp4', { name: 'portal_laser_charging.mp4' })],
        });
    }
}

async function milestones(canvasContext, canvas, interaction) {
    const userMilestones = await getDocs(collection(db, `/${interaction.user.id}/EventQuestProgression/Milestones`));
    const ctx = canvasContext;

    userMilestones.forEach(async milestonesDoc => {
        for (const key in milestonesDoc.data()) {
            let xCoordinates = Math.round((((milestonesDoc.data().milestone1.current / milestonesDoc.data().milestone1.goal * 100) - 10) / 100) * 873);

            const milestone1 = milestonesDoc.data().milestone1;
            const milestone2 = milestonesDoc.data().milestone2;
            const milestone3 = milestonesDoc.data().milestone3 | 0;
            const milestone4 = milestonesDoc.data().milestone4 | 0;
            const milestone5 = milestonesDoc.data().milestone5 | 0;

            const milestone1Goal = milestonesDoc.data().milestone1?.goal;
            const milestone2Goal = milestonesDoc.data().milestone2?.goal | 0;
            const milestone3Goal = milestonesDoc.data().milestone3?.goal | 0;
            const milestone4Goal = milestonesDoc.data().milestone4?.goal | 0;
            const milestone5Goal = milestonesDoc.data().milestone5?.goal | 0;


            switch (key) {
                case 'milestone1':
                    console.log(milestone1);
                    ctx.fillStyle = '#000000';
                    ctx.font = '50px "Burbank Big"';
                    ctx.fillText(`${milestone1?.current}/${milestone1Goal}`, 1200, (sizeOf('./questUI1.png').height - 1086));
                    ctx.font = '40px "Burbank Big"';
                    ctx.fillStyle = (milestone1?.current == milestone1Goal) ? '#10CD19' : '#3284EC';
                    ctx.fillRect(279, (sizeOf('./questUI1.png').height - 1119), Math.round(((milestone1?.current / milestone1Goal * 100) / 100) * 873), 35);
                    ctx.fillStyle = '#ffffff';
                    xCoordinates += 289;
                    if (xCoordinates <= 288) {
                        xCoordinates = 288;
                    }

                    if (xCoordinates >= 1070) {
                        xCoordinates = 1070;
                    }
                    ctx.fillText(`${Math.round((milestone1?.current / milestone1Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 1087));
                    break;

                case 'milestone2':
                    console.log(milestone2);
                    break;

                case 'milestone3':
                    break;

                case 'milestone4':
                    ctx.fillStyle = '#000000';
                    ctx.font = '50px "Burbank Big"';
                    ctx.fillText(`${milestone4?.current}/${milestone4Goal}`, 1200, (sizeOf('./questUI1.png').height - 400));
                    ctx.font = '40px "Burbank Big"';
                    ctx.fillStyle = (milestone4?.current == milestone4Goal) ? '#10CD19' : '#3284EC';
                    ctx.fillRect(277, (sizeOf('./questUI1.png').height - 435), Math.round(((milestone4?.current / milestone4Goal * 100) / 100) * 876), 35);
                    ctx.fillStyle = '#ffffff';
                    xCoordinates = Math.round((((milestone4?.current / milestone4Goal * 100) - 10) / 100) * 873);

                    xCoordinates += 289;
                    if (xCoordinates <= 288) {
                        xCoordinates = 288;
                    }

                    if (xCoordinates >= 1070) {
                        xCoordinates = 1070;
                    }
                    ctx.fillText(`${Math.round((milestone4?.current / milestone4Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 404));
                    break;

                case 'milestone5':
                    ctx.fillStyle = '#000000';
                    ctx.font = '50px "Burbank Big"';
                    ctx.fillText(`${milestone5?.current}/${milestone5Goal}`, 1200, (sizeOf('./questUI1.png').height - 160));
                    ctx.font = '40px "Burbank Big"';
                    ctx.fillStyle = (milestone5?.current == milestone5Goal) ? '#10CD19' : '#3284EC';
                    ctx.fillRect(277, (sizeOf('./questUI1.png').height - 194), Math.round(((milestone5?.goal / milestone5Goal * 100) / 100) * 902), 35);
                    ctx.fillStyle = '#ffffff';
                    xCoordinates = Math.round((((milestone5?.current / milestone5Goal * 100) - 10) / 100) * 873);

                    xCoordinates += 289;
                    if (xCoordinates <= 288) {
                        xCoordinates = 288;
                    }

                    if (xCoordinates >= 1070) {
                        xCoordinates = 1070;
                    }
                    ctx.fillText(`${Math.round((milestone5?.current / milestone5Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 160));
                    break;

                default:
                    break;
            }
        }
    });
    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'player-quests.png' });
    const questEmbed = new EmbedBuilder()
        .setTitle('Player Milestones')
        .setColor('#3284EC')
        .setDescription('You can claim rewards with `/event quests claim`');

    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('quest-category-select')
                .setPlaceholder('Select week or see milestones')
                .addOptions(
                    {
                        label: 'Week 1',
                        description: 'Week 1 missions',
                        value: 'Week 1',
                    },
                    {
                        label: 'Week 2',
                        description: 'Week 2 missions',
                        value: 'Week 2',
                    },
                    {
                        label: 'Milestones',
                        description: 'Milestone quests',
                        value: 'Milestones',
                    },
                ),
        );

    return { files: [attachment], components: [row], embeds: [questEmbed] };
}

async function quests(interaction, weekToDisplay, selectMenu) {
    if (!selectMenu) { interaction.deferReply(); }

    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('quest-category-select')
                .setPlaceholder('Select week or see milestones')
                .addOptions(
                    {
                        label: 'Week 1',
                        description: 'Week 1 missions',
                        value: 'Week 1',
                    },
                    {
                        label: 'Week 2',
                        description: 'Week 2 missions',
                        value: 'Week 2',
                    },
                    {
                        label: 'Milestones',
                        description: 'Milestone quests',
                        value: 'Milestones',
                    },
                ),
        );

    const userWeeklys = await getDocs(collection(db, `/${interaction.user.id}/EventQuestProgression/Weekly`));
    const canvas = Canvas.createCanvas(sizeOf('./questUI1.png').width, sizeOf('./questUI1.png').height);
    const context = canvas.getContext('2d');
    const questImageURL = await questImage(interaction.user.id, weekToDisplay);
    await Canvas.loadImage(questImageURL).then(img => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
    if (weekToDisplay == 'Milestones') {
        const msg = await (milestones(context, canvas, interaction));
        return interaction.editReply(msg);
    }
    context.textAlign = 'center';
    context.fillStyle = '#fff';

    let fontSize = 100;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        fontSize -= 5;
        context.font = `${fontSize}px "Burbank Big"`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(interaction.member.displayName).width > canvas.width - 1050);

    context.fillText(interaction.member.displayName, 1440, (sizeOf('./questUI1.png').height - 2165));
    context.textAlign = 'start';
    let weekUnlocked = true;
    let attachment;
    const weeklyQuestsSnap = await getDocs(collection(db, '/Event'));
    userWeeklys.forEach(async (doc) => {
        if (!doc.id.includes(weekToDisplay.split(' ')[1])) {
            return;
        }
        // doc.data() is never undefined for query doc snapshots
        weeklyQuestsSnap.forEach(async (document) => {
            const ctx = canvas.getContext('2d');
            if (!document.id.includes(weekToDisplay.split(' ')[1])) {
                return;
            }

            if (document.data().locked) {
                console.log(document.data(), 'bruhhhhhhhh!!!!');
                weekUnlocked = false;
                const unlocksDate = new Timestamp(document.data().locked.unlocks.seconds, document.data().locked.unlocks.nanoseconds).toDate();
                const lockedEmbed = new EmbedBuilder()
                    .setTitle('The week you selected is locked!')
                    .setDescription(`It unlocks <t:${Math.floor(unlocksDate.getTime() / 1000)}:R>`)
                    .setColor('#FF0000');
                return interaction.editReply({ embeds: [lockedEmbed], attachments: [], components: [row] });
            }

            console.log(doc.data());
            // ags the game ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            for (const key in doc.data()) {
                console.log(key);
                let xCoordinates = Math.round((((doc.data().mission1 / document.data().quest1.goal * 100) - 10) / 100) * 873);

                const mission1 = doc.data().mission1 | 0;
                const mission2 = doc.data().mission2 | 0;
                const mission3 = doc.data().mission3 | 0;
                const mission4 = doc.data().mission4 | 0;
                const mission5 = doc.data().mission5 | 0;

                const quest1Goal = document.data().quest1?.goal | 0;
                const quest2Goal = document.data().quest2?.goal | 0;
                const quest3Goal = document.data().quest3?.goal | 0;
                const quest4Goal = document.data().quest4?.goal | 0;
                const quest5Goal = document.data().quest5?.goal | 0;
                console.log(key.charAt(7));


                switch (key) {
                    case 'mission1':
                        console.log('hewo');
                        ctx.fillStyle = '#000000';
                        ctx.font = '50px "Burbank Big"';
                        ctx.fillText(`${mission1}/${quest1Goal}`, 1200, (sizeOf('./questUI1.png').height - 1086));
                        ctx.font = '40px "Burbank Big"';
                        ctx.fillStyle = (mission1 == quest1Goal) ? '#10CD19' : '#3284EC';
                        ctx.fillRect(279, (sizeOf('./questUI1.png').height - 1119), Math.round(((doc.data().mission1 / quest1Goal * 100) / 100) * 873), 35);
                        ctx.fillStyle = '#ffffff';
                        xCoordinates += 289;
                        if (xCoordinates <= 288) {
                            xCoordinates = 288;
                        }

                        if (xCoordinates >= 1070) {
                            xCoordinates = 1070;
                        }
                        ctx.fillText(`${Math.round((mission1 / quest1Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 1087));
                        console.log(doc.id, ' => ', doc.data().mission1);
                        break;

                    case 'mission2':
                        ctx.fillStyle = '#000000';
                        ctx.font = '50px "Burbank Big"';
                        ctx.fillText(`${mission2}/${quest2Goal}`, 1200, (sizeOf('./questUI1.png').height - 863));
                        ctx.font = '40px "Burbank Big"';
                        ctx.fillStyle = (mission2 == quest2Goal) ? '#10CD19' : '#3284EC';
                        ctx.fillRect(279, (sizeOf('./questUI1.png').height - 894), Math.round(((doc.data().mission2 / quest2Goal * 100) / 100) * 873), 35);
                        ctx.fillStyle = '#ffffff';
                        xCoordinates += 289;
                        if (xCoordinates <= 288) {
                            xCoordinates = 288;
                        }

                        if (xCoordinates >= 1070) {
                            xCoordinates = 1070;
                        }
                        ctx.fillText(`${Math.round((mission2 / quest2Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 863));
                        break;

                    case 'mission3':
                        break;

                    case 'mission4':
                        console.log('4misshewobruh!');
                        ctx.fillStyle = '#000000';
                        ctx.font = '50px "Burbank Big"';
                        ctx.fillText(`${mission4}/${quest4Goal}`, 1200, (sizeOf('./questUI1.png').height - 400));
                        ctx.font = '40px "Burbank Big"';
                        ctx.fillStyle = (mission4 == quest4Goal) ? '#10CD19' : '#3284EC';
                        ctx.fillRect(277, (sizeOf('./questUI1.png').height - 435), Math.round(((mission4 / quest4Goal * 100) / 100) * 876), 35);
                        ctx.fillStyle = '#ffffff';
                        xCoordinates = Math.round((((mission4 / quest4Goal * 100) - 10) / 100) * 873);

                        xCoordinates += 289;
                        if (xCoordinates <= 288) {
                            xCoordinates = 288;
                        }

                        if (xCoordinates >= 1070) {
                            xCoordinates = 1070;
                        }
                        ctx.fillText(`${Math.round((mission4 / quest4Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 404));
                        console.log(doc.id, ' => ', doc.data().mission1);
                        break;

                    case 'mission5':
                        ctx.fillStyle = '#000000';
                        ctx.font = '50px "Burbank Big"';
                        ctx.fillText(`${mission5}/${quest5Goal}`, 1200, (sizeOf('./questUI1.png').height - 165));
                        ctx.font = '40px "Burbank Big"';
                        ctx.fillStyle = (mission5 == quest5Goal) ? '#10CD19' : '#3284EC';
                        ctx.fillRect(277, (sizeOf('./questUI1.png').height - 194), Math.round(((mission5 / quest5Goal * 100) / 100) * 902), 35);
                        ctx.fillStyle = '#ffffff';
                        xCoordinates = Math.round((((mission5 / quest5Goal * 100) - 10) / 100) * 873);

                        xCoordinates += 289;
                        if (xCoordinates <= 288) {
                            xCoordinates = 288;
                        }

                        if (xCoordinates >= 1070) {
                            xCoordinates = 1070;
                        }
                        ctx.fillText(`${Math.round((mission5 / quest5Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 160));
                        break;

                    default:
                        break;
                }
            }
        });
        attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'player-quests.png' });
        const questEmbed = new EmbedBuilder()
            .setTitle(`${weekToDisplay} Player Quests`)
            .setColor('#3284EC')
            .setDescription('You can claim rewards with `/event quests claim`');

        if (weekUnlocked && !selectMenu) {
            interaction.channel.send('```Sending reply one...```');
            return interaction.editReply({ files: [attachment], components: [row], embeds: [questEmbed] });
        }
        else if (weekUnlocked && selectMenu) {
            interaction.channel.send('```Sending reply two...```');
            return interaction.editReply({ files: [attachment], components: [row], embeds: [questEmbed] });
        }
    });
    // Quest 2 ctx.fillText('90/200', 1200, (sizeOf('./questUI1.png').height - 863));
    // Quest 3 ctx.fillText('90/200', 1200, (sizeOf('./questUI1.png').height - 640));

    // Quest2 ctx.fillRect(279, (sizeOf('./questUI1.png').height - 894), Math.round(((15 / 200 * 100) / 100) * 873), 35);
    // Quest 3ctx.fillRect(279, (sizeOf('./questUI1.png').height - 671), Math.round(((90 / 200 * 100) / 100) * 900), 35);

}

async function questImage(userID, category) {
    const querySnapshot = await getDocs(collection(db, `/${userID}/EventQuestProgression/Weekly`));
    const weeklyQuestsSnap = await getDocs(collection(db, '/Event'));

    let imgStr = 'assets/questUI/completed/Week1/questUI_missions_completed_';
    const completedArray = [];
    switch (category) {
        case 'Week 1':
            querySnapshot.forEach(async doc => {
                weeklyQuestsSnap.forEach(async document => {
                    for (const key in doc.data()) {
                        if (doc.data()[key] == document.data()[`quest${key.charAt(7)}`]?.goal) {
                            completedArray.push(key.charAt(7));
                        }
                    }
                });
            });

            for (let i = 1; i < completedArray.length; i++) {
                for (let j = 0; j < i; j++) {
                    if (completedArray[i] < completedArray[j]) {
                        const x = completedArray[i];
                        completedArray[i] = completedArray[j];
                        completedArray[j] = x;
                    }
                }
            }
            console.log(completedArray);
            completedArray.forEach(element => {
                imgStr += element.toString();
            });
            if (completedArray.length == 0) {
                imgStr = './assets/questUI/quest_baseUI.png';
            }
            else {
                imgStr += '.png';
            }
            return imgStr;
        case 'Week 2':
            return './questUI1.png';
        case 'Milestones':
            return 'assets/questUI/MilestonesUI/questsUI_milestones.png';
    }
}