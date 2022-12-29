const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, bold, formatEmoji, ButtonBuilder, ButtonStyle, chatInputApplicationCommandMention } = require('discord.js');
const { CommandIds } = require('../emums/commandIds');
const { Icons } = require('../emums/icons');
const { Utils } = require('../utils');

async function pagination(category, objects, page, user, args) {
    return new Promise((resolve) => {
        const embed = new EmbedBuilder();
        const paginationRow = new ActionRowBuilder();
        const selectMenu = new SelectMenuBuilder();
        const selectMenuOrb2 = new SelectMenuBuilder();

        const selectMenuRow = new ActionRowBuilder();
        const selectMenuOrb2Row = new ActionRowBuilder();

        const orbsRow = new ActionRowBuilder();
        orbsRow.addComponents(
            new ButtonBuilder()
                .setCustomId('orb1Button')
                .setEmoji(Icons.AbilityOrb)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('orb2Button')
                .setEmoji(Icons.AbilityOrb)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('orb3Button')
                .setEmoji(Icons.AbilityOrb)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('orb4Button')
                .setEmoji(Icons.AbilityOrb)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('orb5Button')
                .setEmoji(Icons.AbilityOrb)
                .setStyle(ButtonStyle.Success),
        );

        const orbEquippedRow = new ActionRowBuilder();
        orbEquippedRow.addComponents(
            new ButtonBuilder()
                .setCustomId('orb1ButtonChange')
                .setEmoji('🔃')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('orb2ButtonChange')
                .setEmoji('🔃')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('orb3ButtonChange')
                .setEmoji('🔃')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('orb4ButtonChange')
                .setEmoji('🔃')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('orb5ButtonChange')
                .setEmoji('🔃')
                .setStyle(ButtonStyle.Success),
        );

        let maxPages;
        let maxItemsInPage = (category != 'leaderboard') ? 3 : 5;
        if (category == 'allyTarget') {
            maxItemsInPage = 10;
        }
        let itemsProcessed = 1;
        let currentItem = 0;
        if (!args?.arraySorted) {
            objects.sort((a, b) => {
                return (a.id - b.id);
            });
        }
        // Max items minus one
        if (page != 1) {
            for (let ignore = 1; ignore < page; ignore++) {
                console.log('Adding +3');
                currentItem += (category != 'leaderboard') ? 3 : 5;
            }
        }
        for (let i = 0; i < maxItemsInPage; i++) {
            maxPages = objects.length;
            const element = objects[currentItem];


            switch (category) {
                case 'abilityOrbsInventoryEnchanterEQUIP': {
                    embed.setTitle(`EQUIP: Orbe Habilidad ${Icons.AbilityOrb}`).setColor('Aqua');
                    embed.setDescription(`Equipando en ranura ${args.orbPosition}`);
                    selectMenu.setCustomId(`inventoryAbilityOrbsModal-orb${args.orbPosition}-selectMenu/${user.id}`).setPlaceholder(`Equipar orbe en ranura ${args.orbPosition}...`);


                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;
                    embed.addFields(
                        {
                            name: `__${element.name}__ | ID: ${element.id}`,
                            value: `${Utils.FormatDescription(element.desc, element)}` + `\n\n${bold('Mana requerido:')} ${element.requiredMana} ${formatEmoji(Icons.Mana)}`,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: `${element.name}`,
                            description: `Mana requerido: ${element.requiredMana}`,
                            value: `abilityOrbsInventoryModal-ability-equip-orb${args.orbPosition}-${element.id}`,
                            emoji: Icons.AbilityOrb,
                        },
                    );

                    itemsProcessed += 1;
                    currentItem += 1;
                    break;
                }
                case 'abilityOrbsInventoryEnchanter': {
                    embed.setTitle(`Tus Orbes de Habilidad ${Icons.AbilityOrb}`).setColor('Aqua');


                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;
                    embed.addFields(
                        {
                            name: `${element.name} | ID: ${element.id}`,
                            value: `${Utils.FormatDescription(element.desc, element)}` + `\n\n${bold('Mana requerido:')} ${element.requiredMana} ${formatEmoji(Icons.Mana)}`,
                        },
                    );


                    itemsProcessed += 1;
                    currentItem += 1;
                    break;
                }
                case 'abilityOrbsInventory': {
                    embed.setTitle(`Tus Orbes de Habilidad ${Icons.AbilityOrb}`).setColor('Aqua');
                    selectMenu.setCustomId(`inventoryAbilityOrbsModal-orb1-selectMenu/${user.id}`).setPlaceholder('Equipar ranura de habilidad 1...');
                    selectMenuOrb2.setCustomId(`inventoryAbilityOrbsModal-orb2-selectMenu/${user.id}`).setPlaceholder('Equipar ranura de habilidad 2...');

                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;
                    embed.addFields(
                        {
                            name: `__${element.name}__ | ID: ${element.id}`,
                            value: `${Utils.FormatDescription(element.desc, element)}` + `\n\n${bold('Mana requerido:')} ${element.requiredMana} ${formatEmoji(Icons.Mana)}`,
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
                case 'swordsInventory': {
                    embed.setTitle('Your Swords').setColor('#F83636');
                    selectMenu.setCustomId(`inventorySwordsModal-selectMenu/${user.id}`).setPlaceholder('Cambiar espada equipada...');

                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;
                    let perksStr = `\n\n***${element?.perks?.perkName || 'Ninguno'}***\n${element?.perks?.perkDesc || 'Este objeto no tiene ningun perk'}\n\n`;
                    for (let index = 0; index < Object.values(element?.perks || []).length; index++) {
                        const perk = element?.perks[`perk${index + 1}`];
                        if (index == 0) { perksStr = `\n\n**${perk?.perkName}**\n${perk?.perkDesc}\n\n`; }
                        else { perksStr += `\n\n**${perk?.perkName}`; }
                    }
                    embed.addFields(
                        {
                            name: '__' + element.name + '__',
                            value: `\n\n\n***Stats***\n\n**+${element.stats.atk}** - ATK\n**+${element.stats.spd}** - SPD\n\n**Perks**${perksStr}**Minimum Level:** ${element.minLvl}`,
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
                }
                case 'armorPlatesInventory': {
                    embed.setTitle('Tus Armaduras').setColor('#F83636');
                    selectMenu.setCustomId(`inventoryArmorPlatesModal-selectMenu/${user.id}`).setPlaceholder('Cambiar armadura equipada...');

                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;
                    let perksStr = `\n\n***${element?.perks?.perkName || 'Ninguno'}***\n${element?.perks?.perkDesc || 'Este objeto no tiene ningun perk'}\n\n`;
                    for (let index = 0; index < Object.values(element?.perks || []).length; index++) {
                        const perk = element?.perks[`perk${index + 1}`];
                        if (index == 0) { perksStr = `\n\n**${perk?.perkName}**\n${perk?.perkDesc}\n\n`; }
                        else { perksStr += `\n\n**${perk?.perkName}`; }
                    }

                    embed.addFields(
                        {
                            name: '__' + element.name + '__',
                            value: `\n\n\n***Stats***\n\n**+${element.stats.armor}** - Armor\n**+${element.stats.magicDurability}** - Magic DURABILITY\n\n**Perks**${perksStr}**Minimum Level:** ${element.minLvl}`,
                            inline: true,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: element.name,
                            description: `Nivel minimo: ${element.minLvl}`,
                            value: `inventoryArmorPlateModal-armorPlate-equip-${element.id}`,
                            emoji: '🛡️',
                        },
                    );

                    itemsProcessed += 1;
                    currentItem += 1;
                    console.log(currentItem, 'log0001');
                    break;
                }

                case 'bowsInventory': {
                    embed.setTitle('Your Bows').setColor('Green');
                    selectMenu.setCustomId(`inventoryBowsModal-selectMenu/${user.id}`).setPlaceholder('Cambiar arco equipado...');

                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;

                    let perksStr = '\n\n***Ninguno***\nEste objeto no tiene ningun perk\n\n';
                    for (let index = 0; index < Object.values(element?.perks).length; index++) {
                        const perk = element?.perks[`perk${index + 1}`];
                        if (index == 0) { perksStr = `\n\n**${perk.perkName}**\n${perk.perkDesc}\n\n`; }
                        else { perksStr += `\n\n**${perk.perkName}`; }
                    }

                    embed.addFields(
                        {
                            name: '__' + element.name + '__',
                            value: `\n\n\n***Stats***\n\n**+${element.stats.atk}** - ATK\n**+${element.stats.spd}** - SPD\n\n**Perks**${perksStr}**Minimum Level:** ${element.minLvl}`,
                            inline: true,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: element.name,
                            description: `Nivel minimo: ${element.minLvl}`,
                            value: `inventoryBowModal-bow-equip-${element.id}`,
                            emoji: '🏹',
                        },
                    );

                    itemsProcessed += 1;
                    currentItem += 1;
                    console.log(currentItem, 'log0001');
                    break;
                }

                case 'abilityOrbs':
                    embed.setTitle('Your Ability Orbs').setColor('Aqua');
                    selectMenu.setCustomId(`abilityModal-selectMenu/${user.id}`).setPlaceholder('Select ability...');


                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;


                    embed.setDescription(`${bold('Mana actual: ')} ${args.currentMana} ${formatEmoji(Icons.Mana)}`);
                    embed.addFields(
                        {
                            name: `__${element.name}__ | ID: ${element.id}`,
                            value: `${Utils.FormatDescription(element.desc, element)}` + `\n\n${bold('Mana requerido:')} ${element.requiredMana} ${formatEmoji(Icons.Mana)}`,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: `${element.name}`,
                            description: `Mana requerido: ${element.requiredMana}`,
                            value: `abilityModal-ability-select-${element.id}-${element.target}`,
                            emoji: Icons.AbilityOrb,
                        },
                    );

                    console.log(currentItem, 'log0000');
                    itemsProcessed += 1;
                    currentItem += 1;
                    console.log(currentItem, 'log0001');
                    break;

                case 'wandsInventoryEnchanter':
                    embed.setTitle('Your Magical Wands').setColor('Blue');
                    selectMenu.setCustomId(`inventoryWandsModal-selectMenu/${user.id}`).setPlaceholder('Cambiar varita equipada...');


                    console.log(currentItem, itemsProcessed, maxItemsInPage, 'sadfasd');
                    if (itemsProcessed > maxItemsInPage) {
                        continue;
                    }

                    if (!element) continue;

                    embed.addFields(
                        {
                            name: '__' + element.name + '__',
                            value: `\n\n\n***Stats***\n\n**+${element.stats.magicStrength}** - MGC STR\n**+${element.stats.mana}** - MANA\n\n**Perks**\n\n***${element?.perks?.perkName || 'Ninguno'}***\n${element?.perks?.perkDesc || 'Este objeto no tiene ningun perk'}\n\n**Minimum Level:** ${element.minLvl}`,
                            inline: true,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: element.name,
                            description: `Nivel minimo: ${element.minLvl}`,
                            value: `inventoryWandModal-wand-equip-${element.id}`,
                            emoji: '🪄',
                        },
                    );

                    itemsProcessed += 1;
                    currentItem += 1;
                    console.log(currentItem, 'log0001');
                    break;

                case 'leaderboard':
                    embed.setTitle('Tabla del Evento').setColor('Aqua');
                    console.log(element);
                    if (!element) continue;


                    embed.addFields(
                        {
                            name: `${currentItem + 1} \\ ${bold(element.name)} ${element.isPlayer ? '(Tú)' : ''} - ${chatInputApplicationCommandMention('profile', CommandIds.Profile)}`,
                            value: `Puntos: **${new Intl.NumberFormat().format(element.eventPts)}**\nNivel: **${element.lvl}**\nVida: **${element.playerHp}/${element.playerMaxHp}** ${Utils.HpEmoji(element.playerHp, element.playerMaxHp)}`,
                        },
                    );

                    itemsProcessed += 1;
                    currentItem += 1;
                    break;

                case 'allyTarget': {
                    embed.setTitle('Aliados').setColor('Green');
                    selectMenu.setCustomId(`allyTarget-selectMenu/${user.id}`).setPlaceholder('Seleccionar aliado...');
                    if (!element) continue;


                    embed.addFields(
                        {
                            name: `(+) ${bold(element.name)}`,
                            value: `HP ${element.playerHp}/${bold(element.playerMaxHp)} ${Utils.HpEmoji(element.playerHp, element.playerMaxHp)}`,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: element.name,
                            description: `HP ${element.playerHp}/${element.playerMaxHp} ${Utils.HpEmoji(element.playerHp, element.playerMaxHp)}`,
                            value: `ability-target-ally-${element.id}-${element.abilityID}`,
                            emoji: '🪄',
                        },
                    );

                    itemsProcessed += 1;
                    currentItem += 1;
                    break;
                }

                case 'consumables': {
                    embed.setTitle('Consumibles').setColor('Green');
                    selectMenu.setCustomId(`consumable-selectMenu/${user.id}`).setPlaceholder('Seleccionar consumible...');
                    if (!element) continue;


                    embed.addFields(
                        {
                            name: `${bold(element.name)}`,
                            value: `${bold(element.type.toUpperCase())}\n(+) ${element.amount}\n\n**Cantidad:** ${element.consumableAmount}`,
                        },
                    );

                    selectMenu.addOptions(
                        {
                            label: element.name,
                            description: `${element.type.toUpperCase()} | ${element.amount}`,
                            value: `consumable-use-${element.id}`,
                            emoji: '🥤',
                        },
                    );

                    itemsProcessed += 1;
                    currentItem += 1;
                    break;
                }

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
        return resolve({
            embed: embed,
            paginationRow: paginationRow,
            selectMenuRow: (category != 'abilityOrbsInventoryEnchanter') ? selectMenuRow : orbsRow,
            selectMenuOrb2Row: (category != 'abilityOrbsInventoryEnchanter') ? selectMenuOrb2Row : orbEquippedRow,
        });
    });
}


module.exports = { pagination };