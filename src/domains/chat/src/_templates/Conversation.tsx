import Book from '../_molecules/Book';
import Conversation from '../_molecules/Conversation';

// This file puts all components for Chat page together
export default function Chat(){
  return(
  <div className='w-full flex flex-col'>
    <h1>Chat</h1>
    <Conversation />
    <Book />
  </div>
  )
}
