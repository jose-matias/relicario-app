/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiCalendar, FiHash } from 'react-icons/fi';
import Select from 'react-select';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../components/Input';
import InputMask from '../../components/InputMask';
import ToggleSwitch from '../../components/ToggleSwitch';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface AppProps {
  setModalVisibility: Function;
  mutate: any;
  infoList: any;
  itemId?: string;
}

const EditModal: React.FC<AppProps> = ({
  setModalVisibility,
  mutate,
  infoList,
  itemId,
}) => {
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      boxShadow: state.isFocused ? 0 : 0,
      borderColor: state.isFocused ? '#E5E7EB' : '#E5E7EB',
      '&:hover': {
        borderColor: '#E5E7EB',
        border: '2px solid rgba(31, 120, 76)',
      },
    }),
  };
  const [isToggled, setIsToggled] = useState<boolean>(true);
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    setValue,
  } = useForm();

  const getUser = async (id: string) => {
    const { data } = await api.get<any>(`/user/${id}`);
    setUser(data);
  };
  useEffect(() => {
    if (itemId) {
      getUser(itemId);
    }
  }, [itemId]);

  useEffect(() => {
    setValue('name', user?.name);
    setValue('email', user?.email);
    setValue('role', {
      value: user?.role,
      label: user?.role === 'User' ? 'Usuário' : 'Administrador',
    });
    console.log(user);
    console.log(user?.status);
    setIsToggled(user?.status);
    setIsContentLoaded(true);
  }, [user]);

  const onSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Informe o nome'),
          email: Yup.string().email().required('Informe o email'),

          role: Yup.object().required('Informe o tipo de usuário'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.put(`/user/${itemId}`, {
          status: isToggled,
          name: data.name,
          email: data.email,
          role: data.role.value,
        });
        addToast({
          type: 'success',
          title: 'Usuário alterado com sucesso',
        });
        setModalVisibility(false);

        mutate(infoList);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((e: any) => {
            addToast({
              type: 'error',
              title: 'Erro ao editar usuário',
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
    [
      addToast,
      setError,
      setModalVisibility,
      isToggled,
      infoList,
      itemId,
      mutate,
    ],
  );

  return (
    <>
      {isContentLoaded ? (
        <div className="bg-gray-50 h-auto sm:h-84 lg:h-auto w-full rounded-md p-10 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-sans font-bold text-lg">Alterar usuário</h1>
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
              <span>{isToggled ? 'Usuário Ativo' : 'Usuário Inativo'}</span>
              <ToggleSwitch
                isToggled={isToggled}
                onToggle={() => setIsToggled(!isToggled)}
              />
            </div>

            <form className="space-y-1" onSubmit={handleSubmit(onSubmit)}>
              <Input
                icon={FiUser}
                name="name"
                placeholder="Nome Completo"
                register={register('name')}
                error={errors?.name?.message}
              />

              <Input
                icon={FiMail}
                name="email"
                placeholder="E-mail"
                register={register('email')}
                error={errors?.email?.message}
              />

              <Controller
                name="role"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      styles={customStyles}
                      placeholder="Função"
                      options={[
                        { value: 'Admin', label: 'Administrador' },
                        { value: 'User', label: 'Usuário' },
                      ]}
                    />
                  );
                }}
              />

              <div className="display flex items-center justify-end pt-5">
                <Button title="Alterar Usuário" type="submit" />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default EditModal;
