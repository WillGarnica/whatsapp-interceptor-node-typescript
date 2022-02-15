import makeWASocket, { DisconnectReason, useSingleFileAuthState } from '@adiwajshing/baileys';
import { Boom } from '@hapi/boom';
import { listenEvents } from './listenEvents';

export function connectToWhatsApp() {
    console.log("inicia connectToWhatsApp");
    const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')
    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state
    });
    sock.ev.on('creds.update', saveState);
    sock.ev.on('connection.update', (update) => {
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
    });
    listenEvents(sock);
    return sock;
}
