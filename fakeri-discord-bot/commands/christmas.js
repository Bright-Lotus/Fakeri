const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const sizeOf = require('image-size');

const { firebaseConfig } = require('../firebaseConfig.js');

const { getFirestore, collection, getDocs, Timestamp, getDoc, doc, orderBy, query } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { pagination } = require('../handlers/paginationHandler.js');
const path = require('node:path');


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Informacion acerca de cosas relacionadas con el evento.')
        .addSubcommand(subcmd =>
            subcmd.setName('leaderboard').setDescription('Mira la tabla de puntuacion del evento'),
        )
        .addSubcommand(subcommand => {
            return subcommand
                .setName('quests')
                .setDescription('Lists your quests.')
                .addStringOption(option =>
                    option.setName('category')
                        .setDescription('Category of the mission (Weekly or Milestone) and if applicable, which week.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Week 1', value: 'Week 1' },
                            { name: 'Week 2', value: 'Week 2' },
                            { name: 'Week 3', value: 'Week 3' },
                            // { name: 'Milestones', value: 'Milestones' },
                            { name: 'Instructor', value: 'Instructor' },
                            { name: 'Nora', value: 'Nora' },
                        ),
                )
                .addStringOption(option => option.setName('arguments').setDescription('Additional arguments.'));
        }),
    execute: async function (interaction) {
        await event(interaction);
    },
    contextMenuExecute: async function (interaction, selected) {
        const playerClass = await (await getDoc(doc(db, interaction.user.id, 'PlayerInfo'))).data().class;
        let instructor;
        switch (playerClass) {
            case 'warrior':
                instructor = 'Lyra';
                break;

            case 'enchanter':
                instructor = 'Abe';
                break;

            case 'archer':
                instructor = 'Arissa';
                break;
        }
        if (selected == 'Instructor') {
            await quests(interaction, instructor, true);
        }
        else {
            await quests(interaction, selected, true);
        }
    },
};

async function event(interaction) {
    if (interaction.options.getSubcommand() === 'quests') {
        if (interaction.options.getString('category') == 'Instructor') {
            const playerClass = await (await getDoc(doc(db, interaction.user.id, 'PlayerInfo'))).data().class;
            let instructor;
            switch (playerClass) {
                case 'warrior':
                    instructor = 'Lyra';
                    break;

                case 'enchanter':
                    instructor = 'Abe';
                    break;

                case 'archer':
                    instructor = 'Arissa';
                    break;
            }
            await quests(interaction, instructor, false);
        }
        else {
            await quests(interaction, interaction.options.getString('category'), false);
        }
    }
    if (interaction.options.getSubcommand() === 'leaderboard') {
        await leaderboard(interaction);
    }
}

async function leaderboard(interaction) {
    await interaction.deferReply();
    const players = await getDoc(doc(db, 'Event/Players'));
    const usersArray = [];
    if (players.exists()) {
        for await (const player of players.data().members) {
            const playerInfo = await (await getDoc(doc(db, player.id, 'PlayerInfo'))).data();
            await interaction.client.users.fetch(player.id).then(usr => {
                usersArray.push({
                    id: usr.id,
                    eventPts: playerInfo.eventPoints,
                    name: usr.username,
                    playerHp: playerInfo.stats.hp,
                    playerMaxHp: playerInfo.stats.maxHp,
                    isPlayer: (interaction.user.id == player.id),
                    lvl: playerInfo.playerLvl,
                });
            });
        }
        const sortedArray = usersArray.sort((a, b) => {
            return b.eventPts - a.eventPts;
        });
        console.log(sortedArray);
        await pagination('leaderboard', sortedArray, 1, interaction.user, { arraySorted: true }).then(results => {
            interaction.editReply({ embeds: [ results.embed ], components: [ results.paginationRow ] });
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
            const __milestone3 = milestonesDoc.data().milestone3 | 0;
            const milestone4 = milestonesDoc.data().milestone4 | 0;
            const milestone5 = milestonesDoc.data().milestone5 | 0;

            const milestone1Goal = milestonesDoc.data().milestone1?.goal;
            const __milestone2Goal = milestonesDoc.data().milestone2?.goal | 0;
            const __milestone3Goal = milestonesDoc.data().milestone3?.goal | 0;
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
        .setColor('#3284EC');

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

    return { files: [ attachment ], components: [ row ], embeds: [ questEmbed ] };
}

async function quests(interaction, weekToDisplay, selectMenu) {
    if (!selectMenu) { interaction.deferReply(); }
    Canvas.GlobalFonts.registerFromPath(path.join(__dirname, '..', 'assets', 'Font', 'BurbankBigCondensed-Black.otf'), 'Burbank Big');

    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId(`quest-category-select/${interaction.user.id}`)
                .setPlaceholder('Select week or see milestones')
                .addOptions(
                    {
                        label: 'Week 1',
                        description: 'Misiones de la semana 1',
                        value: 'Week 1',
                    },
                    {
                        label: 'Week 2',
                        description: 'Misiones de la semana 2',
                        value: 'Week 2',
                    },
                    {
                        label: 'Week 3',
                        description: 'Misiones de la semana 3',
                        value: 'Week 3',
                    },
                    // TODO: Milestones {
                    //     label: 'Milestones',
                    //     description: 'Milestone quests',
                    //     value: 'Milestones',
                    // },
                    {
                        label: 'Instructor',
                        description: 'Misiones de tu instructor',
                        value: 'Instructor',
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
    let displayName = interaction.member.displayName;
    if (interaction.user.id == '407225705051455491') {
        displayName = 'Ashe';
    }
    do {
        // Assign the font to the context and decrement it so it can be measured again
        fontSize -= 5;
        context.font = `${fontSize}px "Burbank Big"`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(displayName).width > canvas.width - 1050);

    context.fillText(displayName, 1440, (sizeOf('./questUI1.png').height - 2165));
    context.textAlign = 'start';
    let weekUnlocked = true;
    let attachment;
    const missionsQuery = query(collection(db, (weekToDisplay.includes('Week')) ? '/Event' : interaction.user.id), orderBy('quest0'));
    const weeklyQuestsSnap = await getDocs(missionsQuery);
    userWeeklys.forEach(async (weekly) => {
        if (weekToDisplay.includes('Week')) {
            if (!weekly.id.includes(weekToDisplay.split(' ')[ 1 ])) {
                return;
            }
        }
        else {
            // eslint-disable-next-line no-lonely-if
            if (!weekly.id.includes(weekToDisplay)) {
                return;
            }
        }

        // doc.data() is never undefined for query doc snapshots
        weeklyQuestsSnap.forEach(async (document) => {
            const ctx = canvas.getContext('2d');
            if (weekToDisplay.includes('Week')) {
                if (!document.id.includes(weekToDisplay.split(' ')[ 1 ])) {
                    return;
                }
            }
            else {
                // eslint-disable-next-line no-lonely-if
                if (!document.id.includes(weekToDisplay)) {
                    return;
                }
            }

            if (document.data()?.locked) {
                weekUnlocked = false;
                const unlocksDate = new Timestamp(document.data().locked.unlocks.seconds, document.data().locked.unlocks.nanoseconds).toDate();
                const lockedEmbed = new EmbedBuilder()
                    .setTitle('Esta semana esta bloqueada!')
                    .setDescription(`Sera desbloqueada <t:${Math.floor(unlocksDate.getTime() / 1000)}:R> <t:${Math.floor(unlocksDate.getTime() / 1000)}:F>`)
                    .setColor('#FF0000');
                interaction.editReply({ embeds: [ lockedEmbed ], attachments: [], components: [ row ] });
                return;
            }

            console.log(weekly.data());
            // ags the game ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            for (const key in weekly.data()) {
                console.log(key);
                let xCoordinates = Math.round((((weekly.data().mission0 / document.data().quest0.goal * 100) - 10) / 100) * 873);

                const mission0 = weekly.data().mission0 || 0;
                const mission1 = weekly.data().mission1 || 0;
                const mission2 = weekly.data().mission2 || 0;
                const mission3 = weekly.data().mission3 || 0;
                const mission4 = weekly.data().mission4 || 0;
                const mission5 = weekly.data().mission5 || 0;

                const quest0Goal = document.data().quest0?.goal || 0;
                const quest1Goal = document.data().quest1?.goal || 0;
                const quest2Goal = document.data().quest2?.goal || 0;
                const quest3Goal = document.data().quest3?.goal || 0;
                const quest4Goal = document.data().quest4?.goal || 0;
                const quest5Goal = document.data().quest5?.goal || 0;
                console.log(key.charAt(7));


                switch (key) {
                    case 'mission0': {
                        ctx.fillStyle = '#000000';
                        if (!weekToDisplay.includes('Week')) {
                            ctx.font = 'italic 65px "Burbank Big"';
                            ctx.fillText(document.data().quest0.mission, 289, (sizeOf('./questUI1.png').height - 1575));
                            ctx.fillStyle = '#6A6A6A';
                            ctx.font = 'italic 55px "Burbank Big"';
                            ctx.fillText(document.data().quest0.description, 289, (sizeOf('./questUI1.png').height - 1530));
                            ctx.fillStyle = '#000000';
                        }
                        ctx.font = '50px "Burbank Big"';
                        ctx.fillText(`${mission0}/${quest0Goal}`, (!weekToDisplay.includes('Week')) ? 1200 : 1235, (sizeOf('./questUI1.png').height - 1475));
                        ctx.font = '40px "Burbank Big"';
                        ctx.fillStyle = (mission0 == quest0Goal) ? '#10CD19' : '#3284EC';
                        ctx.fillRect(279, (sizeOf('./questUI1.png').height - 1511), Math.floor(((mission0 / quest0Goal * 100) / 100) * 873), 35);
                        ctx.fillStyle = '#ffffff';
                        let mission0XCoordinates = Math.floor((((weekly.data().mission0 / quest0Goal * 100) - 10) / 100) * 873);
                        mission0XCoordinates += 289;
                        if (mission0XCoordinates <= 288) {
                            mission0XCoordinates = 288;
                        }

                        if (mission0XCoordinates >= 1070) {
                            mission0XCoordinates = 1070;
                        }
                        ctx.fillText(`${Math.floor((mission0 / quest0Goal) * 100)}%`, mission0XCoordinates, (sizeOf('./questUI1.png').height - 1480));
                        console.log(weekly.id, ' => ', weekly.data().mission1);
                        break;
                    }

                    case 'mission1':
                        ctx.fillStyle = '#000000';
                        ctx.font = '50px "Burbank Big"';
                        ctx.fillText(`${mission1}/${quest1Goal}`, 1200, (sizeOf('./questUI1.png').height - 1086));
                        ctx.font = '40px "Burbank Big"';
                        ctx.fillStyle = (mission1 == quest1Goal) ? '#10CD19' : '#3284EC';
                        ctx.fillRect(279, (sizeOf('./questUI1.png').height - 1119), Math.floor(((weekly.data().mission1 / quest1Goal * 100) / 100) * 873), 35);
                        ctx.fillStyle = '#ffffff';
                        xCoordinates += 289;
                        if (xCoordinates <= 288) {
                            xCoordinates = 288;
                        }

                        if (xCoordinates >= 1070) {
                            xCoordinates = 1070;
                        }
                        ctx.fillText(`${Math.floor((mission1 / quest1Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 1087));
                        console.log(weekly.id, ' => ', weekly.data().mission1);
                        break;

                    case 'mission2':
                        ctx.fillStyle = '#000000';
                        ctx.font = '50px "Burbank Big"';
                        ctx.fillText(`${mission2}/${quest2Goal}`, 1200, (sizeOf('./questUI1.png').height - 863));
                        ctx.font = '40px "Burbank Big"';
                        ctx.fillStyle = (mission2 == quest2Goal) ? '#10CD19' : '#3284EC';
                        ctx.fillRect(279, (sizeOf('./questUI1.png').height - 894), Math.floor(((weekly.data().mission2 / quest2Goal * 100) / 100) * 873), 35);
                        ctx.fillStyle = '#ffffff';
                        xCoordinates += 289;
                        if (xCoordinates <= 288) {
                            xCoordinates = 288;
                        }

                        if (xCoordinates >= 1070) {
                            xCoordinates = 1070;
                        }
                        ctx.fillText(`${Math.floor((mission2 / quest2Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 863));
                        break;

                    case 'mission3':
                        ctx.fillStyle = '#000000';
                        ctx.font = '50px "Burbank Big"';
                        ctx.fillText(`${mission3}/${quest3Goal}`, 1200, (sizeOf('./questUI1.png').height - 640));
                        ctx.font = '40px "Burbank Big"';
                        ctx.fillStyle = (mission3 == quest3Goal) ? '#10CD19' : '#3284EC';
                        ctx.fillRect(279, (sizeOf('./questUI1.png').height - 671), Math.floor(((weekly.data().mission3 / quest3Goal * 100) / 100) * 900), 35);
                        ctx.fillStyle = '#ffffff';
                        xCoordinates += 289;
                        if (xCoordinates <= 288) {
                            xCoordinates = 288;
                        }

                        if (xCoordinates >= 1070) {
                            xCoordinates = 1070;
                        }
                        ctx.fillText(`${Math.floor((mission3 / quest3Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 640));
                        break;

                    case 'mission4':
                        ctx.fillStyle = '#000000';
                        ctx.font = '50px "Burbank Big"';
                        ctx.fillText(`${mission4}/${quest4Goal}`, 1200, (sizeOf('./questUI1.png').height - 400));
                        ctx.font = '40px "Burbank Big"';
                        ctx.fillStyle = (mission4 == quest4Goal) ? '#10CD19' : '#3284EC';
                        ctx.fillRect(277, (sizeOf('./questUI1.png').height - 435), Math.floor(((mission4 / quest4Goal * 100) / 100) * 876), 35);
                        ctx.fillStyle = '#ffffff';
                        xCoordinates = Math.floor((((mission4 / quest4Goal * 100) - 10) / 100) * 873);

                        xCoordinates += 289;
                        if (xCoordinates <= 288) {
                            xCoordinates = 288;
                        }

                        if (xCoordinates >= 1070) {
                            xCoordinates = 1070;
                        }
                        ctx.fillText(`${Math.floor((mission4 / quest4Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 404));
                        console.log(weekly.id, ' => ', weekly.data().mission1);
                        break;

                    case 'mission5':
                        ctx.fillStyle = '#000000';
                        ctx.font = '50px "Burbank Big"';
                        ctx.fillText(`${mission5}/${quest5Goal}`, 1200, (sizeOf('./questUI1.png').height - 165));
                        ctx.font = '40px "Burbank Big"';
                        ctx.fillStyle = (mission5 == quest5Goal) ? '#10CD19' : '#3284EC';
                        ctx.fillRect(277, (sizeOf('./questUI1.png').height - 194), Math.floor(((mission5 / quest5Goal * 100) / 100) * 902), 35);
                        ctx.fillStyle = '#ffffff';
                        xCoordinates = Math.floor((((mission5 / quest5Goal * 100) - 10) / 100) * 873);

                        xCoordinates += 289;
                        if (xCoordinates <= 288) {
                            xCoordinates = 288;
                        }

                        if (xCoordinates >= 1070) {
                            xCoordinates = 1070;
                        }
                        ctx.fillText(`${Math.floor((mission5 / quest5Goal) * 100)}%`, xCoordinates, (sizeOf('./questUI1.png').height - 160));
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
            .setDescription('Saldran nuevas misiones cada semana!');

        if (weekUnlocked) {
            return interaction.editReply({ files: [ attachment ], components: [ row ], embeds: [ questEmbed ] });
        }
    });
}

async function questImage(userID, category) {
    const querySnapshot = await getDocs(collection(db, `/${userID}/EventQuestProgression/Weekly`));
    const missionsQuery = query(collection(db, (category.includes('Week')) ? '/Event' : userID), orderBy('quest0'));
    const weeklyQuestsSnap = await getDocs(missionsQuery);

    let imgStr = `assets/questUI/completed/Week${category.split(' ')[ 1 ]}/questUI_missions_completed_`;
    let completedArray = [];
    if (category.includes('Week')) {
        querySnapshot.forEach(async userMissions => {
            weeklyQuestsSnap.forEach(async document => {
                for (const key in userMissions.data()) {
                    if (!userMissions.id.includes(category.split(' ')[ 1 ])) continue;
                    if (userMissions.data()[ key ] == document.data()[ `quest${key.charAt(7)}` ]?.goal) {
                        completedArray.push(key.charAt(7));
                    }
                }
            });
        });

        for (let i = 1; i < completedArray.length; i++) {
            for (let j = 0; j < i; j++) {
                if (completedArray[ i ] < completedArray[ j ]) {
                    const x = completedArray[ i ];
                    completedArray[ i ] = completedArray[ j ];
                    completedArray[ j ] = x;
                }
            }
        }
        completedArray = completedArray.filter(item => item !== '0');
        console.log(completedArray);
        completedArray.forEach(element => {
            imgStr += element.toString();
        });
        if (completedArray.length == 0) {
            imgStr = `./assets/questUI/baseWeek${category.split(' ')[ 1 ]}.png`;
        }
        else {
            imgStr += '.png';
        }
        return imgStr;
    }
    else {
        switch (category) {
            case 'Lyra': return 'assets/questUI/lyraBase.png';
            case 'Arissa': return 'assets/questUI/arissaBase.png';
            case 'Nora': return 'assets/questUI/nora.png';
            case 'Abe': return 'assets/questUI/abeBase.png';
            case 'Milestones':
                return 'assets/questUI/MilestonesUI/questsUI_milestones.png';
        }
    }
}