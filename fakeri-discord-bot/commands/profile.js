const { SlashCommandBuilder, EmbedBuilder, chatInputApplicationCommandMention, bold, formatEmoji, underscore, italic, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getFirestore, getDoc, doc } = require('firebase/firestore');

const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { CommandIds } = require('../emums/commandIds.js');
const { Icons } = require('../emums/icons.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const { getAverageColor } = require('fast-average-color-node');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Comando para que veas tu perfil!')
        .addUserOption(option => option.setName('jugador').setDescription('Usuario del que quieres ver el perfil, dejalo en blanco para el tuyo!')),
    async execute(interaction) {
        await profile(interaction);
    },
};


async function profile(interaction) {
    const playerID = interaction.options.getUser('jugador')?.id || interaction.user.id;
    const playerUser = await interaction.guild.members.fetch(playerID);
    const playerInfo = await getDoc(doc(db, playerID, 'PlayerInfo'));

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if (playerInfo.exists()) {
        const playerStats = playerInfo.data().stats;
        const profileEmbed = new EmbedBuilder()
            .setTitle(`Perfil de ${playerUser.displayName}`)
            .setThumbnail(playerUser.displayAvatarURL({ extension: 'jpg' }))
            .setDescription(`Para ver las misiones usa ${chatInputApplicationCommandMention('event', CommandIds.Event)}`);

        const statRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('goldBtn')
                .setLabel(`${playerInfo.data().gold} - Oro`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(Icons.Gold),
            new ButtonBuilder()
                .setCustomId('xpBonusBtn')
                .setLabel(`${playerInfo.data().xpBonus}% - XP Bonus`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji('⬆️'),
            new ButtonBuilder()
                .setCustomId('classBtn')
                .setLabel(`${capitalizeFirstLetter(playerInfo.data().class)} - Clase`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji('💫'),
            new ButtonBuilder()
                .setCustomId('eventPointsBtn')
                .setLabel(`${playerInfo.data().eventPoints} - Puntos Evento`)
                .setStyle(ButtonStyle.Success)
                .setEmoji('✨'),
        );

        await getAverageColor(playerUser.displayAvatarURL({ extension: 'jpg' })).then(color => {
            console.log(color);
            profileEmbed.setColor(color.hex);
        });
        let hpEmoji = '';
        const percentageOfMaxHp = (playerStats.hp / playerStats.maxHp) * 100;
        if (percentageOfMaxHp > 100) { hpEmoji = Icons.MoreThanFullHp; }
        else if (percentageOfMaxHp >= 75) { hpEmoji = Icons.FullHp; }
        else if (percentageOfMaxHp >= 50) { hpEmoji = Icons.SeventyFivePercentHp; }
        else if (percentageOfMaxHp >= 25) { hpEmoji = Icons.FiftyPercentHp; }
        else if (percentageOfMaxHp > 0) { hpEmoji = Icons.TwentyFivePercentHp; }
        else if (playerStats.hp == 0) { hpEmoji = formatEmoji(Icons.DeadHp); }

        const statEmoji = (stat) => {
            switch (stat) {
                case 'hp':
                    return hpEmoji;

                case 'atk':
                    return Icons.ATK;

                case 'mana':
                    return formatEmoji(Icons.Mana);

                case 'armor':
                    return Icons.Armor;

                case 'magicDurability':
                    return Icons.MagicDurability;

                case 'speed':
                    return Icons.SPD;

                default:
                    break;
            }
        };
        const equipped = await getDoc(doc(db, playerID, 'PlayerInfo/Inventory/Equipped'));
        const equipment = await getDoc(doc(db, playerID, 'PlayerInfo/Inventory/Equipment'));
        for (const key in playerStats) {
            if (key == 'maxHp' || key == 'xp') continue;
            let baseStat;
            let itemStat;
            if (equipment.exists()) {
                if (equipped.data().sword?.id) {
                    const stat = (key == 'speed') ? 'spd' : key;
                    baseStat = playerStats[key] - equipment.data().swords[`sword${equipped.data().sword.id}`]?.stats[stat] || undefined;
                    itemStat = equipment.data().swords[`sword${equipped.data().sword.id}`].stats[stat] || undefined;
                }
            }
            if (!baseStat) { baseStat = playerStats[key]; }
            if (!itemStat) { itemStat = 0; }
            console.log(baseStat, key, itemStat);
            profileEmbed.addFields(
                {
                    name: `${key.toUpperCase()}`,
                    value: `${italic(playerStats[key])} ${(key == 'hp') ? '/ ' + bold(playerStats.maxHp) : ''} ${statEmoji(key)}\n\n` + bold(`+${baseStat}`) + ` - ${underscore('Base')}` + bold(`\n+${itemStat}`) + ` - ${underscore('Items\n\n')}`,
                    inline: true,
                },
            );
        }
        interaction.reply({ embeds: [profileEmbed], components: [statRow] });
    }

}