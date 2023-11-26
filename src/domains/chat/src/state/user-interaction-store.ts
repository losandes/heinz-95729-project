// src/domains/chat/src/state/user-interaction-store.ts
// this function is used to send the user input to the chatbot service and get the response
// and update the conversation state with the response
import { useState, useEffect } from 'react';
import { sendUserInteraction } from '../io/send-user-interaction';

export function useUserInteractionStore() {
  const [userName, setUserName] = useState('');
  const [conversation, setConversation] = useState([{ text: 'Hello, what is your name?', sender: 'bot' }]);

  async function addUserMessage(message:string) {
    if (!userName) {
      setUserName(message);
      setConversation(prevConversation => [...prevConversation, { text: message, sender: 'user' }, { text: 'Nice to meet you, ' + message + '. Please ask a question related to a book.', sender: 'bot' }]);
    } else {
      setConversation(prevConversation => [...prevConversation, { text: message, sender: 'user' }]);
      const botResponse = await sendUserInteraction(message);
      setConversation(prevConversation => [...prevConversation, { text: botResponse, sender: 'bot' }]);
    }
  }

  return { conversation, addUserMessage };
}
