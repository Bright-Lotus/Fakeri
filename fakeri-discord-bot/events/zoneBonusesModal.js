const { Events, channelMention, ChannelType, ThreadAutoArchiveDuration, bold } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { Utils } = require('../utils.js');
const { getFirestore, doc, updateDoc, arrayUnion, increment, getDoc, setDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId.includes('farmChannel-zoneBonuses')) {
            await interaction.deferReply();
            const idSplit = interaction.customId.split('-');
            const bonuses = [];
            for (let i = 1; i < 6; i++) {
                if (interaction.fields.getTextInputValue(`zoneBonusSlot${i}`).trim() == '') continue;
                bonuses.push(interaction.fields.getTextInputValue(`zoneBonusSlot${i}`).split(','));
            }
            const enemiesZone = idSplit[2];
            const createdChannelID = idSplit[3];
            const databaseChannelID = idSplit[4];
            const effectsEmbed = new EmbedBuilder()
                .setTitle('Efectos de la Zona')
                .setColor('Blue')
                .setDescription('Puedes ver los enemigos de la zona usando comandos de ataque.');

            for await (const bonus of bonuses) {
                const bonusObj = {
                    name: bonus[0].split(':')[1].trim(),
                    type: bonus[1].split(':')[1].trim(),
                    amount: bonus[2].split(':')[1].trim(),
                };
                await updateDoc(doc(db, `${interaction.guildId}/FarmChannels`), {
                    [`channel${databaseChannelID}.zoneBonuses`]: arrayUnion(bonusObj),
                }, { merge: true });

                effectsEmbed.addFields(
                    { name: bonusObj.name, value: `${bold(Utils.FormatStatName(bonusObj.type))} \\ ${bonusObj.amount}`, inline: true },
                );
            }

            if (bonuses.length == 0) {
                effectsEmbed.addFields(
                    { name: 'NONE', value: '**Sin efectos** \\ 0%' },
                );
            }

            const embed = new EmbedBuilder()
                .setTitle('Canal creado exitosamente!')
                .setDescription(`Con los enemigos [${enemiesZone}]\n${channelMention(createdChannelID)}`)
                .setColor('Green');
            interaction.editReply({ embeds: [embed] });
            await interaction.guild.channels.fetch(createdChannelID).then(async channel => {
                channel.send({ embeds: [ effectsEmbed ] }).then(msg => { msg.pin(); });
                const thread = await channel.threads.create({
                    name: 'Enchanter Zone',
                    autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
                    type: ChannelType.PublicThread,
                    reason: 'Needed a separate thread for enchanter effects',
                });
                const channelsSnap = await getDoc(doc(db, interaction.guild.id, 'FarmChannels'));
                if (channelsSnap.exists()) {
                    if (channelsSnap.data()?.channelCount) {
                        const enchanterEffectsEmbed = new EmbedBuilder()
                            .setTitle('Efectos de la Zona')
                            .setColor('Aqua')
                            .setDescription('Puedes ver los enemigos de la zona usando comandos de ataque.');
                        await updateDoc(doc(db, `${interaction.guildId}/FarmChannels`), { ['channelCount']: increment(1) }, { merge: true });
                        await setDoc(doc(db, `${interaction.guildId}/FarmChannels`), { [`channel${channelsSnap.data().channelCount + 1}`]: { enemies: enemiesZone.split(','), id: thread.id, minLvl: idSplit[5], enchanterOnly: true } }, { merge: true });
                        bonuses.unshift('name: Enchanter Buff, type: manaPerAttack, amount: +35%'.split(','));

                        for await (const bonus of bonuses) {
                            const bonusObj = {
                                name: bonus[0].split(':')[1].trim(),
                                type: bonus[1].split(':')[1].trim(),
                                amount: bonus[2].split(':')[1].trim(),
                            };
                            await updateDoc(doc(db, `${interaction.guildId}/FarmChannels`), {
                                [`channel${channelsSnap.data().channelCount + 1}.zoneBonuses`]: arrayUnion(bonusObj),
                            }, { merge: true });
                            enchanterEffectsEmbed.addFields(
                                { name: bonusObj.name, value: `${bold(Utils.FormatStatName(bonusObj.type))} \\ ${bonusObj.amount}`, inline: true },
                            );
                        }
                        thread.send({ embeds: [ enchanterEffectsEmbed ] }).then(msg => { msg.pin(); });
                    }
                }
            });
        }
    },
};