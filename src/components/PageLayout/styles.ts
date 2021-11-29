import styled from 'styled-components';

export const Content = styled.section`
  width: 100%;
  height: 100%;
  max-width: 80rem;
  margin: 0 auto;
  @media (min-width: 640px) {
    max-width: 640px;
  }

  @media (min-width: 768px) {
    max-width: 768px;
  }

  @media (min-width: 1024px) {
    max-width: 1024px;
  }

  @media (min-width: 1280px) {
    max-width: 1280px;
  }

  @media (min-width: 1536px) {
    max-width: 1536px;
  }
`;

export const Container = styled.main`
  width: 100%;
  min-height: calc(100% - 4rem);

  padding: 4rem 0rem 4rem 0rem;
`;
