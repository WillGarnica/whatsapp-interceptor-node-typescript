import axios from 'axios';
import { removerFormato } from '../utils/whatsappContacNumbertFormat';
import { ChatDto } from '../DTOs/chatDto';

// guarda el chat en BD
// por ahora DynamoDB en AWS
// se envian los datos por llamado HTTP POST
export function persistirChat(chatDto: ChatDto) {
    if (chatDto == null) return;
    chatDto.contactNumber = removerFormato(chatDto.contactNumber);
    chatDto.chatbootNumber = removerFormato(chatDto.chatbootNumber);
    const urlAwsDynamoDB = process.env.URL_AWS_DYNAMODB;
    axios({
        method: "POST",
        url: urlAwsDynamoDB,
        data: chatDto
    }).then(function (response: { data: any; }) {
        console.log("Se persistio chat de forma correcta ", response.data);
    }).catch(e => console.log("Error en persistencia DynamoDB AWS ", e));
}

