import React, { useCallback } from 'react';
import * as yup from 'yup';
import { FiMail } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface FormData {
  email: string;
}

const RecoverPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const { recoverPassword } = useAuth();
  const { state } = useLocation<{ redirect: string }>();

  const { push } = useHistory();
  const { addToast } = useToast();

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const schema = yup.object().shape({
          email: yup.string().required('E-mail é requerido'),
        });

        await schema.validate(data, { abortEarly: false });

        recoverPassword(data.email);

        addToast({
          type: 'success',
          title: 'E-mail enviado com sucesso',
        });

        push(state?.redirect || '/');
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          err.inner.reverse().forEach((e: any) => {
            setError(e.path, { message: e.message });
          });
          return;
        }
        addToast({
          title: 'Erro ao enviar e-mail',
          description: 'Verifique seu e-mail e tente novamente',
          type: 'error',
        });
      }
    },
    [recoverPassword, push, state?.redirect, addToast, setError],
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
              placeholder="Digite seu e-mail"
              type="email"
              autoComplete="on"
              icon={FiMail}
            />
            <Button title="Enviar e-mail para recuperar senha" type="submit" />
          </div>
        </form>
      </div>
    </>
  );
};

export default RecoverPassword;
