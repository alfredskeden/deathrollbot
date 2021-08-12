import { ApplicationCommandData } from 'discord.js';

export const weatherCommandData: ApplicationCommandData = {
  name: 'weather',
  description: 'Shows the weather of the location you specify.',
  options: [
    {
      name: 'location',
      type: 'STRING',
      description: 'Where do you want the weather from?',
      required: true,
    },
  ],
};

export const testCommandData: ApplicationCommandData = {
  name: 'test',
  description: 'Starts the testing command.',
};

export const jokeCommandData: ApplicationCommandData = {
  name: 'joke',
  description: 'random programming joke.',
};

export const deathrollCommandData: ApplicationCommandData = {
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
