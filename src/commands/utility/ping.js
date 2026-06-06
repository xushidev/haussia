const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute({ interaction, message, args }) {
        if (interaction) {
            await interaction.reply('Pong!');
        } else {
            await message.reply('Pong!');
        }
    },
};
