import React, { useCallback } from 'react';
import * as yup from 'yup';
import { FiUser, FiCalendar, FiLock, FiMail } from 'react-icons/fi';
import { useHistory, useLocation, Link } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface FormData {
  name: string;
  birthday: Date;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const { signUp } = useAuth();
  const { state } = useLocation<{ redirect: string }>();

  const { push } = useHistory();
  const { addToast } = useToast();

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const schema = yup.object().shape({
          name: yup.string().required('Nome do usuário é requerido'),
          birthday: yup.string().required('Data de aniversário é requerido'),
          email: yup.string().required('E-mail é requerido'),
          password: yup.string().required('Senha é requerida'),
          passwordConfirmation: yup
            .string()
            .oneOf([yup.ref('password'), null], 'As senhas devem corresponder'),
        });

        await schema.validate(data, { abortEarly: false });

        await signUp(data);
        push(state?.redirect || '/dashboard');

        addToast({
          title: 'Seja bem vindo!',
          description: 'Sua conta foi criada com sucesso',
          type: 'success',
        });
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          err.inner.reverse().forEach((e: any) => {
            setError(e.path, { message: e.message });

            addToast({
              title: 'Não foi possível realizar seu cadastro',
              description: e.message,
              type: 'error',
            });
          });

          return;
        }

        addToast({
          title: 'Não foi possível realizar seu cadastro',
          description: 'Verifique suas informações e tente novamente',
          type: 'error',
        });
      }
    },
    [addToast, push, setError, signUp, state?.redirect],
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-xl flex flex-col gap-2 p-4 justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-semibold uppercase ">Relicário</h1>
        <p className=" text-gray-500 font-semibold text-md text-xl text-center">
          <span>Gerenciamento de Bibliotecas</span>
          <span />
        </p>
        <div className="grid w-full gap-4">
          <Input
            name="name"
            error={errors?.name?.message}
            register={register('name')}
            placeholder="Nome do usuário"
            type="text"
            autoComplete="on"
            icon={FiUser}
          />
          <Input
            name="birthday"
            error={errors?.birthday?.message}
            register={register('birthday')}
            placeholder="Data de nascimento"
            type="date"
            autoComplete="on"
            icon={FiCalendar}
          />
          <Input
            name="email"
            error={errors?.email?.message}
            register={register('email')}
            placeholder="E-mail"
            type="email"
            autoComplete="on"
            icon={FiMail}
          />
          <Input
            name="password"
            error={errors?.password?.message}
            register={register('password')}
            placeholder="Senha"
            type="password"
            autoComplete="on"
            icon={FiLock}
          />
          <Input
            name="passwordConfirmation"
            error={errors?.passwordConfirmation?.message}
            register={register('passwordConfirmation')}
            placeholder="Confirmar senha"
            type="password"
            autoComplete="on"
            icon={FiLock}
          />
          <Button title="Criar nova conta" type="submit" />
          <div className="px-1 text-center">
            <p className="text-sm text-gray-600">
              <Link className="text-green-600 hover:text-primary-500" to="/">
                Voltar para tela de login.
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
