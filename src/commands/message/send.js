// Send a message to a certain channel
const {
	SlashCommandBuilder,
	MessageFlags,
	PermissionFlagsBits,
} = require('discord.js');

const { Keyv } = require('keyv');
const { KeyvSqlite } = require('@keyv/sqlite');

// Resolves the path into an absolute path
const path = require('path');
const dbPath = path.resolve(__dirname, '../../data/roles.sqlite');

// Database where role permissione are stored
const roles = new Keyv({
	store: new KeyvSqlite({
		uri: `sqlite://${dbPath}`,
	}),
});

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
	// interaction is Client
	async execute({ interaction, message, args }) {
		// args = ['channel-id message']
		if (interaction) {
			try {
				// Get the allowed roles
				let allowed_roles = await roles.get(interaction.guild.id);
				// Check if the member has either admin right or
				// is one of the allowed roles for this command
				if (
					message.member.permissions.has(PermissionFlagsBits.Administrator,) ||
					message.member.roles.cache.some((role) => allowed_roles.includes(role))
				) {
					// Returns a TextChannel object
					const channel = interaction.options.getChannel('channel');
					const msg = interaction.options.getString('message');

					// Sends the message to the chosen channel
					await channel.send(msg);

					// If everything goes well, return a success message
					await interaction.reply({
						content: 'Message sent!',
						flags: MessageFlags.Ephemeral,
					});
				}
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
				// Get the allowed roles
				let allowed_roles = await roles.get(message.guild.id);
				// Check if the member has either admin right or
				// is one of the allowed roles for this command
				if (
					message.member.permissions.has(PermissionFlagsBits.Administrator,) ||
					message.member.roles.cache.some((role) => allowed_roles.includes(role))
				) {
					// Receives: interaction, [["arg1", "arg2", ...]]
					// unfortunately args come as [["arg"]]
					args = args[0];
					// Get the channel id as first arg
					const arg_channel = args.shift();

					// Detects if the channel is declared with id or mentioned as link
					let channel_id = arg_channel.slice(0, 2) == '<#' ? arg_channel.slice(2, -1) : arg_channel;

					const channel = await message.client.channels.fetch(channel_id);

					// Get the message as 2nd arg (and join them back together)
					const msg = args.join(' ');

					// Sends the message to the channel:
					await channel.send(msg);
				}
			} catch (error) {
				// If something goes wrong, log the error
				console.error(error);
			}
		}
	},
};
