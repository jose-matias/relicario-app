/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiCalendar, FiHash } from 'react-icons/fi';
import Select from 'react-select';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../components/Input';
import InputMask from '../../components/InputMask';

import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface AppProps {
  setModalVisibility: Function;
  mutate: any;
  infoList: any;
}

const SignUpModal: React.FC<AppProps> = ({
  setModalVisibility,
  mutate,
  infoList,
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
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm();

  const onSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required(),
          email: Yup.string().email().required(),
          password: Yup.string()
            .min(8)
            .matches(
              /(?=.*[a-z])(?=.*[A-Z])/g,
              'Sua senha deve incluir uma letra maiúscula e uma minúscula',
            )
            .required(),
          role: Yup.object().required(),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/user', {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role.value,
        });
        addToast({
          type: 'success',
          title: 'Usuário criado com sucesso',
        });
        setModalVisibility(false);
        mutate(infoList);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((e: any) => {
            addToast({
              type: 'error',
              title: 'Erro ao criar usuário',
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
    [addToast, setError, setModalVisibility, infoList, mutate],
  );

  return (
    <div className="bg-gray-50 h-auto sm:h-84 lg:h-auto w-full rounded-md p-10 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-sans font-bold text-lg">
            Adicionar novo usuário
          </h1>
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

          <Input
            icon={FiHash}
            name="password"
            placeholder="Senha"
            type="password"
            register={register('password')}
            error={errors?.password?.message}
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
            <Button title="Criar Usuário" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
