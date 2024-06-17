import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { GetUserProfile, UserPost, UserSavedPost, getUserConnections } from "../services/api/user/apiMethods";
import { toast } from "sonner";
import { updateUser } from "../utils/reducers/authSlice";
import FollowersModal from "./Modals/FollowersModal";
import FollowingModal from "./Modals/FollowingModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";


function UserProfile({userProfileRefresh}) {
    const user = useSelector((state:any)=>state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [userPost,setUserPost] = useState([]);
    const [isFollowersModalOpen,setIsFollowersModalOpen] = useState(false)
    const [isFollowingModalOpen,setIsFollowingModalOpen] = useState(false)


    useEffect(()=>{
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
      getUserConnections(user._id)
        .then((response: any) => {
            const connectionData = response.data.connection;
            console.log(response.data.connection);
            setFollowing(connectionData.following);
            setFollowers(connectionData.followers);
        })
        UserPost(user._id)
  .then((response: any) => {
    const data = response.data;
    if (response.status === 200) {
      setUserPost(data.posts);
    } else {
      toast.error(data.message);
    }
  });
    },[userProfileRefresh])

    const handleFollowersModal = ()=>{
      setIsFollowersModalOpen(!isFollowersModalOpen);
    }
    const handleFollowingModal = ()=>{
      setIsFollowingModalOpen(!isFollowingModalOpen);
    
    }
  return (
    <div className='bg-white lg:w-80 h-[23rem] mt-5 rounded-md'>
    <div className='flex flex-col items-center  '>
  <div className='w-72 h-24 mt-3 rounded-md'>
    <img className="rounded-md" src={user.bgImage} alt="" />
  </div>
  <div className=' flex items-center justify-center w-24 h-24 -mt-10 bg-white rounded-full'>
    <img className=" w-[90px] h-[90px] rounded-full" src={user.profileImage} alt="" />
  </div>
  <div>
    <p className="text-center font-semibold">{user.name} {user.premium?<FontAwesomeIcon icon={faCheckCircle} color='#2892FF' />:""}</p>
    <p className='text-center mt-1 text-[#837D7D] font-semibold text-sm'>@{user.userName}</p>
  </div>
  
</div>
<div className='flex gap-10 justify-center mt-5'>
    <div>
        <p className='text-center font-medium'>{userPost.length}</p>
        <p className="text-[#8B8585] text-sm font-medium">Post</p>
    </div>
    <div>
    <p className='text-center font-medium'>{followers.length}</p>
        <p className="text-[#8B8585] text-sm font-medium cursor-pointer" onClick={handleFollowersModal}>Followers</p>
    </div>
    <div>
    <p className='text-center font-medium'>{following.length}</p>
        <p className="text-[#8B8585] text-sm font-medium cursor-pointer" onClick={handleFollowingModal}>Following</p>
    </div>
  </div>
  <div className='flex justify-center mt-9'>
    <button className="mt-1 h-9 w-64 bg-[#2892FF] text-white rounded-xl hover:shadow-md" onClick={()=>navigate('/my-profile')}>My Profile</button>
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

export default UserProfile