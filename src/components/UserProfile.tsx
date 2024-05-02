import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


function UserProfile() {
    const user = useSelector((state:any)=>state.auth.user);
    const navigate = useNavigate();
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
    <p className="text-center font-semibold">{user.name}</p>
    <p className='text-center mt-1 text-[#837D7D] font-semibold text-sm'>@{user.userName}</p>
  </div>
  
</div>
<div className='flex gap-10 justify-center mt-5'>
    <div>
        <p className='text-center font-medium'>140</p>
        <p className="text-[#8B8585] text-sm font-medium">Post</p>
    </div>
    <div>
    <p className='text-center font-medium'>140</p>
        <p className="text-[#8B8585] text-sm font-medium">Followers</p>
    </div>
    <div>
    <p className='text-center font-medium'>140</p>
        <p className="text-[#8B8585] text-sm font-medium">Following</p>
    </div>
  </div>
  <div className='flex justify-center mt-9'>
    <button className="mt-1 h-9 w-64 bg-[#2892FF] text-white rounded-xl " onClick={()=>navigate('/my-profile')}>My Profile</button>
  </div>

</div>

  )
}

export default UserProfile