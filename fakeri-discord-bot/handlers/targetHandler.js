const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, formatEmoji, bold, underscore } = require('discord.js');
const { pagination } = require('../handlers/paginationHandler.js');

const { Icons } = require('../emums/icons.js');
const { ability } = require('./abilityHandler.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
function formatKeyword(keyword, displayName) {
    console.log('🚀 ~ file: farmChannel.js:13 ~ formatKeyword ~ keyword', keyword, displayName);
    if (keyword == 'ability') keyword = 'Ability';
    return `**${hyperlink(displayName, 'https://fakeri.parcel.app/keywords/' + keyword.toLowerCase())}** ${formatEmoji(Icons[keyword])}`;
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

        default:
            break;
    }
}
async function targetHandler(interaction, args) {
    await interaction.deferReply();

    const values = interaction.values[0].split('-');
    const activeBattles = await getDoc(doc(db, interaction.user.id, 'ActiveBattles'));
    const abilityID = (args?.filter) ? values[4] : values[3];
    const target = (args?.filter) ? values[3] : values[4];
    const activeBattlesListEmbed = new EmbedBuilder()
        .setTitle('Your active battles')
        .setColor('Red');
    console.log('🚀 ~ file: targetHandler.js:16 ~ targetHandler ~ values', target, abilityID);

    const activeBattleSelectMenu = new SelectMenuBuilder();
    activeBattleSelectMenu.setCustomId(`battleFlow-selectMenu-activeBattle/${interaction.user.id}`).setPlaceholder('Target a enemy already in battle...');
    switch (target) {
        case 'enemy': {
            if (activeBattles.exists()) {

                if (activeBattles.data()?.battles.amount > 0) {
                    await Promise.all(Object.values(activeBattles.data().battles).filter(element => (typeof element != 'number')).map(async battle => {
                        console.log(battle);
                        const enemy = await getDoc(doc(db, 'Event/Enemies/RegularMonsters/Monsters'));

                        if (enemy.exists()) {
                            const battleEnemy = enemy.data()[`enemy${battle.enemyId}`];
                            const checkElite = (stat) => {
                                if (battle.enemyElite != '0') return (stat == battle.enemyElite.split(':')[0]) ? formatEmoji(Icons.Elite) : '';
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
                            let eliteStr;
                            if (battle.enemyElite != '0') {
                                eliteStr = `- ${formatEmoji(Icons.Elite)} ${battle.enemyElite.split(':')[0].toUpperCase()}: ${battle.enemyElite.split(':')[1].toUpperCase()}`;
                            }
                            const abilityStr = (abilityID) ? `-${abilityID}` : '';
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

                    const activeBattleRow = new ActionRowBuilder();
                    activeBattleRow.addComponents(activeBattleSelectMenu);
                    return interaction.editReply({ embeds: [activeBattlesListEmbed], components: [activeBattleRow] });
                }
            }
            break;
        }
        case 'ally': {
            const players = await getDoc(doc(db, 'Event/Players'));
            const usersArray = [];
            console.log(abilityID, 'targetHandler.js');
            if (players.exists()) {
                for await (const user of players.data().members) {
                    const playerStats = await (await getDoc(doc(db, user.id, 'PlayerInfo'))).data().stats;
                    await interaction.client.users.fetch(user.id).then(usr => {
                        usersArray.push({ id: usr.id, playerHp: playerStats.hp, playerMaxHp: playerStats.maxHp, name: usr.username, abilityID: abilityID });
                    });
                }
                let sortedArray = usersArray.sort((a, b) => {
                    return a.playerHp - b.playerHp;
                });
                if (args?.filter) {
                    sortedArray = sortedArray.filter(element => element.name.match(args.match) != null);
                }
                const btnLabel = (args?.filter) ? `Filtro: ${args?.match.toString().substring(args?.match.toString().indexOf('[') + 1, args?.match.toString().indexOf(']'))}` : 'Filtrar';
                const filterRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`filterButton-abiilty-target-${target}-${abilityID}`)
                        .setStyle(ButtonStyle.Primary)
                        .setLabel(btnLabel)
                        .setEmoji('🔎'),
                );
                await pagination('allyTarget', sortedArray, 1, interaction.user, { arraySorted: true }).then(async results => {
                    await interaction.editReply({ embeds: [results.embed], components: [results.paginationRow, filterRow, results.selectMenuRow] });
                });
            }
            break;
        }
        case 'self': {
            await ability(abilityID, -1, interaction.user).then(async results => {
                const orbEmbed = new EmbedBuilder()
                    .setTitle('Has usado el orbe seleccionada')
                    .setColor('Blue')
                    .setDescription(`${bold('Mana restante:')} ${results.manaRemaining} ${formatEmoji(Icons.Mana)}`);
                await interaction.editReply({ embeds: [orbEmbed] });
            }).catch(async results => {
                await interaction.editReply({ embeds: [results.manaEmbed] });
            });
            break;
        }
    }
}

module.exports = { targetHandler };