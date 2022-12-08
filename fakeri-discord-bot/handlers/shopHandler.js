const { getFirestore, getDocs, collection } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    async execute(action, interaction, page, previousEmbeds, category, actionArguments) {
        return shop(action, interaction, page, previousEmbeds, category, actionArguments);
    },
};

async function shop(action, interaction, page, previousEmbeds, category, actionArguments) {
    const shopInventory = await getDocs(collection(db, '/Event/Shop/ShopInventory'));
    const userClass = await getDocs(collection(db, interaction.user.id));
    let playerClass;
    let playerGold;
    userClass.forEach(async stats => {
        playerClass = stats.data().class;
        playerGold = stats.data().gold;
        console.log(playerClass);
    });
    const shopEmbed = new EmbedBuilder();
    const paginationRow = new ActionRowBuilder();
    let maxPages;
    let maxItemsInPage = 3;
    let itemsProcessed = 1;
    let currentItem = 0;
    const buyRow = new ActionRowBuilder();
    const selectMenu = new SelectMenuBuilder();
    selectMenu.setCustomId(`shopModal-selectMenu-${interaction.user.id}`).setPlaceholder('Buy item...');
    let items;
    switch (playerClass) {
        case 'warrior':
            items = 'swords';
            break;
        case 'enchanter':
            items = 'wands';
            break;
        case 'archer':
            items = 'bows';
            break;
        default:
            break;
    }
    if (category) items = category;
    if (!category) category = items;
    console.log(shopInventory);
    shopInventory.forEach(async (document) => {
        console.log(document.data());
        // Max items minus one
        maxPages = Object.entries(document.data()[items]).length;
        console.log('page', page);
        if (page != 1) {
            for (let i = 1; i < page; i++) {
                console.log('Adding +3');
                currentItem += 3;
            }
        }
        else {
            maxItemsInPage = 3;
            currentItem = 0;
        }

        const itemsArray = Object.entries(document.data()[items]);
        console.log(Object.entries(document.data()[items]), 'jaja el pepe');
        switch (playerClass) {
            case 'archer':
                shopEmbed.setTitle('Archer Items').setColor('#37BC6C');
                break;

            case 'warrior':
                shopEmbed.setTitle('Warrior Items').setColor('#F83636');
                // eslint-disable-next-line no-unused-vars


                for (const _keyIgnore in document.data()[items]) {
                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        return;
                    }
                    console.log(currentItem, 'log4');
                    if (!Object.entries(document.data()[items])[currentItem]) {
                        return;
                    }
                    itemsArray.sort((a, b) => {
                        return (Number(a[0].match(/\d+/g)[0]) - Number(b[0].match(/\d+/g)[0]));
                    });
                    const element = itemsArray[currentItem][1];
                    if (!element) return;


                    shopEmbed.setDescription(`**Oro actual:** ${playerGold} 🪙`);
                    shopEmbed.addFields(
                        {
                            name: '__' + element.name + '__',
                            value: `\n\n\n***Stats***\n\n**+${element.stats.atk}** - ATK\n**+${element.stats.spd}** - SPD\n\n**Perks**\n\n***${element.perks.perkName}***\n${element.perks.perkDesc}\n\n**Price:** ${element.price} 🪙\n**Minimum Level:** ${element.minLvl}`,
                            inline: true,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: `${element.name} - ${element.price} GOLD`,
                            description: element.perks.perkDesc,
                            value: `shopModal-item-buy-${itemsArray[currentItem][0].match(/\d+/g)[0]}-${category}`,
                        },
                    );

                    console.log(currentItem, 'log0000');
                    itemsProcessed += 1;
                    currentItem += 1;
                    console.log(currentItem, 'log0001');
                }
                break;

            case 'enchanter':
                shopEmbed.setTitle('Enchanter Items').setColor('##00EAFF');
                break;

            default:
                break;
        }
    });
    console.log(shopEmbed);
    console.log(page + 1, maxPages, 'log9999');
    maxPages = Math.ceil(maxPages / maxItemsInPage);
    paginationRow.addComponents(
        new ButtonBuilder()
            .setCustomId(`shopModal-page${page - 1}-${category}-${interaction.user.id}`)
            .setLabel('<')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(((page - 1) <= 0) ? true : false),
        new ButtonBuilder()
            .setCustomId('shopModal-pageViewer')
            .setLabel(`${page} \u200b / \u200b ${maxPages}`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(false),
        new ButtonBuilder()
            .setCustomId(`shopModal-page${page + 1}-${category}-${interaction.user.id}`)
            .setLabel('>')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(((page + 1) > maxPages) ? true : false),
    );
    const changeItemsRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`shopModal-seeAbilityOrbs-${interaction.user.id}`)
                .setLabel('See Ability Orbs')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`shopModal-seeArmorPlates-${interaction.user.id}`)
                .setLabel('See Armor Plates')
                .setStyle(ButtonStyle.Primary),
        );

    buyRow.addComponents(
        selectMenu,
    );

    console.log(previousEmbeds);
    const embeds = [];
    embeds.push(shopEmbed);
    embeds.push(...previousEmbeds);
    console.log(buyRow.components[0].options);
    return { embeds: embeds, components: [paginationRow, changeItemsRow, buyRow] };
}
