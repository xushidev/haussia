
const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

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
		.setName('perms_show')
		.setDescription('Shows which role can use the bot'),
	async execute({ interaction, message, args }) {
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
					// Args is useless, we are just gonna show the list of roles and that's it
					if (await roles.get(interaction.guild.id)) {
						let role_list = await roles.get(interaction.guild.id);
						let reply = "Roles with permissions:\n"
						role_list.forEach(role => {
							let resolved_role = interaction.guild.roles.resolve(role);
							reply += `${resolved_role.name} (${resolved_role.id})\n`;
						});
						await interaction.reply({
							content: reply,
							flags: MessageFlags.Ephemeral
						});
					} else {
						await interaction.reply({
							content: "No roles were added for this server.",
							flags: MessageFlags.Ephemeral
						});
					}
				}
			} catch (error) {
				// Error handling
				console.log("Error occured during permission adding: ", error);
				await interaction.reply({
					contents: "Error during permission setting",
					flags: MessageFlags.Ephemeral
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
					// Args is useless, we are just gonna show the list of roles and that's it
					if (await roles.get(message.guild.id)) {
						let role_list = await roles.get(message.guild.id);
						let reply = "Roles with permissions:\n"
						role_list.forEach(role => {
							let resolved_role = message.guild.roles.resolve(role);
							reply += `${resolved_role.name} (${resolved_role.id})\n`;
						});
						await message.reply(reply);
					} else {
						await message.reply("No roles were added for this server.");
					}
				}
			} catch (error) {
				// Error handling
				console.log("Error occured during permission adding: ", error);
				await interaction.reply({
					contents: "Error during permission setting",
					flags: MessageFlags.Ephemeral
				});
			}
		}
	},
};
