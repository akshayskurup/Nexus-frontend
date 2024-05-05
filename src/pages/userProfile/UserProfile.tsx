import React, { useEffect, useState } from 'react';
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

function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [userPost, setUserPost] = useState([]);
  const [isFollowing,setIsFollowing] = useState(false)
  const [connections,setConnections] = useState(null)
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowersModalOpen,setIsFollowersModalOpen] = useState(false)
  const [isFollowingModalOpen,setIsFollowingModalOpen] = useState(false)
  const user = useSelector((state:any) => state.auth.user);

  const fetchUserConnections = (userId: any) => {
    getUserConnections(userId)
        .then((response: any) => {
            const connectionData = response.data.connection;
            console.log(response.data.connection);
            setFollowing(connectionData.following);
            setFollowers(connectionData.followers);
            console.log(connections);
            console.log("USerer",userId);
            
            setIsFollowing(connectionData.followers.map(user => user._id).includes(user._id));
            
              console.log("Follower IDs:", connectionData.followers.map(user => user._id));

        })
}

useEffect(() => {
    const fetchData = async () => {
        try {
            const response: any = await GetUserProfile(userId);
            if (response.status === 200) {
                setConnections(response.data.connections)
                setProfile(response.data.user);

                // Fetch user posts
                fetchUserPosts(userId);
                fetchUserConnections(userId);
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
    console.log("fetchUserPosts",userId);
    
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

  const handleFollow = () => {
    if (profile) {
        const data = {
            userId: user._id,
            followingUser: profile._id
        }
        follow(data)
            .then((response: any) => {
                const data = response.data;
                if (response.status === 200) {
                    toast.success(data.message);
                    setIsFollowing(true); // Update isFollowing state here
                    setFollowers([...followers, profile]); // Update followers state

                } else {
                    toast.error(data.message);
                }
            })
    }
}

const handleUnfollow = () => {
    const data = {
        userId: user._id,
        unFollowingUser: profile._id
    }
    unFollow(data)
        .then((response: any) => {
            const data = response.data;
            if (response.status === 200) {
                setIsFollowing(false); // Update isFollowing state here
                setFollowers(followers.filter((follower) => follower._id !== profile._id)); // Update followers state
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        })
}

const handleFollowersModal = ()=>{
  setIsFollowersModalOpen(!isFollowersModalOpen);
}
const handleFollowingModal = ()=>{
  setIsFollowingModalOpen(!isFollowingModalOpen);

}

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
                    <p className='font-medium'>{userPost?userPost.length:0}</p>
                    <p className='text-[#8B8585] font-medium xl:text-md text-sm'>Post</p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='font-medium'>{followers.length}</p>
                    <p className='text-[#8B8585] font-medium xl:text-md text-sm' onClick={handleFollowersModal}>Follower</p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='font-medium'>{following.length}</p>
                    <p className='text-[#8B8585] font-medium xl:text-md text-sm' onClick={handleFollowingModal}>Following</p>
                  </div>
                </div>
                <p className='mt-6 ml-14 md:ml-44 xl:w-96 xl:ml-44'>{profile.bio}</p>
                <div className='ml-14 md:ml-44 lg:ml-44 mt-6'>
                  {isFollowing!=true?
                  (<button className='border  rounded-lg px-1 py-1 pl-12 pr-12 bg-[#2892FF] text-white font-medium'
                  onClick={handleFollow}
                  >
                    Follow
                  </button>)
                  :
                  (<button className='border border-red-600 rounded-lg px-1 py-1 pl-12 pr-12 bg-white text-red-600 font-medium'
                  onClick={handleUnfollow}
                  >
                    Unfollow
                  </button>)}
                </div>
              </div>
            </div>
          </>
        )}
        <hr className="h-px my-3 bg-gray-200 border-1 dark:bg-gray-700" />
        <div className='flex flex-col items-center'>
          {userPost && userPost.map((post) => (
            <Posts key={post._id} post={post} handleSavedPost={handleSavedPost} handlePost={fetchUserPosts}/>
          ))}
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
    </div>
  );
}

export default UserProfile;
