require('dotenv').config();

import * as fs from 'fs';
const { Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

import { Message, User } from "discord.js";

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

interface ICurrentDeathRoll {
    interactionId: string,
    startedBy: string,
    playerOne: User,
    playerTwo: User,
    startnumber: number,
    currentRoll: number,
    currentPlayer: User
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

const currentDeathrolls: Array<ICurrentDeathRoll> = [];

client.on('messageCreate', async (message: Message) => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
		const data = {
			name: 'deathroll',
			description: 'Starts a deahtroll against two players.',
			options: [{
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
			}],
		};

		await client.guilds.cache.get(process.env.WALLA_ID)?.commands.create(data);

		console.log("Deployment done!");
	}
});

const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * max) + min;
}

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isButton()) return;

    const deathRollIndex = currentDeathrolls.findIndex(currentDeathRoll => currentDeathRoll.interactionId === (interaction.message.interaction?.id || interaction.message.reference?.messageId));
    const tempDeathRoll = currentDeathrolls[deathRollIndex];

    if (deathRollIndex === -1) return;

    try {
        if (!(interaction.user === tempDeathRoll.currentPlayer)) return;

        const newRandomRoll: number = randomNumber(1, tempDeathRoll.currentRoll);

        if (newRandomRoll === 1) {
            const embed = new MessageEmbed()
			.setColor('#0099ff')
            .setTitle('Roll')
			.setDescription(`${tempDeathRoll.currentPlayer.username} rolls **${newRandomRoll}** (1-${tempDeathRoll.currentRoll}).\n\nAnd loses the Death Roll - GG!`);

            await interaction.reply({ embeds: [embed] }).then(() => {
                currentDeathrolls[deathRollIndex] = {
                    interactionId: "",
                    startedBy: tempDeathRoll.startedBy,
                    playerOne: tempDeathRoll.playerOne,
                    playerTwo: tempDeathRoll.playerTwo,
                    startnumber: tempDeathRoll.startnumber,
                    currentRoll: newRandomRoll,
                    currentPlayer: tempDeathRoll.playerOne
                };
            });
        } else {
            const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Next roll')
					.setStyle('PRIMARY'),
			);

            const embed = new MessageEmbed()
			.setColor('#0099ff')
            .setTitle('Roll')
			.setDescription(`${tempDeathRoll.currentPlayer.username} rolls **${newRandomRoll}** (1-${tempDeathRoll.currentRoll}).`);
        
            await interaction.reply({content: `<@${(tempDeathRoll.currentPlayer.id === tempDeathRoll.playerOne.id) ? tempDeathRoll.playerTwo.id : tempDeathRoll.playerOne.id}>`, embeds: [embed], components: [row] }).then(() => {
            currentDeathrolls[deathRollIndex] = {
                interactionId: interaction.message.id,
                startedBy: tempDeathRoll.startedBy,
                playerOne: tempDeathRoll.playerOne,
                playerTwo: tempDeathRoll.playerTwo,
                startnumber: tempDeathRoll.startnumber,
                currentRoll: newRandomRoll,
                currentPlayer: (tempDeathRoll.currentPlayer.id === tempDeathRoll.playerOne.id) ? tempDeathRoll.playerTwo : tempDeathRoll.playerOne
            };
        });
        }
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (!client.commands.has(interaction.commandName)) return;

    if (interaction.options._hoistedOptions[0].user.bot || interaction.options._hoistedOptions[1].user.bot) return;

	try {
        currentDeathrolls.push({
            interactionId: interaction.id,
            startedBy: interaction.user,
            playerOne: interaction.options._hoistedOptions[0].user,
            playerTwo: interaction.options._hoistedOptions[1].user,
            startnumber: interaction.options._hoistedOptions[2].value,
            currentRoll: interaction.options._hoistedOptions[2].value,
            currentPlayer: interaction.options._hoistedOptions[0].user
        })

		await client.commands.get(interaction.commandName).execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.TOKEN);