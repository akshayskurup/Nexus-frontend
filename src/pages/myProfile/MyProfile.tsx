import React, { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { GetUserProfile, UserPost, UserSavedPost, capturePayment, createOrder, getUserConnections } from '../../services/api/user/apiMethods';
import Posts from '../../components/Posts';
import EditProfile from '../../components/Modals/EditProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faCheckCircle, faCrown, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import TopNavBar from '../../components/responsiveNavBars/TopNavBar';
import BottomNavBar from '../../components/responsiveNavBars/BottomNavBar';
import {updateUser } from '../../utils/reducers/authSlice';
import Suggestion from '../../components/Suggestion';
import FollowingModal from '../../components/Modals/FollowingModal';
import FollowersModal from '../../components/Modals/FollowersModal';

function MyProfile() {
  const [userPost,setUserPost] = useState([]);
  const [userSavedPost,setUserSavedPost] = useState([]);
  const [isEditProfileModalOpen,setIsEditProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [refresh,setRefresh] = useState(false)
  const [isFollowingModalOpen,setIsFollowingModalOpen] = useState(false)
  const [isFollowersModalOpen,setIsFollowersModalOpen] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state:any)=>state.auth.user);
  
  
  const fetchPost = ()=>{
    setUserPost([])
    UserPost(user._id)
  .then((response: any) => {
    const data = response.data;
    if (response.status === 200) {
      setUserPost(data.posts);
    } else {
      toast.error(data.message);
    }
  });
}

const fetchUserConnections = (userId: any) => {
  getUserConnections(userId)
      .then((response: any) => {
          const connectionData = response.data.connection;
          console.log(response.data.connection);
          setFollowing(connectionData.following);
          setFollowers(connectionData.followers);
          console.log("USerer",userId);
      })
}

  useEffect(() => {
    if (user===null) {
      navigate('/login');
    }
    GetUserProfile(user._id)
    .then((response: any) => {
      const data = response.data;
      console.log("Working getUser",data);
      
      if (response.status === 200) {
        console.log("data.user",data.user);
        
        dispatch(updateUser({user:data.user}));
      } else {
        toast.error(data.message);
      }
    });
    fetchPost()
    fetchUserConnections(user._id)
  }, [refresh]);

  const handleSavedPost = ()=>{
    console.log("worrr");
    
    UserSavedPost(user._id)
    .then((response: any) => {
      const data = response.data;
      if (response.status === 200) {
        setUserSavedPost(data.savedposts);
        setActiveTab('saved');
      } else {
        toast.error(data.message);
      }
    });
  }

  const handlePurchase = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  
    try {
      createOrder().then((res: any) => {
        const data = res.data;
        console.log("DATAA", data);
        if (res.status === 200) {
          toast.success("Got data");
  
          const options = {
            key: process.env.KEY_ID,
            name: "Nexus",
            description: "Some Description",
            order_id: data.id,
            handler: async (response: any) => {
              try {
                const paymentId = response.razorpay_payment_id;
  
                capturePayment(paymentId).then((res: any) => {
                  const data = res.data;
                  console.log("DATAAddddd", data);
                  if (res.status === 200) {
                     dispatch(updateUser({user:data.updatedUser}))
                    toast.success("Payment captured successfully");
                  }
                });
              } catch (err) {
                console.log(err);
              }
            },
            theme: {
              color: "#686CFD",
            },
          };
  
          const rzp1 = new (window as any).Razorpay(options);
          rzp1.open();
        }
      });
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleUserPost = ()=>{
    setUserSavedPost([])
    fetchPost();
    setActiveTab('posts');
  }
  const handleEditProfile = ()=>{
    setIsEditProfileModalOpen(true);
  }
  const openModal = () => {
    setIsEditProfileModalOpen(true);
  };
  const closeModal = () => {
    setIsEditProfileModalOpen(false);
  };  
  const handleSuggestedFollow = ()=>{
    setRefresh(!refresh);
  }
  const handleFollowingModal = ()=>{
    setIsFollowingModalOpen(!isFollowingModalOpen);
  }
  const handleFollowersModal = ()=>{
    setIsFollowersModalOpen(!isFollowersModalOpen);
  }

  return (
    <div>
      <div className='hidden md:block sticky top-0 z-10 '>
        <NavBar />
      </div>
      <div className='sticky top-0 md:hidden'>
        <TopNavBar />
      </div>
      <div className=' fixed bottom-0 w-full md:hidden'>
        <BottomNavBar />
      </div>
     <div className='flex text-black'>
      <div className='mt-5 xl:ml-6 xl:w-3/4  bg-white'>
        <div className='bg-slate-400 w-full xl:h-64'>
          <img className=' w-full h-44 xl:h-64 xl:w-full' src={user.bgImage?user.bgImage:""} alt="noImg" />
        </div>
        <div className='flex'>

          <div className='profile-sec -mt-20 text-center md:ml-5 xl:ml-7'>
            <div className=' pt-1 mt-5 bg-white w-[6.5rem] h-[6.5rem] xl:w-44  xl:h-44  rounded-full'>
              <img className='h-24 w-24 ml-1  xl:ml-1 xl:w-[10.5rem] xl:h-[10.5rem] rounded-full' src={user.profileImage?user.profileImage:""} alt="" />
            </div>
            <p className='font-semibold text-lg'>{user.userName?user.userName:""} {user.premium?<FontAwesomeIcon icon={faCheckCircle} color='#2892FF' />:""}</p>
            <p className='text-[#837D7D] text-sm'>@{user.name?user.name:""}</p>
          </div>
          <div>
            <div className=' ml-14 gap-7 md:ml-44 md:gap-24 xl:ml-44 xl:gap-32 mt-5 flex  text-center'>
            <div className='flex flex-col'>
              <p className='font-medium'>{userPost.length}</p>
              <p className='text-[#8B8585] font-medium xl:text-md text-sm '>Post</p>
            </div>
            <div className='flex flex-col'>
            <p className='font-medium'>{followers.length}</p>
              <p className='text-[#8B8585] font-medium xl:text-md text-sm cursor-pointer' onClick={handleFollowersModal}>Follower</p>
            </div>
            <div className='flex flex-col'>
            <p className='font-medium '>{following.length}</p>
              <p className='text-[#8B8585] font-medium xl:text-md text-sm cursor-pointer' onClick={handleFollowingModal}>Following</p>
            </div>
            </div>

            <p className='mt-6 ml-14 md:ml-44 xl:w-96 xl:ml-44'>{user.bio}</p>
            <div className='ml-5 md:ml-44 lg:ml-44 mt-6'>
            <button className='border border-blue-500 rounded-lg px-1 py-1 pl-3 pr-3 text-[#2892FF] font-medium hover:shadow-md' onClick={handleEditProfile}>Edit Profile</button>
            {!user.premium && <button className='ml-5 md:ml-20 border border-[#FFD700] rounded-lg px-1 py-1 pl-3 pr-3 text-[#FFD700] font-medium hover:shadow-md' onClick={handlePurchase}><FontAwesomeIcon icon={faCrown} /> Get Premium</button>}
            </div>
          </div>
          {isEditProfileModalOpen&& <EditProfile isOpen={openModal} onClose={closeModal} />}
        </div>
          <hr className="h-px my-3 bg-gray-200 border-1 dark:bg-gray-700" />
          <div className='flex justify-center gap-44'>
          <button className={`font-medium ${activeTab === 'posts' ? 'text-[#2892FF]' : 'text-[#837D7D]'}`} onClick={handleUserPost}>
        <FontAwesomeIcon icon={faTableCellsLarge} /> Posts
      </button>
      <button className={`font-medium ${activeTab === 'saved' ? 'text-[#2892FF]' : 'text-[#837D7D]'}`} onClick={handleSavedPost}>
        <FontAwesomeIcon icon={faBookmark} /> Saved
      </button>
      </div>
          <div className='flex flex-col items-center'>
          {userPost && activeTab=='posts' && (userPost.length!=0?userPost.map((post:any)=>(
              <Posts key={post._id} post={post} handleSavedPost={handleSavedPost} />
          )):
          <p className='mt-5 text-lg font-semibold'>No Post Available</p>
          )}
            
          {userSavedPost && activeTab!='posts' && (userSavedPost.length!=0?userSavedPost.map((post:any)=>(
              <Posts key={post._id} post={post} handleSavedPost={handleSavedPost} />
          )):
          <p className='mt-5 text-lg font-semibold h-[50vh]'>No Post Available</p>
          )}
          </div>
          
      </div>
          <div className='-mr-14 hidden xl:block w-1/4 sticky top-10 h-screen ml-1 z-0'>
      <Suggestion handleSuggestedFollow = {handleSuggestedFollow} />
      </div>
    </div>
    {isFollowersModalOpen && (
    <FollowersModal
      isModalOpen={handleFollowersModal}
      onModalClose={handleFollowersModal}
      userId={user._id}
    />
  )}
  {isFollowingModalOpen && (
  <FollowingModal
      isModalOpen={handleFollowingModal}
      onModalClose={handleFollowingModal}
      userId={user._id}
    />
  )}
    </div>
  )
}

export default MyProfile