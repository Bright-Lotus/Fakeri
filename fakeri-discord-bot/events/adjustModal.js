const { Events, userMention } = require('discord.js');
const { getFirestore, doc, updateDoc, increment, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId.includes('adjust-item')) {
            // If the user isn't Luis or Ze, return
            if (interaction.user.id != '773971453392584755' && interaction.user.id != '949025108897448046' && interaction.user.id != '1011657604822474873') {
                const errorEmbed = ErrorEmbed(EventErrors.NotEnoughPermissions, `Solo ${userMention('773971453392584755')} y ${userMention('1011657604822474873')} pueden usar este comando!`);
                return interaction.reply({ embeds: [ errorEmbed ] });
            }
            const idSplit = interaction.customId.split('-');
            const category = idSplit[ 2 ];
            const itemName = idSplit[ 3 ];
            const action = idSplit[ 4 ];
            await interaction.reply(`\`\`\`[${new Date().toISOString()}] Adjusting item...\nOperation: ${action.toUpperCase()}\`\`\``);

            const values = interaction.fields.getTextInputValue('adjustValues').split(',');
            const shopInventory = await (await getDoc(doc(db, '/Event/Shop/ShopInventory/items'))).data();
            for await (const [ itemID, item ] of Object.entries(shopInventory[ category ])) {
                if (item.name.includes(itemName)) {
                    switch (category) {
                        case 'swords': {
                            const atk = values[ 0 ].split(':')[ 1 ].trim();
                            const spd = values[ 1 ].split(':')[ 1 ].trim();
                            await updateDoc(doc(db, '/Event/Shop/ShopInventory/items'), {
                                [ `${category}.${itemID}.stats.atk` ]: increment((action == 'buff') ? atk : -atk),
                                [ `${category}.${itemID}.stats.spd` ]: increment((action == 'buff') ? spd : -spd),
                            }, { merge: true });

                            const players = await getDoc(doc(db, 'Event/Players'));
                            if (players.exists()) {
                                for await (const player of players.data().members) {
                                    const equipped = await (await getDoc(doc(db, player.id, 'PlayerInfo/Inventory/Equipped'))).data();
                                    if (equipped?.sword?.id) {
                                        const swordID = equipped.sword.id;
                                        const equipment = await (await getDoc(doc(db, player.id, 'PlayerInfo/Inventory/Equipment'))).data().swords;
                                        const sword = equipment[ `sword${swordID}` ];
                                        if (sword.name.includes(itemName)) {
                                            await updateDoc(doc(db, player.id, 'PlayerInfo'), {
                                                [ 'stats.atk' ]: increment(-sword.stats.atk),
                                                [ 'stats.speed' ]: increment(-sword.stats.spd),
                                            }, { merge: true });

                                            await updateDoc(doc(db, player.id, 'PlayerInfo/Inventory/Equipment'), {
                                                [ `swords.sword${swordID}.stats.atk` ]: increment((action == 'buff') ? atk : -atk),
                                                [ `swords.sword${swordID}.stats.spd` ]: increment((action == 'buff') ? spd : -spd),
                                            }, { merge: true });

                                            await updateDoc(doc(db, player.id, 'PlayerInfo'), {
                                                [ 'stats.atk' ]: increment(sword.stats.atk - ((action == 'buff') ? -atk : atk)),
                                                [ 'stats.speed' ]: increment(sword.stats.spd - ((action == 'buff') ? -spd : spd)),
                                            }, { merge: true });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            await interaction.followUp(`\`\`\`[${new Date().toISOString()}] Item adjusted.\`\`\``);
        }
    },
};