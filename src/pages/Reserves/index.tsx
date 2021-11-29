/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-duplicates */
import React, { useState } from 'react';
import { Empty } from 'antd';

import { FiX, FiCheck, FiArchive } from 'react-icons/fi';
import PageLayout from '../../components/PageLayout';
import useFetch from '../../hooks/useFetch';
import Modal from '../../components/Modal';
import CancelModal from './CancelModal';
import ApproveModal from './ApproveModal';
import ReceiveModal from './ReceiveModal';
import { useAuth } from '../../hooks/auth';

const Reserves: React.FC = () => {
  const { user } = useAuth();
  const url =
    user?.role === 'Admin' ? '/reserve' : `/reserve?user=${user?._id}`;
  const { data: reserves, isLoading, mutate } = useFetch<any>(url);
  const [approveModalVisibility, setApproveModalVisibility] = useState<boolean>(
    false,
  );
  const [receiveModalVisbility, setReceiveModalVisibility] = useState<boolean>(
    false,
  );
  const [deleteModalVisibility, setDeleteModalVisibility] = useState<boolean>(
    false,
  );
  const [selectedId, setSeletecId] = useState('');

  return (
    <PageLayout>
      <>
        <section className="flex mt-4 w-full space-y-4 flex-col lg:space-y-0 lg:flex-row lg:space-x-4 sm:px-4">
          <div className="flex-1 flex flex-col gap-4 ">
            <div className=" bg-white p-4 divide-y divide-gray-100 shadow-sm rounded-md ">
              <header className="pb-4 flex items-center justify-between">
                <span>Reservas</span>
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
                    {!reserves?.length && (
                      <li className="p-4 flex justify-center items-center">
                        <Empty description="Não há reservas" />
                      </li>
                    )}
                    {reserves?.map((reserve: any, index: number) => (
                      <li
                        key={reserve?._id}
                        className={`py-2 p-1 ${!(index % 2) && 'bg-gray-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-8 items-center gap-2">
                            <div>{reserve?._book?.name}</div>
                            <span className="text-md">{reserve?.status}</span>
                          </div>

                          <div className="flex gap-2 lg:gap-4 items-center">
                            <div className="space-x-1">
                              {user?.role === 'Admin' &&
                              reserve?.status === 'Reservado' ? (
                                <>
                                  <button
                                    type="button"
                                    className="p-2 rounded-full border text-gray-500 hover:border-primary-500 hover:text-primary-500"
                                    onClick={() => {
                                      setSeletecId(reserve);

                                      setApproveModalVisibility(
                                        !approveModalVisibility,
                                      );
                                    }}
                                  >
                                    <FiCheck />
                                  </button>
                                </>
                              ) : null}

                              {user?.role === 'Admin' &&
                              reserve?.status === 'Emprestado' ? (
                                <button
                                  type="button"
                                  className="p-2 rounded-full border text-gray-500 hover:border-primary-500 hover:text-primary-500"
                                  onClick={() => {
                                    setSeletecId(reserve?._id);
                                    setReceiveModalVisibility(
                                      !receiveModalVisbility,
                                    );
                                  }}
                                >
                                  <FiArchive />
                                </button>
                              ) : null}
                              {user?.role === 'Admin' ||
                              reserve?.status === 'Reservado' ? (
                                <button
                                  type="button"
                                  className="p-2 rounded-full border text-gray-500 hover:border-primary-500 hover:text-primary-500"
                                  onClick={async () => {
                                    setSeletecId(reserve._id);
                                    setDeleteModalVisibility(
                                      !deleteModalVisibility,
                                    );
                                  }}
                                >
                                  <FiX />
                                </button>
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
              visible={deleteModalVisibility}
              onClose={() => {
                setDeleteModalVisibility(false);
              }}
            >
              <CancelModal
                id={selectedId}
                infoList={reserves}
                mutate={mutate}
                setModalVisibility={setDeleteModalVisibility}
              />
            </Modal>

            <Modal
              visible={approveModalVisibility}
              onClose={() => {
                setApproveModalVisibility(false);
              }}
            >
              <ApproveModal
                id={selectedId}
                mutate={mutate}
                infoList={reserves}
                setModalVisibility={setApproveModalVisibility}
              />
            </Modal>
            <Modal
              visible={receiveModalVisbility}
              onClose={() => {
                setReceiveModalVisibility(false);
              }}
            >
              <ReceiveModal
                id={selectedId}
                infoList={reserves}
                mutate={mutate}
                setModalVisibility={setReceiveModalVisibility}
              />
            </Modal>
          </>
        </section>
      </>
    </PageLayout>
  );
};

export default Reserves;
