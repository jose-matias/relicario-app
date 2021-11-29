/* eslint-disable react/button-has-type */
import React, { InputHTMLAttributes } from 'react';

interface ButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
  title: string;
  active?: boolean;
  type?: 'button' | 'reset' | 'submit';
}

const ActiveButton: React.FC<ButtonProps> = ({
  title,
  active,
  type = 'button',
  ...rest
}) => {
  const activeStyle =
    !!active &&
    'bg-primary-500 text-white hover:border-gray-400 border-primary-500';
  return (
    <button
      className={`px-3 py-1 text-sm  rounded border  border-gray-300 ${
        activeStyle || 'hover:border-primary-500'
      }`}
      type={type}
      {...rest}
    >
      {title}
    </button>
  );
};

export default ActiveButton;
