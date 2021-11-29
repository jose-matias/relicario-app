import { Tooltip } from 'antd';
import React, { useMemo } from 'react';

import { BiDollar, BiError, BiStopwatch } from 'react-icons/bi';
import { RiRefund2Fill } from 'react-icons/ri';

// import { Container } from './styles';

interface IconStatusProps {
  status: 'paid' | 'refunded' | 'refused' | 'waiting_payment' | 'processing';
}

const IconStatus: React.FC<IconStatusProps> = ({ status }) => {
  const option = useMemo(() => {
    const validKeys = [
      'paid',
      'refunded',
      'refused',
      'waiting_payment',
      'processing',
    ];
    return validKeys.find(item => item === status) || 'processing';
  }, [status]);

  const types = {
    paid: <BiDollar />,
    refunded: <RiRefund2Fill />,
    refused: <BiError />,
    waiting_payment: <BiStopwatch />,
    processing: <BiStopwatch />,
  };

  const colors = {
    paid: 'green',
    refunded: 'purple',
    refused: 'red',
    waiting_payment: 'yellow',
    processing: 'yellow',
  };

  const titles = {
    paid: 'Paga',
    refunded: 'Estornada',
    refused: 'Recusada',
    waiting_payment: 'Aguardando pagamento',
    processing: 'Aguardando pagamento',
  };

  const Icon = () => {
    return types[option as 'processing'];
  };

  const color = colors[option as 'processing'];

  const title = titles[option as 'processing'];

  return (
    <Tooltip title={title}>
      <div
        className={`flex items-center justify-center h-8 w-8 rounded-full bg-${color}-100 text-${color}-500`}
      >
        <Icon />
      </div>
    </Tooltip>
  );
};

export default IconStatus;
