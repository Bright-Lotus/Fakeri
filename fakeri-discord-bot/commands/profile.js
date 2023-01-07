const { SlashCommandBuilder, EmbedBuilder, chatInputApplicationCommandMention, bold, formatEmoji, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { CommandIds } = require('../emums/commandIds.js');
const { Icons } = require('../emums/icons.js');

const { getFirestore, getDoc, doc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const { getAverageColor } = require('fast-average-color-node');
const { Utils } = require('../utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Comando para que veas tu perfil!')
        .addUserOption(option => option.setName('jugador').setDescription('Usuario del que quieres ver el perfil, dejalo en blanco para el tuyo!')),
    async execute(interaction) {
        await profile(interaction);
    },
    async contextMenuExecute(interaction, args) {
        await profile(interaction, args);
    },
};


async function profile(interaction, args) {
    await interaction.deferReply();
    let playerID = interaction.options.getUser('jugador')?.id || interaction.user.id;
    if (args?.contextMenu) {
        playerID = interaction.targetId;
    }
    const playerUser = await interaction.guild.members.fetch(playerID);
    const playerInfo = await getDoc(doc(db, playerID, 'PlayerInfo'));
    let displayName = playerUser.displayName;

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if (playerInfo.exists()) {
        if (interaction.user.id == '407225705051455491') {
            displayName = 'Ashe';
        }
        const playerStats = playerInfo.data().stats;
        const profileEmbed = new EmbedBuilder()
            .setTitle(`Perfil de ${displayName}`)
            .setThumbnail(playerUser.displayAvatarURL({ extension: 'jpg' }))
            .setDescription(bold(playerInfo.data().instructor.level.titleName));

        const extraData = new EmbedBuilder()
            .setTitle('Informacion Adicional')
            .setColor('Blurple')
            .setDescription('_ _');

        extraData.addFields(
            { name: `Experiencia ${formatEmoji(Icons.LevelUp)}`, value: `${playerInfo.data().stats.xp} / ${bold(playerInfo.data().nextLvlXpGoal)}\n _ _` },
            { name: 'Estrellas Instructor 🌟', value: `${playerInfo.data().instructor.level.currentStars} / ${bold(playerInfo.data().instructor.level.starsForNextTitle)}\n _ _` },
            { name: `Nivel Jugador ${Icons.Level}`, value: `${playerInfo.data().playerLvl} / ${bold(100)}\n _ _` },
        );

        const statRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`goldBtn-${playerInfo.data().gold}`)
                .setLabel(`${Utils.NumberFormatWithLetter(playerInfo.data().gold)} - Oro`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(Icons.Gold),
            new ButtonBuilder()
                .setCustomId('manaBtn')
                .setLabel(`${playerInfo.data().stats.mana} - Mana Actual`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(Icons.Mana),
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
                .setCustomId(`eventPointsBtn-${playerInfo.data().eventPoints}`)
                .setLabel(`${Utils.NumberFormatWithLetter(playerInfo.data().eventPoints)} - Puntos Evento`)
                .setStyle(ButtonStyle.Success)
                .setEmoji('✨'),
        );

        await getAverageColor(playerUser.displayAvatarURL({ extension: 'jpg' })).then(color => {
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
                case 'hp': return hpEmoji;
                case 'atk': return Icons.ATK;
                case 'manaPerAttack': return formatEmoji(Icons.Mana);
                case 'armor': return Icons.Armor;
                case 'magicDurability': return Icons.MagicDurability;
                case 'speed': return Icons.SPD;
                case 'magicStrength': return Icons.MagicStrength;

                default:
                    break;
            }
        };
        const equipped = await getDoc(doc(db, playerID, 'PlayerInfo/Inventory/Equipped'));
        const equipment = await getDoc(doc(db, playerID, 'PlayerInfo/Inventory/Equipment'));
        for (const key in playerStats) {
            if (key == 'maxHp' || key == 'xp' || key == 'mana') continue;
            let baseStat;
            let itemStat;
            if (equipment.exists()) {
                if (equipped.data().sword?.id) {
                    const stat = (key == 'speed') ? 'spd' : key;
                    baseStat = playerStats[ key ] - equipment.data().swords[ `sword${equipped.data().sword.id}` ]?.stats[ stat ] || undefined;
                    itemStat = equipment.data().swords[ `sword${equipped.data().sword.id}` ].stats[ stat ] || undefined;
                }
            }
            if (!baseStat) { baseStat = playerStats[ key ]; }
            if (!itemStat) { itemStat = 0; }
            console.log(baseStat, key, itemStat);
            profileEmbed.addFields(
                {
                    name: `${Utils.FormatStatName(key)}`,
                    value: `${playerStats[ key ]} ${(key == 'hp') ? '/ ' + bold(playerStats.maxHp) : ''} ${statEmoji(key)}\n\n` + bold(`+${baseStat}`) + '  | Base' + bold(`\n+${itemStat}`) + '  | Items\n\n',
                    inline: true,
                },
            );
        }
        interaction.editReply({ embeds: [ profileEmbed, extraData ], components: [ statRow ] });
    }

}