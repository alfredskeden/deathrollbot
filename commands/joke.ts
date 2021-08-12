import { MessageEmbed, CommandInteraction } from 'discord.js';

import axios from 'axios';

const embed: MessageEmbed = new MessageEmbed().setColor(`RANDOM`);

const lolGifs: Array<string> = [
  `https://c.tenor.com/wIxFiobxxbIAAAAd/john-jonah-jameson-lol.gif`,
  `https://c.tenor.com/lpeb_wR5a2gAAAAC/day-limns-gifsdayrol.gif`,
  `https://c.tenor.com/fyYfY_rM81sAAAAC/lolol-lol.gif`,
  `https://c.tenor.com/9v8LTDyxiWgAAAAC/the-office-dying-of-laughter.gif`,
  `https://c.tenor.com/0UiTzxP3mjAAAAAC/monkey-rofl.gif`,
  `https://c.tenor.com/bN0hO7r_M40AAAAd/laughing-laughing-hysterically.gif`,
  `https://c.tenor.com/f_7nrJFqCSQAAAAC/hahaha-laughing.gif`,
  `https://c.tenor.com/f1CGJD-uUDMAAAAd/funny-hahaha.gif`,
  `https://c.tenor.com/DbA0zn4QikYAAAAC/pointing-laughing.gif`,
  `https://c.tenor.com/8URhwJp8ZjIAAAAC/friends-phoebe-buffay.gif`,
  `https://c.tenor.com/mx9fNn1S4PwAAAAC/spit-take.gif`,
  `https://c.tenor.com/ISfg1epIVZ0AAAAd/funny-smile.gif`,
];

const getRandomGif = (gifUrls: Array<string>): string => {
  return gifUrls[Math.floor(Math.random() * gifUrls.length)];
};

module.exports = {
  name: 'joke',
  description: 'random programming joke.',
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    axios.get(`https://official-joke-api.appspot.com/jokes/programming/random`).then(async (res) => {
      embed.setTitle(`${res.data[0].setup}`).setDescription(`${res.data[0].punchline}`).setImage(getRandomGif(lolGifs));
      await interaction.reply({ embeds: [embed] });
    });
  },
};
