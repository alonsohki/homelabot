import TelegramBot from 'node-telegram-bot-api';
import hola from '~/commands/hola';
import powerOn from '~/commands/powerOn';

export type Command = {
  validateCommand: (me: TelegramBot.User, command: string) => boolean;
  validateText: (me: TelegramBot.User, text: string) => boolean;
  run: (
    me: TelegramBot.User,
    bot: TelegramBot,
    msg: TelegramBot.Message
  ) => Promise<void>;
};

const parseBotDirectCommand = (
  me: TelegramBot.User,
  msg: TelegramBot.Message
): string | null => {
  const text = msg.text;
  if (!text || text.length === 0) return null;

  const regex = new RegExp(`^\/(?<command>.+)@${me.username}$`);
  const match = text.match(regex);
  return match?.groups.command || null;
};

const commands: Command[] = [hola, powerOn];

export default async (
  me: TelegramBot.User,
  bot: TelegramBot,
  msg: TelegramBot.Message
): Promise<void> => {
  if (!msg.text) return;

  const text = msg.text.substring(2 + me.username.length).toLowerCase();
  const directCommand = parseBotDirectCommand(me, msg)?.toLowerCase();

  commands
    .filter(
      (cmd) =>
        cmd.validateText(me, text) ||
        (directCommand && cmd.validateCommand(me, directCommand))
    )
    .forEach((cmd) => cmd.run(me, bot, msg));
};
