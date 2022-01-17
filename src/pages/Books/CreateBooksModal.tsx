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

  const [page, setPage] = useState<number>(0);
  const [bookImage, setBookImage] = useState<any>('capa-default.png');
  const [isImagePicked, setImagePicked] = useState<boolean>(false);

  const title = [
    'Insira os dados do livro',
    'Selecione os dados do livro',
    'Selecione uma capa'
  ];

  console.log('Page: ', page);

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
    console.log('firstPage()');

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
    console.log('secondPage()');

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
    console.log('thirdPage()');

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

  const PageDisplay = (): any => {
    if (page === 0) {
      return firstPage();
    } if (page === 1) {
      return secondPage();
    } if (page === 2) {
      return thirdPage();
    }

    return null;
  };

  return (
    <div className="bg-gray-50 rounded-md p-10 w-full sm:h-80 md:h-auto">
      <div className="space-y-3">
        <div className="flex-col items-center">
          <div className="flex justify-between">
            <h1 className="font-sans font-bold text-lg">Adicionar novo livro</h1>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-red-600 hover:text-white transition-colors duration-300"
              onClick={() => {setModalVisibility(false)}}
            >
              <FiX />
            </button>
          </div>
          <div className="flex pb-5">
            <h3>{title[page]}</h3>
          </div>
        </div>

        <div className="form">
          <div className="space-y-2 h-auto w-full">
            {PageDisplay()}
          </div>

          <div className="display flex items-center w-full h-auto justify-end pt-5">
            <Button
              title="Voltar"
              type="submit"
              hidden={page === 0}
              onClick={() => setPage((currentPage) => currentPage - 1)}
            />
            <Button
              title="Próximo"
              type="submit"
              hidden={page === 2}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooksModal;
