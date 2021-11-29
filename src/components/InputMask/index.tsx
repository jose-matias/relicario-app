import React, { InputHTMLAttributes } from 'react';
import InputMaskProvider from 'react-input-mask';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { Tooltip } from 'antd';

interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  mask: string;
  error?: string;
  register?: any;
  icon?: React.ComponentType<IconBaseProps>;
  className?: string;
  placeholder?: string;
}

const InputMask: React.FC<InputMaskProps> = ({
  name,
  mask,
  error,
  className = '',
  register,
  placeholder = null,
  icon: Icon,
  ...rest
}) => {
  const styleIconIfError = error ? 'text-red-500 ' : '';
  const styleInputIfError = error
    ? 'border-red-500 ring-1 ring-red-500'
    : 'focus:border-primary-500 focus:ring-1 focus:ring-primary-500';
  return (
    <div className={`relative ${className}`}>
      {!!Icon && (
        <span className="absolute left-3 top-1/4 text-lg text-gray-400">
          <Icon />
        </span>
      )}
      <InputMaskProvider
        id={name}
        mask={mask}
        maskChar=""
        placeholder={placeholder}
        {...rest}
        {...register}
        className={`${styleInputIfError} focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10 pr-10 h-10`}
      />
      {!!error && (
        <span
          className={`absolute right-3 top-1/4 text-lg text-gray-400 ${styleIconIfError} `}
        >
          <Tooltip title={error}>
            <FiAlertCircle />
          </Tooltip>
        </span>
      )}
    </div>
  );
};

export default InputMask;
