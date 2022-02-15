import axios from 'axios';
import { MessageToChatbootDto } from '../DTOs/messageToChatbootDto';
import { ChatDto } from '../DTOs/chatDto';
import { removerFormato } from '../utils/whatsappContacNumbertFormat';

export function sendMessageToChatboot(message: ChatDto): void {
    const urlChatboot = process.env.URL_CHATBOOT_PROCESAR_MSJ;
    message.contactNumber = removerFormato(message.contactNumber);
    message.chatbootNumber = removerFormato(message.chatbootNumber);
    const messageToChatbootDto: MessageToChatbootDto = {
        sender: message.contactNumber + ":" + message.chatbootNumber,
        message: message.message
    }
    axios({
        method: "POST",
        url: urlChatboot,
        data: messageToChatbootDto
    }).then(function (response: { data: any; }) {
        console.log("Se envio mensaje a chatboot para ser procesado", response.data);
    }).catch(e => {
        console.log("Error en el envio de informacion a chatboot." + " URL chatboot: " + urlChatboot + ". ", e);
    });

}