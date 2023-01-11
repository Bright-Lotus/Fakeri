const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Events, bold, underscore, formatEmoji, hyperlink, chatInputApplicationCommandMention } = require('discord.js');

const { getFirestore, doc, getDocs, collection, getDoc, increment, updateDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const { Icons } = require('../emums/icons.js');
const { pagination } = require('../handlers/paginationHandler.js');
const { Utils } = require('../utils.js');
const { CommandIds } = require('../emums/commandIds.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function formatKeyword(keyword, displayName) {
    if (keyword == 'ability') keyword = 'Ability';
    return `**${hyperlink(displayName, 'https://fakeri.parcel.app/keywords/' + keyword.toLowerCase())}** ${formatEmoji(Icons[ keyword ])}`;
}

function formatKeywordDesc(keywordSubtype, args) {
    switch (keywordSubtype) {
        case 'split':
            return `Se divide en 2 unidades con el **${args.ratio}%** de las stats originales`;

        case 'vampiric':
            return `Se cura por **${args.ratio}%** del daño hecho con cada ataque`;

        case 'hardened':
            return `Recibe **${args.ratio}** menos de daño de todas las fuentes`;

        case 'duelist':
            return `Recibe **${args.ratio} ATK** en cada ataque al jugador`;

        case 'dodge':
            return `Tiene un chance del **${args.ratio}%** de esquivar el ataque del jugador`;

        case 'elusive':
            return `Tiene un chance del **${args.ratio}%** de esquivar el ataque del jugador`;

        case 'thunderStrike':
            return `Lanza un ataque de trueno que hace **${args.ratio}% ATK**`;

        case 'lavaStrike':
            return `Lanza un ataque con lava que hace **${args.ratio}% ATK**`;

        case 'vampiricStrike':
            return `Lanza una mordida letal que roba vida y hace **${args.ratio}% ATK**`;

        case 'plasmaStrike':
            return `Lanza un ataque con plasma que hace **${args.ratio}% ATK**`;

        case 'elite':
            return `Cada cierta cantidad de ataques, hace daño extra haciendo **${args.ratio}% ATK**`;

        case 'burn':
            return `Hace extra daño por **${args.ratio}% ATK** cada ataque`;

        default:
            break;
    }
}

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute: async function (message) {
        // Testing purposes
        await updateDoc(doc(db, 'Event/Info'), {
            [ 'messageCount' ]: increment(1),
        }, { merge: true });
        if (message.author.bot) return;
        const farmChannelsSnap = await getDoc(doc(db, message.guild.id, 'FarmChannels'));
        const monsterSnap = await getDocs(collection(db, '/Event/Enemies/RegularMonsters'));
        let farmChannels = [];
        if (farmChannelsSnap.exists()) {
            for (let i = 1; i < (farmChannelsSnap.data().channelCount + 1); i++) {
                if (farmChannelsSnap.data()[ `channel${i}` ].id == message.channel.id) {
                    farmChannels.push(farmChannelsSnap.data()[ `channel${i}` ]);
                }
            }
        }

        farmChannels = farmChannels.filter(element => { return element !== undefined; });
        const passed = [];
        const playerInfo = await getDoc(doc(db, message.author.id, 'PlayerInfo'));

        farmChannels.forEach(element => {
            if (element.enchanterOnly) {
                if (playerInfo.data().class != 'enchanter') {
                    message.reply({ embeds: [ ErrorEmbed(EventErrors.EnchanterOnlyZone) ] });
                    return;
                }
            }
            if (message.channel.id != element.id) {
                passed.push('failed');
                return;
            }
            passed.push('pass');
        });
        const enemiesListEmbed = new EmbedBuilder()
            .setTitle('Zone\'s Enemies')
            .setColor('Blue');
        const activeBattlesListEmbed = new EmbedBuilder()
            .setTitle('Your active battles')
            .setColor('Red');
        const row = new ActionRowBuilder();
        const battleSelectMenu = new SelectMenuBuilder();
        battleSelectMenu.setCustomId(`battleFlow-selectMenu/${message.author.id}`).setPlaceholder('Target a new enemy...');

        const activeBattleSelectMenu = new SelectMenuBuilder();
        activeBattleSelectMenu.setCustomId(`battleFlow-selectMenu-activeBattle/${message.author.id}`).setPlaceholder('Target a enemy already in battle...');
        let unique = 1;
        const eliteConstant = 0.1;
        const elitePower = 1;
        let eliteCount = 0;

        let activeBattles = await getDoc(doc(db, message.author.id, 'ActiveBattles'));
        if (activeBattles.data()?.battles.amount > 0 && !activeBattles.data()?.battles.battle0) {
            await updateDoc(doc(db, message.author.id, 'ActiveBattles'), {
                [ 'battles.amount' ]: 0,
            }, { merge: true });
            activeBattles = await getDoc(doc(db, message.author.id, 'ActiveBattles'));
        }

        if (passed.filter(element => (element == 'pass')).length > 0) {
            let hasActiveBattles = false;
            message.content = message.content.toLowerCase();
            if (message.content == 'atk') {
                message.content = 'attack';
            }
            else if (message.content == 'abl') {
                message.content = 'ability';
            }

            if (!playerInfo.exists() && message.content == 'attack') {
                return message.reply({ embeds: [ ErrorEmbed(EventErrors.PlayerNotRegistered) ] });
            }

            switch (message.content) {
                case 'attack':
                    message.channel.sendTyping();
                    if (playerInfo.data()?.dead) {
                        return message.reply({ embeds: [ ErrorEmbed(EventErrors.PlayerIsDead) ] });
                    }

                    farmChannels.forEach(async farmChannel => {
                        const constant = 0.1;
                        const power = 1;
                        let farmChannelName = '';
                        message.channel.name.match(/\w+/g).forEach(element => {
                            farmChannelName += Utils.CapitalizeFirstLetter(element) + ' ';
                        });
                        enemiesListEmbed.setAuthor({ name: `Actualmente estas en ${farmChannelName}` });
                        if (playerInfo.data().class == 'archer' && playerInfo.data().playerLvl + 5 < farmChannel.minLvl) {
                            return message.reply({ embeds: [ ErrorEmbed(EventErrors.NotEnoughLevelForZone, `Necesitas ser nivel ${Icons.Level} ${bold(farmChannel.minLvl)} para esta zona\nEres nivel ${Icons.Level} ${bold(playerInfo.data().playerLvl + 5)} 🏹 ahora mismo.`) ] });
                        }
                        else if (playerInfo.data().class != 'archer' && playerInfo.data().playerLvl < farmChannel.minLvl) {
                            return message.reply({ embeds: [ ErrorEmbed(EventErrors.NotEnoughLevelForZone, `Necesitas ser nivel ${Icons.Level} ${bold(farmChannel.minLvl)} para esta zona\nEres nivel ${Icons.Level} ${bold(playerInfo.data().playerLvl)} ahora mismo.`) ] });
                        }
                        farmChannel.enemies.forEach(monsters => {
                            monsterSnap.forEach(async monsterDoc => {
                                const monster = monsterDoc.data()[ `enemy${monsters}` ];
                                monster.elite = Math.random() < 0.3;
                                const randomProperty = function (obj) {
                                    const keys = Object.keys(obj);

                                    return keys[ Math.floor(Math.random() * keys.length) ];
                                };
                                const randProp = randomProperty(monster.stats);
                                let valueKeyword = (monster.keywords.length > 0) ? '-' : '';
                                let keywordStr = '';
                                if (monster.elite) {
                                    monster.gold += monster.gold * 0.25;
                                    monster.baseXp += monster.baseXp * 0.25;
                                }
                                monster.baseXp += Math.round((playerInfo.data().playerLvl / 0.1) ** 1);
                                monster.gold += Math.round((playerInfo.data().playerLvl / 0.1) ** 0.9);
                                for (const stat of Object.keys(monster.stats)) {
                                    if (playerInfo.data().class == 'archer' && playerInfo.data().playerLvl < farmChannel.minLvl) {
                                        monster.stats[ stat ] += Math.round((playerInfo.data().playerLvl / constant) ** 1.1);
                                        if (monster.stats[ stat ] < 0) {
                                            monster.stats[ stat ] = 0;
                                        }
                                    }
                                    else {
                                        monster.stats[ stat ] += Math.round((playerInfo.data().playerLvl / constant) ** power);
                                    }
                                }
                                if (monster.elite) {
                                    monster.keywords.push({ type: 'Elite', displayName: 'Elite', subtype: 'elite', ratio: 30 });
                                }
                                monster.keywords.forEach(keyword => {
                                    console.log(formatKeyword(keyword.type, keyword.displayName));
                                    keywordStr += `${formatKeyword(keyword.type, keyword.displayName)}\n${formatKeywordDesc(keyword.subtype, { ratio: keyword.ratio })}\n\n`;
                                    valueKeyword += `${keyword.type}:${keyword.subtype}:${Math.round(keyword.ratio)}/`;
                                });

                                if (monster?.abilities) {
                                    keywordStr += `${formatKeyword(monster.abilities.type, monster.abilities.displayName)}\n${formatKeywordDesc(monster.abilities.subtype, { ratio: monster.abilities.ratio })}\n\n`;
                                    valueKeyword += `-${monster.abilities.type}:${monster.abilities.subtype}:${monster.abilities.ratio}/`;
                                }
                                if (keywordStr == '') {
                                    keywordStr = 'No special properties!\n\n\n';
                                }

                                if (!monster.elite) {
                                    enemiesListEmbed.addFields(
                                        {
                                            name: bold(underscore(monster.name)),
                                            value: `\n**Properties:**\n\n${keywordStr}\n\n
                                            **Stats:**\n\n**${monster.stats.atk}** - ATK ${Icons.ATK} \n**${monster.stats.hp}** - Max HP ${Icons.FullHp} \n**${monster.stats.spd}** - SPD ${Icons.SPD}\n**${monster.stats.armor}** - ARMOR ${Icons.Armor}\n**${monster.stats.magicDurability}** - MAGIC DURABILITY${Icons.MagicDurability}\n
                                            \n**__Level:__** ${monster.minLvl}`,
                                            inline: true,
                                        },
                                    );
                                }
                                else {
                                    eliteCount++;
                                    monster.stats[ randProp ] += Math.round((playerInfo.data().playerLvl / eliteConstant) ** elitePower);
                                    monster.baseXp += monster.baseXp * 0.4;
                                    monster.gold += monster.gold * 0.4;
                                    enemiesListEmbed.addFields(
                                        {
                                            name: bold(underscore(monster.name)),
                                            // TODO: Add hyperlink to monster page
                                            value: `\n**Properties:**\n\n**${hyperlink('Elite', 'https://blank.page/')}** ${formatEmoji(Icons.Elite)}\nEsta unidad recibe una mejora en una estadistica aleatoria\n\n**No puedes ver sus estadisticas hasta que inicias una pelea con esta unidad**\n\n
                                            \n**__Level:__** ${monster.minLvl}`,
                                            inline: true,
                                        },
                                    );
                                }
                                let randPropDisplay = randProp;
                                if (randProp == 'magicDurability') { randPropDisplay = 'mgcDrb'; }
                                const eliteStr = `${randPropDisplay}:${Math.round(monster.stats[ randProp ])}`;
                                const turn = (playerInfo.data()?.stats.spd > monster.stats.spd) ? 'player' : 'enemy';

                                battleSelectMenu.addOptions(
                                    {
                                        label: `${monster.name} - Recommended Level: ${Math.ceil((monster.minLvl / 85) * 100)} `,
                                        description: (`Rewards: ${monster.baseXp} XP | ${monster.gold} GOLD`),
                                        // B is abbreviation for battle, b is abbreviation for begin, e is abbreviation for enemy
                                        // This is done so that the value is not too long but still we know what it does
                                        value: `b-s-e-${monster.id}-${Math.round(monster.stats.hp)}-${Math.round(monster.stats.atk)}-${Math.round(monster.stats.spd)}-${Math.round(monster.stats.armor)}-${Math.round(monster.stats.magicDurability)}-${(monster.elite) ? eliteStr : '0'}-${monster.baseXp}-${Math.round(monster.gold)}-${turn}${valueKeyword}-${unique}`,
                                        emoji: (monster.elite) ? Icons.Elite : Icons[ monster.keywords[ 0 ]?.type ],
                                    },
                                );

                                unique++;
                            });
                        });
                    });
                    row.addComponents(battleSelectMenu);
                    if (activeBattles.exists()) {

                        if (activeBattles.data()?.battles.amount > 0) {
                            await Promise.all(Object.values(activeBattles.data().battles).filter(element => (typeof element != 'number')).map(async battle => {
                                const enemy = await getDoc(doc(db, 'Event/Enemies/RegularMonsters/Monsters'));

                                if (enemy.exists()) {
                                    hasActiveBattles = true;
                                    const battleEnemy = enemy.data()[ `enemy${battle.enemyId}` ];

                                    const checkElite = (stat) => {
                                        if (stat == 'mgcDrb') { stat = 'magicDurability'; }
                                        if (battle.enemyElite != '0') return (stat == battle.enemyElite.split(':')[ 0 ]) ? formatEmoji(Icons.Elite) : '';
                                        return '';
                                    };

                                    let keywordStr = '';
                                    battle.keywords.forEach(keyword => {
                                        console.log('🚀 ~ file: farmChannel.js:224 ~ awaitPromise.all ~ keyword', keyword);
                                        if (keyword.type != 'ability') {
                                            let displayName;
                                            if (keyword.type == 'LastBreath') {
                                                displayName = 'Last Breath';
                                            }
                                            else if (keyword?.type?.match(/[A-Z]/g)?.length < 2) { displayName = keyword.type; }
                                            keywordStr += `${formatKeyword(keyword.type, displayName)}\n${formatKeywordDesc(keyword.subtype, { ratio: keyword.ratio })}\n\n`;
                                        }
                                    });
                                    if (battleEnemy?.abilities) {
                                        keywordStr += `${formatKeyword(battleEnemy.abilities.type, battleEnemy.abilities.displayName)}\n${formatKeywordDesc(battleEnemy.abilities.subtype, { ratio: battleEnemy.abilities.ratio })}\n\n`;
                                    }
                                    if (keywordStr == '') {
                                        keywordStr = 'No special properties!';
                                    }


                                    activeBattlesListEmbed.addFields(
                                        {
                                            name: bold(underscore(battleEnemy.name)),
                                            value: `\n**Properties:**\n\n${keywordStr}\n
                                            **Stats:**\n\n**${battle.enemyAtk}** - ATK ${Icons.ATK} ${checkElite('atk')}\n**${battle.enemyHp}** - Current HP ${Icons.SeventyFivePercentHp} ${checkElite('hp')}\n**${battle.enemySpd}** - SPD ${Icons.SPD} ${checkElite('spd')}\n**${battle.enemyArmor}** - ARMOR ${Icons.Armor} ${checkElite('armor')}\n**${battle.enemyMagicDurability}** - MAGIC DURABILITY ${Icons.MagicDurability} ${checkElite('magicDurability')}\n
                                            \n**__Level:__** ${battleEnemy.minLvl}`,
                                            inline: true,
                                        },
                                    );

                                    console.log('start options');
                                    let eliteStr;
                                    if (battle.enemyElite != '0') {
                                        eliteStr = `- ${battle.enemyElite.split(':')[ 0 ].toUpperCase()}: ${battle.enemyElite.split(':')[ 1 ].toUpperCase()}`;
                                    }
                                    activeBattleSelectMenu.addOptions(
                                        {
                                            label: `${battleEnemy.name} ${(battle.enemyElite != '0') ? eliteStr : ''}`,
                                            description: (`${(battleEnemy.ability) ? battleEnemy.ability.abilityDesc : 'No special Properties!'}`),
                                            value: `battle-attack-monster-${battle.enemyId}-${battle.enemyUnique}-${activeBattles.data().battles.amount}`,
                                            emoji: (battle.enemyElite != '0') ? Icons.Elite : Icons.Attack,
                                        },
                                    );
                                    console.log('end options');
                                    return true;
                                }
                            }));
                            // but heres the eeper activeBattles.data().battles.forEach(async battle => {

                            // });

                            const activeBattleRow = new ActionRowBuilder();
                            activeBattleRow.addComponents(activeBattleSelectMenu);
                            if ((activeBattles.data().battles.length + 1) > 3) {
                                return message.reply({ embeds: [ activeBattlesListEmbed ], components: [ activeBattleRow ], ephemeral: true });
                            }
                            if (eliteCount > 0) enemiesListEmbed.setColor('#8A1DE6');
                            message.reply({ embeds: [ enemiesListEmbed, activeBattlesListEmbed ], components: [ row, activeBattleRow ], ephemeral: true });
                        }
                        else {
                            if (eliteCount > 0) enemiesListEmbed.setColor('#8A1DE6');
                            message.reply({ embeds: [ enemiesListEmbed ], components: [ row.toJSON() ], ephemeral: true }).catch(err => console.error(err));
                        }
                    }
                    break;


                case 'ability': {
                    if (playerInfo.data().class != 'enchanter') return;
                    message.channel.sendTyping();
                    if (playerInfo.data()?.dead) {
                        return message.reply({ embeds: [ ErrorEmbed(EventErrors.PlayerIsDead) ] });
                    }

                    const playerEquipment = await getDoc(doc(db, message.author.id, 'PlayerInfo/Inventory/Equipment'));
                    if (playerEquipment.exists()) {
                        if (playerInfo.exists()) {
                            const playerMana = playerInfo.data().stats.mana;
                            const abilityOrbs = playerEquipment.data().abilityOrbs;
                            const abilityOrbsArray = Object.values(abilityOrbs).filter(element => (typeof element != 'number'));

                            await pagination('abilityOrbs', abilityOrbsArray, 1, message.author, { currentMana: playerMana }).then(results => {
                                return message.reply({ embeds: [ results.embed ], components: [ results.paginationRow, results.selectMenuRow ] });
                            });
                        }

                    }
                    break;
                }

                case 'item': {
                    message.channel.sendTyping();

                    const playerEquipment = await getDoc(doc(db, message.author.id, 'PlayerInfo/Inventory/Equipment'));
                    if (playerInfo.exists()) {
                        const consumables = Object.values(playerEquipment?.data()?.consumables || {}).filter(element => typeof element != 'number');
                        if (consumables.length == 0) {
                            const noConsumablesEmbed = new EmbedBuilder()
                                .setTitle('No tienes ningún consumible!')
                                .setDescription(`Compra alguno en la tienda! (${chatInputApplicationCommandMention('shop', CommandIds.Shop)})`)
                                .setColor('#FF0000');
                            message.reply({ embeds: [ noConsumablesEmbed ] });
                            return;
                        }
                        await pagination('consumables', consumables, 1, message.author).then(results => {
                            return message.reply({ embeds: [ results.embed ], components: [ results.paginationRow, results.selectMenuRow ] });
                        });
                    }
                    break;
                }

                case 'charge':
                    if (playerInfo.data().class != 'warrior') return;
                    message.channel.sendTyping();
                    if (playerInfo.data()?.dead) {
                        return message.reply({ embeds: [ ErrorEmbed(EventErrors.PlayerIsDead) ] });
                    }

                    if (activeBattles.exists()) {

                        if (activeBattles.data()?.battles.amount > 0) {
                            await Promise.all(Object.values(activeBattles.data().battles).filter(element => (typeof element != 'number')).map(async battle => {
                                console.log(battle, 'debugpromisebattles');
                                const enemy = await getDoc(doc(db, 'Event/Enemies/RegularMonsters/Monsters'));

                                if (enemy.exists()) {
                                    hasActiveBattles = true;
                                    const battleEnemy = enemy.data()[ `enemy${battle.enemyId}` ];

                                    const checkElite = (stat) => {
                                        if (stat == 'mgcDrb') { stat = 'magicDurability'; }
                                        if (battle.enemyElite != '0') { return (stat == battle.enemyElite.split(':')[ 0 ]) ? formatEmoji(Icons.Elite) : ''; }
                                        return '';
                                    };

                                    let keywordStr = '';
                                    battle.keywords.forEach(keyword => {
                                        console.log('🚀 ~ file: farmChannel.js:224 ~ awaitPromise.all ~ keyword', keyword);
                                        if (keyword.type != 'ability') {
                                            let displayName;
                                            if (keyword.type == 'LastBreath') {
                                                displayName = 'Last Breath';
                                            }
                                            else if (keyword?.type?.match(/[A-Z]/g)?.length < 2) { displayName = keyword.type; }
                                            console.log('🚀 ~ file: farmChannel.js:191 ~ awaitPromise.all ~ keyword', keyword);
                                            console.log(keyword, 'debugkeyword');
                                            keywordStr += `${formatKeyword(keyword.type, displayName)}\n${formatKeywordDesc(keyword.subtype, { ratio: keyword.ratio })}\n\n`;
                                        }
                                    });
                                    if (battleEnemy?.abilities) {
                                        keywordStr += `${formatKeyword(battleEnemy.abilities.type, battleEnemy.abilities.displayName)}\n${formatKeywordDesc(battleEnemy.abilities.subtype, { ratio: battleEnemy.abilities.ratio })}\n\n`;
                                    }
                                    if (keywordStr == '') {
                                        keywordStr = 'No special properties!';
                                    }

                                    activeBattlesListEmbed.addFields(
                                        {
                                            name: bold(underscore(battleEnemy.name)),
                                            value: `\n**Properties:**\n\n${keywordStr}\n\n
                                            **Stats:**\n\n**${battle.enemyAtk}** - ATK ${Icons.ATK} ${checkElite('atk')}\n**${battle.enemyHp}** - Current HP ${Icons.SeventyFivePercentHp} ${checkElite('hp')}\n**${battle.enemySpd}** - SPD ${Icons.SPD} ${checkElite('spd')}\n**${battle.enemyArmor}** - ARMOR ${Icons.Armor} ${checkElite('armor')}\n**${battle.enemyMagicDurability}** - MAGIC DURABILITY ${Icons.MagicDurability} ${checkElite('magicDurability')}\n
                                            \n**__Level:__** ${battleEnemy.minLvl}`,
                                            inline: true,
                                        },
                                    );

                                    console.log('start options');
                                    let eliteStr;
                                    if (battle.enemyElite != '0') {
                                        eliteStr = `- ${battle.enemyElite.split(':')[ 0 ].toUpperCase()}: ${battle.enemyElite.split(':')[ 1 ].toUpperCase()}`;
                                    }
                                    activeBattleSelectMenu.addOptions(
                                        {
                                            label: `${battleEnemy.name} ${(battle.enemyElite != '0') ? eliteStr : ''}`,
                                            description: (`${(battleEnemy.ability) ? battleEnemy.ability.abilityDesc : 'No special Properties!'}`),
                                            value: `battle-chargeAttack-monster-${battle.enemyId}-${battle.enemyUnique}-${activeBattles.data().battles.amount}`,
                                            emoji: (battle.enemyElite != '0') ? Icons.Elite : Icons.BuffedAtk,
                                        },
                                    );
                                    console.log('end options');
                                    return true;
                                }
                            }));
                            // but heres the eeper activeBattles.data().battles.forEach(async battle => {

                            // });

                            const activeBattleRow = new ActionRowBuilder();
                            activeBattleRow.addComponents(activeBattleSelectMenu);
                            console.log(row.components);
                            console.log('start repl');
                            if ((activeBattles.data().battles.length + 1) > 3) {
                                return message.reply({ embeds: [ activeBattlesListEmbed ], components: [ activeBattleRow ] }).catch(console.error);
                            }
                            if (eliteCount > 0) enemiesListEmbed.setColor('#8A1DE6');
                            message.reply({ embeds: [ activeBattlesListEmbed ], components: [ activeBattleRow ] });
                        }
                        else {
                            const noBattlesEmbed = new EmbedBuilder()
                                .setTitle('No tienes batallas activas')
                                .setDescription('Usa "attack" para empezar una batalla')
                                .setColor('Red');
                            message.reply({ embeds: [ noBattlesEmbed ] });
                        }
                    }
                    break;

                default:
                    break;
            }
        }


    },
};