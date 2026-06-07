// Edit a message given the message id
const { SlashCommandBuilder, MessageFlags } = require('discord.js');

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
            // Get client
            const client = interaction.client;

            // Parse options
            const message_link = interaction.options.getString('message-link');
            const msg = interaction.options.getString('message');

            // message link structure: https://discord.com/channels/{guild-id}/{channel-id}/{message-id}
            // 29 characters + {guild-id}/{channel-id}/{message-id}
            const [guild_id, channel_id, message_id] = message_link
                .slice(29)
                .split('/');

            // We don't really need the guild_id as we can simply fetch from the channel
            const channel = await client.channels.fetch(channel_id);
            await channel.messages
                .fetch(message_id)
                .then((message) => {
                    message.edit(msg);
                })
                .catch((err) => {
                    console.error(err);
                });
            
            // If everything goes well, return
            await interaction.reply({ content: "Message edited!", flags: MessageFlags.Ephemeral})
        } else {
        }
    },
};
