import express from 'express';
import * as bodyParser from 'body-parser';
import { enviarMsjWhatsapp } from './whataspp/enviarMensajeWhatsapp';
import { MessageFromChatbootDto } from './DTOs/messageFromChatbootDto';
import { connectToWhatsApp } from './whataspp/connectToWhataspp';
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Servidor arriba!');
});

const sockWhatsapp = connectToWhatsApp();

// pendiente separar funcionalidades
app.post('/whatsapp/chat', (request, response) => {
    console.log("objeto request.body: ", request.body)
    const messageFromChatbootDto: MessageFromChatbootDto = request.body;
    enviarMsjWhatsapp(messageFromChatbootDto, sockWhatsapp);
    response.send("Successful");
});

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});


