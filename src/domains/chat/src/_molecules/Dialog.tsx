//here we are creating a component that will display the conversation between the user and the bot.
import React from 'react';
import { type Message } from '../typedefs';
import { useChatStore } from '../state/user-interaction-store';
import MessageLine from './MessageLine';

export function Dialog() {

  const conversation = useChatStore((state)=>state.messages)

  return (
    <ul className="
      h-full
      overflow-y-scroll
      p-5
      my-1
      scroll-snap-y-container
      ">
    {conversation.map((message, index) => (
      <MessageLine
      key={index}
      sender={message.sender}
      text={message.text} />
    ))}
  </ul>
  );
}
