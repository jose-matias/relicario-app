import React from 'react';
import Navbar from '../Navbar';
import NavbarMobile from '../NavbarMobile';
import { Content, Container } from './styles';

interface PageLayoutProps {
  header?: React.FC;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  header: Header,
  children,
}) => {
  return (
    <>
      <Navbar />
      <Container>
        {!!Header && <Header />}
        <Content>{children}</Content>
      </Container>
      <NavbarMobile />
    </>
  );
};

export default PageLayout;
