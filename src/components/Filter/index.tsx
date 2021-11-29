import { format } from 'date-fns';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import Input from '../Input';

import Modal from '../Modal';

interface FilterProps {
  visible: boolean;
  startDate?: Date;
  endDate?: Date;
  onClose(): void;
}

const Filter: React.FC<FilterProps> = ({
  visible,
  onClose,
  startDate = new Date(),
  endDate = new Date(),
}) => {
  const history = useHistory();
  const [dates, setDates] = useState({
    from: format(startDate, 'yyyy-MM-dd'),
    to: format(endDate, 'yyyy-MM-dd'),
  });
  const [status, setStatus] = useState('');
  const clearFilter = useCallback(() => {
    onClose();
    history.push('/dashboard');
  }, [history, onClose]);

  const handleFilter = useCallback(() => {
    history.push({
      pathname: '/dashboard',
      search: `?startDate=${dates.from}&endDate=${dates.to}${
        status && `&status=${status}`
      }`,
    });
    onClose();
  }, [dates, status, history, onClose]);

  return (
    <Modal
      visible={visible}
      size="sm"
      onClose={() => {
        history.push({
          search: `?startDate=${format(new Date(), 'yyyy-MM-dd')}`,
        });
      }}
    >
      <div className="bg-white rounded-md shadow-lg ">
        <header className="flex items-center justify-between p-4 bg-primary-500 text-white rounded-t-md">
          <span>Filtrar</span>
          <button
            onClick={clearFilter}
            type="button"
            className="flex items-center gap-4 text-sm text-white text-opacity-50 hover:text-opacity-100 hover:underline"
          >
            Limpar
          </button>
        </header>
        <form>
          <div className="bg-white px-2">
            <div className="flex w-full flex-col divide-y divide-gray-100">
              <div className="">
                <label
                  htmlFor="paid"
                  className="flex items-center justify-between p-2 cursor-pointer"
                >
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                    <span className="text-sm">Pago</span>
                  </div>
                  <input
                    id="paid"
                    value="paid"
                    checked={status === 'paid'}
                    onChange={event => setStatus(event.target.value)}
                    type="radio"
                    className="text-primary-500 bg-primary-500"
                  />
                </label>
              </div>
              <div className="">
                <label
                  htmlFor="refunded"
                  className="flex items-center justify-between p-2 cursor-pointer"
                >
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-sm">Estornado</span>
                  </div>
                  <input
                    id="refunded"
                    value="refunded"
                    checked={status === 'refunded'}
                    type="radio"
                    onChange={event => setStatus(event.target.value)}
                    className="text-primary-500 bg-primary-500"
                  />
                </label>
              </div>
              <div className="">
                <label
                  htmlFor="refused"
                  className="flex items-center justify-between p-2 cursor-pointer"
                >
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">Recusado</span>
                  </div>
                  <input
                    type="radio"
                    id="refused"
                    value="refused"
                    checked={status === 'refused'}
                    onChange={event => setStatus(event.target.value)}
                    className="text-primary-500 bg-primary-500"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="px-3 bg-white p-2 mt-2">
            <div className="flex w-full flex-col divide-y">
              <div className="grid md:grid-cols-2 items-center gap-2">
                <Input
                  name="startDate"
                  type="date"
                  value={dates.from}
                  onChange={event => {
                    setDates(state => ({ ...state, from: event.target.value }));
                  }}
                />
                <Input
                  name="startDate"
                  type="date"
                  value={dates.to}
                  onChange={event => {
                    setDates(state => ({ ...state, to: event.target.value }));
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <footer className="flex justify-end p-3 gap-2 rounded-b-md bg-white">
        <button
          onClick={onClose}
          type="button"
          className="p-1 px-2 bg-gray-200 text-sm text-gray-700 rounded"
        >
          CANCELAR
        </button>
        <button
          onClick={handleFilter}
          type="button"
          className="p-1 px-2 bg-primary-500 text-sm text-white rounded"
        >
          ADICIONAR FILTRO
        </button>
      </footer>
    </Modal>
  );
};

export default Filter;
