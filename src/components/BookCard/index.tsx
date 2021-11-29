/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { FiChevronLeft, FiFileText, FiNavigation } from 'react-icons/fi';

import { Link } from 'react-router-dom';

interface BookCardProps {
  bookTitle: string;
  author: string;
  about: string;
  owner: string;
  price: number;
  image: any;
  id: string;
}

const BookCard: React.FC<BookCardProps> = ({
  bookTitle,
  author,
  about,
  owner,
  price,
  image,
  id,
}) => {
  const [isDescriptionVisible, setDescriptionVisiblity] = useState<boolean>(
    false,
  );
  return (
    <div className="w-56 h-96 rounded-2xl overflow-hidden relative shadow-xl hover:shadow-2xl transition-all duration-300">
      <div
        className={`w-full h-full flex flex-col items-center absolute ${
          isDescriptionVisible ? 'opacity-0 z-0' : 'opacity-100 z-50'
        } transition-all duration-300`}
      >
        <div className="w-full h-full mx-auto text-center flex justify-center items-center">
          <img src={image} alt="Capa Indisponível" className="w-full h-auto" />
        </div>
        <div className="w-full h-1/6 bg-white flex justify-evenly items-center text-2xl text-gray-800 justify-self-end">
          <Link to={`/book/${id}`}>
            <button type="button" className="text-2xl hover:text-gray-500">
              <FiNavigation />
            </button>
          </Link>
          <button
            type="button"
            onClick={() => setDescriptionVisiblity(!isDescriptionVisible)}
            className="text-2xl hover:text-gray-500"
          >
            <FiFileText />
          </button>
        </div>
      </div>

      <div
        className={`w-full h-full flex flex-col items-center absolute px-4 py-6 space-y-4 bg-white ${
          isDescriptionVisible ? 'opacity-100 z-50' : 'opacity-0 z-0'
        } transition-all duration-300`}
      >
        <div className="w-full h-10 items-center flex">
          <div>
            <button
              type="button"
              onClick={() => setDescriptionVisiblity(!isDescriptionVisible)}
              className="text-base rounded-full bg-red-600 text-white w-8 h-8 flex items-center justify-center"
            >
              <FiChevronLeft />
            </button>
          </div>
          <h1 className="flex-1 text-lg text-center font-bold">Descrição</h1>
        </div>
        <p className="text-sm overflow-y-auto text-left flex-wrap">{about}</p>
      </div>
    </div>
  );
};

export default BookCard;

/* <h4 className="text-sm ">
              {bookTitle.length > 35
                ? `${`${bookTitle.substring(0, 35)}...`}`
                : bookTitle}
            </h4> */
