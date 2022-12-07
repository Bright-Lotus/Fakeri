const { getFirestore, doc, setDoc, getDocs, collection, updateDoc, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../main.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, bold, underscore } = require('discord.js');
const { goldManager } = require('../handlers/goldHandler.js');
const { EventErrors, ErrorEmbed } = require('../errors/errors.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isSelectMenu()) return;
        if (!interaction.customId.includes('shopModal-selectMenu')) return;
        if (interaction.user.id != interaction.customId.split('-')[2]) {
            return interaction.reply({ embeds: [ErrorEmbed(EventErrors.NotOwnerOfInteraction)], ephemeral: true });
        }
        const shopInventory = await getDocs(collection(db, '/Event/Shop/ShopInventory'));
        const itemId = interaction.values[0].split('-')[3];
        const category = interaction.values[0].split('-')[4];
        let item;
        shopInventory.forEach(async document => {
            item = document.data()[category][`${category.slice(0, -1)}${itemId}`];
            console.log(document.data());
        });
        const filter = msg => msg.content.includes('confirmar') || msg.content.includes('rechazar');
        const confirmationEmbed = new EmbedBuilder()
            .setTitle('Nora')
            .setColor('#C600FF')
            .setDescription('Vas a comprar eso?');
        const itemEmbed = new EmbedBuilder()
            .setTitle('__' + item.name + '__')
            .setColor('#C600FF')
            .setDescription(`\n\n\n***Stats***\n\n**+${item.stats.atk}** - ATK\n**+${item.stats.spd}** - SPD\n\n**Perks**\n\n***${item.perks.perkName}***\n${item.perks.perkDesc}\n\n**Price:** ${item.price} 🪙\n**Minimum Level:** ${item.minLvl}`);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('accept')
                .setLabel('Escribe "confirmar" para comprar el item seleccionado')
                .setEmoji('➡️')
                .setStyle(ButtonStyle.Primary),
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('reject')
                .setLabel('Escribe "rechazar" para no comprarlo')
                .setEmoji('➡️')
                .setStyle(ButtonStyle.Danger),
        );
        interaction.reply({ embeds: [confirmationEmbed, itemEmbed], components: [row, row2], fetchReply: true })
            .then(() => {
                interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] })
                    .then(async collected => {
                        if (collected.first().content == 'confirmar') {
                            await goldManager('buy', item.price, interaction.user)
                                .then(async result => {
                                    console.log(result);
                                    const thanksEmbed = new EmbedBuilder()
                                        .setTitle('Nora')
                                        .setColor('#C600FF')
                                        .setDescription('Gracias por tu compra... supongo');

                                    const dialogEnd = new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('end')
                                            .setLabel('Dialog has ended')
                                            .setStyle(ButtonStyle.Secondary)
                                            .setEmoji('🛑'),
                                    );

                                    const goldEmbed = new EmbedBuilder()
                                        .setTitle('La compra ha sido exitosa')
                                        .setDescription(`${bold(`Has comprado ${underscore(item.name)} por ${underscore(item.price)} oro`)}\nOro restante: ${result}`)
                                        .setColor('Gold');

                                    const docSnap = await getDoc(doc(db, collected.first().author.id, 'PlayerInfo/Inventory/Equipment'));
                                    let swordAmount;
                                    if (docSnap.exists()) {
                                        swordAmount = docSnap.data().swords.amount;
                                    }

                                    console.log(docSnap.data().swords);
                                    item = { ...item, id: swordAmount + 1 };
                                    await updateDoc(doc(db, collected.first().author.id, 'PlayerInfo/Inventory/Equipment'), {
                                        [category]: { ...docSnap.data().swords, amount: swordAmount + 1, [`sword${swordAmount + 1}`]: item },
                                    }, { merge: true });
                                    return collected.first().reply({ embeds: [goldEmbed, thanksEmbed], components: [dialogEnd] });
                                }).catch(error => {
                                    if (error.errorCode == EventErrors.NotEnoughGold) {
                                        const goldErrorEmbed = new EmbedBuilder()
                                            .setTitle('Nora')
                                            .setColor('#C600FF')
                                            .setDescription('Compra algo mas barato o vuelve cuando tengas mas oro!!');
                                        return collected.first().reply({ embeds: [error.errorEmbed, goldErrorEmbed] });
                                    }
                                });
                        }
                        else {
                            const rejectedEmbed = new EmbedBuilder()
                                .setTitle('Nora')
                                .setColor('#C600FF')
                                .setDescription('Mira lo que te gusta y seleccionalo!\nY deja de desperdiciar mi tiempo.');
                            return collected.first().reply({ embeds: [rejectedEmbed] });
                        }
                    }).catch(err => {
                        const rejectedEmbed = new EmbedBuilder()
                            .setTitle('Nora')
                            .setColor('#C600FF')
                            .setDescription('Mira lo que te gusta y seleccionalo!\nY deja de desperdiciar mi tiempo.');
                        return interaction.followUp({ embeds: [rejectedEmbed] });
                    });
            });
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    },
};