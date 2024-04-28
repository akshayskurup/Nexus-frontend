import React, { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { UserPost, UserSavedPost } from '../../services/api/user/apiMethods';
import Posts from '../../components/Posts';

function UserProfile() {
  const [userPost,setUserPost] = useState([])
  const navigate = useNavigate();
  const user = useSelector((state:any)=>state.auth.user)
  
  
  const fetchPost = ()=>{
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

  useEffect(() => {
    if (user===null) {
      navigate('/login');
    }
    fetchPost()
  }, [navigate, user]);

  const handleSavedPost = ()=>{
    UserSavedPost(user._id)
    .then((response: any) => {
      const data = response.data;
      if (response.status === 200) {
        setUserPost(data.savedposts);
      } else {
        toast.error(data.message);
      }
    });
  }
  const handleUserPost = ()=>{
    fetchPost()
  }

  return (
    <div>
      <div className='sticky top-0'>
      <NavBar/>
      </div>
      <div className=' mt-5 ml-6 w-3/4  bg-white'>
        <div className='bg-slate-400 w-full h-64'>
          <img className='h-64 w-full' src={user.bgImage} alt="noImg" />
        </div>
        <div className='flex'>

          <div className='profile-sec -mt-20 text-center ml-7'>
            <div className=' pt-1 bg-white w-44 h-44 rounded-full'>
              <img className=' ml-1  w-[10.5rem] h-[10.5rem] rounded-full' src={user.profileImage} alt="" />
            </div>
            <p className='font-semibold text-lg'>{user.userName}</p>
            <p className='text-[#837D7D] text-sm'>@{user.name}</p>
          </div>
          <div>
            <div className=' ml-44 mt-5 flex gap-32 text-center'>
            <div className='flex flex-col'>
              <p>214</p>
              <p>Post</p>
            </div>
            <div className='flex flex-col'>
              <p>214</p>
              <p>Follower</p>
            </div>
            <div className='flex flex-col'>
              <p>214</p>
              <p>Following</p>
            </div>
            </div>

            <p className='mt-6 w-96 ml-44'>{user.bio}</p>
            <div className='ml-44 mt-6'>
            <button className='border border-blue-500 rounded-lg px-1 py-1 pl-3 pr-3'>Edit Profile</button>
            <button className='ml-5'>Edit Profile</button>
            </div>
          </div>
        </div>
          <hr className="h-px my-3 bg-gray-200 border-1 dark:bg-gray-700" />
          <div className='flex justify-center gap-44'>
            <button onClick={handleUserPost}>Posts</button>
            <button onClick={handleSavedPost}>Saved</button>
          </div>
          <div className='flex flex-col items-center'>
          {userPost && userPost.map((post)=>(
              <Posts key={post._id} post={post} />
          ))}
          </div>
      </div>
    </div>
  )
}

export default UserProfile