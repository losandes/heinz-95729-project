// src/domains/chat/src/state/user-interaction-store.ts
// this function is used to send the user input to the chatbot service and get the response
// and update the conversation state with the response
import { useState } from 'react';
import { sendUserInteraction } from '../io/send-user-interaction';
import { create } from 'zustand';
import { Sender, type Message } from '../typedefs';

type ChatStore = Readonly<{
  messages: Message[];
  loading: boolean
}>

export const useChatStore = create<ChatStore>()(() => (
  {
    loading:false,
    messages: [{
      sender:Sender.Bot,
      text:'Nice to meet you. Please ask a question related to a book.'}]
  })
)

export const askQuestion = (input:string) => {
  // record the new inputs and set the loading to true
  addUserMessage(input)
  // fetch reponse from api and set loading to true
  // callBack: add the response to chatStore and set the loading to false
  sendUserInteraction(input)

}

const addUserMessage = (message: string) => {
  // add user's message
  const newMessage: Message={
    sender: Sender.User,
    text:message
  }
  useChatStore.setState((state) => ({
    messages:[...state.messages,newMessage],
    loading:true
  }))
}

export const addBotMessage = (message: string) => {
  const newMessage: Message={
    sender: Sender.Bot,
    text:message
  }
  useChatStore.setState((state) => ({
    messages:[...state.messages,newMessage],
    loading:false
  }))
}
