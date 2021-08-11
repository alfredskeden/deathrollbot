import {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  CommandInteraction,
  MessageButton,
  MessageSelectOptionData,
} from 'discord.js';

const messageSelectOptionData: Array<MessageSelectOptionData> = [
  {
    label: `stuff`,
    value: `ok`,
    description: `fuck off`,
    emoji: `💩`,
    default: false,
  },
  {
    label: `stuff2`,
    value: `heeeelloooo`,
    description: `fuck offddd`,
    emoji: `💩`,
    default: false,
  },
];

const row1: MessageActionRow = new MessageActionRow().addComponents(
  new MessageSelectMenu()
    .addOptions(messageSelectOptionData)
    .setCustomId('This is a test message')
);

const row2: MessageActionRow = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId('applyButton')
    .setLabel('ok')
    .setStyle('SECONDARY')
);

const embed: MessageEmbed = new MessageEmbed()
  .setColor('#DB664F')
  .setDescription(`This is a test message.`);

module.exports = {
  name: 'test',
  description: 'Starts the testing command.',
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;
    await interaction.reply({
      ephemeral: true,
      embeds: [embed],
      components: [row1, row2],
    });
  },
};
