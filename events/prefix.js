// Module to check for prefix
const { Events } = require('discord.js');
const { globalPrefix } = require('../config.json');


module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
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
        const commandName = args.shift().toLowerCase();
        // h!test 1 2 3 -> "test"

        // run commands based on the name
        // Get the command's name
        const command = message.client.commands.get(
            commandName
        );
        // If the command doesn't exists, log an error
        if (!command) {
            console.error(
                `No command matching ${commandName} was found.`,
            );
            return;
        }

        // If the command exists, then run the execute function in the command
        try {
            await command.execute(message);
        } catch (error) {
            // If it gives an error, then log and return the error as message
            console.error(error);
            if (message.replied || message.deferred) {
                await message.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await message.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

    },
};
