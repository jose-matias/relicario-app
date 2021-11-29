import React from 'react';
import {
  FiUsers,
  FiLayout,
  FiArrowLeft,
  FiTool,
  FiBook,
  FiTag,
  FiEdit2,
  FiUser,
  FiCheckCircle,
  FiBookOpen,
} from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import NavbarItem from '../NavbarItem';
import { useAuth } from '../../hooks/auth';

const Navbar: React.FC = () => {
  const { goBack } = useHistory();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  return (
    <nav className="fixed w-full bg-primary-500 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex w-full items-center space-x-4 justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                type="button"
                className="text-white text-lg p-2"
              >
                <FiArrowLeft />
              </button>
              <div className="flex-shrink-0">
                <Link to="/dashboard" />
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden lg:block">
                <div className="flex items-baseline gap-2">
                  <NavbarItem
                    title="Inicio"
                    path="/dashboard"
                    icon={FiLayout}
                  />
                  {isAdmin ? (
                    <>
                      <NavbarItem
                        title="Usuários"
                        path="/users"
                        icon={FiUsers}
                      />
                      <NavbarItem title="Livros" path="/books" icon={FiBook} />
                      <NavbarItem
                        title="Autores"
                        path="/authors"
                        icon={FiEdit2}
                      />
                      <NavbarItem
                        title="Categorias"
                        path="/categories"
                        icon={FiTag}
                      />
                      <NavbarItem
                        title="Editoras"
                        path="/publisher"
                        icon={FiBookOpen}
                      />
                    </>
                  ) : null}
                  <NavbarItem
                    title="Reservas"
                    path="/reserves"
                    icon={FiCheckCircle}
                  />
                  <NavbarItem title="Perfil" path="/perfil" icon={FiUser} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
