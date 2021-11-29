/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react';
import { FiX, FiMousePointer, FiBookOpen } from 'react-icons/fi';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import ToggleSwitch from '../../components/ToggleSwitch';
import useFetch from '../../hooks/useFetch';

interface AppProps {
  setModalVisibility: Function;
  mutate: any;
  id: string;
  infoList: any;
}

interface Category {
  status: boolean;
  _id: string;
  name: string;
  site: string;
}

const UpdateModal: React.FC<AppProps> = ({
  setModalVisibility,
  mutate,
  infoList,
  id,
}) => {
  const { data: publisher, isLoading } = useFetch<Category>(`/publisher/${id}`);
  const [isToggled, setIsToggled] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm();

  useEffect(() => {
    if (!isLoading) {
      setValue('name', publisher?.name);
      setValue('site', publisher?.site);
      setIsToggled(publisher?.status);
    }
  }, [publisher, setValue, isLoading, setIsToggled]);
  const { addToast } = useToast();

  const onSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Informe o nome da editora'),
          site: Yup.string().required('Informe o site da editora'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.put(`/publisher/${id}`, {
          name: data.name,
          site: data.site,
          status: isToggled,
        });
        addToast({
          type: 'success',
          title: 'Editora alterada com sucesso',
        });
        setModalVisibility(false);
        mutate(infoList);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((e: any) => {
            addToast({
              type: 'error',
              title: 'Erro ao criar editora',
              description: e.message,
            });
            setError(e.path, { message: e.message });
          });
        } else {
          addToast({
            title: 'Erro inesperado',
            description: 'Aconteceu algum problema contate o suporte',
            type: `error`,
          });
        }
      }
    },
    [addToast, setError, setModalVisibility, infoList, mutate, id, isToggled],
  );

  return (
    <div className="bg-gray-50 h-auto sm:h-84 lg:h-auto w-full rounded-md p-10 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-sans font-bold text-lg">Alterar editora</h1>
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

        <div className="flex items-center justify-end space-x-6">
          <span>{isToggled ? 'Editora Ativa' : 'Editora inativa'}</span>
          <ToggleSwitch
            isToggled={isToggled}
            onToggle={() => setIsToggled(!isToggled)}
          />
        </div>

        <form className="space-y-1" onSubmit={handleSubmit(onSubmit)}>
          <Input
            icon={FiBookOpen}
            name="name"
            placeholder="Nome"
            register={register('name')}
            error={errors?.name?.message}
          />
          <Input
            icon={FiMousePointer}
            name="site"
            placeholder="Site"
            register={register('site')}
            error={errors?.site?.message}
          />

          <div className="display flex items-center justify-end pt-5">
            <Button title="Criar editora" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
