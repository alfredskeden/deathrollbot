require('dotenv').config();

import * as fs from 'fs';
import axios from 'axios';
import { Client, Collection, Intents, MessageButton, ApplicationCommandData, ButtonInteraction, CommandInteraction, Message, MessageActionRow, MessageEmbed, SelectMenuInteraction } from 'discord.js';

import { randomNumber, errorReply, checkDaysLeft, checkHoursLeft } from './helper/helper';
import { ICurrentDeathRoll, ICommand } from './helper/interfaces';
import { retardCommandData, deathrollCommandData, jokeCommandData, testCommandData, weatherCommandData } from './helper/slashcommands';

const tempToken = {
  access_token: '',
  expires_in: 4757717,
  token_type: 'bearer',
};

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const commands = new Collection<unknown, ICommand>();

const commandFiles = fs.readdirSync('./dist/commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

const currentDeathrolls: Array<ICurrentDeathRoll> = [];

client.once('ready', () => {
  console.log('Ready!');
});

var counter: number = 86400000;

const printHoursLeftTheMessage = async (message: Message) => {
  await message.channel.send(`<@&${process.env.NOTIFY_GROUP}> det är ${checkDaysLeft()} dagar och ${checkHoursLeft()} timmar kvar tills New World släpps på PC.`);
};

const printHoursLeftMessageNoIntervall = (message: Message) => {
  printHoursLeftTheMessage(message);
};

const printHoursLeftMessage = (message: Message) => {
  printHoursLeftTheMessage(message);
  setTimeout(printHoursLeftMessage, counter * (checkDaysLeft() / 10), message);
};

/** For each message */
client.on('messageCreate', async (message: Message) => {
  if (!client.application?.owner) await client.application?.fetch();

  if (message.author.id === client.application?.owner.id) {
    if (message.content.toLowerCase() === '!deploydeathroll') {
      await client.guilds.cache.get(message.guild.id)?.commands.create(deathrollCommandData);
    }

    if (message.content.toLowerCase() === '!deploytest') {
      await client.guilds.cache.get(message.guild.id)?.commands.create(testCommandData);
    }

    if (message.content.toLowerCase() === '!deployweather') {
      await client.guilds.cache.get(message.guild.id)?.commands.create(weatherCommandData);
    }

    if (message.content.toLowerCase() === '!deployjoke') {
      await client.guilds.cache.get(message.guild.id)?.commands.create(jokeCommandData);
    }

    if (message.content.toLowerCase() === '!deployretard') {
      await client.guilds.cache.get(message.guild.id)?.commands.create(retardCommandData);
    }

    if (message.content.toLowerCase() === '!startcountdown') {
      printHoursLeftMessageNoIntervall(message);

      setTimeout(printHoursLeftMessage, counter, message);
    }

    if (message.content.toLowerCase() === '!gtt') {
      axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`).then((res) => {
        console.log(res);
      });
    }

    if (message.content.toLowerCase() === '!testgetnewworld') {
      axios
        .post(`https://api.igdb.com/v4/games`, `fields *; where id = 24654;`, {
          headers: {
            Accept: 'application/json',
            'Client-ID': `${process.env.TWITCH_CLIENT_ID}`,
            Authorization: `Bearer ${tempToken.access_token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

/** interaction for SelectMenu */
client.on('interactionCreate', async (interaction: SelectMenuInteraction) => {
  if (!interaction.isSelectMenu()) return;

  console.log(interaction);
});

/** Interaction for buttons */
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

/** Interaction for slash commands */
client.on('interactionCreate', async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  if (!commands.has(interaction.commandName)) return;

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

    await commands.get(interaction.commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply(errorReply);
  }
});

client.login(process.env.TOKEN);
