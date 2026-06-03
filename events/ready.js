// Handles when the bot is ready
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        // When the client is ready, run this code (only once).
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};