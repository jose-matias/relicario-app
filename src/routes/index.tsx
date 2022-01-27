import React from 'react';
import { Switch, BrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

import Route from './Route';

import Home from '../pages/Home';
import HomeAdmin from '../pages/HomeAdmin';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Users from '../pages/Users';
import Category from '../pages/Category';
import Books from '../pages/Books';
import BookDetails from '../pages/BookDetails';
import Author from '../pages/Author';
import Reserve from '../pages/Reserves';
import Publisher from '../pages/Publishers';
import RecoverPassword from '../pages/RecoverPassword';
import Profile from '../pages/Profile';
import Suggestion from '../pages/Suggestion';

const Routes: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={SignIn} />
        <Route path="/cadastro" exact component={SignUp} />
        <Route path="/recuperar-senha" exact component={RecoverPassword} />
        <Route
          path="/dashboard"
          isPrivate
          exact
          component={isAdmin ? HomeAdmin : Home}
        />
        <Route path="/users" isPrivate exact component={Users} />
        <Route path="/books" isPrivate exact component={Books} />
        <Route path="/categories" isPrivate exact component={Category} />
        <Route path="/authors" isPrivate exact component={Author} />
        <Route path="/reserves" isPrivate exact component={Reserve} />
        <Route path="/publisher" isPrivate exact component={Publisher} />
        <Route path="/sugestion" isPrivate exact component={Suggestion} />
        <Route path="/book/:id" isPrivate exact component={BookDetails} />
        <Route path="/perfil" isPrivate exact component={Profile} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
