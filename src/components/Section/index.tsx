import React from 'react';
import { useSpring } from 'react-spring';
import { Background } from './styles';

interface SectionProps {
  visible: boolean;
  zIndex: number;
}

export const Section: React.FC<SectionProps> = ({
  visible,
  zIndex,
  children,
}) => {
  const animationBackground = useSpring({
    config: {
      duration: 250,
    },
    opacity: visible ? 1 : 0,
    transform: visible ? `translateX(0%)` : `translateX(-100%)`,
    display: visible ? 'flex' : 'none',
  });

  return (
    <Background zIndex={zIndex} style={animationBackground}>
      {children}
    </Background>
  );

  return visible ? (
    <Background zIndex={zIndex} style={animationBackground}>
      {children}
    </Background>
  ) : null;
};
