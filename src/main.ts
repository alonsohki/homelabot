import TelegramBot from 'node-telegram-bot-api';
import { ensureEnv } from '~/ensureEnv';
import commands from '~/commands';

const externalAddress = ensureEnv('EXTERNAL_ADDRESS');
const token = ensureEnv('TELEGRAM_TOKEN');
const port = ensureEnv('PORT');

const botOpts = {
  webHook: {
    port: +port,
    key: 'ssl/server-key.pem',
    cert: 'ssl/server-cert.pem',
  },
};

const bot = new TelegramBot(token, botOpts);
bot.setWebHook(`${externalAddress}/bot${token}`, {
  certificate: botOpts.webHook.cert,
});

(async () => {
  const me = await bot.getMe();
  if (!me.username) {
    throw new Error('The Telegram bot must have a username');
  }

  bot.on('message', async (msg) => {
    await commands(me, bot, msg);
  });
})();
