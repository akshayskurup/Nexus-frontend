import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { follow, suggestedUser } from '../services/api/user/apiMethods';


function Suggestion() {
    const navigate = useNavigate();
    const user = useSelector((state:any)=>state.auth.user);
    const [suggestedUsers,setSuggestedUsers] = useState([])
    
    const handleFollow = (userId:string,e:any)=>{
      e.stopPropagation();
      follow({userId:user._id,followingUser:userId  }).then((response:any)=>{
        const data = response.data;
        if(response.status===200){
          console.log("FOllow button",data);
        }
      })
    }
    
    useEffect(()=>{
      suggestedUser(user._id).then((response:any)=>{
        const data = response.data
        if(response.status===200){
          console.log("DAta received from suggestion ",data)
          setSuggestedUsers(data.slice(0, 4))
        }
      })
    },[handleFollow])

   
  return (
    <div className='bg-white w-80 h-80 ml-4 mt-5 rounded-md'>
      <div className='flex justify-between pt-3'>
      <p className='font-bold ml-3 tracking-wider'>Suggested For You</p>
      <p className='text-[#837D7D] text-sm mr-1'>See all</p>
      </div>
      
        {suggestedUsers.map((users:any)=>(
          
          <div 
          className='flex items-center justify-between ml-3 mt-4 cursor-pointer hover:bg-slate-100 pt-1 pb-1 rounded-md'
          onClick={()=>navigate(`/profile/${users._id}`)}
          >
          <img className='w-11 h-11 rounded-full' src={users.profileImage} alt="" />
          <div className='flex flex-col'>
        <p className='font-semibold'>{users.userName}</p>
        <p className='text-sm text-[#837D7D]'>Suggested For You</p>
        </div>
        <p className='mr-1 text-[#4d99db] font-medium tracking-wide cursor-pointer'
        onClick={(e)=>handleFollow(users._id,e)}
        >Follow</p>
        </div>
        ))}
        
      
      
    </div>

  )
}

export default Suggestion