import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonPostThumbnail = () => {
  return (
    <div className=' w-64 h-64'>
      <Skeleton height='100%' />
    </div>
  );
};

export default SkeletonPostThumbnail;
