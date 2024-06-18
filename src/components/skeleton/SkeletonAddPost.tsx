import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonAddPost = () => {
  return (
    <div className='bg-white w-[25rem] md:w-[40rem] md:ml-3 rounded-md p-5 mt-5'>
      <div className='flex flex-row'>
        <Skeleton circle={true} height={36} width={36} />
        <Skeleton  height={36} width='38vw' className='ml-5' />

        {/* <Skeleton height={32} width='calc(100% - 36px)' className='ml-5' /> */}
      </div>
      <div className='flex flex-col items-center'>
      <Skeleton height={24} width={50} className='mt-3 mx-30' />
      <Skeleton height={32} width='20vw' className='mx-auto mt-1' />
      </div>
    </div>
  );
};

export default SkeletonAddPost;
