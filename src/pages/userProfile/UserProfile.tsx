import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import TopNavBar from '../../components/responsiveNavBars/TopNavBar';
import BottomNavBar from '../../components/responsiveNavBars/BottomNavBar';
import { GetUserProfile, UserPost, UserSavedPost, follow, getUserConnections, unFollow } from '../../services/api/user/apiMethods';
import { toast } from 'sonner';
import Posts from '../../components/Posts';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FollowersModal from '../../components/Modals/FollowersModal';
import FollowingModal from '../../components/Modals/FollowingModal';
import Suggestion from '../../components/Suggestion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [userPost, setUserPost] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState<any>([]);
  const [following, setFollowing] = useState([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [refresh,setRefresh] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const [followUnfollowState, setFollowUnfollowState] = useState(0);

const handleFollowUnfollowChange = () => {
  setFollowUnfollowState(prevState => prevState + 1);
};

  const fetchUserConnections = async (userId: any) => {
    try {
      const response:any = await getUserConnections(userId);
      const connectionData = response.data.connection;
      setFollowing(connectionData.following);
      setFollowers(connectionData.followers);
      setIsFollowing(connectionData.followers.some((follower: any) => follower._id === user._id));
    } catch (error) {
      console.error('Error fetching user connections:', error);
      toast.error('Failed to fetch user connections');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await GetUserProfile(userId);
        if (response.status === 200) {
          setProfile(response.data.user);
          await fetchUserConnections(userId);
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
  }, [userId,refresh]);

  const fetchUserPosts = async (userId: any) => {
    try {
      const response:any = await UserPost(userId);
      if (response.status === 200) {
        setUserPost(response.data.posts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to fetch user posts');
    }
  };

  const handleSavedPost = async () => {
    try {
      const response:any = await UserSavedPost(user._id);
      if (response.status === 200) {
        setUserPost(response.data.savedposts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      toast.error('Failed to fetch saved posts');
    }
  };

  const handleFollow = async () => {
    try {
      const response:any = await follow({ userId: user._id, followingUser: profile._id });
      if (response.status === 200) {
        toast.success(response.data.message);
        setIsFollowing(true);
        setFollowers((prevFollowers:any) => [...prevFollowers, user]);
        handleFollowUnfollowChange();

      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      const response:any = await unFollow({ userId: user._id, unFollowingUser: profile._id });
      if (response.status === 200) {
        toast.success(response.data.message);
        setIsFollowing(false);
        setFollowers((prevFollowers:any) => prevFollowers.filter((follower: any) => follower._id !== user._id));
        handleFollowUnfollowChange();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
    }
  };

  const handleFollowersModal = () => {
    setIsFollowersModalOpen(!isFollowersModalOpen);
  };

  const handleFollowingModal = () => {
    setIsFollowingModalOpen(!isFollowingModalOpen);
  };
  const handleSuggestedFollow = ()=>{
    setRefresh(!refresh);
  }

  return (
    
    <div>
      <div className='hidden md:block sticky top-0 z-10'>
        <NavBar />
      </div>
      <div className='sticky top-0 md:hidden'>
        <TopNavBar />
      </div>
      <div className='fixed bottom-0 w-full md:hidden'>
        <BottomNavBar />
      </div>
      <div className='flex text-black'>
        <div className='mt-5 xl:ml-10 xl:w-3/4 bg-white'>
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
                <p className='font-semibold text-lg'>{profile.name} {profile.premium?<FontAwesomeIcon icon={faCheckCircle} color='#2892FF' />:""}</p>
                <p className='text-[#837D7D] text-sm'>@{profile.userName}</p>
              </div>
              <div>
                <div className='ml-14 gap-7 md:ml-44 md:gap-24 xl:ml-44 xl:gap-32 mt-5 flex text-center'>
                  <div className='flex flex-col'>
                    <p className='font-medium'>{userPost.length}</p>
                    <p className='text-[#8B8585] font-medium xl:text-md text-sm'>Post</p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='font-medium'>{followers.length}</p>
                    <p className='text-[#8B8585] font-medium xl:text-md text-sm cursor-pointer' onClick={handleFollowersModal}>Follower</p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='font-medium'>{following.length}</p>
                    <p className='text-[#8B8585] font-medium xl:text-md text-sm cursor-pointer' onClick={handleFollowingModal}>Following</p>
                  </div>
                </div>
                <p className='mt-6 ml-14 md:ml-44 xl:w-96 xl:ml-44'>{profile.bio}</p>
                <div className='ml-14 md:ml-44 lg:ml-44 mt-6'>
                  {!isFollowing ? (
                    <button className='border rounded-lg px-1 py-1 pl-12 pr-12 bg-[#2892FF] text-white font-medium '
                      onClick={handleFollow}
                    >
                      Follow
                    </button>
                  ) : (
                    <button className='border border-red-600 rounded-lg px-1 py-1 pl-12 pr-12 bg-white text-red-600 font-medium'
                      onClick={handleUnfollow}
                    >
                      Unfollow
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        <hr className="h-px my-3 bg-gray-200 border-1 dark:bg-gray-700" />
        <div className='flex flex-col items-center'>
          {userPost && (userPost.length!=0?userPost.map((post:any)=>(
            // <Posts key={post._id} post={post} handleSavedPost={handleSavedPost} handlePost={fetchUserPosts} />
            
              <Posts key={post?._id} post={post} handleSavedPost={handleSavedPost} handlePost={fetchUserPosts} />
          )):
          <p className='mt-5 text-lg font-semibold'>No Post Available</p>
          )
          }
          
        </div>
        
      </div>
      
      {isFollowersModalOpen && (
        <FollowersModal
          isModalOpen={handleFollowersModal}
          onModalClose={handleFollowersModal}
          userId={userId}
        />
      )}
      {isFollowingModalOpen && (
        <FollowingModal
          isModalOpen={handleFollowingModal}
          onModalClose={handleFollowingModal}
          userId={userId}
        />
      )}
      <div className='-mr-14 hidden xl:block w-1/4 sticky top-10 h-screen ml-1 z-0'>
      <Suggestion handleSuggestedFollow = {handleSuggestedFollow} followUnfollowState={followUnfollowState}/>
      </div>
      </div>
        
      
    </div>
   
  
  );
}

export default UserProfile;
