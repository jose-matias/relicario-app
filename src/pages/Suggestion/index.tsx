/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { Empty } from 'antd';
import { FiPlusSquare, FiEdit, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';

import useFetch from '../../hooks/useFetch';
import PageLayout from '../../components/PageLayout';
import Modal from '../../components/Modal';

import CreateModal from './CreateModal';
import DeleteModal from './DeleteModal';
import UpdateModal from './UpdateModal';

interface Suggestion {
  _id: string;
  status: true;
  name: string;
  author: string;
}

const Suggestion: React.FC = () => {
  const { data: suggestions, isLoading, mutate } = useFetch<Suggestion[]>(
    '/suggestion',
  );
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [selectedId, setSeletecId] = useState('');
  const [createModalVisibility, setCreateModalVisibility] = useState<boolean>(
    false,
  );
  const [editModalVisibility, setEditModalVisibility] = useState<boolean>(
    false,
  );
  const [deleteModalVisibility, setDeleteModalVisibility] = useState<boolean>(
    false,
  );

  console.log(suggestions);


  return (
    <PageLayout>
      <>
        <section className="flex mt-4 w-full space-y-4 flex-col lg:space-y-0 lg:flex-row lg:space-x-4 sm:px-4">
          <div className="flex-1 flex flex-col gap-4 ">
            <div className=" bg-white p-4 divide-y divide-gray-100 shadow-sm rounded-md ">
              <header className="pb-4 flex items-center justify-between">
                <span>{isAdmin ? 'Sugestões' : 'Minhas sugestões'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setCreateModalVisibility(!createModalVisibility);
                  }}
                  className="text-primary-500 text-2xl cursor-pointer"
                >
                  <FiPlusSquare />
                </button>
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
                    {!suggestions?.length && (
                      <li className="p-4 flex justify-center items-center">
                        <Empty description="Não há sugestões cadastradas" />
                      </li>
                    )}
                    {suggestions?.map((suggestion, index) => (
                      <li
                        key={suggestion._id}
                        className={`py-2 p-1 ${!(index % 2) && 'bg-gray-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-8 items-center gap-2">
                            <div>{suggestion.name}</div>
                          </div>

                          <div className="flex gap-2 lg:gap-4 items-center">
                            <div className="space-x-1">
                              {isAdmin ? (
                                <>
                                  <button
                                    type="button"
                                    className="p-2 rounded-full border text-gray-500 hover:border-primary-500 hover:text-primary-500"
                                    onClick={() => {
                                      setSeletecId(suggestion._id);
                                      setEditModalVisibility(
                                        !editModalVisibility,
                                      );
                                    }}
                                  >
                                    <FiEdit />
                                  </button>
                                  <button
                                    type="button"
                                    className="p-2 rounded-full border text-gray-500 hover:border-primary-500 hover:text-primary-500"
                                    onClick={async () => {
                                      setSeletecId(suggestion._id);
                                      setDeleteModalVisibility(
                                        !deleteModalVisibility,
                                      );
                                    }}
                                  >
                                    <FiX />
                                  </button>
                                </>
                              ) : null}
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
              visible={createModalVisibility}
              onClose={() => {
                setCreateModalVisibility(false);
              }}
            >
              <CreateModal
                setModalVisibility={setCreateModalVisibility}
                mutate={mutate}
                infoList={suggestions}
              />
            </Modal>

            <Modal
              visible={deleteModalVisibility}
              onClose={() => {
                setDeleteModalVisibility(false);
              }}
            >
              <DeleteModal
                setModalVisibility={setDeleteModalVisibility}
                id={selectedId}
                mutate={mutate}
                infoList={suggestions}
              />
            </Modal>

            <Modal
              visible={editModalVisibility}
              onClose={() => {
                setEditModalVisibility(false);
              }}
            >
              <UpdateModal
                id={selectedId}
                setModalVisibility={setEditModalVisibility}
                mutate={mutate}
                infoList={suggestions}
              />
            </Modal>
          </>
        </section>
      </>
    </PageLayout>
  );
};

export default Suggestion;
