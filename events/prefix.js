// Module to check for prefix
const { Events } = require('discord.js');
const { globalPrefix } = require('../config.json');


module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        // If the prefix sent is by a bot, then do nothing
        if (message.author.bot) return;
        
        let args;

        // handle messages in a guild
        if (message.guild) {
            let prefix;

            if (message.content.startsWith(globalPrefix)) {
                prefix = globalPrefix;
            }
            /*else {
                // check the guild-level prefix
                const guildPrefix = await prefixes.get(message.guild.id);
                if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
            }*/

            // if we found a prefix, setup args; otherwise, this isn't a command
            if (!prefix) return;
            args = message.content.slice(prefix.length).trim().split(/\s+/);
            // h!test 1 2 3 -> ["test", '1', '2', '3']
        } else {
            // handle DMs
            const slice = message.content.startsWith(globalPrefix)
                ? globalPrefix.length
                : 0;
            args = message.content.slice(slice).split(/\s+/);
        }

        // get the first space-delimited argument after the prefix as the command
        const command = args.shift().toLowerCase();
        // h!test 1 2 3 -> "test"
    },
};
