/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tooltip } from 'antd';
import React, { InputHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: string;
  register?: any;
  icon?: React.ComponentType<IconBaseProps>;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  name,
  error,
  register,
  className = '',
  icon: Icon,
  ...rest
}) => {
  const styleIconIfError = error ? 'text-red-500 ' : '';
  const styleInputIfError = error
    ? 'border-red-500 ring-1 ring-red-500 pr-10'
    : 'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 pr-2';
  return (
    <div className={`relative ${className}`}>
      {!!Icon && (
        <span className="absolute left-3 top-1/4 text-lg text-gray-400">
          <Icon />
        </span>
      )}
      <input
        id={name}
        name={name}
        className={`${styleInputIfError} focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 h-10 ${
          !Icon ? 'pl-2' : 'pl-10'
        }`}
        {...rest}
        {...register}
      />
      {!!error && (
        <span
          className={`absolute right-3 top-1/4 text-lg text-gray-400 ${styleIconIfError} `}
        >
          <Tooltip title="">
            <FiAlertCircle />
          </Tooltip>
        </span>
      )}
    </div>
  );
};

export default Input;
