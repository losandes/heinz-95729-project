
import { updateStore } from '../state/user-interaction-store'

import axios,{type AxiosResponse, AxiosError} from 'axios';
import type { Message } from '../typedefs';

export async function sendUserInteraction(latests: Message[], userInput: string){

  axios.get('http://127.0.0.1:8000/api/chat/answer_question',
  {params:{user_input: userInput,
    chat_history: latests
  }})
  .then(function (response: AxiosResponse) {
    // Handle successful response
    const message=response.data.message

    if(response.data.details){

      const book={
        title: response.data.details.title,
        genre: response.data.details.genre,
        cover: response.data.details.cover,
        description: response.data.details.description,
        price: response.data.details.price,
        rating: response.data.details.reting
      }
      updateStore(message, book)
    }else{
      updateStore(message, null)
    }
  })
  .catch(function (error: AxiosError) {
    // Handle error
    return updateStore(error.message,null);
  });
}
