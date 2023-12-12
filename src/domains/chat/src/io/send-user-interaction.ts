
import { updateStore, useChatStore } from '../state/user-interaction-store'

import axios,{type AxiosResponse, AxiosError} from 'axios';
import {Book} from '../typedefs';

export async function sendUserInteraction(userInput: string){

  const messages=useChatStore((state)=>(state.messages))
  const len=messages.length;
  const latests=[];
  if(len<6){
    for(let i=0; i<len; i++){
      latests[i]=messages[i]
    }
  }else{
    for(let i=0; i<6;i++){
      latests[i]=messages[len-6+i]
    }
  }

  axios.get('http://127.0.0.1:8000/api/chat/answer_question',
  {params:{user_input: userInput,
    chat_history: latests
  }})
  .then(function (response: AxiosResponse) {
    // Handle successful response
    const message=response.data.message

    if(response.data.details){

      const book=Book.parse({
        title: response.data.details.related_book_name,
        cover: response.data.details.image_link,
        description: response.data.details.book_description,
        price: response.data.details.price,
        rating: response.data.details.rating,
        checkout: response.data.details.checkout
      })
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
