/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback, useMemo } from 'react';
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiHash,
  FiFileText,
} from 'react-icons/fi';
import Select from 'react-select';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../components/Input';
import InputMask from '../../components/InputMask';
import ToggleSwitch from '../../components/ToggleSwitch';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import useFetch from '../../hooks/useFetch';

interface AppProps {
  setModalVisibility: Function;
}

interface Companies {
  _id: string;
  contactName: string;
  contactNumber: string;
  name: string;
  document: string;
}

const SignUpModal: React.FC<AppProps> = ({ setModalVisibility }) => {
  const { data: companies } = useFetch('/companies');
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
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm();

  const companiesId: any = useMemo(() => {
    const companiesObject: any = [];
    companies?.map((company: Companies) => {
      return companiesObject.push({
        label: company.name,
        value: company._id,
      });
    });
    return companiesObject;
  }, [companies]);

  const onSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required(),
          username: Yup.string().required(),
          phone: Yup.string().required(),
          document: Yup.string().required(),
          email: Yup.string().email().required(),
          password: Yup.string()
            .min(8)
            .matches(
              /(?=.*[a-z])(?=.*[A-Z])/g,
              'Sua senha deve incluir uma letra maiúscula e uma minúscula',
            )
            .required(),
          company_id: Yup.object().required(),
          role: Yup.object().required(),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/users', {
          active: isToggled,
          name: data.name,
          username: data.username,
          email: data.email,
          document: data.document,
          contact: data.phone,
          password: data.password,
          companyId: data.company_id.value,
          role: data.role.value,
        });
        addToast({
          type: 'success',
          title: 'Usuário criado com sucesso',
        });
        setModalVisibility(false);
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
    [addToast, setError, setModalVisibility, isToggled],
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
            icon={FiUser}
            name="username"
            placeholder="Nome de usuário"
            register={register('username')}
            error={errors?.username?.message}
          />
          <InputMask
            icon={FiPhone}
            name="phone"
            placeholder="Telefone"
            mask="(99) 99999-9999"
            register={register('phone')}
            error={errors?.phone?.message}
          />
          <Input
            icon={FiFileText}
            name="document"
            placeholder="Documento"
            register={register('document')}
            error={errors?.document?.message}
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
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  {...field}
                  styles={customStyles}
                  placeholder="Empresa"
                  options={companiesId}
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
