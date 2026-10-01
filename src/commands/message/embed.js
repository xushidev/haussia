// Send a message to a certain channel
const {
	SlashCommandBuilder,
	MessageFlags,
	PermissionFlagsBits,
	Embed,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Sends an embed message to a specific channel')
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
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute({ interaction, message, args }) {
		// args = ['channel-id message']
		if (interaction) {
			try {
				// Returns a TextChannel object
				const channel = interaction.options.getChannel('channel');
				const msg = interaction.options.getString('message');

				// Sends the message to the chosen channel
				await channel.send({
					embeds: [new Embed({ description: msg }).toJSON()]
				});

				// If everything goes well, return a success message
				await interaction.reply({
					content: 'Message sent!',
					flags: MessageFlags.Ephemeral,
				});
			} catch (error) {
				// If something goes wrong, log an error and return an error message
				console.error(error);
				await interaction.reply({
					content: 'Error in sending the message',
					flags: MessageFlags.Ephemeral,
				});
			}
		} else {
			try {
				if (
					message.member.permissions.has(
						PermissionFlagsBits.Administrator,
					)
				) {
					// Receives: interaction, [["arg1", "arg2", ...]]
					// unfortunately args come as [["arg"]]
					args = args[0];
					// Get the channel id as first arg
					const arg_channel = args.shift();

					// detect if the channel is given with #channel_name or is given as id
					let channel_id = arg_channel.slice(0, 2) == '<#' ? arg_channel.slice(2, -1) : arg_channel;

					const channel = await message.client.channels.fetch(channel_id);

					// Get the message as 2nd arg (and join them back together)
					const msg = args.join(' ');

					// Sends the embed to the channel:
					await channel.send({ embeds: [new Embed({ description: msg }).toJSON()] });
				}
			} catch (error) {
				// If something goes wrong, log the error
				console.error(error);
			}
		}
	},
};
