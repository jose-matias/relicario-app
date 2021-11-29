import React from 'react';
import ActiveButton from '../../components/ActiveButton';

// import { Container } from './styles';

const Logout: React.FC = () => {
  return (
    <div className="container p-4 justify-center items-center">
      <div className="w-full justify-around items-center">
        <ActiveButton title="Cancelar" active />
        <ActiveButton title="Sair" />
      </div>
    </div>
  );
};

export default Logout;
