import React, { useMemo } from 'react';
import { Column, ColumnConfig } from '@ant-design/charts';
import { FiUsers, FiBook, FiUser, FiBookmark } from 'react-icons/fi';
import { format } from 'date-fns';
import Stats from '../../components/Stats';
import PageLayout from '../../components/PageLayout';
import useFetch from '../../hooks/useFetch';

interface LastAddedBooks {
  date: Date;
  books: number;
}

interface Dashboard {
  users: number;
  books: number;
  categories: number;
  authors: number;
  lastAddedBooks: Array<LastAddedBooks>;
}

const HomeAdmin: React.FC = () => {
  const { data: dashboard } = useFetch<Dashboard>('/dashboard');

  const allUsers = useMemo(() => {
    const users = dashboard?.users || 0;
    return users.toString();
  }, [dashboard]);

  const allBooks = useMemo(() => {
    const books = dashboard?.books || 0;
    return books.toString();
  }, [dashboard]);

  const allAuthors = useMemo(() => {
    const authors = dashboard?.authors || 0;
    return authors.toString();
  }, [dashboard]);

  const allCategories = useMemo(() => {
    const categories = dashboard?.categories || 0;
    return categories.toString();
  }, [dashboard]);

  const chartData = useMemo(() => {
    const lastAddedBooks = dashboard?.lastAddedBooks || [];

    return lastAddedBooks.map(item => {
      return {
        type: format(new Date(item.date), 'dd/MM/yyyy'),
        sales: item.books,
      };
    });
  }, [dashboard]);

  const config: ColumnConfig = {
    data: chartData,
    color: '#1F784C',
    xField: 'type',
    yField: 'sales',
    appendPadding: 15,
    height: 300,
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      type: { alias: 'Category' },
      sales: {
        alias: 'Cadastros',
      },
    },
  };

  return (
    <PageLayout>
      <>
        <section className="flex mt-4 w-full space-y-4 flex-col lg:space-y-0 lg:flex-row lg:space-x-4 sm:px-4">
          <div className="flex-1 flex flex-col gap-4 ">
            <div className=" bg-white p-4 divide-y divide-gray-100 shadow-sm rounded-md ">
              <header className="pb-4 flex items-center justify-between text-3xl">
                <span>Resumo</span>
              </header>
              <div className="grid w-full grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <Stats title="Usuários" value={allUsers} icon={FiUsers} />
                <Stats title="Livros" value={allBooks} icon={FiBook} />
                <Stats title="Autores" value={allAuthors} icon={FiUser} />
                <Stats
                  title="Categorias"
                  value={allCategories}
                  icon={FiBookmark}
                />
              </div>

              <header className="pb-4 flex items-center justify-between text-base text-gray-500 mt-10">
                <span>Cadastro de livros na última semana</span>
              </header>
              <div className="grid w-full grid-cols-1 sm:grid-cols-1">
                <Column {...config} />
              </div>
            </div>
          </div>
        </section>
      </>
    </PageLayout>
  );
};

export default HomeAdmin;
