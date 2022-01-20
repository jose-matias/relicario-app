/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-duplicates */
import React, { useState } from 'react';
import { Empty } from 'antd';

import { FiPlusSquare, FiX, FiEdit, FiDownload } from 'react-icons/fi';

import { useToast } from '../../hooks/toast';
import PageLayout from '../../components/PageLayout';
import useFetch from '../../hooks/useFetch';
import Modal from '../../components/Modal';
import CreateBooksModal from './CreateBooksModal';
import DeleteBooksModal from './DeleteBooksModal';
import UpdateBooksModal from './UpdateBooksModal';
import api from '../../services/api';

const Books: React.FC = () => {
  const { addToast } = useToast();
  const { data: books, isLoading, mutate } = useFetch<any>('/book');
  const [editModalVisibility, setEditModalVisibility] = useState<boolean>(
    false,
  );
  const [deleteModalVisibility, setDeleteModalVisibility] = useState<boolean>(
    false,
  );
  const [selectedId, setSeletecId] = useState('');

  const [modalVisibility, setModalVisibility] = useState<boolean>(false);

  const downloadList = async () => {
    try {
      const response = await api.get('/report-books', {
        responseType: 'blob',
      });

      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);

      addToast({
        type: 'success',
        title: 'Relatório de livros gerado com sucesso',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao gerar relatório de livros',
      });
    }
  };

  return (
    <PageLayout>
      <>
        <section className="flex mt-4 w-full space-y-4 flex-col lg:space-y-0 lg:flex-row lg:space-x-4 sm:px-4">
          <div className="flex-1 flex flex-col gap-4 ">
            <div className=" bg-white p-4 divide-y divide-gray-100 shadow-sm rounded-md ">
              <header className="pb-4 flex items-center justify-between">
                <span>Usuários</span>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSeletecId(null);
                      setModalVisibility(!modalVisibility);
                    }}
                    className="text-primary-500 text-2xl cursor-pointer pr-5"
                  >
                    <FiPlusSquare />
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadList()}
                    className="text-primary-500 text-2xl cursor-pointer pr-5"
                  >
                    <FiDownload />
                  </button>
                </div>
              </header>

              <ul>
                {isLoading ? (
                  <>
                    {['1', '2', '3', '4'].map(item => (
                      <li
                        key={item}
                        className="p-1 py-2 flex items-center gap-4"
                      >
                        <div className="bg-gray-100 w-8 h-8 rounded-full animate-pulse " />
                        <div className="bg-gray-100 flex-1 h-4 rounded animate-pulse " />
                        <div className="bg-gray-100 w-12 h-4 rounded animate-pulse " />
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    {!books?.length && (
                      <li className="p-4 flex justify-center items-center">
                        <Empty description="Não há usuários cadastrados" />
                      </li>
                    )}
                    {books?.map((book: any, index: number) => (
                      <li
                        key={book._id}
                        className={`py-2 p-1 ${!(index % 2) && 'bg-gray-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-8 items-center gap-2">
                            <div>{book.name}</div>
                            <span className="text-md">{book.author}</span>
                          </div>

                          <div className="flex gap-2 lg:gap-4 items-center">
                            <div className="space-x-1">
                              <button
                                type="button"
                                className="p-2 rounded-full border text-gray-500 hover:border-primary-500 hover:text-primary-500"
                                onClick={() => {
                                  setSeletecId(book._id);
                                  setModalVisibility(!editModalVisibility);
                                }}
                              >
                                <FiEdit />
                              </button>
                              <button
                                type="button"
                                className="p-2 rounded-full border text-gray-500 hover:border-primary-500 hover:text-primary-500"
                                onClick={async () => {
                                  setSeletecId(book._id);
                                  setDeleteModalVisibility(
                                    !deleteModalVisibility,
                                  );
                                }}
                              >
                                <FiX />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>

          <>
            <Modal
              visible={modalVisibility}
              onClose={() => {
                setModalVisibility(false);
              }}
            >
              <CreateBooksModal
                id={selectedId}
                setModalVisibility={setModalVisibility}
                infoList={books}
                mutate={mutate}
              />
            </Modal>

            <Modal
              visible={deleteModalVisibility}
              onClose={() => {
                setDeleteModalVisibility(false);
              }}
            >
              <DeleteBooksModal
                setModalVisibility={setDeleteModalVisibility}
                id={selectedId}
                mutate={mutate}
                books={books}
              />
            </Modal>
            <Modal
              visible={editModalVisibility}
              onClose={() => {
                setEditModalVisibility(false);
              }}
            >
              <UpdateBooksModal
                id={selectedId}
                setModalVisibility={setEditModalVisibility}
                mutate={mutate}
                books={books}
              />
            </Modal>
          </>
        </section>
      </>
    </PageLayout>
  );
};

export default Books;
