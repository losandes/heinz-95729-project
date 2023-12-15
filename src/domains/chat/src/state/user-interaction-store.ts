// src/domains/chat/src/state/user-interaction-store.ts
// this function is used to send the user input to the chatbot service and get the response
// and update the conversation state with the response

import { sendUserInteraction } from '../io/send-user-interaction';
import { create } from 'zustand';
import { Sender, type Message, type Book } from '../typedefs';

type ChatStore = Readonly<{
  messages: Message[];
  loading: boolean;
  book: Book|null|undefined;
}>

export const useChatStore = create<ChatStore>()(() => (
  {
    loading:false,
    messages: [{
      sender:Sender.Bot,
      text:'Nice to meet you. Please ask a question related to a book.'}],
    book: null
  })
)

export const askQuestion = (input:string, latests: Message[]) => {
  // record the new inputs and set the loading to true
  addUserMessage(input)
  // fetch reponse from api and set loading to true
  // callBack: add the response to chatStore and set the loading to false

  sendUserInteraction(latests, input)
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

const addBotMessage=(message:string) => {
  const newMessage: Message={
    sender: Sender.Bot,
    text:message
  }
  useChatStore.setState((state) => ({
    messages:[...state.messages,newMessage]
  }))
}

const updateBook = (newBook:Book)=>{
  useChatStore.setState(() => ({
    book:newBook
  }))
}

const endLoading=()=>{
  useChatStore.setState(() => ({
    loading:false
  }))
}

export const updateStore = (message: string, book:Book|null|undefined) => {
  addBotMessage(message)
  if(book){
    updateBook(book)
  }
  endLoading()
}
