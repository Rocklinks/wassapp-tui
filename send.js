const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const MESSAGE = `Test`;

const NUMBERS = [
  '91',
  '91',
];

const DELAY = 3000;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { executablePath: '/usr/bin/brave' }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('Ready. Sending...');
  for (const number of NUMBERS) {
    const num = number.replace(/\D/g, '');
    if (!num) continue;
    const id = num.concat('@c.us');
    try {
      await client.sendMessage(id, MESSAGE);
      console.log('Sent: ' + num);
    } catch(e) {
      console.log('Failed: ' + num + ' ' + e.message);
    }
    await new Promise(r => setTimeout(r, DELAY));
  }
  console.log('Done.');
  process.exit(0);
});

client.on('auth_failure', () => { console.log('Auth failed'); process.exit(1); });
client.initialize();
