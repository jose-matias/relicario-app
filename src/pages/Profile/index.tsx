/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';

import { useForm } from 'react-hook-form';
import {
  FiCalendar,
  FiHome,
  FiLock,
  FiMail,
  FiMapPin,
  FiUser,
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import brasilApi from '../../services/brasil-api';
import Input from '../../components/Input';
import { useToast } from '../../hooks/toast';
import PageLayout from '../../components/PageLayout';
import AsideMenu from '../../components/AsideMenu';

const Profile: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm();
  const [cepInfo, setCEPInfo] = useState('');

  const onSubmit = useCallback(
    async data => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          name: Yup.string().required('O nome do usuário é obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          birthday,
          city,
          state,
          neighborhood,
          street,
          number,
        } = data;

        let responseAddress: any;

        if (cepInfo.length === 8) {
          if (user._address) {
            responseAddress = await api.put(`/address/${user._address}`, {
              _id: user._address,
              cep: cepInfo,
              city,
              state,
              neighborhood,
              street,
              number,
            });
          } else {
            responseAddress = await api.post('/address', {
              cep: cepInfo,
              city,
              state,
              neighborhood,
              street,
              number,
            });
          }
        }

        const address = responseAddress?.data;

        await api.put(`/user/${user._id}`, {
          _id: user._id,
          name,
          birthday: parseISO(birthday),
          _address: address?._id || null,
        });

        updateUser({ ...user, name, _address: address?._id || null, birthday });

        addToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Perfil atualizado com sucesso',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          err.inner.reverse().forEach((e: any) => {
            addToast({
              type: 'error',
              title: 'Erro ao atualizar perfil',
              description: e.message,
            });
            setError(e.path, { message: e.message });
          });
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao atualizar perfil',
            description: 'Verifique se todos campos e tente novamente',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast, cepInfo, setError, updateUser, user],
  );

  const changePassword = useCallback(
    async data => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (value: any) => !!value,
            then: Yup.string()
              .required('Nova senha deve ser informada')
              .min(6, 'A senha deve ter no mínimo 6 caracteres'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().when('old_password', {
            is: (value: any) => !!value,
            then: Yup.string()
              .required('Confirmação de senha deve ser informada')
              .oneOf([Yup.ref('password'), null], 'As senhas não conferem'),
            otherwise: Yup.string(),
          }),
        });

        await schema.validate(data, { abortEarly: false });
        const { password } = data;

        await api.put(`/user/change-password/${user._id}`, {
          email: user.email,
          password,
        });

        addToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Senha atualizada com sucesso',
        });

        setValue('password', '');
        setValue('old_password', '');
        setValue('password_confirmation', '');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          err.inner.reverse().forEach((e: any) => {
            addToast({
              type: 'error',
              title: 'Erro ao atualizar perfil',
              description: e.message,
            });
            setError(e.path, { message: e.message });
          });
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao atualizar perfil',
            description: 'Verifique se todos campos e tente novamente',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast, setValue, setError, user],
  );

  useEffect(() => {
    if (cepInfo.length === 8) {
      brasilApi(`/${cepInfo}`)
        .then(response => {
          const { city, state, neighborhood, street } = response.data;

          if (response.status === 200) {
            setValue('city', city);
            setValue('state', state);
            setValue('neighborhood', neighborhood);
            setValue('street', street);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [setValue, cepInfo, user._address]);

  useEffect(() => {
    if (user._address) {
      api.get(`/address/${user._address}`).then(response => {
        const {
          cep,
          city,
          state,
          neighborhood,
          street,
          number,
        } = response.data;

        setCEPInfo(cep);
        setValue('city', city);
        setValue('state', state);
        setValue('neighborhood', neighborhood);
        setValue('street', street);
        setValue('number', number);
      });
    }
  }, [setValue, user._address]);

  return (
    <>
      <PageLayout>
        <div className="flex gap-4 mt-4">
          <AsideMenu className="hidden md:block" />
          <section className="bg-white flex-1 mx-auto py-4 rounded-md shadow-sm">
            <div className="flex h-full flex-col">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-1 flex-col"
              >
                <div className="flex-1">
                  <div className="px-4">
                    <span className="font-semibold text-gray-700">
                      Dados pessoais
                    </span>
                  </div>
                  <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2  gap-4 p-4">
                    <Input
                      error={errors?.name?.message}
                      name="name"
                      icon={FiUser}
                      defaultValue={user.name}
                      type="text"
                      register={register('name')}
                      placeholder="Nome/Razão Social"
                    />
                    <Input
                      name="email"
                      defaultValue={user.email}
                      icon={FiMail}
                      disabled
                      type="text"
                    />
                  </div>
                  <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2  gap-4 px-4 pb-4">
                    <Input
                      error={errors?.birthday?.message}
                      lang="pt-BR"
                      name="birthday"
                      icon={FiCalendar}
                      defaultValue={format(
                        new Date(user.birthday),
                        'yyyy-MM-dd',
                      )}
                      type="date"
                      register={register('birthday')}
                      placeholder="Data de aniversário"
                    />
                    <Input
                      name="role"
                      defaultValue={
                        // eslint-disable-next-line no-nested-ternary
                        user.role === 'Admin'
                          ? 'Adminstrador'
                          : user.role === 'User'
                          ? 'Usuário'
                          : ''
                      }
                      icon={FiUser}
                      disabled
                      type="text"
                    />
                  </div>

                  <div className="px-4 flex flex-col">
                    <span className="font-semibold text-gray-700">
                      Endereço
                    </span>
                  </div>
                  <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3  gap-4 p-4 pb-0">
                    <Input
                      maxLength={8}
                      type="text"
                      name="cep"
                      icon={FiMapPin}
                      placeholder="CEP"
                      onChange={e => setCEPInfo(e.target.value)}
                      value={cepInfo}
                    />
                    <Input
                      name="city"
                      icon={FiHome}
                      register={register('city')}
                      placeholder="Cidade"
                    />
                    <Input
                      name="state"
                      icon={FiHome}
                      register={register('state')}
                      placeholder="Estado"
                    />
                  </div>
                  <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3  gap-4 p-4">
                    <Input
                      type="text"
                      name="neighborhood"
                      icon={FiHome}
                      register={register('neighborhood')}
                      placeholder="Bairro"
                    />
                    <Input
                      name="street"
                      icon={FiHome}
                      register={register('street')}
                      placeholder="Rua"
                    />
                    <Input
                      name="number"
                      icon={FiHome}
                      register={register('number')}
                      placeholder="Numero da casa"
                    />
                  </div>
                </div>
                <div className="grid px-4 gap-4 lg:grid-cols-1">
                  <button
                    className="rounded p-2 px-4 bg-primary-500 text-white"
                    type="submit"
                  >
                    Editar perfil
                  </button>
                </div>
              </form>

              <form
                onSubmit={handleSubmit(changePassword)}
                className="flex flex-1 flex-col"
              >
                <div className="px-4 flex flex-col pt-4">
                  <span className="font-semibold text-gray-700">
                    Mudar Senha
                  </span>
                </div>
                <div className="w-full grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3  gap-4 p-4">
                  <Input
                    error={errors?.old_password?.message}
                    name="old_password"
                    icon={FiLock}
                    type="password"
                    register={register('old_password')}
                    placeholder="Senha atual"
                  />
                  <Input
                    error={errors?.password?.message}
                    name="password"
                    icon={FiLock}
                    type="password"
                    register={register('password')}
                    placeholder="Nova senha"
                  />
                  <Input
                    error={errors?.password_confirmation?.message}
                    name="password_confirmation"
                    icon={FiLock}
                    type="password"
                    register={register('password_confirmation')}
                    placeholder="Confirmação de senha"
                  />
                </div>
                <div className="grid px-4 gap-4 lg:grid-cols-1">
                  <button
                    className="rounded p-2 px-4 bg-primary-500 text-white"
                    type="submit"
                  >
                    Alterar senha
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </PageLayout>
    </>
  );
};

export default Profile;
