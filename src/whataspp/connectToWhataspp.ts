import makeWASocket, { DisconnectReason, useSingleFileAuthState } from '@adiwajshing/baileys';
import { Boom } from '@hapi/boom';
import { listenEvents } from './listenEvents';
import qr from "qr-image";

export function connectToWhatsApp() {
    console.log("inicia connectToWhatsApp");
    const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')
    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state,
        version: [2, 2204, 13] // solucion error 405 https://github.com/adiwajshing/Baileys/issues/1246
    });
    sock.ev.on('creds.update', saveState);
    sock.ev.on('connection.update', (update) => {

        /* si existe un qr se actualiza la imagen qr-code.svg*/
        if (update && update.qr) {
            let qr_svg = qr.image(update.qr, { type: 'svg', margin: 4 });
            qr_svg.pipe(require('fs').createWriteStream('./src/resources/qr-code.svg'));
        }

        console.log("Se actualizo la coneccion");
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if (shouldReconnect) {
                console.log("Se intenta reconectar con whatsapp");
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }

        listenEvents(sock);
    });

    return sock;
}