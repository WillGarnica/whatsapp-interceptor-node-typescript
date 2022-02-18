import { removerFormato } from "../utils/whatsappContacNumbertFormat";
import { ChatDto } from "../DTOs/chatDto";
import { MessageFromChatbootDto } from "../DTOs/messageFromChatbootDto";
import { persistirChat } from "../persistencia/persistirChats";

export async function enviarMsjWhatsapp(msj: MessageFromChatbootDto, sock: any) {
    try {
        if (!msj || !msj.recipient_id) {
            console.log("mensaje invalido para ser enviado", msj);
            return;
        }
        let contactNumber = msj.recipient_id.split(":")[0];
        contactNumber = removerFormato(contactNumber);

        // se valida que al numero al cual se desea enviar el mensaje sea un numero whatsapp valido
        const [result] = await sock.onWhatsApp(contactNumber);
        if (!result || !result.exists || !result.jid) {
            console.error("el numero de contacto: " + contactNumber + " no es un numero de whatsapp valido. No se envia mensaje");
            return;
        }
        sock.sendMessage(result.jid, { text: msj.text });

        const chatDto: ChatDto = {
            contactNumber: contactNumber,
            message: msj.text,
            messagefromChatboot: true,
            chatbootNumber: sock.user.id
        };

        persistirChat(chatDto);
    } catch (e) {
        console.log("Error al enviar msj whatsapp", e);
    }

}