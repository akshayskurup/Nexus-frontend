import { faBell, faCompass, faHome, faPeopleGroup, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../utils/reducers/authSlice';

function BottomNavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = ()=>{
        dispatch(logoutUser());
        localStorage.clear();
        navigate('/login');
    }

  return (
    <div className='bg-white h-12 w-screen flex justify-center items-center'>
        
        <div className='flex gap-16'>
        <FontAwesomeIcon className="text-[#2892FF]" onClick={()=>navigate('/home')} size='lg'  icon={faHome} />
        <FontAwesomeIcon className="text-[#837D7D]" size='lg' icon={faCompass} />
        {/* <FontAwesomeIcon className="text-[#837D7D]" size='lg' icon={faComment} /> */}
        <FontAwesomeIcon className="text-[#837D7D]" size='lg' icon={faBell} />
        <FontAwesomeIcon className="text-[#837D7D]" size='lg' icon={faPeopleGroup} />
        <FontAwesomeIcon className="text-red-700 cursor-pointer" onClick={handleLogout} size='lg' icon={faSignOut} />
        </div>
        
    </div>

  )
}

export default BottomNavBar