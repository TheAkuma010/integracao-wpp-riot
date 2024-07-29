const { Client, LocalAuth, Poll, PollVote } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const wwebVersion = '2.2412.54';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-gpu', ],
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
});

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.initialize();

let pairingCodeRequested = false;
client.on('qr', async (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });

    // paiuting code example
    const pairingCodeEnabled = false;
    if (pairingCodeEnabled && !pairingCodeRequested) {
        const pairingCode = await client.requestPairingCode('5521989877248'); // enter the target phone number
        console.log('Pairing code enabled, code: '+ pairingCode);
        pairingCodeRequested = true;
    }
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
    console.log('READY');
    const debugWWebVersion = await client.getWWebVersion();
    console.log(`WWebVersion = ${debugWWebVersion}`);

    client.pupPage.on('pageerror', function(err) {
        console.log('Page error: ' + err.toString());
    });
    client.pupPage.on('error', function(err) {
        console.log('Page error: ' + err.toString());
    });
    
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

    if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } else if (msg.body === '!ping') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'pong');
    } else if (msg.body === '!sendpoll') {
        await msg.reply(new Poll('Winter or Summer', ['Winter', 'Summer']));
    } else if (msg.body === '!sendpoll2') {
        const poll = new Poll('Which pet do you prefer?', ['Cat', 'Dog']);
        const msgPoll = await client.sendMessage('5521996773500@c.us', poll);
    }
});

client.on('vote_update', (vote) => {
    /** The vote that was affected: */
    console.log(vote);
});