const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');


module.exports = {
	name: 'roll',
	async execute(interaction, currentDeathRoll) {

        if (!interaction.isCommand()) return;
        if (!interaction.user.bot) return;
        if (!interaction.user.id === '874258630873071617') return;

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Next roll')
					.setStyle('PRIMARY'),
			);

            const embed = new MessageEmbed()
			.setColor('#0099ff')
            .setTitle('Deathroll')
			.setDescription(`${interaction.user.username} started a deathroll with the players ${hoistedOptions[0].user.username} and ${hoistedOptions[1].user.username}. Starting with number ${hoistedOptions[2].value}. <@${hoistedOptions[0].user.id}> please use the button bellow to roll.`);

        await interaction.reply({ embeds: [embed], components: [row] });
	},
};