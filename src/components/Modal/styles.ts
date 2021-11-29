import styled from 'styled-components';
import { animated } from 'react-spring';

export const Background = styled(animated.div)`
  width: 100%;
  height: 100vh;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: saturate(180%) blur(20px);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalWrapper = styled(animated.div)`
  display: grid;
  position: relative;
  z-index: 1010;
  border-radius: 0.5rem;
`;
