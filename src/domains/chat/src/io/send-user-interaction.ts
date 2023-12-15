import { updateStore } from '../state/user-interaction-store'

import axios,{type AxiosResponse, AxiosError} from 'axios';
import type { Message } from '../typedefs';

export async function sendUserInteraction(latests: Message[], userInput: string){

  console.log(latests.length)

  axios.get('http://127.0.0.1:8000/api/chat/answer_question',
  {params:{user_input: userInput,
    chat_history: latests
  }})
  .then(function (response: AxiosResponse) {
    // Handle successful response

    console.log(response.data)

    const message=response.data.data.message
    if(response.data.data.details){
      console.log(response.data.data.details)
      const book={
        title: response.data.data.details.related_book_name,
        cover: response.data.data.details.image_link,
        description: response.data.data.details.book_description,
        price: response.data.data.details.price,
        rating: response.data.data.details.rating
      }
      updateStore(message, book)
    }else{

    }
  })
  .catch(function (error: AxiosError) {
    // Handle error
    return updateStore(error.message,null);
  });
}
