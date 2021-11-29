import React from 'react';
import { GoCheck } from 'react-icons/go';

interface StepItemProps {
  active?: boolean;
  checked?: boolean;
  onClick?(): void;
  title: string;
}

const StepItem: React.FC<StepItemProps> = ({
  active,
  checked,
  title,
  onClick,
}) => {
  const color = active ? 'primary-500' : 'gray-500';
  const fontWeight = active ? 'font-semibold' : '';
  const visible = active ? '' : 'hidden';
  return (
    <div className="flex  flex-col md:flex-row items-center gap-1">
      {checked ? (
        <div className="relative">
          <div className="flex justify-center w-5 h-5 mx-auto border-2  rounded-full  text-white items-center border-primary-500 bg-primary-500 text-sm">
            <GoCheck />
          </div>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`flex justify-center w-5 h-5 mx-auto border-2  rounded-full text-lg text-white items-center border-${color}`}
          >
            <div
              className={`w-3 h-3 bg-primary-500 rounded-full self-center ${visible}`}
            />
          </div>
        </div>
      )}
      <div
        className={`mtext-xs text-center md:text-base text-${color} ${fontWeight}`}
      >
        <button
          disabled={!checked}
          type="button"
          className={`hover:underline ${!checked && 'cursor-not-allowed'}`}
          onClick={onClick}
        >
          {title}
        </button>
      </div>
    </div>
  );
};

export default StepItem;
