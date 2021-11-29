/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { FiX, FiMousePointer, FiBookOpen } from 'react-icons/fi';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface AppProps {
  setModalVisibility: Function;
  mutate: any;
  infoList: any;
}

const CreateModal: React.FC<AppProps> = ({
  setModalVisibility,
  mutate,
  infoList,
}) => {
  // const [isToggled, setIsToggled] = useState<boolean>(true);
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = useCallback(
    async data => {
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Informe o nome da editora'),
          site: Yup.string().required('Informe o site da editora'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/publisher', {
          name: data.name,
          site: data.site,
        });
        addToast({
          type: 'success',
          title: 'Editora criada com sucesso',
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
    [addToast, setError, setModalVisibility, infoList, mutate],
  );

  return (
    <div className="bg-gray-50 h-auto sm:h-84 lg:h-auto w-full rounded-md p-10 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-sans font-bold text-lg">
            Adicionar nova editora
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

export default CreateModal;
