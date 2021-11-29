import React, { useEffect } from 'react';
import { FiAlertCircle, FiX, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { ToastMessage, useToast } from '../../../hooks/toast';

import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  success: <FiCheckCircle size={24} />,
  error: <FiAlertCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  const messageTypes = {
    success: 'bg-primary-500 text-white',
    info: 'bg-blue-500 text-white',
    error: 'bg-red-600 text-white',
    default: 'bg-gray-600 text-white',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message.id, removeToast]);

  return (
    <Container
      style={style}
      className={`w-full sm:4/5 sm:rounded-lg  p-3 m-0 text-md ${
        messageTypes[message.type || 'default']
      }`}
    >
      {icons[message.type || 'info']}
      <div className="text-sm">
        <strong>{message.title}</strong>
        {message.description && <span>{message.description}</span>}
      </div>
      <button onClick={() => removeToast(message.id)} type="button">
        <FiX size={18} />
      </button>
    </Container>
  );
};

export default Toast;
