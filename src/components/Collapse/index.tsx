import React from 'react';

import { Container } from './styles';

interface CollapseProps {
  toggle: boolean;
  className?: string;
}

const Collapse: React.FC<CollapseProps> = ({ toggle, className, children }) => {
  return (
    <Container className={className as string} toggle={toggle}>
      {children}
    </Container>
  );
};

export default Collapse;
