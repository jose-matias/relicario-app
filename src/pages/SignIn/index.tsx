import React, { useCallback } from 'react';
import * as yup from 'yup';
import { FiLock, FiMail } from 'react-icons/fi';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const { REACT_APP_GOOGLE_APP_ID } = process.env;

  const { signIn, signInWithGoogle } = useAuth();
  const { state } = useLocation<{ redirect: string }>();

  const { push } = useHistory();
  const { addToast } = useToast();

  const google = useCallback(
    async ({ profileObj }) => {
      try {
        await signInWithGoogle(profileObj);
        push(state?.redirect || '/dashboard');
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          err.inner.reverse().forEach((e: any) => {
            setError(e.path, { message: e.message });
          });
          return;
        }
        addToast({
          title: 'Não foi possível realizar seu cadastro',
          description: 'Verifique seu e-mail ou senha e tente novamente',
          type: 'error',
        });
      }
    },
    [signInWithGoogle, push, state?.redirect, addToast, setError],
  );

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const schema = yup.object().shape({
          email: yup.string().required('E-mail é requerido'),
          password: yup.string().required('Senha é requerida'),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn(data);
        push(state?.redirect || '/dashboard');
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          err.inner.reverse().forEach((e: any) => {
            setError(e.path, { message: e.message });
          });
          return;
        }
        addToast({
          title: 'Não foi possível realizar seu cadastro',
          description: 'Verifique seu e-mail ou senha e tente novamente',
          type: 'error',
        });
      }
    },
    [push, addToast, setError, state, signIn],
  );

  return (
    <>
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
            <Button title="Entrar" type="submit" />
            <GoogleLogin
              clientId={String(REACT_APP_GOOGLE_APP_ID)}
              render={renderProps => (
                <Button
                  title="Entrar com conta Google"
                  type="button"
                  className="w-full p-2 bg-red-600 focus-within:bg-red-500 rounded text-white ring-2 ring-red-500"
                  onClick={renderProps.onClick}
                />
              )}
              onSuccess={google}
              // onFailure={google}
              cookiePolicy="single_host_origin"
            />
            <div className="px-1 text-center">
              <p className="text-sm text-gray-600">
                <span>Novo por aqui? </span>
                <Link
                  className="text-green-600 hover:text-primary-500"
                  to="/cadastro"
                >
                  Cadastre-se agora.
                </Link>
              </p>
            </div>
            <div className="px-1 text-center">
              <p className="text-sm text-gray-600">
                <a
                  className="text-green-600 hover:text-primary-500"
                  href="/recuperar-senha"
                >
                  Esqueci minha senha?
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignIn;
