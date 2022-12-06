const { getFirestore, doc, getDocs, collection, updateDoc, getDoc, arrayRemove } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { Events } = require('discord.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: Events.MessageReactionRemove,
    once: false,
    execute: async function(reaction, user) {
        // When a reaction is received, check if the structure is partial
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            }
            catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        if (user.bot) return;

        // Now the message has been cached and is fully available
        // The reaction is now also fully available and the properties will be reflected accurately:
        const channels = await getDoc(doc(db, 'Event/GiftDrops'));
        if (channels.exists()) {
            if (!channels.data()?.activeDrop) return;

            const activeDrop = channels.data().activeDrop;
            activeDrop.messages.forEach(async msg => {
                if (reaction.message.id == msg) {
                    reaction.message.react('🫳');
                    await updateDoc(doc(db, 'Event/GiftDrops'), {
                        ['activeDrop.progress']: (activeDrop.pendingRewards.length - 1 < 0) ? 0 : activeDrop.pendingRewards.length - 1,
                    }, { merge: true });
                    await updateDoc(doc(db, 'Event/GiftDrops'), {
                        ['activeDrop.pendingRewards']: arrayRemove(user.id),
                    }, { merge: true });
                }
            });
        }
    },
};