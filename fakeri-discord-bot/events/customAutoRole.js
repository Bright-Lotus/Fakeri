module.exports = {
    name: 'messageReactionAdd',
    once: false,
    execute: async function (reaction, user) {
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
        if (reaction.me) return;
        // El Observador: 📰
        // El Mega Observador: 🔭
        // UFOLogy: 🛸
        if (reaction.message.content.includes('Para empezar a participar') && reaction.message.author.id == '743521074884640809') {
            if (reaction.emoji.name == '📰') {
                const role = reaction.message.guild.roles.cache.find((role) => role.name.includes('El Observador'));
                if (role) {
                    reaction.message.guild.members.cache.get(user.id).roles.add(role);
                }
            }
            if (reaction.emoji.name == '🔭') {
                const role = reaction.message.guild.roles.cache.find((role) => role.name.includes('El Mega Observador'));
                if (role) {
                    reaction.message.guild.members.cache.get(user.id).roles.add(role);
                }
            }
            if (reaction.emoji.name == '🛸') {
                const role = reaction.message.guild.roles.cache.find((role) => role.name.includes('UFOLogy'));
                if (role) {
                    reaction.message.guild.members.cache.get(user.id).roles.add(role);
                }
            }
        }
    },
};