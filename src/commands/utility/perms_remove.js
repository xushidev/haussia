
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
		.setName('perms_remove')
		.setDescription('Remove the roles for who can use the bot')
		.addRoleOption((option) => option
			.setName("role")
			.setDescription("Role to remove the permission from.")
			.setRequired(true)),
	async execute({ interaction, message, args }) {
		if (interaction) {
			try {
				// get the role we need
				let role = interaction.options.getRole("role");

				// First check if the roles for the guild even exist or not
				if (await roles.get(role.guild.id)) {
					let present_roles = await roles.get(role.guild.id);
					// Check if the role given exists in the list or not
					if (present_roles.includes(role.id)) {
						// If the role is present inside the list,
						// then remove the role and rewrite it
						let new_roles = present_roles.filter((present_role) => {
							return !(role.id == present_role);
						});
						await roles.set(role.guild.id, new_roles);
						await interaction.reply({
							content: "Role removed from the database",
							flags: MessageFlags.Ephemeral
						});
					} else {
						// If the role doesn't exist inside the list,
						// then reply that it doesn't exist
						await interaction.reply({
							content: "Role isn't in the database",
							flags: MessageFlags.Ephemeral
						})
					}
				} else {
					// if there is no list for the guild, then just reply that it doesn't exist
					await interaction.reply({
						content: "No roles for the guild",
						flags: MessageFlags.Ephemeral
					})
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
				// first check if the list even exists or not
				if (await roles.get(message.guild.id)) {
					// if the list exists,
					// then we can check if it the role is inside there or not
					let present_roles = await roles.get(message.guild.id);
					if (present_roles.includes(role)) {
						// If the role is in the list,
						// then we can filter it out
						let new_roles = present_roles.filter((present_role) => {
							return !(role == present_role);
						});
						await roles.set(message.guild.id, new_roles);
					}
					// else we don't do anything
				}
				// if the list doesn't exist, 
				// then we don't do anything
			});

				// finally, reply with success if all went well.
				await message.reply("Removed roles from database");
		}
	},
};
