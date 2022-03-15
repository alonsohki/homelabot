import { Command } from '~/commands';

const dice: Command = {
  validateText: (_me, text) => text.includes('lanza un dado'),
  validateCommand: (_me, command) => command === 'dado',

  run: async (_me, bot, msg) => {
    const n = Math.floor(1 + Math.random() * 6);
    bot.sendMessage(msg.chat.id, `🎲 Lanzando un dado... 🎲 ¡Es un ${n}!`);
  },
};

export default dice;
