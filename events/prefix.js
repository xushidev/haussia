// Module to check for prefix
const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        // If the prefix sent is by a bot, then do nothing
        if (message.author.bot) return;

        console.log('prefix.js triggered by ' + message.content);

        if (message.content.startsWith('!ha')) {
            console.log('prefix found');
            // Test for channel fetching
            // message.client.channels.fetch('').then(channel => console.log(channel.name)).catch(console.error)
        }

        /*
        let args;

        // handle messages in a guild
        if (message.guild) {
            let prefix;

            if (message.content.startsWith(globalPrefix)) {
                prefix = globalPrefix;
            } else {
                // check the guild-level prefix
                const guildPrefix = await prefixes.get(message.guild.id);
                if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
            }

            // if we found a prefix, setup args; otherwise, this isn't a command
            if (!prefix) return;
            args = message.content.slice(prefix.length).trim().split(/\s+/);
        } else {
            // handle DMs
            const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
            args = message.content.slice(slice).split(/\s+/);
        }

        // get the first space-delimited argument after the prefix as the command
        const command = args.shift().toLowerCase();
        */
    },
};
