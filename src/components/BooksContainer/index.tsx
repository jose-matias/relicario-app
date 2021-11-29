/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import useFetch from '../../hooks/useFetch';
import BookCard from '../BookCard';
import Input from '../Input';

const BooksContainer: React.FC = () => {
  const { data: books, isLoading } = useFetch<any>('/book');
  const [filteredBooks, setFilteredBooks] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (!isLoading) {
      const filteredBooksArray = books?.filter((book: any) => {
        if (searchTerm === '' && book?.status) {
          console.log(book.name, book?.status);
          return book;
        }

        if (
          book.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()) &&
          book.status === true
        ) {
          return book;
        }
      });
      console.log(filteredBooksArray);
      setFilteredBooks(filteredBooksArray);
    }
  }, [searchTerm, books, isLoading]);
  return (
    <div className="w-screen display flex flex-col space-y-5 items-center pt-9">
      <div className="w-3/4 sm:w-1/2">
        <Input
          icon={FiSearch}
          name="searchTerm"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Pesquise um título de livro"
        />
      </div>
      <div className="w-full mt-10 grid grid-cols-1 gap-y-8 justify-items-center z-0 lg:grid-cols-2 lg:gap-y-10  md:gap-x-0 xl:grid-cols-3 xl:gap-y-10 ">
        {isLoading
          ? null
          : filteredBooks.map((book: any) => (
              <BookCard
                bookTitle={book?.name}
                about={book?.description}
                author={book?._author?.name}
                owner={book?._user?.name}
                price={book?.price}
                image={book?.cover}
                id={book?._id}
                key={book?._id}
              />
            ))}
      </div>
    </div>
  );
};

export default BooksContainer;
