import React from 'react';
import { useSpring } from 'react-spring';
import { Background, ModalWrapper } from './styles';

interface ModalProps {
  visible: boolean;
  onClose(): void;
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

const Modal: React.FC<ModalProps> = ({ visible, size = 'lg', children }) => {
  const animationModalWrapper = useSpring({
    config: {
      duration: 250,
    },
    opacity: visible ? 1 : 0,
    transform: visible ? `translateY(0%)` : `translateY(+100%)`,
  });

  const animationBackground = useSpring({
    config: {
      duration: 150,
    },
    opacity: visible ? 1 : 0,
  });

  return visible ? (
    <Background style={animationBackground}>
      <ModalWrapper
        className={`w-full max-h-lg p-4 max-w-${size}`}
        style={animationModalWrapper}
      >
        {children}
      </ModalWrapper>
    </Background>
  ) : null;
};

export default Modal;
