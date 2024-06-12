import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonPost = () => {
  return (
    <div className='bg-white w-[25rem] md:w-[40rem] md:ml-3 rounded-md mt-5 p-5'>
      <div className='flex items-center'>
        <Skeleton circle={true} height={44} width={44} />
        <div className='ml-5'>
          <Skeleton height={20} width={150} />
        </div>
      </div>
      <Skeleton height={24} className='mt-3' />
      <Skeleton height={200} className='mt-3' />
      <div className='flex mt-3'>
        <Skeleton height={24} width={24} />
        <Skeleton height={24} width={24} className='ml-5' />
        <Skeleton height={24} width={24} className='ml-5' />
      </div>
    </div>
  );
};

export default SkeletonPost;
