import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonSuggestion = () => {
  return (
    <div className='bg-white w-80 h-80 ml-4 mt-5 rounded-md p-5'>
      <Skeleton height={20} width={150} />
      {Array(4).fill().map((_, index) => (
        <div key={index} className='flex items-center justify-between mt-4'>
          <Skeleton circle={true} height={44} width={44} />
          <div className='flex flex-col ml-3'>
            <Skeleton height={20} width={100} />
            <Skeleton height={16} width={80} />
          </div>
          <Skeleton height={20} width={50} />
        </div>
      ))}
    </div>
  );
};

export default SkeletonSuggestion;
