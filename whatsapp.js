const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    console.log('Received message:', message.body);
});

app.post('/send-message', (req, res) => {
    const { phone, body } = req.body;

    client.sendMessage(phone, body).then(response => {
        res.status(200).json({
            status: 'success',
            response
        });
    }).catch(err => {
        res.status(500).json({
            status: 'error',
            message: err.toString()
        });
    });
});

client.initialize();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
