require('dotenv').config();

import * as fs from 'fs';
import {
  ApplicationCommandData,
  ButtonInteraction,
  ColorResolvable,
  CommandInteraction,
  Guild,
  Interaction,
  InteractionReplyOptions,
  Message,
  MessageActionRow,
  MessageEmbed,
  MessagePayload,
  SelectMenuInteraction,
  User,
} from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
const { Client, Collection, Intents, MessageButton } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new Collection();

const errorReply: InteractionReplyOptions = {
  content: 'There was an error while executing this command!',
  ephemeral: true,
};

interface ICurrentDeathRoll {
  interactionId: string;
  startedBy: string;
  playerOne: User;
  playerTwo: User;
  startnumber: number;
  currentRoll: number;
  currentPlayer: User;
}

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const currentDeathrolls: Array<ICurrentDeathRoll> = [];

client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', async (message: Message) => {
  if (!client.application?.owner) await client.application?.fetch();

  var commandData: ApplicationCommandData;
  var commandBuilder: any;

  if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
    commandData = {
      name: 'deathroll',
      description: 'Starts a deahtroll against two players.',
      options: [
        {
          name: 'playerone',
          type: 'USER',
          description: 'Player to start the deathroll.',
          required: true,
        },
        {
          name: 'playertwo',
          type: 'USER',
          description: 'Second player to roll.',
          required: true,
        },
        {
          name: 'startnumber',
          type: 'INTEGER',
          description: 'The start integer.',
          required: true,
        },
      ],
    };
  }

  if (message.content.toLowerCase() === '!deploytest' && message.author.id === client.application?.owner.id) {
    commandData = {
      name: 'test',
      description: 'Starts the testing command.',
    };
  }

  if (message.content.toLowerCase() === '!deployweather' && message.author.id === client.application?.owner.id) {
    commandBuilder = new SlashCommandBuilder()
      .setName('weather')
      .setDescription('Fetches the weather from an api!')
      .addStringOption((option) => {
        return option.setName('location').setDescription('Where do you want to check the weather?').setRequired(true);
      });
  }

  console.log('Deployment of done!');

  await client.guilds.cache.get(message.guild.id)?.commands.create(commandData ? commandData : commandBuilder);
});

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * max) + min;
};

client.on('interactionCreate', async (interaction: SelectMenuInteraction) => {
  if (!interaction.isSelectMenu()) return;

  console.log(interaction);
});

client.on('interactionCreate', async (interaction: ButtonInteraction) => {
  if (!interaction.isButton()) return;

  const deathRollIndex: number = currentDeathrolls.findIndex(
    (currentDeathRoll) =>
      currentDeathRoll.interactionId ===
      (interaction.message.interaction?.id ||
        // @ts-ignore
        interaction.message.reference?.messageId)
  );
  const tempDeathRoll: ICurrentDeathRoll = currentDeathrolls[deathRollIndex];

  if (deathRollIndex === -1) return;

  try {
    if (!(interaction.user === tempDeathRoll.currentPlayer)) return;

    const newRandomRoll: number = randomNumber(1, tempDeathRoll.currentRoll);

    if (newRandomRoll === 1) {
      const embed: MessageEmbed = new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle('Roll')
        .setDescription(`${tempDeathRoll.currentPlayer.username} rolls **${newRandomRoll}** (1-${tempDeathRoll.currentRoll}).\n\nAnd loses the Death Roll - GG!`);

      await interaction.reply({ embeds: [embed] }).then(() => {
        currentDeathrolls[deathRollIndex] = {
          interactionId: '',
          startedBy: tempDeathRoll.startedBy,
          playerOne: tempDeathRoll.playerOne,
          playerTwo: tempDeathRoll.playerTwo,
          startnumber: tempDeathRoll.startnumber,
          currentRoll: newRandomRoll,
          currentPlayer: tempDeathRoll.playerOne,
        };
      });
    } else {
      const row: MessageActionRow = new MessageActionRow().addComponents(new MessageButton().setCustomId('primary').setLabel('Next roll').setStyle('PRIMARY'));

      const embed: MessageEmbed = new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle('Roll')
        .setDescription(`${tempDeathRoll.currentPlayer.username} rolls **${newRandomRoll}** (1-${tempDeathRoll.currentRoll}).`);

      await interaction
        .reply({
          content: `<@${tempDeathRoll.currentPlayer.id === tempDeathRoll.playerOne.id ? tempDeathRoll.playerTwo.id : tempDeathRoll.playerOne.id}>`,
          embeds: [embed],
          components: [row],
        })
        .then(() => {
          currentDeathrolls[deathRollIndex] = {
            interactionId: interaction.message.id,
            startedBy: tempDeathRoll.startedBy,
            playerOne: tempDeathRoll.playerOne,
            playerTwo: tempDeathRoll.playerTwo,
            startnumber: tempDeathRoll.startnumber,
            currentRoll: newRandomRoll,
            currentPlayer: tempDeathRoll.currentPlayer.id === tempDeathRoll.playerOne.id ? tempDeathRoll.playerTwo : tempDeathRoll.playerOne,
          };
        });
    }
  } catch (error) {
    console.error(error);
    await interaction.reply(errorReply);
  }
});

client.on('interactionCreate', async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  if (!client.commands.has(interaction.commandName)) return;

  try {
    if (interaction.commandName === 'deathroll') {
      if (interaction.options.get('playerone').user.bot || interaction.options.get('playertwo').user.bot) return;

      currentDeathrolls.push({
        interactionId: interaction.id,
        startedBy: interaction.user.username,
        playerOne: interaction.options.get('playerone').user,
        playerTwo: interaction.options.get('playertwo').user,
        startnumber: interaction.options.get('startnumber').value as number,
        currentRoll: interaction.options.get('startnumber').value as number,
        currentPlayer: interaction.options.get('playerone').user,
      });
    }

    await client.commands.get(interaction.commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply(errorReply);
  }
});

client.login(process.env.TOKEN);
