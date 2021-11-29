import React from 'react';
import AppProvider from './hooks';
import Routes from './routes';
import './styles/global.scss';

const src: React.FC = () => {
  return (
    <AppProvider>
      <Routes />
    </AppProvider>
  );
};

export default src;
