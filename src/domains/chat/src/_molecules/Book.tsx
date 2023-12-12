import { useState } from 'react';
import { useChatStore } from '../state/user-interaction-store';

import { ArrowPathIcon } from '@heroicons/react/24/outline';


export default function Book() {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const loading = useChatStore((state)=>state.loading)
  const book = useChatStore((state)=>state.book)

  // test data
  // const book={
  //   title: 'Harry Porter',
  //   price: 20,
  //   rating:10,
  //   checkout: 'https://www.google.com/'
  // }

  // Function to truncate the description to the first 100 words
  const truncateDescription = (description: string) => {
    const words = description.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    }
    return description;
  };

  return (
    <div className='
      mx-20
      my-10
      h-96
      flex
      flex-col
      justify-items-center'>
      <h2>Recommend For You</h2>
      {loading? (
        <ArrowPathIcon
        className='cursor-pointer w-6 h-6 mx-3 justify-end animate-spin'/>
      ): (book? (
        <div className='grid grid-cols-4 gap-4 my-5'>
          {/* Column for Information */}
          <div className="grid col-span-3 grid-rows-5 h-96">
              <div className='col-span-1'>Title:</div>
              <div className='col-span-2 h-12'>{book?.title}</div>
              <div className='col-span-1'>Price ($):</div>
              <div className='col-span-2'>{book?.price}</div>
              <div className='col-span-1'>Rating:</div>
              <div className='col-span-2'>{book?.rating}</div>
            <div className='col-span-3'>Description:</div>
            {
              book?.description? (
                <div className='col-span-3'>
                  {showFullDescription ? book?.description : truncateDescription(book?.description)}
                  <button
                    className="text-blue-500 text-sm ml-2 mb-5"
                    onClick={() => setShowFullDescription(!showFullDescription)}>
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              ):null
            }
          </div>

          {/* Column for Image and Checkout */}
          <div className="col-span-1">
            <div className="grid grid-cols-2">
              <a href={book?.checkout?book.checkout:''}>
                <button
                className="bg-blue-500 text-white py-1 px-3 text-sm rounded">
                  Checkout
                </button>
              </a>
            </div>
            <div>
              <img
              src={book?.cover?book.cover:''}
              alt="Book Cover"
              className="w-auto h-72 my-5" />
            </div>
          </div>
        </div>
        ):
      '')
      }

    </div>
  );
}
