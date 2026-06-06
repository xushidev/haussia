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
            option
                .setName('message')
                .setDescription('The message to be sent')
                .setRequired(true),
        ),
    async execute({ interaction, message, args }) {
        // args = ['channel-id message']
        if (interaction) {
            // Returns a TextChannel object
            const channel = interaction.options.getChannel('channel');
            const msg = interaction.options.getString('message');

            // Sends the message to the chosen channel
            await channel.send(msg);
        } else {
            // Receives: interaction, ["arg1", "arg2", ...]

            // unfortunately args come as [["arg"]]
            args = args[0];

            // Get the channel id as first arg
            const channelId = args.shift();
            const channel = await message.client.channels.fetch(channelId);

            // Get the message as 2nd arg (and join them back together)
            const msg = args.join(' ');

            // Sends the message to the channel:
            await channel.send(msg);
        }
    },
};
