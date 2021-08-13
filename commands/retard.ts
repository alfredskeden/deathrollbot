import { CommandInteraction } from 'discord.js';
import { retardifyString3 } from '../helper/helper';

module.exports = {
  name: `retard`,
  description: `Transforms a string to retard text.`,
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    await interaction.reply({ content: `<@${interaction.user.id}> said in retard: ${retardifyString3(interaction.options.get('thestring').value as string)}` });
  },
};
