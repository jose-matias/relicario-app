/* eslint-disable no-underscore-dangle */
import React, { useCallback } from 'react';
import { FiX, FiUser } from 'react-icons/fi';
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
          name: Yup.string().required('Informe o nome da categoria'),
          about: Yup.string().required('Informe a descrição da categoria'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/author', {
          name: data.name,
          about: data.about,
        });
        addToast({
          type: 'success',
          title: 'Autor criada com sucesso',
        });
        setModalVisibility(false);
        mutate(infoList);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach((e: any) => {
            addToast({
              type: 'error',
              title: 'Erro ao criar autor',
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
    [addToast, setError, setModalVisibility, infoList],
  );

  return (
    <div className="bg-gray-50 h-auto sm:h-84 lg:h-auto w-full rounded-md p-10 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-sans font-bold text-lg">Adicionar novo autor</h1>
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

        {/* <div className="flex items-center justify-end space-x-6">
          <span>{isToggled ? 'Usuário Ativo' : 'Usuário Inativo'}</span>
          <ToggleSwitch
            isToggled={isToggled}
            onToggle={() => setIsToggled(!isToggled)}
          />
        </div> */}

        <form className="space-y-1" onSubmit={handleSubmit(onSubmit)}>
          <Input
            icon={FiUser}
            name="name"
            placeholder="Nome"
            register={register('name')}
            error={errors?.name?.message}
          />
          <Input
            icon={FiUser}
            name="about"
            placeholder="Descrição"
            register={register('about')}
            error={errors?.about?.message}
          />

          <div className="display flex items-center justify-end pt-5">
            <Button title="Criar Autor" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
