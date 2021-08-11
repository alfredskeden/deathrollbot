const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'deathroll',
	description: 'Starts a deahtroll against two players.',
	async execute(interaction) {

        if (!interaction.isCommand()) return;

        const hoistedOptions = interaction.options._hoistedOptions;

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Roll')
					.setStyle('PRIMARY'),
			);

        const embed = new MessageEmbed()
        .setColor('#DB664F')
        .setDescription(`${interaction.user.username} started a deathroll with the players ${hoistedOptions[0].user.username} and ${hoistedOptions[1].user.username}. Starting with the number ${hoistedOptions[2].value}. <@${hoistedOptions[0].user.id}> please use the button bellow to start the roll.`);

        await interaction.reply({ embeds: [embed], components: [row] });
	},
};