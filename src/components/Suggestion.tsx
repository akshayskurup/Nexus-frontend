import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Suggestion() {
    const user = useSelector((state:any)=>state.auth.user);
    const navigate = useNavigate();
    
    
  return (
    <div className='bg-white w-80 h-80 ml-4 mt-5 rounded-md'>
    <div className='flex flex-col items-center  '>
  <div className='w-72 h-24 mt-3 rounded-md'>
    <img className="rounded-md" src="" alt="" />
  </div>
  <div className=' flex items-center justify-center w-24 h-24 -mt-10 bg-white rounded-full'>
    <img className=" w-[90px] h-[90px] rounded-full" src={user.profileImage} alt="" />
  </div>
  <div>
    <p className="text-center">{user.name}</p>
    <p className='text-center'>@{user.userName}</p>
  </div>
  
</div>
<div className='flex gap-10 justify-center'>
    <div>
        <p className='text-center'>140</p>
        <p>Post</p>
    </div>
    <div>
        <p className='text-center'>140</p>
        <p>Followers</p>
    </div>
    <div>
        <p className='text-center'>140</p>
        <p>Following</p>
    </div>
  </div>
  <div className='flex justify-center mt-9'>
    <button className="mt-1 h-8 w-72 bg-[#2892FF] text-white rounded-xl " onClick={()=>navigate('/my-profile')}>My Profile</button>
  </div>

</div>

  )
}

export default Suggestion