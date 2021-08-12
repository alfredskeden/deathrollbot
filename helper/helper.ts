import { InteractionReplyOptions } from 'discord.js';

export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * max) + min;
};

export const getRandomStringFromArray = (stringArray: Array<string>): string => {
  return stringArray[Math.floor(Math.random() * stringArray.length)];
};

export const errorReply: InteractionReplyOptions = {
  content: 'There was an error while executing this command!',
  ephemeral: true,
};
