// Handles when the interaction for he command is made
const { Events, MessageFlags } = require('discord.js');

// exports the file
module.exports = {
    // name of the exported module
    name: Events.InteractionCreate,
    // Function for execute
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        // Get the command's name
        const command = interaction.client.commands.get(
            interaction.commandName,
        );

        // If the command doesn't exists, log an error
        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`,
            );
            return;
        }

        // If the command exists, then run the execute function in the command
        try {
            await command.execute(interaction);
        } catch (error) {
            // If it gives an error, then log and return the error as message
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
};
