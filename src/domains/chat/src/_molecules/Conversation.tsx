// src/domains/chat/src/_templates/Conversation.tsx
// here we are importing the UserInput and Dialog components from the _molecules folder
import React from 'react';
import { UserInput } from './UserInput';
import { Dialog } from './Dialog';

export default function Conversation() {

  return (
    <div className='
      flex
      flex-col
      h-96
      mx-20
      justify-items-center
      bg-dracula-purple
      rounded-3xl'>
      <Dialog />
      <UserInput />
    </div>
  );
}
