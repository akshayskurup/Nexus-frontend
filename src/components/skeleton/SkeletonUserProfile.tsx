
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonUserProfile = () => {
  return (
    <div className='bg-white lg:w-80 h-[23rem] mt-5 rounded-md p-5'>
      <Skeleton height={96} />
      <div className='flex flex-col items-center justify-center -mt-10'>
        <Skeleton circle={true} height={90} width={90} />
      
      <Skeleton height={24} width={150} className='mt-3 ml-auto mr-auto' />
      <Skeleton height={20} width={100} className='mt-1 ml-auto mr-auto' />
      </div>
      <div className='flex justify-center mt-5'>
        <Skeleton height={20} width={50} />
        <Skeleton height={20} width={50} className='ml-5' />
        <Skeleton height={20} width={50} className='ml-5' />
      </div>
      <Skeleton height={36} width={256} className='mt-9' />
    </div>
  );
};

export default SkeletonUserProfile;
