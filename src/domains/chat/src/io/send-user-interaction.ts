// src/domains/chat/src/io/send-user-interaction.ts

export async function sendUserInteraction(userInput: string): Promise<string> {
  // Here we should send the user input to your chatbot (AI) service and get a response.
  // For now, I mocked response.  we have to change this with the response of AI  service
  return `You said, ${userInput} please confirm?: `;
}
