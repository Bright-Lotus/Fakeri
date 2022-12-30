const { getFirestore, doc, getDoc, Timestamp, updateDoc, arrayRemove } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { healthManager } = require('./healthHandler.js');
const { EmbedBuilder } = require('discord.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function timeoutManager(client) {
    const timeoutsSnap = await getDoc(doc(db, 'Event/Timeouts'));
    if (timeoutsSnap.exists()) {
        const timeouts = timeoutsSnap.data().timestamps;
        for await (const timeout of timeouts) {
            const timeoutDate = new Timestamp(timeout.timeoutDate.seconds, timeout.timeoutDate.nanoseconds).toDate();
            const diff = (+Date.now()) - (+timeoutDate);
            switch (timeout.type) {
                case 'revive': {
                    const target = timeout.target;
                    client.users.fetch(target).then(async user => {
                        setTimeout(async (usr, hpManager, Embed, originalTimestamp) => {
                            await hpManager('revive', usr);
                            usr.send({
                                embeds: [
                                    new Embed()
                                        .setTitle('Has revivido!')
                                        .setDescription('Ya puedes usar acciones de nuevo')
                                        .setColor('Green'),
                                ],
                            });
                            await updateDoc(doc(db, 'Event/Timeouts'), {
                                timestamps: arrayRemove({
                                    type: 'revive',
                                    target: usr.id,
                                    timeoutDate: Timestamp.fromMillis(originalTimestamp),
                                }),
                            }, { merge: true });
                        }, Math.abs(diff), user, healthManager, EmbedBuilder, timeoutDate);
                    });
                    return;
                }
                // TODO: Add gift destruction timeout
            }
        }
    }
}

module.exports = { timeoutManager };