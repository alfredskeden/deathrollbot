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

export const checkDaysLeft = (): number => {
  return Math.floor((new Date('2021-09-28 09:00:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
};

export const checkHoursLeft = (): number => {
  return Math.floor(Math.abs(new Date('2021-09-28 09:00:00').getTime() - new Date().getTime()) / 36e5);
};

export const retardifyString2 = (str: string): string => {
  var splittedString: Array<string> = str.split(` `); // Seperates each word on space

  var fiftyPercentForEachWord: Array<lowHigh> = []; // Initialize the 50% split per word array.

  /** forEach word do a calculation to find out how many upper case and lower case it fits */
  splittedString.forEach((eachString: string) => {
    const randomNumberThisItteration: number = randomNumber(0, 2);
    fiftyPercentForEachWord.push({
      low: randomNumberThisItteration === 0 ? Math.floor(eachString.length / 2) : Math.ceil(eachString.length / 2),
      high: randomNumberThisItteration === 0 ? Math.ceil(eachString.length / 2) : Math.floor(eachString.length / 2),
    }); // Push that into the array
  });

  /** forEach word in array. split on each letter then map those letters. */
  splittedString = splittedString.map((eachString: string, index: number) => {
    return (
      eachString
        .split('')
        .map((each: string) => {
          const lowOrHigh: number = randomNumber(0, 2); // random between 0 and 1

          if (lowOrHigh === 0) {
            // If you cant do more lowercase do an uppercase instead and negate the counter for that
            if (fiftyPercentForEachWord[index].low !== 0) {
              --fiftyPercentForEachWord[index].low;
              each = each.toLowerCase();
            } else {
              --fiftyPercentForEachWord[index].high;
              each = each.toUpperCase();
            }
          } else {
            if (fiftyPercentForEachWord[index].high !== 0) {
              --fiftyPercentForEachWord[index].high;
              each = each.toUpperCase();
            } else {
              --fiftyPercentForEachWord[index].low;
              each = each.toLowerCase();
            }
          }

          // returns the new upper or lowercase letter to the map.
          return each;
        })
        // joins them again on each letter.
        .join('')
    );
  });

  // joins all the splitted
  return splittedString.join(' ');
};

export const retardifyString3 = (str: string): string => {
  var startIndex: number = -1;

  return str
    .split('')
    .map((eachLetter: string) => {
      startIndex = eachLetter === ' ' ? startIndex : startIndex + 1;

      return (eachLetter = startIndex % 2 === 0 ? eachLetter.toLowerCase() : eachLetter.toUpperCase());
    })
    .join('');
};
