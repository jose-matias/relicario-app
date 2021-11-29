/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-duplicates */
import React, { useState } from 'react';
import { Empty } from 'antd';
import { Link } from 'react-router-dom';
import { FiDownload, FiPlusSquare } from 'react-icons/fi';

import { BiShow } from 'react-icons/bi';
import { useToast } from '../../hooks/toast';
import PageLayout from '../../components/PageLayout';
import { User } from '../../hooks/auth';
import useFetch from '../../hooks/useFetch';
import Modal from '../../components/Modal';
import SignUpModal from './SignUpModal';
import api from '../../services/api';

const Users: React.FC = () => {
  const { addToast } = useToast();
  const { data: users, isLoading } = useFetch<User[]>('/user');
  const [modalVisibility, setModalVisibility] = useState<boolean>(false);
  // {user.email}
  // console.log(users)
  const downloadList = async () => {
    try {
      const response = await api.get('/report-users', {
        responseType: 'blob',
      });

      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);

      addToast({
        type: 'success',
        title: 'Relatório de usuário gerado com sucesso',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao gerar relatório de usuários',
      });
    }
  };
  const splitName = (name: string) => {
    const splittedName = name.split(' ');
    return splittedName[0];
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
                    {!users?.length && (
                      <li className="p-4 flex justify-center items-center">
                        <Empty description="Não há usuários cadastrados" />
                      </li>
                    )}
                    {users?.map((user, index) => (
                      <li
                        key={user._id}
                        className={`py-2 p-1 ${!(index % 2) && 'bg-gray-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 w-24 lg:w-32 overflow-x-auto ">
                            {splitName(user.name)}
                          </div>
                          <div className="text-md w-3/4 text-left overflow-x-auto">
                            {user.email}
                          </div>

                          <div className="flex gap-2 lg:gap-4 items-center ml-3">
                            <div>
                              <Link to={`/transacoes/${user._id}`}>
                                <button
                                  type="button"
                                  className="p-2 rounded-full border text-gray-500 hover:border-primary-500 hover:text-primary-500"
                                >
                                  <BiShow />
                                </button>
                              </Link>
                            </div>
                            <div>
                              <Link to={`/transacoes/${user._id}`}>
                                <button
                                  type="button"
                                  className="p-2 rounded-full border text-gray-500 hover:border-primary-500 hover:text-primary-500"
                                >
                                  <BiShow />
                                </button>
                              </Link>
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
              <SignUpModal setModalVisibility={setModalVisibility} />
            </Modal>
          </>
        </section>
      </>
    </PageLayout>
  );
};

export default Users;
