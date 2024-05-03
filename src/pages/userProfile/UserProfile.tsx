import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import TopNavBar from '../../components/responsiveNavBars/TopNavBar';
import BottomNavBar from '../../components/responsiveNavBars/BottomNavBar';
import { GetUserProfile, UserPost, UserSavedPost } from '../../services/api/user/apiMethods';
import { toast } from 'sonner';
import Posts from '../../components/Posts';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [userPost, setUserPost] = useState([]);
  const user = useSelector((state:any) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response:any = await GetUserProfile(userId);
        if (response.status === 200) {
          setProfile(response.data.user);
          // Fetch user posts
          fetchUserPosts(userId);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to fetch user profile');
      }
    };

    fetchData();
  }, [userId]);

  const fetchUserPosts = (userId) => {
    UserPost(userId)
      .then((response:any) => {
        const data = response.data;
        if (response.status === 200) {
          setUserPost(data.posts);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching user posts:', error);
        toast.error('Failed to fetch user posts');
      });
  };

  const handleSavedPost = () => {
    UserSavedPost(user._id)
      .then((response) => {
        const data = response.data;
        if (response.status === 200) {
          setUserPost(data.savedposts);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching saved posts:', error);
        toast.error('Failed to fetch saved posts');
      });
  };

  return (
    <div>
      <div className='hidden md:block sticky top-0'>
        <NavBar />
      </div>
      <div className='sticky top-0 md:hidden'>
        <TopNavBar />
      </div>
      <div className='fixed bottom-0 w-full md:hidden'>
        <BottomNavBar />
      </div>
      <div className='mt-5 xl:ml-6 xl:w-3/4 bg-white'>
        {profile && (
          <>
            <div className='bg-slate-400 w-full xl:h-64'>
              <img className='w-full h-44 xl:h-64 xl:w-full' src={profile.bgImage} alt="Background" />
            </div>
            <div className='flex'>
              <div className='profile-sec -mt-20 text-center md:ml-5 xl:ml-7'>
                <div className='pt-1 mt-5 bg-white w-[6.5rem] h-[6.5rem] xl:w-44 xl:h-44 rounded-full'>
                  <img className='h-24 w-24 ml-1 xl:ml-1 xl:w-[10.5rem] xl:h-[10.5rem] rounded-full' src={profile.profileImage} alt="Profile" />
                </div>
                <p className='font-semibold text-lg'>{profile.name}</p>
                <p className='text-[#837D7D] text-sm'>@{profile.userName}</p>
              </div>
              <div>
                <div className='ml-14 gap-7 md:ml-44 md:gap-24 xl:ml-44 xl:gap-32 mt-5 flex text-center'>
                  <div className='flex flex-col'>
                    <p className='font-medium'>214</p>
                    <p className='text-[#8B8585] font-medium xl:text-md text-sm'>Post</p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='font-medium'>214</p>
                    <p className='text-[#8B8585] font-medium xl:text-md text-sm'>Follower</p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='font-medium'>214</p>
                    <p className='text-[#8B8585] font-medium xl:text-md text-sm'>Following</p>
                  </div>
                </div>
                <p className='mt-6 ml-14 md:ml-44 xl:w-96 xl:ml-44'>{profile.bio}</p>
                <div className='ml-14 md:ml-44 lg:ml-44 mt-6'>
                  <button className='border border-blue-500 rounded-lg px-1 py-1 pl-3 pr-3 text-[#2892FF] font-medium'>Edit Profile</button>
                </div>
              </div>
            </div>
          </>
        )}
        <hr className="h-px my-3 bg-gray-200 border-1 dark:bg-gray-700" />
        <div className='flex flex-col items-center'>
          {userPost && userPost.map((post) => (
            <Posts key={post._id} post={post} handleSavedPost={handleSavedPost} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
