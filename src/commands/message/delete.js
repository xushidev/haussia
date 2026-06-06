// Delete a message given the message id
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Deletes a certain message sent by the bot!')
        .addStringOption((option) =>
            option
                .setName('message-link')
                .setDescription('The link of the message to be deleted')
                .setRequired(true),
        ),
    async execute({ interaction, message, args }) {
        await interaction.reply('Pong!');
    },
};
