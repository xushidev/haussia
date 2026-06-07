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
            
            // Edit the message in the channel
            await channel.messages
                .fetch(message_id)
                .then((message) => {
                    message.edit(msg);
                })
                .catch((err) => {
                    console.error(err);
                });

            // If everything goes well, return a success message
            await interaction.reply({
                content: 'Message edited!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            //! Todo: should wrap everything into a try catch later

            // Receives: Interaction, [["arg1", "arg2", ...]]
            // arg1 is the link
            args = args[0];

            // Get all the informations we need
            const [guild_id, channel_id, message_id] = args
                .shift()
                .slice(29)
                .split('/');
            
            // Get the original message and the channel
            const channel = await message.client.channels.fetch(channel_id);
            const msg = args.join(' ');

            await channel.messages
                .fetch(message_id)
                .then((message) => {
                    message.edit(msg);
                })
                .catch((err) => {
                    console.error(err);
                });
            
            // Since message.reply doesn't seem to have an ephemeral option, don't return anything
            
            //// If everything goes well, return
            //await message.reply({
            //    content: 'Message edited!',
            //    flags: MessageFlags.Ephemeral,
            //});
        }
    },
};
