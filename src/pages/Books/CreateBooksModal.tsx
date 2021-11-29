/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  FiX,
  FiInfo,
  FiUser,
  FiFileText,
  FiBook,
  FiFeather,
  FiBold,
  FiBookOpen,
  FiDollarSign,
  FiTag,
  FiCopy,
  FiArchive,
} from 'react-icons/fi';
import { FaCloud } from 'react-icons/fa';
import Select from 'react-select';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import useFetch from '../../hooks/useFetch';
import { useAuth } from '../../hooks/auth';

interface AppProps {
  setModalVisibility: Function;
  mutate: any;
  infoList: any;
}

interface AuthorType {
  _id: string;
  about: string;
  status: boolean;
  name: string;
  document: string;
}
interface CategoryType {
  _id: string;
  about: string;
  status: boolean;
  name: string;
}

const CreateBooksModal: React.FC<AppProps> = ({
  setModalVisibility,
  mutate,
  infoList,
}) => {
  const { data: authors } = useFetch('/author');
  const { data: categories } = useFetch('/category');
  const { data: publishers } = useFetch('/publisher');

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
  const [secondPhase, setSecondPhase] = useState<boolean>(false);
  const [image, setImage] = useState<any>();
  const [isImagePicked, setImagePicked] = useState<boolean>(false);
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues,
    control,
    watch,
  } = useForm();

  const { user } = useAuth();

  useEffect(() => {
    console.log(image);
  }, [image]);

  const watchAuthor = watch('authors') || false;
  const watchCategory = watch('categories') || false;
  const watchPublisher = watch('publisher') || false;

  const setNewCategory = useMemo(() => {
    let isTrue = false;
    if (watchCategory) {
      const isSetNewCategoryTrue = watchCategory.find((option: any) => {
        return option.value === 'set_new_category';
      });

      if (isSetNewCategoryTrue) {
        isTrue = true;
      }
    }
    return isTrue;
  }, [watchCategory]);

  const setNewAuthor = useMemo(() => {
    let isTrue = false;

    if (watchAuthor.value === 'set_new_author') {
      isTrue = true;
    }

    return isTrue;
  }, [watchAuthor]);

  const setNewPublisher = useMemo(() => {
    let isTrue = false;

    if (watchPublisher.value === 'set_new_publisher') {
      isTrue = true;
    }

    return isTrue;
  }, [watchPublisher]);

  const authorsList: any = useMemo(() => {
    const authorsOptions: any = [
      {
        label: 'Adicionar novo autor',
        value: 'set_new_author',
      },
    ];
    if (authors) {
      const validAuthors: any = authors?.filter((author: AuthorType) => {
        return author.status === true;
      });

      validAuthors.forEach((author: AuthorType) => {
        return authorsOptions.push({
          label: author.name,
          value: author._id,
        });
      });
    }
    return authorsOptions;
  }, [authors]);

  const publishersList: any = useMemo(() => {
    const publishersOptions: any = [
      {
        label: 'Adicionar nova editora',
        value: 'set_new_publisher',
      },
    ];
    if (publishers) {
      const validPublishers: any = publishers?.filter(
        (publisher: AuthorType) => {
          return publisher.status === true;
        },
      );

      validPublishers.forEach((publisher: AuthorType) => {
        return publishersOptions.push({
          label: publisher.name,
          value: publisher._id,
        });
      });
    }
    return publishersOptions;
  }, [publishers]);
  const categoriesList: any = useMemo(() => {
    const categoriesOptions: any = [
      {
        label: 'Adicionar nova categoria',
        value: 'set_new_category',
      },
    ];
    if (categories) {
      const validCategories: any = categories?.filter(
        (category: CategoryType) => {
          return category.status === true;
        },
      );

      validCategories.forEach((category: CategoryType) => {
        return categoriesOptions.push({
          label: category.name,
          value: category._id,
        });
      });
    }

    return categoriesOptions;
  }, [categories]);

  const onSubmit = useCallback(
    async data => {
      if (secondPhase) {
        try {
          const schema = Yup.object().shape({
            categories: Yup.array()
              .min(1)
              .required('É necessário escolher ao menos uma categoria'),
            authors: Yup.object().required(
              'É necessário definir o autor do livro',
            ),
          });

          if (setNewCategory) {
            const fields = getValues(['category_name', 'category_about']);
            fields.forEach((element, index) => {
              const erro: string =
                index === 0
                  ? 'Preencha o nome da categoria'
                  : 'Preencha a descrição da categoria';

              if (!element) {
                throw new Error(erro);
              }
            });
          }
          if (setNewAuthor) {
            const fields = getValues(['author_name', 'author_about']);
            fields.forEach((element, index) => {
              const erro: string =
                index === 0
                  ? 'Preencha o nome do autor'
                  : 'Preencha a descrição do autor';

              if (!element) {
                throw new Error(erro);
              }
            });
          }

          await schema.validate(data, { abortEarly: false });
          let newAuthorId = '';
          let newCategoryId = '';
          let newPublisherId = '';
          const categoryArray: string[] = [];

          if (setNewAuthor) {
            const name = getValues('author_name');
            const about = getValues('author_about');
            const res = await api.post('/author', {
              name,
              about,
            });

            newAuthorId = res.data.author._id;
          }
          if (setNewPublisher) {
            const name = getValues('publisher_name');
            const site = getValues('publisher_site');
            try {
              const res = await api.post<any>('/publisher', {
                name,
                site,
              });
              console.log(res);
              newPublisherId = res?.data?._id;
            } catch (error) {
              console.log(error);

              addToast({
                type: 'error',
                title: 'Erro ao criar editora',
                description: 'Verifique se essa editora já existe',
              });
            }
          }
          if (setNewCategory) {
            const name = getValues('category_name');
            const about = getValues('category_about');
            const res = await api.post('/category', {
              name,
              about,
            });

            newCategoryId = res.data._id;
            const filteredArray = data.categories.filter((element: any) => {
              return element.value !== 'set_new_category';
            });
            categoryArray.push(newCategoryId);
            filteredArray.forEach((element: any) => {
              categoryArray.push(element.value);
            });
          } else {
            data.categories.forEach((element: any) => {
              categoryArray.push(element.value);
            });
          }

          const author = setNewAuthor ? newAuthorId : data.authors.value;
          const publisher = setNewPublisher
            ? newPublisherId
            : data.publisher.value;
          console.log(publisher);
          const category = categoryArray;

          if (!isImagePicked) {
            throw new Error('Insira uma imagem');
          }

          const bookInfo = await api.post('/book', {
            _user: user._id,
            _category: category,
            _author: author,
            _publisher: publisher,
            name: data.title,
            description: data.about,
            quantity: data.quantity,
            location: data.location,
            language: data.language,
            pages_qty: data.pages,
            ISBN10: data.ISBN10,
            ISBN13: data.ISBN13,
          });
          console.log(image);

          const bookId = bookInfo.data.book._id;
          console.log(bookId);

          const formData: any = new FormData();
          formData.append('file', image);
          formData.append('bookId', bookId);

          console.log(formData);
          await api.post('/file', formData, {
            headers: {
              'Content-Type': `multipart/form-data;boundary=${formData._boundary}`,
            },
          });

          addToast({
            title: 'Livro criado com sucesso',
            type: 'success',
          });
          mutate(infoList, true);
        } catch (err: any) {
          if (err instanceof Yup.ValidationError) {
            err.inner.forEach((e: any) => {
              addToast({
                type: 'error',
                title: 'Erro ao criar livro',
                description: e.message,
              });
              setError(e.path, { message: e.message });
            });
          } else {
            addToast({
              title: 'Erro inesperado',
              description: err.message
                ? err.message
                : 'Aconteceu algum problema contate o suporte',
              type: `error`,
            });
          }
        }
      } else {
        try {
          if (setNewPublisher) {
            const fields = getValues(['publisher_name', 'publisher_site']);
            fields.forEach((element, index) => {
              const erro: string =
                index === 0
                  ? 'Preencha o nome da editora'
                  : 'Preencha o site da editora';

              if (!element) {
                throw new Error(erro);
              }
            });
          }
          const schema = Yup.object().shape({
            title: Yup.string().required('É necessário definir um título'),
            about: Yup.string().required('É necessário descrever o livro'),
            pages: Yup.number().required(
              'É necessário informar a quantidade de páginas',
            ),
            publisher: Yup.object().required('Informe qual a editora do livro'),
            location: Yup.string()
              .max(10)
              .required('Informa a localização do livro na biblioteca'),
            quantity: Yup.number().required(
              'Defina a quantidade de livros disponíveis',
            ),
            language: Yup.string().required('Informe a linguagem do livro'),
            ISBN10: Yup.string().required('Defina o ISBN10'),
            ISBN13: Yup.string().required('Defina o ISBN13'),
          });

          await schema.validate(data, { abortEarly: false });
          setSecondPhase(!secondPhase);
        } catch (err: any) {
          if (err instanceof Yup.ValidationError) {
            err.inner.forEach((e: any) => {
              addToast({
                type: 'error',
                title: 'Erro ao criar livro',
                description: e.message,
              });
              setError(e.path, { message: e.message });
            });
          } else {
            addToast({
              title: 'Erro inesperado',
              description: err.message
                ? err.message
                : 'Aconteceu algum problema contate o suporte',
              type: `error`,
            });
          }
        }
      }
    },
    [
      addToast,
      setError,
      secondPhase,
      setNewAuthor,
      setNewCategory,
      setNewPublisher,
      isImagePicked,
      getValues,
      user,
      image,
      mutate,
      infoList,
    ],
  );

  return (
    <div className="bg-gray-50 rounded-md p-10 h-3/4 w-full sm:h-80 md:h-auto overflow-y-scroll ">
      <div className=" space-y-3 md:space-y-6 ">
        <div className="flex items-center justify-between">
          <h1 className="font-sans font-bold text-lg">Adicionar novo livro</h1>
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`space-y-2  h-full w-full ${
              secondPhase ? 'hidden' : ''
            } transition-all duration-300`}
          >
            <Input
              icon={FiBook}
              name="title"
              placeholder="Título do livro"
              register={register('title')}
              error={errors?.title?.message}
            />
            <Input
              icon={FiFileText}
              name="about"
              placeholder="Descrição"
              register={register('about')}
              error={errors?.about?.message}
            />
            <Input
              icon={FiBookOpen}
              name="pages"
              placeholder="Quantidade de páginas"
              register={register('pages')}
              error={errors?.pages?.message}
            />

            <Input
              icon={FiArchive}
              name="location"
              placeholder="Localização"
              register={register('location')}
              error={errors?.location?.message}
            />

            <Controller
              name="publisher"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    styles={customStyles}
                    placeholder="Editora"
                    options={publishersList}
                  />
                );
              }}
            />

            {setNewPublisher ? (
              <>
                <Input
                  icon={FiUser}
                  name="publisher_name"
                  placeholder="Nome da editora"
                  register={register('publisher_name')}
                  error={errors?.publisher_name?.message}
                />

                <Input
                  icon={FiInfo}
                  name="publisher_site"
                  placeholder="Site da editora"
                  register={register('publisher_site')}
                  error={errors?.publisher_site?.message}
                />
              </>
            ) : null}
            <Input
              icon={FiCopy}
              name="quantity"
              placeholder="Quantidade de livros"
              register={register('quantity')}
              error={errors?.quantity?.message}
            />
            <Input
              icon={FiBold}
              name="language"
              placeholder="Idioma"
              register={register('language')}
              error={errors?.language?.message}
            />

            <Input
              icon={FiTag}
              name="ISBN10"
              placeholder="ISBN10"
              register={register('ISBN10')}
              error={errors?.ISBN10?.message}
            />

            <Input
              icon={FiTag}
              name="ISBN13"
              placeholder="ISBN13"
              register={register('ISBN13')}
              error={errors?.ISBN13?.message}
            />
          </div>
          <div
            className={`space-y-3 h-124 flex flex-col justify-center ${
              secondPhase ? '' : 'hidden'
            } transition-all duration-300`}
          >
            <label
              className="border border-solid border-gray-400 w-48 h-28 flex flex-col items-center justify-evenly self-center  "
              htmlFor="file-upload"
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={e => {
                  const imageFile = e?.target?.files[0] || null;
                  setImage(imageFile);
                  setImagePicked(true);
                }}
              />
              <i className="text-5xl">
                <FaCloud />
              </i>
              Adicione a Capa
            </label>
            {isImagePicked ? (
              <div className="flex justify-evenly items-center h-7 w-full">
                <p>
                  Imagem Selecionada:
                  {image.name}
                </p>
                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-red-600 hover:text-white transition-colors duration-300"
                  onClick={() => {
                    setImage(null);
                    setImagePicked(false);
                  }}
                >
                  <FiX />
                </button>
              </div>
            ) : null}
            <Controller
              name="categories"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    styles={customStyles}
                    placeholder="Categorias"
                    options={categoriesList}
                    isMulti
                  />
                );
              }}
            />

            {setNewCategory ? (
              <>
                <Input
                  icon={FiUser}
                  name="category_name"
                  placeholder="Categoria"
                  register={register('category_name')}
                  error={errors?.new_category?.message}
                />

                <Input
                  icon={FiInfo}
                  name="category_about"
                  placeholder="Descrição da categoria"
                  register={register('category_about')}
                  error={errors?.category_about?.message}
                />
              </>
            ) : null}
            <Controller
              name="authors"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    styles={customStyles}
                    placeholder="Autores"
                    options={authorsList}
                  />
                );
              }}
            />

            {setNewAuthor ? (
              <>
                <Input
                  icon={FiUser}
                  name="new_author"
                  placeholder="Nome do Autor"
                  register={register('author_name')}
                  error={errors?.new_author?.message}
                />

                <Input
                  icon={FiInfo}
                  name="author_about"
                  placeholder="Descrição do autor"
                  register={register('author_about')}
                  error={errors?.author_about?.message}
                />
              </>
            ) : null}
          </div>
          <div className="display flex items-center w-full h-20 justify-end ">
            <Button
              title={secondPhase ? 'Criar Livro' : 'Próximo Passo'}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBooksModal;
