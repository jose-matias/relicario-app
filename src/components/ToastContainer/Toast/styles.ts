import styled from 'styled-components';
import { animated } from 'react-spring';

export const Container = styled(animated.div)`
  position: relative;
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
  z-index: 9999999999;

  display: flex;
  align-items: center;

  > svg {
    margin: 4px 12px 0 0;
  }
  div {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
  }
  span {
    margin-top: 4px;
    opacity: 0.8;
    line-height: 20px;
    margin-right: 3px;
  }
  button {
    opacity: 0.6;
    border: 0;
    background: transparent;
    color: inherit;
    display: flex;
    align-items: center;
  }
  & + div {
    margin-top: 8px;
  }
`;
