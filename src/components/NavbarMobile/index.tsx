import React from 'react';
import {
  FiLayout,
  FiEdit2,
  FiTag,
  FiUsers,
  FiBook,
  FiCheckCircle,
  FiUser,
  FiBookOpen,
} from 'react-icons/fi';
import NavbarItem from '../NavbarItem';
import { useAuth } from '../../hooks/auth';

const NavbarMobile: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  return (
    <nav
      className={`fixed flex flex-nowrap gap-4 p-4 bottom-0 h-14 bg-primary-500 w-full ${
        isAdmin ? '' : 'justify-evenly'
      } items-center lg:hidden overflow-x-auto overflow-y-hidden`}
    >
      <NavbarItem path="/dashboard" title="Resumo" icon={FiLayout} />
      {isAdmin ? (
        <>
          <NavbarItem path="/books" title="Livros" icon={FiBook} />
          <NavbarItem title="Usuários" path="/users" icon={FiUsers} />
          <NavbarItem title="Autores" path="/authors" icon={FiEdit2} />
          <NavbarItem title="Categorias" path="/categories" icon={FiTag} />
          <NavbarItem title="Editoras" path="/publisher" icon={FiBookOpen} />
          <NavbarItem title="Sugestão" path="/sugestion" icon={FiBookOpen} />
        </>
      ) : null}
      <NavbarItem title="Reservas" path="/reserves" icon={FiCheckCircle} />

      <NavbarItem title="Perfil" path="/perfil" icon={FiUser} />
    </nav>
  );
};

export default NavbarMobile;
