import { proto } from "@adiwajshing/baileys/WAProto";
import { ChatDto } from "../DTOs/chatDto";
import { persistirChat } from "../persistencia/persistirChats";
import { sendMessageToChatboot } from "../chatBoot/sendMessageToChatBoot";

export function listenEvents(sock: any): void {
    sock.ev.on('messages.upsert', (m: { messages: proto.IWebMessageInfo[]; type: string; }) => {
        console.log("se recibe mensaje...");

        if (!m) {
            console.log("Objeto 'm' nulo o vacio. Finaliza metodo")
            return;
        }
        const messages: proto.IWebMessageInfo[] = m.messages;

        if (!validacionesMensaje(messages, m.type)) {
            return;
        }

        console.log("mensaje cumple con requisitos para procesar en chatBoot...");
        console.log(JSON.stringify(messages, undefined, 2));

        const message: proto.IWebMessageInfo = messages[0];

        const chatDto: ChatDto = {
            contactNumber: message.key.remoteJid,
            message: message.message.conversation,
            messagefromChatboot: false,
            chatbootNumber: sock.user.id
        };
        sendMessageToChatboot(chatDto);
        persistirChat(chatDto);
    });
}

/**
 *
 * @param m validaciones al mensaje entrante
 * @returns true validado correcto, false incorrecto
 */
function validacionesMensaje(messages: proto.IWebMessageInfo[], type: string) {

    // solo se procesan mensages de typo 'notify'
    if (!type || type !== 'notify') {
        console.log("type message is null or is not 'notify'. Finaliza metodo");
        return false;
    }

    // debe existir un mensaje entrante
    if (!messages || !messages[0]) {
        console.log("Objeto messages nulo o vacio");
        return false;
    }

    const message: proto.IWebMessageInfo = messages[0];

    if (!message.message || !message.message.conversation) {
        console.log("no existe un message.conversation. Finaliza metodo")
        return false;
    }

    // debe existir un remoteJid (el que envia el mensaje), de lo contrario finaliza el metodo
    if (!message.key || !message.key.remoteJid) {
        console.log("no existe un message.key.remoteJid. Finaliza metodo")
        return false;
    }

    // para evitar que se dispare mensajes del mismo numero del chatboot
    if (message.key.fromMe === true) {
        console.log("message.key.fromMe is true. Finaliza metodo")
        return false;
    }

    // para evitar que se publiquen estados
    if (message.key.remoteJid === 'status@broadcast') {
        console.log("message.broadcast is true. Finaliza metodo")
        return false;
    }
    return true;
}
