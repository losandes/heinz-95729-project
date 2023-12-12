import { useState } from 'react';

export default function Book() {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const book = {
    description: "Patient Twenty-nine.A monster roams the halls of Soothing Hills Asylum. Three girls dead. 29 is endowed with the curseâ¦or gift of perception. She hears messages in music, sees lyrics in paintings. And the corn. A lifetime asylum resident, the orchestral corn music is the only constant in her life.Mason, a new, kind orderly, sees 29 as a woman, not a lunatic. And as his bel Patient Twenty-nine.A monster roams the halls of Soothing Hills Asylum. Three girls dead. 29 is endowed with the curseâ¦or gift of perception. She hears messages in music, sees lyrics in paintings. And the corn. A lifetime asylum resident, the orchestral corn music is the only constant in her life.Mason, a new, kind orderly, sees 29 as a woman, not a lunatic. And as his belief in her grows, so does her self- confidence. That perhaps she might escape, might see the outside world. But the monster has other plans. The missing girls share one common thread...each was twenty-nine's cell mate. Will she be next? ...more",
    imageUrl: "http://books.toscrape.com/media/cache/6b/07/6b07b77236b7c80f42bd90bf325e69f6.jpg"
  };
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
        <div className='grid grid-cols-4 gap-4 my-5'>
          {/* Column for Information */}
          <div className="grid col-span-3 grid-rows-5 h-96">
              <div className='col-span-1'>Title:</div>
              <div className='col-span-2 h-12'>Harry Potter</div>
              <div className='col-span-1'>Price:</div>
              <div className='col-span-2'>[Price Data]</div>
              <div className='col-span-1'>Rating:</div>
              <div className='col-span-2'>[Rating Data]</div>
            <div className='col-span-3'>Description:</div>
            <div className='col-span-3'>
              {showFullDescription ? book.description : truncateDescription(book.description)}
              <button
                className="text-blue-500 text-sm ml-2 mb-5"
                onClick={() => setShowFullDescription(!showFullDescription)}>
                {showFullDescription ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </div>

          {/* Column for Image and Checkout */}
          <div className="col-span-1">
            <div className="grid grid-cols-2">
              <button className="bg-blue-500 text-white py-1 px-3 text-sm rounded">Checkout</button>
            </div>
            <div>
              <img
              src={'http://books.toscrape.com/media/cache/6b/07/6b07b77236b7c80f42bd90bf325e69f6.jpg'}
              alt="Book Cover"
              className="w-auto h-72 my-5" />
            </div>
          </div>
        </div>
    </div>
  );
}
