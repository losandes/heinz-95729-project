import { type Message, Sender } from '../typedefs';
import { BuildingStorefrontIcon, UserIcon } from '@heroicons/react/24/outline';

export default function MessageLine({sender,text}:Message, key:number){
  return (
  <li key={key} className='flex items-center'>
    <div className='
      rounded-full
      h-8
      w-8
      bg-violet-200
      flex
      items-center
      justify-center
      mr-3'>
        {sender===Sender.Bot?
        (<BuildingStorefrontIcon className="h-4 w-4" />):
        (<UserIcon className="h-4 w-4" />)
        }
    </div>
    <div className='w-full
      px-3
      py-2
      rounded-xl
      bg-violet-200'>
      <p key={key} className='p-0 m-0'>
        {text}
      </p>
    </div>
  </li>
  )
}
