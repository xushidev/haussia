// Edit a message given the message id
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit')
        .setDescription('Edits a certain message sent by the bot!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
