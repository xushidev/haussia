// Edit a message given the message id
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit')
        .setDescription('Edits a certain message sent by the bot!')
        .addStringOption((option) =>
            option
                .setName('message-link')
                .setDescription('The link of the message to be edited')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('message')
                .setDescription('The message to be replaced with')
                .setRequired(true),
        ),
    async execute({ interaction, message, args }) {
        if (interaction) {
            const message_id = interaction.options.getString('message-link');
            const message = interaction.options.getString('message');


        } else {

        }
    },
};
