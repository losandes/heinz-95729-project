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
    <div className='pl-20'>
        <h1>Recommend For You</h1>
        <div className='grid grid-cols-2 gap-4'>
          {/* Column for Information */}
          <div className="grid flex-rows-4 grid-cols-2 gap-2">
            <div>Title:</div>
            <div>Harry Potter</div>
            <div>Price:</div>
            <div>[Price Data]</div>
            <div>Rating:</div>
            <div>[Rating Data]</div>
            <div>Description:</div>
            <div>
              {/* {showFullDescription ? book.description : truncateDescription(book.description)}
              <button
                className="text-blue-500 text-sm ml-2"
                onClick={() => setShowFullDescription(!showFullDescription)}>
                {showFullDescription ? 'Show Less' : 'Show More'}
              </button> */}
              {book.description}
            </div>
          </div>

          {/* Column for Image and Checkout */}
          <div className="grid grid-cols-1">
            <div className="grid grid-cols-2">
            <button className="bg-blue-500 text-white py-1 px-3 text-sm rounded">Checkout</button>
            </div>

            <div><img src={'http://books.toscrape.com/media/cache/6b/07/6b07b77236b7c80f42bd90bf325e69f6.jpg'} alt="Book Cover" className="max-w-full h-auto" /></div>
          </div>
        </div>
    </div>
  );
}
