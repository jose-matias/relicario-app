import styled, { css } from 'styled-components';

interface ContainterProps {
  toggle: boolean;
}

export const Container = styled.div<ContainterProps>`
  max-height: 0;
  transition: max-height 0.4s ease-out;
  overflow: hidden;
  ${({ toggle }) =>
    toggle &&
    css`
      transition: max-height 0.8s ease-in;
      max-height: 180rem;
    `};
`;
