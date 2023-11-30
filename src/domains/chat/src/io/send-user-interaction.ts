// src/domains/chat/src/io/send-user-interaction.ts

// import { z } from 'zod'
// import { env } from '@lib/env'
// import { join, useFetch } from '@lib/fetch'
import { addBotMessage, useChatStore } from '../state/user-interaction-store'

import axios,{type AxiosResponse, AxiosError} from 'axios';

export async function sendUserInteraction(userInput: string){
  // Here we should send the user input to your chatbot (AI) service and get a response.
  // For now, I mocked response.  we have to change this with the response of AI  service
  console.log("xxx")
  console.log(userInput)
  axios.get('http://127.0.0.1:8000/api/chat/answer_question', {params:{user_input: userInput }})
  .then(function (response: AxiosResponse) {
    // Handle successful response
    addBotMessage(response.data.message)
  })
  .catch(function (error: AxiosError) {
    // Handle error
    return addBotMessage(error.message);
  });


  // const [
  //   error,
  //   loading,
  //   fetchStatus
  // ] = useFetch<String>(
  //   join(env.PUBLIC_API_ORIGIN, '/api/answer_question'),
  //   z.string(),
  //   (response) => { addBotMessage(response.toString()) },
  // )
}
