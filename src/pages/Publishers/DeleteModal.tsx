/* eslint-disable react/jsx-curly-newline */
import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface AppProps {
  setModalVisibility: Function;
  mutate: Function;
  infoList: any;
  id: string;
}

const DeleteModal: React.FC<AppProps> = ({
  setModalVisibility,
  mutate,
  infoList,
  id,
}) => {
  const { addToast } = useToast();
  const [activeButton, setActiveButton] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);

  if (countdown > 0) {
    setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
  }

  useEffect(() => {
    if (countdown === 0) setActiveButton(true);
  }, [countdown]);

  return (
    <div className="bg-gray-50 h-auto  w-full rounded-md p-10 overflow-y-auto">
      <div className="space-y-14">
        <div className="flex items-center justify-between">
          <h1 className="font-sans font-bold text-lg">Apagar editora</h1>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-red-600 hover:text-white transition-colors duration-300"
            onClick={() => {
              setModalVisibility(false);
            }}
          >
            <FiX />
          </button>
        </div>
        <div className="text-center leading-loose">
          <p>Você deseja apagar essa editora</p>
          <p className="font-bold">Essa ação é irreversível.</p>
        </div>
        <div className="w-full h-full flex justify-between">
          <Button
            title="Cancelar"
            onClick={() => {
              setModalVisibility(false);
            }}
          />
          <Button
            title={
              activeButton
                ? 'Apagar'
                : `Aguarde ${countdown.toString()} segundos para apagar`
            }
            className="p-2 bg-gray-300 focus-within:bg-gray-400 rounded m-1 text-gray-500 ring-2 ring-gray-300"
            onClick={async () => {
              if (activeButton) {
                await api.delete(`/publisher/${id}`);
                mutate(infoList, true);
                addToast({
                  type: 'success',
                  title: 'Editora apagado com sucesso',
                });
                setModalVisibility(false);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
