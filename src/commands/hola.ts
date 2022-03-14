import { Command } from '~/commands';

const hola: Command = {
  validateCommand: (_me, command) => command === 'hola',
  validateText: (_me, text) => text === 'hola',
  run: async (me, bot, msg) => {
    bot.sendMessage(msg.chat.id, `¡Hola @${msg.from?.username}`);
  },
};

export default hola;
