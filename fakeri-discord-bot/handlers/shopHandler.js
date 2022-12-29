const { getFirestore, getDocs, collection, getDoc, doc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, formatEmoji, bold } = require('discord.js');
const { Icons } = require('../emums/icons.js');
const { Utils } = require('../utils.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    async execute(action, interaction, page, previousEmbeds, category) {
        return shop(action, interaction, page, previousEmbeds, category);
    },
};

async function shop(action, interaction, page, previousEmbeds, category) {
    page = Number(page);
    const shopInventory = await getDocs(collection(db, '/Event/Shop/ShopInventory'));
    const playerInfo = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
    let playerClass = 'lu';
    let playerGold = 'is';
    let playerLvl = 'in';
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
    let classSignatureWeapon;
    switch (playerClass) {
        case 'warrior':
            classSignatureWeapon = 'swords';
            items = 'swords';
            break;
        case 'enchanter':
            classSignatureWeapon = 'wands';
            items = 'wands';
            break;
        case 'archer':
            classSignatureWeapon = 'bows';
            items = 'bows';
            break;
        default:
            break;
    }
    if (category) items = category;
    if (!category) category = items;


    shopInventory.forEach(async (document) => {

        // Max items minus one
        console.log('🚀 ~ file: shopHandler.js:63 ~ shopInventory.forEach ~ document.data()', document.data()[ items ], items);
        const itemsArray = Object.entries(document.data()[ items ]);
        maxPages = Object.entries(document.data()[ items ]).length;
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


        let itemStr;


        itemsArray.sort((a, b) => {
            if (category == 'consumables') {
                return (Number(a[ 1 ].price) - Number(b[ 1 ].price));
            }
            return (Number(a[ 1 ].minLvl) - Number(b[ 1 ].minLvl));
        });

        for (const __key in document.data()[ items ]) {
            const item = itemsArray[ currentItem ][ 1 ] || null;
            if (!item) return;

            switch (playerClass) {
                case 'archer': {

                    shopEmbed.setTitle('Archer Items').setColor('#37BC6C');
                    let perksStr = `\n\n***${item?.perks?.perkName || 'Ninguno'}***\n${item?.perks?.perkDesc || 'Este objeto no tiene ningun perk'}\n\n`;
                    for (let index = 0; index < Object.values(item?.perks || []).length; index++) {
                        const perk = item?.perks[ `perk${index + 1}` ];
                        if (index == 0) { perksStr = `\n\n**${perk?.perkName}**\n${perk?.perkDesc}\n\n`; }
                        else { perksStr += `\n\n**${perk?.perkName}`; }
                    }
                    if (category == 'abilityOrbs') {
                        shopEmbed.setTitle('Ability Orbs \\ Warrior').setColor('Aqua');
                        itemStr = `${Utils.FormatDescription(item.desc, item)}` + `\n\n${bold('Mana requerido:')} ${item.requiredMana} ${formatEmoji(Icons.Mana)}`;
                    }
                    else if (category == 'armorPlates') {
                        shopEmbed.setTitle('Armaduras').setColor('Blue');
                        itemStr = `\n\n\n***Stats***\n\n**+${item.stats.armor}** - Armor\n**+${item.stats.magicDurability}** - Magic DURABILITY\n\n**Perks**${perksStr}**Price:** ${item.price} 🪙 ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${item.minLvl || 1} ${Icons.Level} ${(playerLvl < item.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                    }
                    else if (category == 'consumables') {
                        shopEmbed.setTitle('Consumibles').setColor('Green');
                        itemStr = `${bold(item.type.toUpperCase())}\n(+) ${item.amount}\n\n**Precio:** ${item.price} ${Icons.Gold} ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}`;
                    }
                    else {
                        itemStr = `\n\n\n***Stats***\n\n**+${item.stats.atk}** - ATK\n**+${item.stats.spd}** - SPD\n\n**Perks**${perksStr}**Price:** ${item.price} 🪙 ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${item.minLvl || 1} ${Icons.Level} ${(playerLvl < item.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                    }
                    break;
                }

                case 'warrior': {
                    shopEmbed.setTitle('Warrior Items').setColor('#F83636');
                    let perksStr = `\n\n***${item?.perks?.perkName || 'Ninguno'}***\n${item?.perks?.perkDesc || 'Este objeto no tiene ningun perk'}\n\n`;
                    for (let index = 0; index < Object.values(item?.perks || []).length; index++) {
                        const perk = item?.perks[ `perk${index + 1}` ];
                        if (index == 0) { perksStr = `\n\n**${perk?.perkName}**\n${perk?.perkDesc}\n\n`; }
                        else { perksStr += `\n\n**${perk?.perkName}`; }
                    }
                    if (category == 'abilityOrbs') {
                        shopEmbed.setTitle('Ability Orbs \\ Warrior').setColor('Aqua');
                        itemStr = `${Utils.FormatDescription(item.desc, item)}` + `\n\n${bold('Mana requerido:')} ${item.requiredMana} ${formatEmoji(Icons.Mana)}`;
                    }
                    else if (category == 'armorPlates') {
                        shopEmbed.setTitle('Armaduras').setColor('Blue');
                        itemStr = `\n\n\n***Stats***\n\n**+${item.stats.armor}** - Armor\n**+${item.stats.magicDurability}** - Magic DURABILITY\n\n**Perks**${perksStr}**Price:** ${item.price} 🪙 ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${item.minLvl || 1} ${Icons.Level} ${(playerLvl < item.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                    }
                    else if (category == 'consumables') {
                        shopEmbed.setTitle('Consumibles').setColor('Green');
                        itemStr = `${bold(item.type.toUpperCase())}\n(+) ${item.amount}\n\n**Precio:** ${item.price} ${Icons.Gold} ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}`;
                    }
                    else {
                        itemStr = `\n\n\n***Stats***\n\n**+${item.stats.atk}** - ATK\n**+${item.stats.spd}** - SPD\n\n**Perks**${perksStr}**Price:** ${item.price} 🪙 ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${item.minLvl || 1} ${Icons.Level} ${(playerLvl < item.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                    }
                    break;
                }

                case 'enchanter': {
                    if (category == 'abilityOrbs') shopEmbed.setTitle('Ability Orbs | Enchanter').setColor('Aqua');
                    let perksStr = `\n\n***${item?.perks?.perkName || 'Ninguno'}***\n${item?.perks?.perkDesc || 'Este objeto no tiene ningun perk'}\n\n`;
                    for (let index = 0; index < Object.values(item?.perks || []).length; index++) {
                        const perk = item?.perks[ `perk${index + 1}` ];
                        if (index == 0) { perksStr = `\n\n**${perk?.perkName}**\n${perk?.perkDesc}\n\n`; }
                        else { perksStr += `\n\n**${perk?.perkName}`; }
                    }
                    shopEmbed.setTitle('Enchanter Items').setColor('#00EAFF');
                    if (category == 'abilityOrbs') {
                        shopEmbed.setTitle('Ability Orbs \\ Enchanter').setColor('Aqua');
                        itemStr = `${Utils.FormatDescription(item.desc, item)}` + `\n\n${bold('Mana requerido:')} ${item.requiredMana} ${formatEmoji(Icons.Mana)}`;
                    }
                    else if (category == 'armorPlates') {
                        shopEmbed.setTitle('Armaduras').setColor('Blue');
                        itemStr = `\n\n\n***Stats***\n\n**+${item.stats.armor}** - Armor\n**+${item.stats.magicDurability}** - Magic DURABILITY\n\n**Perks**${perksStr}**Price:** ${item.price} 🪙 ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${item.minLvl || 1} ${Icons.Level} ${(playerLvl < item.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                    }
                    else if (category == 'consumables') {
                        shopEmbed.setTitle('Consumibles').setColor('Green');
                        itemStr = `${bold(item.type.toUpperCase())}\n(+) ${item.amount}\n\n**Precio:** ${item.price} ${Icons.Gold} ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}`;
                    }
                    else {
                        itemStr = `\n\n\n***Stats***\n\n**+${item.stats.magicStrength}** - Magic STRENGTH\n**+${item.stats.mana}** - Mana PER ATTACK\n\n**Perks**${perksStr}**Price:** ${item.price} 🪙 ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${item.minLvl || 1} ${Icons.Level} ${(playerLvl < item.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                    }
                    break;
                }

                default:
                    break;
            }

            // Checks is the orb is targeted towards the playerClass
            // For example if the player is a warrior and the orb is targeted towards archers
            // The search should return -1
            // The orb target class is formatted as 'warrior|archer|enchanter'
            // If the class the player is playing is not in the target class, the orb is not shown
            if (item?.targetClass) {
                if (Math.sign(item?.targetClass?.search(playerClass)) == -1) {
                    itemsProcessed += 1;
                    currentItem += 1;
                    continue;
                }
            }

            let itemEmoji = Icons.ShopBtn;
            if (playerLvl < item.minLvl) {
                itemEmoji = Icons.NotEnoughLevel;
            }
            else if (playerGold < item.price) {
                itemEmoji = Icons.NotEnoughGold;
            }


            console.log('🚀 ~ file: shopHandler.js:143 ~ shopInventory.forEach ~ element', item);
            if (itemsProcessed > maxItemsInPage) {
                continue;
            }
            if (!Object.entries(document.data()[ items ])[ currentItem ]) {
                continue;
            }

            if (!item) continue;


            shopEmbed.setDescription(`**Oro actual:** ${playerGold} 🪙`);
            shopEmbed.addFields(
                {
                    name: '__' + item.name + '__',
                    value: itemStr,
                    inline: true,
                },
            );

            let perkDesc = undefined;
            if (item.perks?.perk1?.perkDesc.length >= 100) {
                perkDesc = item.perks?.perk1?.perkDesc.substring(0, 97);
                perkDesc += '...';
            }
            if (category == 'consumables') {
                selectMenu.addOptions(
                    {
                        label: `${item.name} - ${item.price} GOLD`,
                        description: `${item.type.toUpperCase()} | +${item.amount}`,
                        value: `shopModal-item-buy-${itemsArray[ currentItem ][ 0 ].match(/\d+/g)[ 0 ]}-${category}`,
                        emoji: itemEmoji,
                    },
                );
            }
            else {
                selectMenu.addOptions(
                    {
                        label: `${item.name} - ${item.price} GOLD`,
                        description: `${(!item?.requiredMana) ? perkDesc || 'No tiene perks' : 'Mana requerido: ' + item?.requiredMana}`,
                        value: `shopModal-item-buy-${itemsArray[ currentItem ][ 0 ].match(/\d+/g)[ 0 ]}-${category}`,
                        emoji: itemEmoji,
                    },
                );
            }

            itemsProcessed += 1;
            currentItem += 1;
        }
    });
    maxPages = Math.ceil(maxPages / maxItemsInPage);
    paginationRow.addComponents(
        new ButtonBuilder()
            .setCustomId(`shopModal-page${page - 1}-${category}-${interaction.user.id}`)
            .setLabel('<')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(((Number(page) - 1) <= 0) ? true : false),
        new ButtonBuilder()
            .setCustomId('shopModal-pageViewer')
            .setLabel(`${page} \u200b / \u200b ${maxPages}`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(false),
        new ButtonBuilder()
            .setCustomId(`shopModal-page${page + 1}-${category}-${interaction.user.id}`)
            .setLabel('>')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(((Number(page) + 1) > maxPages) ? true : false),
    );
    let categories = [ classSignatureWeapon, 'armorPlates', 'consumables' ];
    if (playerInfo.data().class == 'enchanter') categories.push('abilityOrbs');
    categories = categories.filter(elmnt => elmnt != category);
    const categoriesButton = {
        abilityOrbs: 'Orbes de Habilidad',
        swords: 'Espadas',
        wands: 'Varitas',
        bows: 'Arcos',
        armorPlates: 'Armaduras',
        consumables: 'Consumibles',
        consumablesEmoji: '🥤',
        abilityOrbsEmoji: Icons.AbilityOrb,
        swordsEmoji: Icons.ATK,
        armorPlatesEmoji: Icons.Armor,
        wandsEmoji: Icons.Wands,
        bowsEmoji: Icons.Bows,
    };
    const changeItemsRow = new ActionRowBuilder();
    console.log(categories);
    categories.forEach(elmnt => {
        changeItemsRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`shopModal-${elmnt}-${interaction.user.id}`)
                .setEmoji(`${categoriesButton[ elmnt + 'Emoji' ]}`)
                .setStyle(ButtonStyle.Primary)
                .setLabel(categoriesButton[ elmnt ]),
        );
    });


    buyRow.addComponents(
        selectMenu,
    );

    console.log(previousEmbeds);
    const embeds = [];
    embeds.push(shopEmbed);
    embeds.push(...previousEmbeds);
    console.log(buyRow.components[ 0 ].options);
    return { embeds: embeds, components: [ paginationRow, changeItemsRow, buyRow ] };
}
