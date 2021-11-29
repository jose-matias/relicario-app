import React from 'react';
import Navbar from '../../components/Navbar';
import Header from '../../components/Header';
import Stats from '../../components/Stats';
import PageLayout from '../../components/PageLayout';
import BooksContainer from '../../components/BooksContainer';

// import { Container } from './styles';

const Home: React.FC = () => {
  return (
    <PageLayout>
      <>
        <section className="w-full h-full flex justify-center items-center">
          <BooksContainer />
        </section>
      </>
    </PageLayout>
  );
};

export default Home;
