// here we have the user input component

import React, { useState } from 'react';
import { askQuestion, useChatStore} from '../state/user-interaction-store';
import { ArrowPathIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import type { Message } from '../typedefs';

export function UserInput() {
  const [input, setInput] = useState('');

  const loading=useChatStore((state)=>(state.loading));
  const messages=useChatStore((state)=>(state.messages));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(input.length>0){
      const latests: Message[] = [];
      if (messages.length <= 6) {
        latests.push(...messages);
      } else {
        latests.push(...messages.slice(-6));
      }

      askQuestion(input, latests);
    }
    setInput('');
  }

  return (
    <form onSubmit={handleSubmit} className='w-full bg-violet-200 rounded-3xl inline-flex items-center'>
      <input value={input} onChange={e => setInput(e.target.value)}
      className='rounded-3xl bg-transparent border-none focus:border-none grow px-5'/>
      {loading?(
        <ArrowPathIcon
          className='cursor-pointer w-6 h-6 mx-3 justify-end animate-spin'/>
      ):(
        <PaperAirplaneIcon
          className='cursor-pointer w-6 h-6 mx-3 justify-end'
          onClick={handleSubmit}/>
      )
      }

    </form>
  );
}
