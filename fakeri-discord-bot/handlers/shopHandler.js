const { getFirestore, getDocs, collection, getDoc, doc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, formatEmoji } = require('discord.js');
const { Icons } = require('../emums/icons.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    async execute(action, interaction, page, previousEmbeds, category) {
        return shop(action, interaction, page, previousEmbeds, category);
    },
};

async function shop(action, interaction, page, previousEmbeds, category) {
    const shopInventory = await getDocs(collection(db, '/Event/Shop/ShopInventory'));
    const playerInfo = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
    let playerClass;
    let playerGold;
    let playerLvl;
    if (playerInfo.exists()) {
        playerClass = playerInfo.data().class;
        playerGold = playerInfo.data().gold;
        playerLvl = playerInfo.data().playerLvl;
    }
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
        const element = itemsArray[currentItem][1];
        let itemStr;
        switch (playerClass) {
            case 'archer':
                shopEmbed.setTitle('Archer Items').setColor('#37BC6C');
                break;

            case 'warrior':
                shopEmbed.setTitle('Warrior Items').setColor('#F83636');
                itemStr = `\n\n\n***Stats***\n\n**+${element.stats.atk}** - ATK\n**+${element.stats.spd}** - SPD\n\n**Perks**\n\n***${element.perks.perkName || 'Ninguno'}***\n${element.perks.perkDesc || 'Este objeto no tiene ningun perk'}\n\n**Price:** ${element.price} 🪙 ${(playerGold < element.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${element.minLvl || 1} ${Icons.Level} ${(playerLvl < element.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                // eslint-disable-next-line no-unused-vars
                break;

            case 'enchanter':
                shopEmbed.setTitle('Enchanter Items').setColor('#00EAFF');
                itemStr = `\n\n\n***Stats***\n\n**+${element.stats.magicStrength}** - MAGIC STR\n**+${element.stats.mana}** - MANA\n\n**Perks**\n\n***${element.perks.perkName || 'Ninguno'}***\n${element.perks.perkDesc || 'Este objeto no tiene ningun perk'}\n\n**Price:** ${element.price} 🪙 ${(playerGold < element.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${element.minLvl || 1} ${Icons.Level} ${(playerLvl < element.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                break;

            default:
                break;
        }

        for (const __key in document.data()[items]) {
            let itemEmoji = Icons.ShopBtn;
            if (playerLvl < element.minLvl) {
                itemEmoji = Icons.NotEnoughLevel;
            }
            else if (playerGold < element.price) {
                itemEmoji = Icons.NotEnoughGold;
            }

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
            if (!element) return;


            shopEmbed.setDescription(`**Oro actual:** ${playerGold} 🪙`);
            shopEmbed.addFields(
                {
                    name: '__' + element.name + '__',
                    value: itemStr,
                    inline: true,
                },
            );

            selectMenu.addOptions(
                {
                    label: `${element.name} - ${element.price} GOLD`,
                    description: `${element.perks?.perkDesc || 'No tiene perks'}`,
                    value: `shopModal-item-buy-${itemsArray[currentItem][0].match(/\d+/g)[0]}-${category}`,
                    emoji: itemEmoji,
                },
            );

            console.log(currentItem, 'log0000');
            itemsProcessed += 1;
            currentItem += 1;
            console.log(currentItem, 'log0001');
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
                .setEmoji(Icons.AbilityOrb)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`shopModal-seeArmorPlates-${interaction.user.id}`)
                .setLabel('See Armor Plates')
                .setEmoji(Icons.Armor)
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
