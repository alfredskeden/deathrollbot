import { CommandInteraction } from 'discord.js';

module.exports = {
  name: 'weather',
  description: 'Fetches the weather from an api!',
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    await interaction.reply({
      content: `https://wttr.in/${interaction.options.get('location').value}.png?format=v2&lang=sv`,
    });
  },
};
