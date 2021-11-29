/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { FiBook, FiList, FiRepeat } from 'react-icons/fi';
import { IoLanguageOutline } from 'react-icons/io5';
import { useParams, Link } from 'react-router-dom';

import ActiveButton from '../../components/ActiveButton';
import PageLayout from '../../components/PageLayout';
import api from '../../services/api';
import Modal from '../../components/Modal';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from '../../hooks/toast';

import { useAuth } from '../../hooks/auth';

interface ParamsProps {
  id: string;
}
const BookDetails: React.FC = () => {
  const params: ParamsProps = useParams();
  const bookId = params?.id;
  const [book, setBook] = useState<any>();
  const [
    confirmationModalVisibility,
    setConfirmationModalVisibility,
  ] = useState<boolean>(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const getBook = async (id: string) => {
    const bookData = await api.get(`/book/${id}`);
    setBook(bookData?.data);
  };

  useEffect(() => {
    getBook(bookId);
  }, [bookId]);

  return (
    <PageLayout>
      {book ? (
        <div className="container mx-auto mt-4 bg-white shadow-sm rounded-md space-y-3">
          <div className="w-full h-full flex flex-col lg:flex-row justify-center">
            <div className="mx-auto w-full lg:w-auto flex flex-col justify-center items-start">
              <div className="w-44 md:w-56 h-auto mx-auto border-t-4 border-b-4 border-white">
                <img
                  src={book?.cover}
                  alt="Capa do livro"
                  className="w-full h-auto"
                />
              </div>
              <div className="w-full rounded-md shadow-sm">
                <div className="w-full h-full text-center flex flex-col space-y-1">
                  <div className="h-10  flex justify-center items-center border-b-2 border-gray-500">
                    <h3>Mais informações</h3>
                  </div>

                  <div className="w-full h-full grid grid-cols-1 grid-rows-4 pl-2 space-y-3">
                    <div className="flex items-center">
                      <div className="flex justify-start items-center space-x-1 w-6/12">
                        <FiBook />
                        <p className="text-xs sm:text-sm text-center">
                          Localização
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm w-full text-center ">
                        {book?.location}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex justify-start items-center space-x-1 w-6/12">
                        <FiBook />
                        <p className="text-xs md:text-sm">ISBN10</p>
                      </div>
                      <p className="text-xs md:text-sm w-full">
                        {book?.ISBN10}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex justify-start items-center space-x-1 w-6/12">
                        <FiBook />
                        <p className="text-xs md:text-sm">ISBN13</p>
                      </div>
                      <p className="text-xs md:text-sm w-full">
                        {book?.ISBN13}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div className="flex justify-start items-center space-x-1 w-6/12">
                        <FiBook />
                        <p className="text-xs md:text-sm">Editora</p>
                      </div>
                      <p className="text-xs md:text-sm w-full break-all">
                        {book?._publisher.site}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 py-6 px-6 space-y-4">
              <div className="flex flex-col space-y-4">
                <div className="flex w-full flex-col space-y-4 justify-center items-center">
                  <h1>{book?.name}</h1>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="flex items-center justify-center text-gray-600 space-x-3">
                    <FiBook />
                    <p className="text-sm">{book?.pages_qty}</p>
                    <p>Páginas</p>
                  </div>

                  <div className="flex items-center justify-center text-gray-600 space-x-3">
                    <p className="text-sm">{book?.language}</p>
                    <IoLanguageOutline />
                  </div>
                </div>

                <div className="flex items-center justify-between ">
                  <div className="flex items-center text-gray-600 space-x-3 w-full ">
                    <FiList />
                    <div className="space-x-3 flex items-center justify-center flex-wrap">
                      {book?._category.map((item: any) => (
                        <p>{item?.name}</p>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end text-gray-600 space-x-3 w-2/4">
                    <p className="text-sm text-center">
                      {book?._publisher?.name}
                    </p>
                    <FiBook />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3 w-full items-center justify-center">
                <div className="w-full text-center">
                  <h1>Autor</h1>
                  <div className="flex flex-col space-y-2 w-full items-center justify-center flex-wrap overflow-y-scroll ">
                    <h4>{book?._author?.name}</h4>
                    <p>{book?._author?.about}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-full space-y-2 h-3/4">
                <div className="w-full text-center">
                  <h1>Descrição</h1>
                </div>
                <div className="overflow-y-scroll flex justify-center items-center flex-wrap">
                  <p>{book?.description}</p>
                </div>
              </div>
              <div className="w-full flex justify-end items-center">
                <ActiveButton
                  active
                  title="Reservar"
                  onClick={() => {
                    if (book?.quantity > 0) {
                      setConfirmationModalVisibility(true);
                    } else {
                      addToast({
                        type: 'error',
                        title: 'Erro',
                        description:
                          'Todas as unidades desse livro já foram reservadas,',
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Modal
        visible={confirmationModalVisibility}
        onClose={() =>
          setConfirmationModalVisibility(!confirmationModalVisibility)
        }
      >
        <ConfirmationModal
          bookId={book?._id}
          userId={user._id}
          setModalVisibility={setConfirmationModalVisibility}
        />
      </Modal>
    </PageLayout>
  );
};

export default BookDetails;
