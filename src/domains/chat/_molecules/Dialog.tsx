//here we are creating a component that will display the conversation between the user and the bot.
import React from 'react';


interface DialogProps {
  conversation: {
    text: string;
    sender: string;
  }[];
}

export function Dialog({ conversation }: DialogProps) {
  return (
    <div style={{
      maxHeight: '400px',
      overflowY: 'auto',
      border: '1px solid #ccc',
      padding: '10px',
      marginBottom: '10px'
    }}>
      {conversation.map((message, index) => (
        <p key={index}>
         <strong style={{ color: message.sender === 'user' ? 'blue' : 'green' }}>
        {message.sender === 'user' ? 'User' : 'Bot'}:
         </strong>
          {message.text}
        </p>
      ))}
    </div>
  );
}
