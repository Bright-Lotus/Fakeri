const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Events, bold, underscore, formatEmoji, hyperlink } = require('discord.js');

const { getFirestore, doc, getDocs, collection, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const { Icons } = require('../emums/icons.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function formatKeyword(keyword, displayName) {
    return `**${hyperlink(displayName, 'https://fakeri.parcel.app/keywords/' + keyword.toLowerCase())}** ${formatEmoji(Icons[keyword])}`;
}

function formatKeywordDesc(keywordSubtype, args) {
    switch (keywordSubtype) {
        case 'split':
            return `Se divide en 2 unidades con el ${args.ratio}% de las stats originales`;

        case 'vampiric':
            return `Se cura por ${args.ratio}% del daño hecho con cada ataque`;

        case 'hardened':
            return `Recibe ${args.ratio} menos de daño de todas las fuentes`;

        default:
            break;
    }
}

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute: async function(message) {
        if (message.author.bot) return;
        const farmChannelsSnap = await getDoc(doc(db, message.guild.id, 'FarmChannels'));
        const monsterSnap = await getDocs(collection(db, '/Event/Enemies/RegularMonsters'));
        let farmChannels = [];
        if (farmChannelsSnap.exists()) {
            for (let i = 1; i < (farmChannelsSnap.data().channelCount + 1); i++) {
                if (farmChannelsSnap.data()[`channel${i}`].id == message.channel.id) {
                    farmChannels.push(farmChannelsSnap.data()[`channel${i}`]);
                }
            }
        }

        farmChannels = farmChannels.filter(element => { return element !== undefined; });
        const passed = [];
        farmChannels.forEach(element => {
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
        const eliteConstant = 10;
        let orbInMsg = -1;
        let eliteCount = 0;


        const activeBattles = await getDoc(doc(db, message.author.id, 'ActiveBattles'));
        const playerInfo = await getDoc(doc(db, message.author.id, 'PlayerInfo'));

        if (passed.filter(element => (element == 'pass')).length > 0) {
            let hasActiveBattles = false;
            message.content = message.content.toLowerCase();
            if (message.content == 'atk') {
                message.content = 'attack';
            }
            else if (message.content == 'abl') {
                message.content = 'ability';
            }
            if (message.content.includes('ability/orb') || message.content.includes('abl/orb')) {
                if (message.content.match(/\d+/g).length > 0) {
                    orbInMsg = message.content.match(/\d+/g)[0];
                    message.content = 'ability';
                }
            }

            if (!playerInfo.exists() && message.content == 'attack') {
                return message.reply({ embeds: [ErrorEmbed(EventErrors.PlayerNotRegistered)] });
            }
            if (playerInfo.data().dead) {
                return message.reply({ embeds: [ErrorEmbed(EventErrors.PlayerIsDead)] });
            }


            switch (message.content) {
                case 'attack':
                    message.channel.sendTyping();
                    farmChannels.forEach(async element => {
                        if (playerInfo.data().playerLvl < element.minLvl) {
                            return message.reply({ embeds: [ErrorEmbed(EventErrors.NotEnoughLevelForZone, `Necesitas ser nivel ${Icons.Level} ${bold(element.minLvl)}\nEres nivel ${Icons.Level} ${bold(playerInfo.data().playerLvl)} ahora mismo.`)] });
                        }
                        element.enemies.forEach(monsters => {
                            monsterSnap.forEach(async monsterDoc => {
                                const monster = monsterDoc.data()[`enemy${monsters}`];
                                monster.elite = Math.random() < 0.3;
                                const randomProperty = function(obj) {
                                    const keys = Object.keys(obj);

                                    return keys[Math.floor(Math.random() * keys.length)];
                                };
                                const randProp = randomProperty(monster.stats);
                                let keywordStr = '';
                                let valueKeyword = (monster.keywords.length > 0) ? '-' : '';
                                monster.keywords.forEach(keyword => {
                                    console.log(formatKeyword(keyword.type, keyword.displayName));
                                    keywordStr += `${formatKeyword(keyword.type, keyword.displayName)}\n${formatKeywordDesc(keyword.subtype, { ratio: keyword.ratio })}\n\n`;
                                    valueKeyword += `${keyword.type}:${keyword.subtype}:${keyword.ratio}/`;
                                });
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
                                    monster.stats[randProp] += eliteConstant;
                                    enemiesListEmbed.addFields(
                                        {
                                            name: bold(underscore(monster.name)),
                                            value: `\n**Properties:**\n\n**${hyperlink('Elite', 'https://blank.page/')}** ${formatEmoji(Icons.Elite)}\nEsta unidad recibe una mejora en una estadistica aleatoria\n\n**No puedes ver sus estadisticas hasta que inicias una pelea con esta unidad**\n\n
                                            \n**__Level:__** ${monster.minLvl}`,
                                            inline: true,
                                        },
                                    );
                                }
                                let randPropDisplay = randProp;
                                if (randProp == 'magicDurability') { randPropDisplay = 'mgcDrb'; }
                                const eliteStr = `${randPropDisplay}:${monster.stats[randProp]}`;
                                const turn = (playerInfo.data()?.stats.spd > monster.stats.spd) ? 'player' : 'enemy';

                                battleSelectMenu.addOptions(
                                    {
                                        label: `${monster.name} - Recommended Level: ${Math.ceil((monster.minLvl / 85) * 100)} `,
                                        description: (`Rewards: ${monster.baseXp} XP | ${monster.gold} GOLD`),
                                        value: `battle-start-monster-${monster.id}-${monster.stats.hp}-${monster.stats.atk}-${monster.stats.spd}-${monster.stats.armor}-${monster.stats.magicDurability}-${(monster.elite) ? eliteStr : '0'}-${monster.baseXp}-${monster.gold}-${turn}${valueKeyword}-${unique}`,
                                        emoji: (monster.elite) ? Icons.Elite : Icons[monster.keywords[0]?.type],
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
                                console.log(battle, 'debugpromisebattles');
                                const enemy = await getDoc(doc(db, 'Event/Enemies/RegularMonsters/Monsters'));

                                if (enemy.exists()) {
                                    hasActiveBattles = true;
                                    const battleEnemy = enemy.data()[`enemy${battle.enemyId}`];

                                    const checkElite = (stat) => {
                                        if (stat == 'mgcDrb') { stat = 'magicDurability'; }
                                        if (battle.enemyElite != '0') return (stat == battle.enemyElite.split(':')[0]) ? formatEmoji(Icons.Elite) : '';
                                        return '';
                                    };

                                    let keywordStr = '';
                                    battle.keywords.forEach(keyword => {
                                        console.log(formatKeyword(keyword.type, keyword.displayName));
                                        let displayName;
                                        if (keyword.type == 'LastBreath') {
                                            displayName = 'Last Breath';
                                        }
                                        else if (keyword.type.match(/[A-Z]/g).length < 2) { displayName = keyword.type; }
                                        console.log('🚀 ~ file: farmChannel.js:191 ~ awaitPromise.all ~ keyword', keyword);
                                        keywordStr += `${formatKeyword(keyword.type, displayName)}\n${formatKeywordDesc(keyword.subtype, { ratio: keyword.ratio })}\n\n`;
                                    });
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
                                        eliteStr = `- ${battle.enemyElite.split(':')[0].toUpperCase()}: ${battle.enemyElite.split(':')[1].toUpperCase()}`;
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
                            console.log(row.components);
                            console.log('start repl');
                            if ((activeBattles.data().battles.length + 1) > 3) {
                                return message.reply({ embeds: [activeBattlesListEmbed], components: [activeBattleRow] });
                            }
                            if (eliteCount > 0) enemiesListEmbed.setColor('#8A1DE6');
                            message.reply({ embeds: [enemiesListEmbed, activeBattlesListEmbed], components: [row, activeBattleRow] });
                        }
                        else {
                            if (eliteCount > 0) enemiesListEmbed.setColor('#8A1DE6');
                            message.reply({ embeds: [enemiesListEmbed], components: [row] });
                        }
                    }
                    console.log(hasActiveBattles, 'debug');
                    break;


                case 'ability':
                    message.channel.sendTyping();
                    row.addComponents(battleSelectMenu);
                    if (activeBattles.exists()) {

                        if (activeBattles.data()?.battles.length > 0) {
                            await Promise.all(activeBattles.data().battles.map(async battle => {
                                console.log(battle);
                                const enemy = await getDoc(doc(db, 'Event/Enemies/RegularMonsters/Monsters'));

                                if (enemy.exists()) {
                                    hasActiveBattles = true;
                                    const battleEnemy = enemy.data()[`enemy${battle.enemyId}`];
                                    const checkElite = (stat) => {
                                        if (battle.enemyElite != '0') return (stat == battle.enemyElite.split(':')[0]) ? formatEmoji(Icons.Elite) : '';
                                        return '';
                                    };
                                    activeBattlesListEmbed.addFields(
                                        {
                                            name: bold(underscore(battleEnemy.name)),
                                            value: `\n**Properties:**\n${(battleEnemy?.ability) ? battleEnemy.ability.abilityDesc : 'No special Properties!'}\n\n
                                            **Stats:**\n\n**${battle.enemyAtk}** - ATK ${Icons.ATK} ${checkElite('atk')}\n**${battle.enemyHp}** - Current HP ${Icons.SeventyFivePercentHp} ${checkElite('hp')}\n**${battle.enemySpd}** - SPD ${Icons.SPD} ${checkElite('spd')}\n**${battle.enemyArmor}** - ARMOR ${Icons.Armor} ${checkElite('armor')}\n**${battle.enemyMagicDurability}** - MAGIC DURABILITY ${Icons.MagicDurability} ${checkElite('magicDurability')}\n
                                            \n**__Level:__** ${battleEnemy.minLvl}`,
                                            inline: true,
                                        },
                                    );

                                    let eliteStr;
                                    if (battle.enemyElite != '0') {
                                        eliteStr = `- ${formatEmoji(Icons.Elite)} ${battle.enemyElite.split(':')[0].toUpperCase()}: ${battle.enemyElite.split(':')[1].toUpperCase()}`;
                                    }
                                    const abilityStr = (orbInMsg) ? `-${orbInMsg}` : '';
                                    activeBattleSelectMenu.addOptions(
                                        {
                                            label: `${battleEnemy.name} ${(battle.enemyElite != '0') ? eliteStr : ''}`,
                                            description: (`${(battleEnemy.ability) ? battleEnemy.ability.abilityDesc : 'No special Properties!'}`),
                                            value: `battle-ability-monster-${battle.enemyId}-${battle.enemyUnique}-${activeBattles.data().battles.length}${abilityStr}`,
                                        },
                                    );
                                    return true;
                                }
                            }));
                            // but heres the eeper activeBattles.data().battles.forEach(async battle => {

                            // });

                            const activeBattleRow = new ActionRowBuilder();
                            activeBattleRow.addComponents(activeBattleSelectMenu);
                            return message.reply({ embeds: [activeBattlesListEmbed], components: [activeBattleRow] });
                        }
                    }
                    break;

                case 'ultimate':
                    break;

                default:
                    break;
            }
        }


    },
};