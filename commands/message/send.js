// Send a message to a certain channel
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Sends a message to a specific channel')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('The channel to send the message into')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('message').setRequired(true),
        ),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
