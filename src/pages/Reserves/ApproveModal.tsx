/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { FiX, FiCalendar } from 'react-icons/fi';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import InputMask from '../../components/InputMask';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface AppProps {
  setModalVisibility: Function;
  mutate: any;
  id: any;
  infoList: any;
}

const ApproveModal: React.FC<AppProps> = ({
  setModalVisibility,
  mutate,
  infoList,
  id: { _id, _book, _user },
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const { addToast } = useToast();

  const errorThower = (message: string, fieldName: any) => {
    setError(fieldName, {
      message,
    });
    throw new Error(message);
  };
  const convertDate = (date: string, field: string) => {
    const splittedDate = date.split('/');
    const day = Number(splittedDate[0]);
    const month = Number(splittedDate[1]);
    const year = Number(splittedDate[2]);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    if (day > 31 || month > 12) {
      errorThower(
        'A data deve ser informada seguindo este formato: Dia / Mês / Ano',
        field,
      );
    } else if (year < currentYear) {
      errorThower('O ano não pode ser inferior ao atual', field);
    }
    const parsedDate = new Date(year, month - 1, day);
    return parsedDate;
  };

  const onSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          loan_date: Yup.string().required('Informe a data de empréstimo'),
          return_date: Yup.string().required('Informe a data de retorno'),
        });
        await schema.validate(data, { abortEarly: false });

        let { loan_date, return_date } = data;

        loan_date = convertDate(loan_date, 'loan_date');
        return_date = convertDate(return_date, 'return_date');
        await api.put(`/reserve/${_id}`, {
          status: 'Emprestado',
          _id,
          _book,
          _user,
          loan_date,
          return_date,
        });
        addToast({
          type: 'success',
          title: 'Reserva confirmada com sucesso',
        });
        setModalVisibility(false);
        mutate(infoList);
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((e: any) => {
            addToast({
              type: 'error',
              title: 'Erro ao confirmar reserva',
              description: e.message,
            });
            setError(e.path, { message: e.message });
          });
        } else if (err?.message) {
          addToast({
            title: 'Erro',
            description: err?.message,
            type: `error`,
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
      infoList,
      mutate,
      _id,
      _book,
      _user,
      convertDate,
    ],
  );

  return (
    <div className="bg-gray-50 h-auto sm:h-84 lg:h-auto w-full rounded-md p-10 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-sans font-bold text-lg">Confirmar Reserva</h1>
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
          <InputMask
            mask="99/99/9999"
            icon={FiCalendar}
            name="loan_date"
            placeholder="Data de empréstimo"
            register={register('loan_date')}
            error={errors?.loan_date?.message}
          />
          <InputMask
            icon={FiCalendar}
            mask="99/99/9999"
            name="return_date"
            placeholder="Data de devolução"
            register={register('return_date')}
            error={errors?.return_date?.message}
          />

          <div className="display flex items-center justify-end pt-5">
            <Button title="Confirmar reserva" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApproveModal;
