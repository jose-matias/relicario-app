import React from 'react';
import { IconBaseProps } from 'react-icons/lib';

interface StatsProps {
  icon?: React.ComponentType<IconBaseProps>;
  title: string;
  value: string;
  loading?: boolean;
}

const Stats: React.FC<StatsProps> = ({ title, value, icon: Icon, loading }) => {
  return (
    <div className="p-5 bg-gray-100 relative shadow-sm rounded-md">
      {loading ? (
        <>
          <div className="h-4 mb-2 w-2/3 rounded bg-gray-100 animate-pulse" />
          <div className="h-6 w-1/3 rounded bg-gray-100 animate-pulse" />
        </>
      ) : (
        <>
          <span className="mb-2">{title}</span>
          <h2 className="font-semibold text-2xl text-primary-500 mt-3">
            {value}
          </h2>
        </>
      )}
      {Icon && (
        <Icon className="text-4xl text-primary-500 absolute top-2 right-3 text-opacity-30 " />
      )}
    </div>
  );
};

export default Stats;
