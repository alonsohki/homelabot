import fetch from 'node-fetch';
import https from 'https';
import QS from 'query-string';
import TelegramBot from 'node-telegram-bot-api';
import { ensureEnv } from '../ensureEnv';
import { Command } from '~/commands';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const ipmiUrl = ensureEnv('IPMI_URL');
const [username, password] = ensureEnv('IPMI_CREDENTIALS').split(':');

const powerOn: Command = {
  validateText: (_me, text) => text.includes('enciende el servidor'),
  validateCommand: (_me, command) => command === 'encender',

  run: async (
    _me: TelegramBot.User,
    bot: TelegramBot,
    msg: TelegramBot.Message
  ) => {
    bot.sendMessage(msg.chat.id, 'Encendiendo el servidor...');
    const loginRequest = await fetch(`${ipmiUrl}/api/session`, {
      method: 'post',
      body: QS.stringify({ username, password, certlogin: 0 }),
      agent: httpsAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });

    const sessionId = loginRequest.headers
      .get('set-cookie')
      .match(/^QSESSIONID=(?<sessionId>[^;]+); path=\/$/).groups.sessionId;
    const response = await loginRequest.json();
    const { CSRFToken } = response;

    const powerOnRequest = await fetch(`${ipmiUrl}/api/actions/power`, {
      method: 'post',
      body: JSON.stringify({ power_command: 1 }),
      agent: httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFTOKEN': CSRFToken,
        Cookie: `QSESSIONID=${sessionId}`,
      },
    });

    if (powerOnRequest.status === 200) {
      bot.sendMessage(
        msg.chat.id,
        'Servidor encendido correctamente. Estará disponible en un par de minutos.'
      );
    } else {
      bot.sendMessage(
        msg.chat.id,
        `Error encendiendo el servidor (${
          powerOnRequest.status
        }): ${await powerOnRequest.text()}`
      );
    }
  },
};

export default powerOn;
