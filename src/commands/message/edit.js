// Edit a message given the message id
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
			try {
				// Get the allowed roles
				let allowed_roles = await roles.get(message.guild.id);
				// Check if the member has either admin right or
				// is one of the allowed roles for this command
				if (
					message.member.permissions.has(PermissionFlagsBits.Administrator,) ||
					message.member.roles.cache.some((role) => allowed_roles.includes(role))
				) {
					// Get client
					const client = interaction.client;

					// Parse options
					const message_link =
						interaction.options.getString('message-link');
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
				}
			} catch (error) {
				// If something goes wrong log the error and reply with error message
				console.error(error);
				await interaction.reply({
					content: 'Error in editing the message!',
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
					// Receives: Interaction, [["arg1", "arg2", ...]]
					// arg1 is the link
					args = args[0];

					// Get all the informations we need
					const [guild_id, channel_id, message_id] = args
						.shift()
						.slice(29)
						.split('/');

					// Get the original message and the channel
					const channel =
						await message.client.channels.fetch(channel_id);
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
			} catch (error) {
				// If something goes wrong, log the error
				console.error(error);
			}
		}
	},
};
