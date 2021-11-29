import styled from 'styled-components';
import { animated } from 'react-spring';

interface BackgroundProps {
  zIndex: number;
}

export const Background = styled(animated.div)<BackgroundProps>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${props => props.zIndex};
`;
