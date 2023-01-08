const { SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');
const { firebaseConfig } = require('../firebaseConfig.js');

const { getFirestore, doc, getDoc, setDoc, updateDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ReadText = require('text-from-image');
const fetch = require('node-fetch');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('ffprobe-static').path;

const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);

const Buffer = require('buffer').Buffer;
const fs = require('node:fs');

const { imageToChunks } = require('split-images');
const sizeOf = require('image-size');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duel')
        .setDescription('Start a duel with someone!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Starts a duel battle.')
                .addUserOption(option =>
                    option.setName('with')
                        .setDescription('The person to duel with.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('accept')
                .setDescription('Accepts a duel challenge. (This command will instantly start the duel)')
                .addIntegerOption(option =>
                    option.setName('number')
                        .setDescription('Number of the request to accept')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('requests')
                .setDescription('Lists all your duel challenges.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Bans a GIF on a duel.')
                .addStringOption(option =>
                    option.setName('link')
                        .setDescription('The URL to the GIF to ban. (Only available on a Duel Thread)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('surrender')
                .setDescription('Surrenders duel you are on. (Only available on a Duel Thread)'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('forfeit')
                .setDescription('Surrenders duel you are on. (Only available on a Duel Thread)'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ff')
                .setDescription('Surrenders duel you are on. (Only available on a Duel Thread)')),
    async execute(interaction) {
        await duel(interaction);
    },
};

async function duel(interaction) {

    // Handle Requests Command
    if (interaction.options.getSubcommand() === 'requests') {
        const docRef = doc(db, interaction.user.id, 'PendingRequests');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let listString = ' ';

            for (let i = 0; i < 10; i++) {
                if (docSnap.data()[`duel${i}`]) {
                    const element = docSnap.data()[`duel${i}`];
                    listString += `\n${i} |- ${userMention(element[0])} / Duel mode: ${element[1]}`;
                }
            }
            console.log(listString);

            const ListEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Challenges pending:')
                .setDescription(`You can have up to 10 requests.\n${listString}`)
                .setFooter({ text: 'You can accept any request by using /duel accept [number]' });

            return interaction.reply({
                content: 'Pending requests:',
                ephemeral: true,
                embeds: [ListEmbed],
            });
        }
        else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
        }
    }

    // #region start command
    if (interaction.options.getSubcommand() === 'start') {
        const docRef = doc(db, interaction.options.getUser('with').id, 'PendingRequests');
        const docSnap = await getDoc(docRef);
        let pendingRequests = 0;

        if (docSnap.exists()) {
            for (let i = 0; i < 10; i++) {
                if (docSnap.data()[`duel${i}`]) {
                    const element = docSnap.data()[`duel${i}`];

                    if (element[0] === interaction.user.id) {
                        return interaction.reply({ content: 'You have already sent a duel challenge to this user! Wait for them to accept.', ephemeral: true });
                    }

                    pendingRequests++;
                }
            }
        }


        await setDoc(doc(db, interaction.options.getUser('with').id, 'PendingRequests'), {
            [`duel${pendingRequests + 1}`]: [
                interaction.user.id,
                'GIF Duel',
                false,
            ],
        }, { merge: true });
        return interaction.reply(`A duel challenge to ${userMention(interaction.options.getUser('with').id)} has been sent. They now have to accept.`);

    }
    // #endregion

    if (interaction.options.getSubcommand() === 'accept') {
        const duelPlayers = [];
        const docRef = doc(db, interaction.user.id, 'PendingRequests');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const element = docSnap.data()[`duel${interaction.options.getInteger('number')}`];
            duelPlayers.push(interaction.user);
            await interaction.client.users.fetch(element[0]).then(usr => {
                duelPlayers.push(usr.username);
                duelPlayers.push(usr.id);
            });

        }
        console.log('Step 1 of 3\nCreating duel thread...');
        const thread = await interaction.channel.threads.create({
            name: `${duelPlayers[0].username} vs ${duelPlayers[1]}`,
            autoArchiveDuration: 60,
            reason: 'Needed a separate thread for duel',
        });

        interaction.reply({ content: `Thread for duel has been created: <#${thread.id}>`, ephemeral: true });

        console.log(`Created thread: ${thread.name} with ID ${thread.id}\n\nStep 1 of 3 succeeded\nProceeding with step 2 of 3:\nCreating documents in DB...`);
        console.log(interaction);


        const sides = ['blue', 'red'];
        const duelInfo = {
            [duelPlayers[0].id]: { side: sides[Math.floor(Math.random() * sides.length)] },
            [duelPlayers[2]]: { side: sides[Math.floor(Math.random() * sides.length)] },
        };
        if (duelInfo[duelPlayers[0].id].side == duelInfo[duelPlayers[2]].side) {
            console.log('The players have the same side, assigning correct sides.');
            duelInfo[duelPlayers[2]].side = sides[(sides.indexOf(duelInfo[duelPlayers[2]].side)) == 0 ? 1 : 0];
            console.log('The players now have the correct sides.');
        }
        await setDoc(doc(db, interaction.guildId, 'ActiveDuels'), {
            [`${duelPlayers[0].username}|${duelPlayers[1]}`]: {
                player1: duelPlayers[0].id,
                player2: duelPlayers[2],
                gamemode: 'GIF Duel',
                ended: false,
                winner: 'empty',
                ban_turn: 'red',
                duelInfo: {
                    bans: {
                        red_ban_1: 'empty',
                        red_ban_2: 'empty',
                        blue_ban_1: 'empty',
                        blue_ban_2: 'empty',
                    },
                    sides: {
                        red_side: (duelInfo[duelPlayers[0].id].side) == 'red' ? duelPlayers[0].id : duelPlayers[2],
                        blue_side: (duelInfo[duelPlayers[0].id].side) == 'red' ? duelPlayers[2] : duelPlayers[0].id,
                    },
                    red_side_hp: 2,
                    blue_side_hp: 2,
                    turn: 'blue',
                },
            },
        }, { merge: true });


        console.log('Documents in DB created successfully\n\nProceeding with step 3 of 3:\nSending instructions in thread...');
        console.log(duelInfo);

        const sideEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Sides for each player')
            .addFields(
                {
                    name: '\u200b',
                    value: `${userMention(duelPlayers[0].id)} side: ${duelInfo[duelPlayers[0].id].side}`,
                },
                {
                    name: '\u200b',
                    value: `${userMention(duelPlayers[2])} side: ${duelInfo[duelPlayers[2]].side}`,
                },
            );

        const duelEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('GIF Duel')
            .setDescription('¡Buena suerte!\n\n')
            .addFields(
                {
                    name: 'Reglas',
                    value: 'Mejor de 5\nPrimero a 3\n\nHay dos bandos en este juego: bando azul, y bando rojo.\nAl inicio del duelo se eligen aleatoriamente los bandos\n\nEl bando azul tiene que atacar con GIFs de "Hello Chat".\nEl bando rojo tiene que defender el ataque con GIFs de "Goodbye Chat"\nEl GIF de "Goodbye Chat" tiene que corresponder al de "Hello Chat".\n\nSi el bando rojo no puede defender, este mismo bando pierde 1 punto de vida (PV).\nCada bando tiene 2 PV.\n\n',
                },
                {
                    name: '\u200b',
                    'value': '**Fase de baneos**\nEn esta fase, el bando rojo puede prohibir 2 GIFs de "Hello Chat"\nY el bando azul puede prohibir 2 potenciadores, luego comienza la fase de selección.\n\nEl bando rojo banea primero.\n\n**Fase de selecciónes**\nEn esta fase, cada lado puede elegir 2 potenciadores para usar, una vez se haya elegido un potenciador para un bando, el otro bando no puede elegir el mismo potenciador.\nEl bando rojo elige primero y luego el bando azul. Turnandose.\n\nEl que pierde la primera ronda elige su bando en la siguiente ronda.\n\n**Potenciadores**\nPuedes cargar tu barra de potenciadores atacando o defendiendo, una vez que tu barra esté completamente cargada, puedes usar uno de los potenciadores que elegiste.\n\n**__Tienes 5 minutos para hacer tu jugada:__**\nSi no haces nada en tu turno, pierdes 1 PV, ya sea que estés en el lado rojo o en el lado azul.\n',
                },
                {
                    name: 'Comandos',
                    value: 'Puedes usar `/duel ban [enlace del GIF]` para banear un GIF\nUsa `/duel pick [Nombre del potenciador]`para elegir un potenciador\nEs posible usar `/ff`, `/duel surrender` o `/duel forfeit` para rendirse del duelo.',
                },
            );
        thread.send(
            {
                content: `Bienvenidos al Duelo Epico de GIFs:\n${userMention(duelPlayers[0].id)} vs ${userMention(duelPlayers[2])}`,
                embeds: [duelEmbed, sideEmbed],
            },
        );
        console.log('Instructions sent in thread successfuly.');


        duelGameFlow(thread, interaction);
    }

    if (interaction.options.getSubcommand() === 'ban') {
        let player1;
        let player2;

        if (interaction.channel.isThread()) {
            player1 = interaction.channel.name.split(' ')[0];
            player2 = interaction.channel.name.split(' ')[2];
        }
        else {
            interaction.reply({ content: 'You are not on an active Duel Thread!', ephemeral: true });
            return;
        }

        let query = '';

        if (interaction.user.username == player1 || interaction.user.username == player2) {
            query = `${player1}|${player2}`;
            console.log(query);
        }


        const duelInfoRef = doc(db, interaction.guildId, 'ActiveDuels');
        const duelInfoDocSnap = await getDoc(duelInfoRef);

        if (duelInfoDocSnap.exists()) {
            console.log((!duelInfoDocSnap.data()[query]) ? 'non existent' : 'exists');
            console.log(duelInfoDocSnap.data()[query].duelInfo);
            if (!duelInfoDocSnap.data()[query]) {
                return interaction.reply({ content: 'You don\'t seem to be participating on an active duel!', ephemeral: true });
            }


            const urlOption = interaction.options.getString('link');

            if (urlOption.includes('tenor')) {
                const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
                if (urlRegex.exec(urlOption) == 0) {
                    return interaction.reply({ content: 'The URL provided is not a valid URL!', ephemeral: true });
                }

            }
            else {
                return interaction.reply({ content: 'The URL provided is not a valid URL!', ephemeral: true });
            }

            if (interaction.user.id == duelInfoDocSnap.data()[query].duelInfo.sides.red_side) {
                console.log('User is in the red side');
                if (duelInfoDocSnap.data()[query].ban_turn == 'red') {
                    if (duelInfoDocSnap.data()[query].duelInfo.bans.red_ban_1 == 'empty') {
                        await updateDoc(duelInfoRef, {
                            [`${query}.duelInfo.bans.red_ban_1`]: urlOption,
                            [`${query}.ban_turn`]: 'blue',
                        }).then(() => {
                            return interaction.reply(`🔴 ${userMention(interaction.user.id)}> has banned a GIF: ${urlOption}\nBans remaining: 1`);
                        }).catch(() => {
                            return interaction.reply({ content: 'There was an error banning your GIF!', ephemeral: true });
                        });
                    }
                    else if (duelInfoDocSnap.data()[query].duelInfo.bans.red_ban_2 == 'empty') {
                        await updateDoc(duelInfoRef, {
                            [`${query}.duelInfo.bans.red_ban_2`]: urlOption,
                            [`${query}.ban_turn`]: 'blue',
                        }).then(() => {
                            return interaction.reply(`🔴 ${userMention(interaction.user.id)}> has banned a GIF: ${urlOption}\nBans remaining: 0`);
                        }).catch(() => {
                            return interaction.reply({ content: 'There was an error banning your GIF!', ephemeral: true });
                        });
                    }
                    else {
                        return interaction.reply({ content: 'You have no more bans left!', ephemeral: true });
                    }
                }
                else {
                    return interaction.reply({ content: 'It\'s not your turn to ban!', ephemeral: true });
                }
            }
            else if (interaction.user.id == duelInfoDocSnap.data()[query].duelInfo.sides.blue_side) {
                console.log('User is in the blue side');
                if (duelInfoDocSnap.data()[query].duelInfo.bans.blue_ban_1 == 'empty') {
                    await updateDoc(duelInfoRef, {
                        [`${query}.duelInfo.bans.blue_ban_1`]: urlOption,
                        [`${query}.ban_turn`]: 'red',
                    }).then(() => {
                        return interaction.reply(`🔷 <@${interaction.user.id}> has banned a GIF: ${urlOption}\nBans remaining: 1`);
                    }).catch(() => {
                        return interaction.reply({ content: 'There was an error banning your GIF!', ephemeral: true });
                    });
                }
                else if (duelInfoDocSnap.data()[query].duelInfo.bans.blue_ban_2 == 'empty') {
                    await updateDoc(duelInfoRef, {
                        [`${query}.duelInfo.bans.blue_ban_2`]: urlOption,
                        [`${query}.ban_turn`]: 'red',
                    }).then(() => {
                        return interaction.reply(`🔷 <@${interaction.user.id}> has banned a GIF: ${urlOption}\nBans remaining: 0`);
                    }).catch(() => {
                        return interaction.reply({ content: 'There was an error banning your GIF!', ephemeral: true });
                    });
                }
                else {
                    return interaction.reply({ content: 'You have no more bans left!', ephemeral: true });
                }
            }


            console.log(duelInfoDocSnap.data()[query].duelInfo.bans);
        }
    }

    if (interaction.options.getSubcommand() == 'ff' || interaction.options.getSubcommand() == 'forfeit' || interaction.options.getSubcommand() == 'surrender') {
        let player1;
        let player2;

        if (interaction.channel.isThread()) {
            player1 = interaction.channel.name.split(' ')[0];
            player2 = interaction.channel.name.split(' ')[2];
        }
        else {
            interaction.reply({ content: 'You are not on an active Duel Thread!', ephemeral: true });
            return;
        }

        let query = '';

        if (interaction.user.username == player1 || interaction.user.username == player2) {
            query = `${player1}|${player2}`;
            console.log(query);
        }

        const duelInfoRef = doc(db, interaction.guildId, 'ActiveDuels');
        const duelInfoDocSnap = await getDoc(duelInfoRef);

        if (duelInfoDocSnap.exists()) {
            console.log((!duelInfoDocSnap.data()[query]) ? 'non existent' : 'exists');
            console.log(duelInfoDocSnap.data()[query].duelInfo);
            if (!duelInfoDocSnap.data()[query]) {
                return interaction.reply({ content: 'You don\'t seem to be participating on an active duel!', ephemeral: true });
            }

            if (interaction.user.id == duelInfoDocSnap.data()[query].duelInfo.sides.blue_side) {
                await updateDoc(duelInfoRef, {
                    [`${query}.winner`]: 'red',
                }).then(() => {
                    return interaction.reply(`🔷 <@${interaction.user.id}> has surrendered the duel!\n\n🔴 <@${duelInfoDocSnap.data()[query].duelInfo.sides.red_side}> wins the duel!`);
                }).catch(() => {
                    return interaction.reply({ content: 'There was an error!', ephemeral: true });
                });

            }
            await updateDoc(duelInfoRef, {
                [`${query}.winner`]: 'blue',
            }).then(() => {
                return interaction.reply(`🔴 <@${interaction.user.id}> has surrendered the duel!\n\n🔷 <@${duelInfoDocSnap.data()[query].duelInfo.sides.blue_side}> wins the duel!`);
            }).catch(() => {
                return interaction.reply({ content: 'There was an error!', ephemeral: true });
            });
        }
    }
}

async function duelGameFlow(thread, interaction) {
    console.log(interaction.client);
    const filterGifs = m => m.content.toLowerCase().includes('tenor') && m.author != interaction.client.user.id;
    const gifsCollector = thread.createMessageCollector({ filter: filterGifs, time: 9999 * 9999 });

    gifsCollector.on('collect', async m => {
        console.log(`Collected ${m.attachments}`);
        console.log(m.embeds[0]?.data?.video);

        let player1;
        let player2;
        let turn;
        let opponentSide;
        let opponentID;

        if (thread.isThread()) {
            player1 = thread.name.split('vs')[0];
            player2 = thread.name.split('vs')[1];
        }

        console.log(thread.name, m);

        const duelInfoRef = doc(db, interaction.guildId, 'ActiveDuels');
        const duelInfoDocSnap = await getDoc(duelInfoRef);

        let query = '';
        console.log(m.author.username, (m.author.username == player1));

        if (m.author.username == player1 || m.author.username == player2) {
            query = `${player1}|${player2}`;
            console.log(query);
        }

        let msgAuthorSide;

        if (duelInfoDocSnap.exists()) {
            if (!duelInfoDocSnap.data()[query]) {
                console.log('Non existant');
                return;
            }

            console.log(duelInfoDocSnap.data()[query].duelInfo.bans, typeof duelInfoDocSnap.data()[query].duelInfo.bans);
            msgAuthorSide = (m.author.id == duelInfoDocSnap.data()[query].duelInfo.sides.blue_side) ? 'blue' : 'red';
            turn = duelInfoDocSnap.data()[query].duelInfo.turn;
            opponentSide = (msgAuthorSide == 'blue') ? 'red' : 'blue';
            opponentID = duelInfoDocSnap.data()[query].duelInfo.sides[`${opponentSide}_side`];

            Object.values(duelInfoDocSnap.data()[query].duelInfo.bans).forEach((value) => {
                console.log(value);
                if (m.content == value) {
                    m.channel.send(`<@${m.author.id}> sent a banned GIF: ${m.content}`);
                    m.delete();
                }
            });
        }

        await fetchFile(m.embeds[0]?.data.video.url).then(async () => {
            let processMsg;
            m.channel.send('Processing GIF...').then(message => {
                processMsg = message;
            });
            console.log('bruh!');
            await mp4toframe('C:/Users/djblu/BattleBot/tenorgif.mp4', './').then(async () => {
                await ReadText('./tn.png').then(async (text) => {
                    console.log(text);
                    if (!text.toLowerCase().includes('hello chat') && !text.toLowerCase().includes('goodbye chat')) {
                        const dimensions = sizeOf('./tn.png');
                        const chunkSize = dimensions.height / 2;

                        await imageToChunks('./tn.png', chunkSize).then((chunks) => {
                            let i = 0;
                            chunks.forEach(c => {
                                i++;
                                fs.writeFileSync(`slice_${i}.png`, c);
                            });
                        });

                        const tests = { slice1: 'pending', slice2: 'pending' };

                        await ReadText('./slice_1.png').then((textSlice1) => {
                            console.log(textSlice1);
                            if (!textSlice1.toLowerCase().includes('hello chat') || !textSlice1.toLowerCase().includes('goodbye chat')) {
                                console.log('Failed text extraction of Slice 1');
                                tests.slice1 = 'failed';
                            }
                        });

                        await ReadText('./slice_2.png').then((textSlice2) => {
                            console.log(textSlice2);
                            if (!textSlice2.toLowerCase().includes('hello chat') || !textSlice2.toLowerCase().includes('goodbye chat')) {
                                console.log('Failed text extraction of Slice 2');
                                tests.slice2 = 'failed';
                            }
                        });

                        if (tests.slice1 && tests.slice2 == 'failed') {
                            m.reply(`I could not read the GIF text!\n${(opponentSide == 'red') ? '🔴🛡️' : '🗡️🔷'} <@${opponentID}> has 1 minute to verify the GIF previously sent.\n\nSend 'verify' to verify that the GIF is valid!\nOR 'invalid' to invalidate the GIF (Don't do this in bad faith)`)
                                .then(msg => {
                                    const filter = response => {
                                        if (response.author.id == opponentID) {
                                            return (response.content.toLowerCase() == 'verify' || response.content.toLowerCase() == 'invalid');
                                        }
                                    };

                                    msg.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
                                        .then(async collected => {
                                            if (collected.first().content == 'verify') {
                                                collected.first().reply(`${(msgAuthorSide == 'red') ? '🔴🛡️' : '🗡️🔷'} <@${m.author.id}>'s GIF has been verified.`);
                                                await updateDoc(duelInfoRef, {
                                                    [`${query}.duelInfo.turn`]: 'red',
                                                }).then(() => {
                                                    m.channel.send(`It's red side turn now! ${(opponentSide == 'red') ? '🔴🛡️' : '🗡️🔷'} <@${opponentID}>`);
                                                });
                                                return;
                                            }
                                            collected.first().reply(`${(msgAuthorSide == 'red') ? '🔴🛡️' : '🗡️🔷'} <@${m.author.id}>'s GIF has been invalidated, please send a valid GIF for your side!`);
                                        });
                            });
                        }
                    }

                    if (msgAuthorSide == 'blue' && text.toLowerCase().includes('hello chat') && turn == 'blue') {
                        processMsg.edit('Text extracted.\nGIF is valid for your side.').then(async msg => {
                            await updateDoc(duelInfoRef, {
                                [`${query}.duelInfo.turn`]: 'red',
                            }).then(() => {
                                msg.channel.send(`It's red side turn now! ${(opponentSide == 'red') ? '🔴🛡️' : '🗡️🔷'} <@${opponentID}>`);
                            });
                            setTimeout(() => msg.delete(), 4000);
                        });
                    }
                    else if (msgAuthorSide == 'blue' && turn != 'blue') {
                        processMsg.edit('It\'s not your turn!').then(msg => {
                            setTimeout(msg.delete(), 5000);
                        });
                    }

                    if (msgAuthorSide == 'red' && text.toLowerCase().includes('goodbye chat') && turn == 'red') {
                        processMsg.edit('Text extracted.\nGIF is valid for your side.').then(async msg => {
                            await updateDoc(duelInfoRef, {
                                [`${query}.duelInfo.turn`]: 'blue',
                            }).then(() => {
                                msg.channel.send(`It's blue side turn now! ${(opponentSide == 'red') ? '🔴🛡️' : '🗡️🔷'} <@${opponentID}>`);
                            });
                            setTimeout(() => msg.delete(), 4000);
                        });
                    }
                    else if (msgAuthorSide == 'blue' && turn != 'blue') {
                        processMsg.edit('It\'s not your turn!').then(msg => {
                            setTimeout(msg.delete(), 5000);
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            });
            console.log('hewo');
        });
    });

    gifsCollector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
    });
}

async function fetchFile(url) {
    await fetch(url).then(function(resp) {
        return resp.blob();
    }).then(async function(blob) {
        let buffer = await blob.arrayBuffer();
        buffer = Buffer.from(buffer);
        fs.createWriteStream('tenorgif.mp4').write(buffer);
    });

}

async function mp4toframe(url, des) {
    return new Promise((resolve) => {
        ffmpeg(url)
            .screenshots(({ count: 1, folder: des }))
            .on('end', () => {
                console.log('Finished proccessing video.');
                resolve();
            });
    });
}