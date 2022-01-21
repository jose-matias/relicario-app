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
import ToggleSwitch from '../../components/ToggleSwitch';

interface AppProps {
  id: string;
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
  id,
  setModalVisibility,
  mutate,
  infoList,
}) => {
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
  const { addToast } = useToast();
  const [page, setPage] = useState<number>(0);
  const [bookImage, setBookImage] = useState<any>('capa-default.png');
  const [isBookActive, setIsBookActive] = useState<boolean>(true);
  const [submitForm, setSubmitForm] = useState<boolean>(false);

  const subtitle = [
    'Insira os dados do livro',
    'Selecione os dados do livro',
    'Selecione uma capa'
  ];

  const { data: authors } = useFetch('/author');
  const { data: categories } = useFetch('/category');
  const { data: publishers } = useFetch('/publisher');

  const watchAuthor = watch('authors') || false;
  const watchCategory = watch('categories') || false;
  const watchPublisher = watch('publisher') || false;

  /* Controll Author */
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

  const setNewAuthor = useMemo(() => {
    let isTrue = false;

    if (watchAuthor.value === 'set_new_author') {
      isTrue = true;
    }

    return isTrue;
  }, [watchAuthor]);

  /* Controll Category */
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

  /* Controll Publisher */
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

  const setNewPublisher = useMemo(() => {
    let isTrue = false;

    if (watchPublisher.value === 'set_new_publisher') {
      isTrue = true;
    }

    return isTrue;
  }, [watchPublisher]);

  /* Controll Upload Image */
  const imageHandler = (event: any) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === reader.DONE) {
        setBookImage(reader.result);
      }
    }

    reader.readAsDataURL(event.target.files[0]);
  }

  function firstPage() {
    return (
      <>
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
          type="number"
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

        <Input
          icon={FiCopy}
          name="quantity"
          type="number"
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
      </>
  );
  }

  function secondPage() {
    const customStyles = {
      control: (base: any, state: any) => ({
        ...base,
        boxShadow: state.isFocused ? 0 : 0,
        borderColor: state.isFocused ? '#E5E7EB' : '#E5E7EB',
        '&:hover': {
          borderColor: '#E5E7EB',
          border: '1px solid rgba(31, 120, 76)',
        },
      }),
    };

    return (
      <>
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
              name="author_name"
              placeholder="Nome do Autor"
              register={register('author_name')}
              error={errors?.author_name?.message}
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
              error={errors?.category_name?.message}
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
      </>
    );
  }

  function thirdPage() {
    return (
      <>
        <div className="flex-col w-full">
          <div className="flex items-center justify-center">
            <img
              src={bookImage}
              alt=""
              className="border-solid border-2 border-green-500"
              style={{ width: 200, height: 267 }}
            />
          </div>

          <div className="flex items-center justify-center pt-5">
            <label className="p-1 focus-within:bg-gray-500 rounded m-1 text-gray-500 ring-1 ring-gray-500" htmlFor="file-upload">
              <input
                type="file"
                id="file-upload"
                className="hidden p-1 focus-within:bg-gray-500 rounded m-1 text-gray-500 ring-1 ring-gray-500"
                onChange={imageHandler}
              />
              Selecionar capa
            </label>
          </div>

        </div>
      </>
    );
  }

  const PageDisplay = () => {
    if (page === 0) {
      return firstPage();
    } if (page === 1) {
      return secondPage();
    } if (page === 2) {
      return thirdPage();
    }

    return null;
  };

  async function formValidatorAndCtrlPage(ctrl: 'prev' | 'next'): Promise<any> {
    try {
      if (ctrl === 'next' && page === 0) {
        const schemaFirstPage = Yup.object().shape({
          title: Yup.string().required('É necessário definir um título'),
          about: Yup.string().required('É necessário descrever o livro'),
          pages: Yup.string().required('É necessário informar a quantidade de páginas'),
          location: Yup.string().required('Informa a localização do livro na biblioteca'),
          quantity: Yup.string().required('Defina a quantidade de livros disponíveis'),
          language: Yup.string().required('Informe a linguagem do livro'),
          ISBN10: Yup.string().required('Defina o ISBN10'),
          ISBN13: Yup.string().required('Defina o ISBN13'),
        });

        await schemaFirstPage.validate(getValues(), { abortEarly: false });

        setPage((currentPage) => currentPage + 1);
      } else if (ctrl === 'next' && page === 1) {
        const schemaSecondPage = Yup.object().shape({
          authors: Yup.object().required('É necessário definir o autor do livro'),
          categories: Yup.array().min(1).required('É necessário escolher ao menos uma categoria'),
          publisher: Yup.object().required('Informe qual a editora do livro'),
        });

        if (setNewAuthor) {
          const schemaNewAuthor = Yup.object().shape({
            author_name: Yup.string().required('Preencha o nome do autor'),
            author_about: Yup.string().required('Preencha a descrição do autor'),
          });

          await schemaNewAuthor.validate(getValues(), { abortEarly: false });
        }

        if (setNewCategory) {
          const schemaNewCategory = Yup.object().shape({
            category_name: Yup.string().required('Preencha o nome da categoria'),
            category_about: Yup.string().required('Preencha a descrição da categoria'),
          });

          await schemaNewCategory.validate(getValues(), { abortEarly: false });
        }

        if (setNewPublisher) {
          const schemaNewPublisher = Yup.object().shape({
            publisher_name: Yup.string().required('Preencha o nome da editora'),
            publisher_site: Yup.string().required('Preencha o site da editora'),
          });

          await schemaNewPublisher.validate(getValues(), { abortEarly: false });
        }

        await schemaSecondPage.validate(getValues(), { abortEarly: false });

        setPage((currentPage) => currentPage + 1);
      } else if (ctrl === 'prev' && page === 1) {
        setPage((currentPage) => currentPage - 1);
      } else if (ctrl === 'prev' && page === 2) {
        setPage((currentPage) => currentPage - 1);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((e: any) => {
          addToast({
            type: 'error',
            title: 'Erro ao criar livro',
            description: e.message,
          });

          setError(e.path, { message: e.message });
        });
      }
    }

    return null;
  }

  const findBook = (bookId: string) => {
    api.get(`/book/${bookId}`).then(response => {
      const { data } = response;

      console.log(data);


      if (data) {
        const {
          _category,
          ISBN10,
          ISBN13,
          _author,
          name,
          _publisher,
          language,
          pages_qty,
          location,
          quantity,
          cover,
          status,
          description,
        } = data;

        const category: any = [];

        _category.forEach((item: any) => {
          category.push({
            label: item.name,
            value: item._id,
          });
        });

        setValue('title', name);
        setValue('ISBN10', ISBN10);
        setValue('ISBN13', ISBN13);
        setValue('about', description);
        setValue('pages', pages_qty);
        setValue('location', location);
        setValue('quantity', quantity);
        setValue('publisher', {
          label: _publisher.name,
          value: _publisher._id,
        });
        setValue('language', language);
        setValue('authors', {
          label: _author.name,
          value: _author._id,
        });
        setValue('categories', category);

        setIsBookActive(status);
        setBookImage(cover);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  useEffect(() => {
    if (id) {
      findBook(id);
    }
  }, [id]);

  const onSubmit = useCallback(
    async data => {
      if (page === 2 && id === null) {

        let newAuthorId = '';
        let newCategoryId = '';
        let newPublisherId = '';
        const categoryArray: string[] = [];

        if (setNewAuthor) {
          const name = getValues('author_name');
          const about = getValues('author_about');

          const response = await api.post('/author', {
            name,
            about,
          });

          newAuthorId = response?.data?._id;
        }

        if (setNewCategory) {
          const name = getValues('category_name');
          const about = getValues('category_about');

          const response = await api.post('/category', {
            name,
            about,
          });

          newCategoryId = response?.data?._id;

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

        if (setNewPublisher) {
          const name = getValues('publisher_name');
          const site = getValues('publisher_site');

          const response = await api.post('/publisher', {
            name,
            site,
          });

          newPublisherId = response?.data?._id;
        }

        const author = setNewAuthor ? newAuthorId : data.authors.value;
        const publisher = setNewPublisher ? newPublisherId : data.publisher.value;
        const category = categoryArray;

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

        const bookId = bookInfo.data._id;

        console.log('bookId: ', bookId);

        const formData: any = new FormData();

        formData.append('file', bookImage.file);
        formData.append('bookId', bookId);

        console.log(formData);

        await api.post('/file', formData, {
          headers: {
            'Content-Type': `multipart/form-data;boundary=${formData._boundary}`,
          },
        });

        addToast({
          title: id ? 'Livro editado com sucesso' : 'Livro criado com sucesso',
          type: 'success',
        });

        mutate(infoList, true);
        setModalVisibility(false);
      } else if (page === 2 && id !== null) {
        console.log(data);
      }
    },
    [page, submitForm],
  );

  return (
    <div className="bg-gray-50 rounded-md p-10 w-full sm:h-80 md:h-auto">
      <div className="space-y-3">
        <div className="flex-col items-center">
          <div className="flex justify-between">
            <h1 className="font-sans font-bold text-lg">
              {id ? 'Editar Livro' : 'Adicionar novo livro'}
            </h1>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-red-600 hover:text-white transition-colors duration-300"
              onClick={() => {setModalVisibility(false)}}
            >
              <FiX />
            </button>
          </div>
          <div className="flex pb-5">
            <h3>{subtitle[page]}</h3>
          </div>
        </div>

        <div className={`flex items-center justify-end space-x-3 pb-3 ${page !== 0 ? 'hidden' : ''}`}>
          <span>{isBookActive ? 'Livro Ativo' : 'Livro inativo'}</span>
          <ToggleSwitch
            isToggled={isBookActive}
            onToggle={() => setIsBookActive(!isBookActive)}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <div className="space-y-2 h-auto w-full">
            {PageDisplay()}
          </div>

          <div className="display flex items-center w-full h-auto justify-end pt-5">
            <Button
              title="Voltar"
              type="button"
              hidden={page === 0}
              onClick={() => formValidatorAndCtrlPage('prev')}
            />
            <Button
              title="Próximo"
              type={page === 2 ? "button" : "submit"}
              hidden={page === 2}
              onClick={() => formValidatorAndCtrlPage('next')}
            />
            <Button
              title={id ? 'Salvar Livro' : 'Criar Livro'}
              type="submit"
              hidden={page !== 2}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBooksModal;
