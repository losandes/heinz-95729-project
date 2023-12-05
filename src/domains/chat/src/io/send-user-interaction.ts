
import { addBotMessage, useChatStore } from '../state/user-interaction-store'

import axios,{type AxiosResponse, AxiosError} from 'axios';

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

  axios.get('http://localhost:8000/answer_question',
  {params:{user_input: userInput,
    chat_history: latests}})
  .then(function (response: AxiosResponse) {
    // Handle successful response
    addBotMessage(response.data.message)
  })
  .catch(function (error: AxiosError) {
    // Handle error
    return addBotMessage(error.message);
  });
}
