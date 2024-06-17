import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function TopNavBar() {
    const user = useSelector((state:any)=>state.auth.user);
    const navigate = useNavigate();


    
  return (
    <div className=' bg-white h-12 flex min-w-[24.4rem] items-center gap-32'>
        <button onClick={()=>navigate('/my-profile')}>
            <img className='ml-2 min-w-9 h-9 rounded-full' src={user.profileImage} alt="" />
        </button>

       
        <p className="font-bold text-2xl tracking-wide text-center">Nexus</p>

        
        
        <div className="flex ml-auto gap-10 mr-6">
        <FontAwesomeIcon className={`text-[${location.pathname === '/chat' ? '#2892FF' : '#837D7D'}] cursor-pointer`} size='lg' onClick={()=>navigate('/chat')} icon={faComment} />

        </div>
    </div>

  )
}

export default TopNavBar