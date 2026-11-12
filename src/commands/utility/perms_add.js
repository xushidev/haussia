const { SlashCommandBuilder, MessageFlags } = require('discord.js');

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
		.setName('perms_add')
		.setDescription('Add the roles for who can use the bot')
		.addRoleOption((option) => option
			.setName("role")
			.setDescription("Role to give the permission to.")
			.setRequired(true)),
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
					// get the role we need
					let role = interaction.options.getRole("role");

					// if it is already present, then we are just gonna add the role to it
					if (await roles.get(role.guild.id)) {
						let present_roles = await roles.get(role.guild.id);
						// if the list already has a role, then we just reply saying that it's already in the database
						if (present_roles.includes(role.id)) {
							await interaction.reply({
								content: "Role already present in the database",
								flags: MessageFlags.Ephemeral
							});
						} else {
							// Else we can just push the new value to the database
							present_roles.push(role.id);
							await roles.set(role.guild.id, present_roles);
							await interaction.reply({
								content: "Successfully added " + role.name + " to the list of roles that can use the bot",
								flags: MessageFlags.Ephemeral
							});
						}
					} else {
						// else we just create the list
						let new_roles = [role.id];
						roles.set(role.guild.id, new_roles);
						await interaction.reply({
							content: "Successfully created the database and added " + role.name + " to the list of roles that can use the bot",
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
					// ["role1", "role2"]
					args = args[0];
					let existing_roles = [];

					// Fetch all the roles with their id
					let all_roles = await message.guild.roles.fetch();
					all_roles.each((role) => {
						existing_roles.push(role.id);
					});
					// Filter the roles and take only those who are actually server roles
					args = args.filter((role) => {
						return existing_roles.includes(role);
					});

					args.forEach(async (role) => {
						// if it is already present, then we are just gonna add the role to it
						if (await roles.get(message.guild.id)) {
							let present_roles = await roles.get(message.guild.id);
							// if the list already has a role, then we just reply saying that it's already in the database
							if (!present_roles.includes(role)) {
								// We can just push the new value to the database
								// If it doesn't exist inside of it already
								present_roles.push(role);
								await roles.set(message.guild.id, present_roles);
							}
						} else {
							// else we just create the list
							let new_roles = [role];
							roles.set(message.guild.id, new_roles);
						}
					});
					// reply with success
					await message.reply("Successfully added new roles to the database.");
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
