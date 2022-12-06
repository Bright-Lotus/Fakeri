const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, bold, formatEmoji, ButtonBuilder, ButtonStyle, parseEmoji } = require('discord.js');
const { Icons } = require('../emums/icons');

async function pagination(category, objects, page, user, args) {
    return new Promise((resolve, reject) => {
        const embed = new EmbedBuilder();
        const paginationRow = new ActionRowBuilder();
        const selectMenu = new SelectMenuBuilder();
        const selectMenuOrb2 = new SelectMenuBuilder();

        const selectMenuRow = new ActionRowBuilder();
        const selectMenuOrb2Row = new ActionRowBuilder();

        let maxPages;
        const maxItemsInPage = 3;
        let itemsProcessed = 1;
        let currentItem = 0;
        objects.sort((a, b) => {
            return (a.id - b.id);
        });
        // Max items minus one
        if (page != 1) {
            for (let ignore = 1; ignore < page; ignore++) {
                console.log('Adding +3');
                currentItem += 3;
            }
        }
        for (let i = 0; i < maxItemsInPage; i++) {
            maxPages = objects.length;
            const element = objects[currentItem];

            switch (category) {
                case 'abilityOrbsInventory': {
                    embed.setTitle(`Tus Orbes de Habilidad ${Icons.AbilityOrb}`).setColor('#F83636');
                    if (args.class == 'warrior') {
                        selectMenu.setCustomId(`inventoryAbilityOrbsModal-orb1-selectMenu/${user.id}`).setPlaceholder('Cambiar orbe de habilidad 1 equipada...');
                        selectMenuOrb2.setCustomId(`inventoryAbilityOrbsModal-orb2-selectMenu/${user.id}`).setPlaceholder('Cambiar orbe de habilidad 2 equipada...');

                    }
                    // eslint-disable-next-line no-unused-vars


                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;
                    embed.addFields(
                        {
                            name: `__${element.name}__ | ID: ${element.id}`,
                            value: element.desc + `\n\n${bold('Mana requerido:')} ${element.requiredMana} ${formatEmoji('1045827771311599696')}`,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: `${element.name}`,
                            description: `Mana requerido: ${element.requiredMana}`,
                            value: `abilityOrbsInventoryModal-ability-equip-orb1-${element.id}`,
                            emoji: Icons.AbilityOrb,
                        },
                    );

                    selectMenuOrb2.addOptions(
                        {
                            label: `${element.name}`,
                            description: `Mana requerido: ${element.requiredMana}`,
                            value: `abilityOrbsInventoryModal-ability-equip-orb2-${element.id}`,
                            emoji: Icons.AbilityOrb,
                        },
                    );

                    itemsProcessed += 1;
                    currentItem += 1;
                    console.log(currentItem, 'log0001');
                    break;
                }
                case 'swordsInventory':
                    embed.setTitle('Your Swords').setColor('#F83636');
                    selectMenu.setCustomId(`inventorySwordsModal-selectMenu/${user.id}`).setPlaceholder('Cambiar espada equipada...');
                    // eslint-disable-next-line no-unused-vars


                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;

                    embed.addFields(
                        {
                            name: '__' + element.name + '__',
                            value: `\n\n\n***Stats***\n\n**+${element.stats.atk}** - ATK\n**+${element.stats.spd}** - SPD\n\n**Perks**\n\n***${element.perks.perkName}***\n${element.perks.perkDesc}\n\n**Minimum Level:** ${element.minLvl}`,
                            inline: true,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: element.name,
                            description: `Nivel minimo: ${element.minLvl}`,
                            value: `inventorySwordModal-sword-equip-${element.id}`,
                            emoji: '🪓',
                        },
                    );

                    itemsProcessed += 1;
                    currentItem += 1;
                    console.log(currentItem, 'log0001');
                    break;

                case 'abilityOrbs':
                    embed.setTitle('Your Ability Orbs').setColor('#F83636');
                    selectMenu.setCustomId(`abilityModal-selectMenu/${user.id}`).setPlaceholder('Select ability...');
                    // eslint-disable-next-line no-unused-vars


                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;


                    embed.setDescription(`${bold('Mana actual: ')} ${args.currentMana} ${formatEmoji('1045827771311599696')}`);
                    embed.addFields(
                        {
                            name: `__${element.name}__ | ID: ${element.id}`,
                            value: element.desc + `\n\n${bold('Mana requerido:')} ${element.requiredMana} ${formatEmoji('1045827771311599696')}`,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: `${element.name}`,
                            description: `Mana requerido: ${element.requiredMana} ${formatEmoji(Icons.Mana)}`,
                            value: `abilityModal-ability-use-${element.id}-${args.enemyUnique}`,
                            emoji: Icons.AbilityOrb,
                        },
                    );

                    console.log(currentItem, 'log0000');
                    itemsProcessed += 1;
                    currentItem += 1;
                    console.log(currentItem, 'log0001');
                    break;

                case 'enchanter':
                    embed.setTitle('Enchanter Items').setColor('##00EAFF');
                    break;

                default:
                    break;
            }
        }
        maxPages = Math.ceil(maxPages / maxItemsInPage);
        const enemyUniqueStr = (category == 'abilityOrbs') ? `-${args?.enemyUnique}` : '';
        selectMenuRow.addComponents(selectMenu);
        selectMenuOrb2Row.addComponents(selectMenuOrb2);

        paginationRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`${category}Modal-page${page - 1}-${category}-${user.id}${enemyUniqueStr}`)
                .setLabel('<')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(((page - 1) <= 0) ? true : false),
            new ButtonBuilder()
                .setCustomId('shopModal-pageViewer')
                .setLabel(`${page} \u200b / \u200b ${maxPages}`)
                .setStyle(ButtonStyle.Success)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId(`${category}Modal-page${page + 1}-${category}-${user.id}${enemyUniqueStr}`)
                .setLabel('>')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(((page + 1) > maxPages) ? true : false),
        );
        return resolve({ embed: embed, paginationRow: paginationRow, selectMenuRow: selectMenuRow, selectMenuOrb2Row: selectMenuOrb2Row });
    });
}


module.exports = { pagination };