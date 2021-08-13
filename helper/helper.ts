import { InteractionReplyOptions } from 'discord.js';
import { lowHigh } from './interfaces';

export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * max) + min;
};

export const getRandomStringFromArray = (stringArray: Array<string>): string => {
  return stringArray[Math.floor(Math.random() * stringArray.length)];
};

export const errorReply: InteractionReplyOptions = {
  content: `There was an error while executing this command!`,
  ephemeral: true,
};

export const retardifyString = (str: string): string => {
  const str2 = str.split(``).map((str22: string) => {
    str22 = randomNumber(1, 2) === 1 ? str22.toUpperCase() : str22.toLowerCase();
    return str22;
  });
  return str2.join(``);
};

export const retardifyString2 = (str: string): string => {
  var splittedString: Array<string> = str.split(` `); // ?

  var fiftyPercentForEachWord: Array<lowHigh> = [];

  splittedString.forEach((eachString: string) => {
    const randomNumberThisItteration: number = randomNumber(0, 2);
    const fifty = {
      low: randomNumberThisItteration === 0 ? Math.floor(eachString.length / 2) : Math.ceil(eachString.length / 2),
      high: randomNumberThisItteration === 0 ? Math.ceil(eachString.length / 2) : Math.floor(eachString.length / 2),
    };
    fiftyPercentForEachWord.push(fifty);
  });

  splittedString = splittedString.map((eachString: string, index) => {
    return eachString
      .split('')
      .map((each: string) => {
        const lowOrHigh = randomNumber(0, 2);

        if (lowOrHigh === 0) {
          if (fiftyPercentForEachWord[index].low !== 0) {
            fiftyPercentForEachWord[index].low = fiftyPercentForEachWord[index].low - 1;
            each = each.toLowerCase();
          } else {
            fiftyPercentForEachWord[index].high = fiftyPercentForEachWord[index].high - 1;
            each = each.toUpperCase();
          }
        } else {
          if (fiftyPercentForEachWord[index].high !== 0) {
            fiftyPercentForEachWord[index].high = fiftyPercentForEachWord[index].high - 1;
            each = each.toUpperCase();
          } else {
            fiftyPercentForEachWord[index].low = fiftyPercentForEachWord[index].low - 1;
            each = each.toLowerCase();
          }
        }

        return each;
      })
      .join('');
  });

  return splittedString.join(' ');
};

export const retardifyString3 = (str: string): string => {
  var startIndex: number = -1;

  return str
    .split('')
    .map((eachLetter: string) => {
      startIndex = eachLetter === ' ' ? startIndex : startIndex + 1;

      return (eachLetter = startIndex % 2 === 0 ? eachLetter.toUpperCase() : eachLetter.toLowerCase());
    })
    .join('');
};
