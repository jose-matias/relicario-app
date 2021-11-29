import React, { MouseEventHandler } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

interface QuestionHeaderProps {
  title: string;
  toggle: boolean;
  buttonAction?(): void;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  title,
  toggle,
  buttonAction,
}) => {
  return (
    <button
      type="button"
      onClick={buttonAction as MouseEventHandler}
      className="w-full  relative p-2 px-5 flex justify-between items-center "
    >
      <h1 className="text-lg">{title}</h1>
      <span>{!toggle ? <RiArrowDownSLine /> : <RiArrowUpSLine />}</span>
    </button>
  );
};

export default QuestionHeader;
