import TelegramBot from 'node-telegram-bot-api';
import powerOnCommand from './powerOnCommand';

export default async (
  me: TelegramBot.User,
  bot: TelegramBot,
  msg: TelegramBot.Message
): Promise<void> => {
  if (!msg.text) return;

  const text = msg.text.substring(2 + me.username.length);

  if (text.toLocaleLowerCase() === 'hola') {
    bot.sendMessage(msg.chat.id, `¡Hola @${msg.from.username}!`);
  } else if (text.toLocaleLowerCase().includes('enciende el servidor')) {
    await powerOnCommand(me, bot, msg);
  }
};
