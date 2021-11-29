/* eslint-disable react/button-has-type */
import React, { InputHTMLAttributes } from 'react';

interface ButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
  title: string;
  type?: 'button' | 'reset' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ title, type = 'button', ...rest }) => {
  return (
    <button
      className="p-2 bg-primary-500 focus-within:bg-primary-500 rounded m-1 text-white ring-2 ring-primary-500"
      type={type}
      {...rest}
    >
      {title}
    </button>
  );
};

export default Button;
