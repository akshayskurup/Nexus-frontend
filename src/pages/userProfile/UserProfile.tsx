import React, { useEffect } from 'react'
import NavBar from '../../components/NavBar'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

function UserProfile() {
  const navigate = useNavigate();
  const user = useSelector((state:any)=>state.auth.user)
  console.log("user",user);
  

  useEffect(() => {
    if (user===null) {
      navigate('/login');
    }
  }, [navigate, user]);

  return (
    <div>
      <div className='sticky top-0'>
      <NavBar/>
      </div>
      <div className=' mt-5 ml-6 w-3/4 h-[180vh] bg-white'>
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

            <p className='mt-4 w-96 ml-44'>{user.bio}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile