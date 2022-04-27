import React, { useMemo } from 'react';
import { Column, ColumnConfig } from '@ant-design/charts';
import { FiUsers, FiBook, FiBookmark } from 'react-icons/fi';
import Stats from '../../components/Stats';
import PageLayout from '../../components/PageLayout';
import useFetch from '../../hooks/useFetch';

interface DataGraph {
  label: string;
  value: number;
}

interface Dashboard {
  inactiveUsers: number;
  suggestionReview: number;
  reservedBooks: number;
  borrowedBooks: number;
  dataGraph: Array<DataGraph>;
}

const HomeAdmin: React.FC = () => {
  const { data: dashboard } = useFetch<Dashboard>('/dashboard');

  const inativesUsers = useMemo(() => {
    const data = dashboard?.inactiveUsers || 0;
    return data.toString();
  }, [dashboard]);

  const suggestionReview = useMemo(() => {
    const data = dashboard?.suggestionReview || 0;
    return data.toString();
  }, [dashboard]);

  const reservedBooks = useMemo(() => {
    const data = dashboard?.reservedBooks || 0;
    return data.toString();
  }, [dashboard]);

  const borrowedBooks = useMemo(() => {
    const data = dashboard?.borrowedBooks || 0;
    return data.toString();
  }, [dashboard]);

  const chartData = useMemo(() => {
    const dataGraph = dashboard?.dataGraph || [];

    return dataGraph.map(item => {
      return {
        label: item.label,
        value: item.value,
      };
    });
  }, [dashboard]);

  const config: ColumnConfig = {
    data: chartData,
    color: '#1F784C',
    xField: 'label',
    yField: 'value',
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
      value: {
        alias: 'Quant.',
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
                <Stats title="Usuários inativos" value={inativesUsers} icon={FiUsers} />
                <Stats title="Sugestões analisadas" value={suggestionReview} icon={FiBookmark} />
                <Stats title="Livros reservados hoje" value={reservedBooks} icon={FiBook} />
                <Stats title="Livros emprestados hoje" value={borrowedBooks} icon={FiBook} />
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
