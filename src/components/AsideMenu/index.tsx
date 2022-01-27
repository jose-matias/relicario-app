import React from 'react';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';
import AsideMenuItem from '../AsideMenuItem';

interface AsideMenuProps {
  className?: string;
}

const AsideMenu: React.FC<AsideMenuProps> = ({ className }) => {
  const { signOut } = useAuth();
  return (
    <aside className={className}>
      <nav className=" bg-white py-4 w-full lg:w-64 divide-y divide-gray-100 shadow-sm rounded-md">
        <AsideMenuItem title="Meu Perfil" icon={FiUser} path="/perfil" />
      </nav>
      <footer className="bg-white w-full lg:w-64 mt-4 grid p-4 shadow-sm rounded-md ">
        <button
          onClick={signOut}
          className="rounded p-2 px-4 border bg-red-500 text-white"
          type="button"
        >
          Sair
        </button>
      </footer>
    </aside>
  );
};

export default AsideMenu;
