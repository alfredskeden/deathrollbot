import { User } from 'discord.js';

export interface ICurrentDeathRoll {
  interactionId: string;
  startedBy: string;
  playerOne: User;
  playerTwo: User;
  startnumber: number;
  currentRoll: number;
  currentPlayer: User;
}

export interface ICommand {
  name: string;
  description: string;
  execute: Function;
}
