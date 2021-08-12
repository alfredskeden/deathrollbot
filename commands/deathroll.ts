import { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction } from 'discord.js';

const row: MessageActionRow = new MessageActionRow().addComponents(new MessageButton().setCustomId('primary').setLabel('Roll').setStyle('PRIMARY'));

const embed: MessageEmbed = new MessageEmbed().setColor('#DB664F');

module.exports = {
  name: 'deathroll',
  description: 'Starts a deahtroll against two players.',
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    embed.setDescription(
      `${interaction.user.username} started a deathroll with the players ${interaction.options.get('playerone').user.username} and ${
        interaction.options.get('playertwo').user.username
      }. Starting with the number ${interaction.options.get('startnumber').value}. <@${interaction.options.get('playerone').user.id}> please use the button bellow to start the roll.`
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
