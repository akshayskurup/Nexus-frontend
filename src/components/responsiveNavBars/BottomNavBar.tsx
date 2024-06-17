import { faBell, faCompass, faHome, faPeopleGroup, faRobot, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../utils/reducers/authSlice';
import AssistantModal from '../Modals/AssistantModal';
import SuggestionsModal from '../Modals/SuggestionsModal';

function BottomNavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [assistantModal,setAssistantModal] = useState(false)
    const [suggestionModal,setSuggestionModal] = useState(false);
    const handleLogout = ()=>{
        dispatch(logoutUser());
        localStorage.clear();
        navigate('/login');
    }

  return (
    <div className='bg-white h-12 w-screen flex justify-center items-center'>
        
        <div className='flex gap-16'>
        <FontAwesomeIcon className={`text-[${location.pathname === '/home' ? '#2892FF' : '#837D7D'}] cursor-pointer`} onClick={()=>navigate('/home')} size='lg'  icon={faHome} />
        <FontAwesomeIcon className={`text-[${location.pathname === '/explore' ? '#2892FF' : '#837D7D'}] cursor-pointer`} size='lg' icon={faCompass}  onClick={()=>navigate('/explore')}/>
        {/* <FontAwesomeIcon className="text-[#837D7D]" size='lg' icon={faComment} /> */}
        <FontAwesomeIcon className='text-[#837D7D] cursor-pointer' icon={faRobot} size='lg' 
        onClick={()=>setAssistantModal(true)} 
        />
        <FontAwesomeIcon className="text-[#837D7D]" size='lg' icon={faPeopleGroup} onClick={()=>setSuggestionModal(true)}/>
        <FontAwesomeIcon className="text-red-700 cursor-pointer" onClick={handleLogout} size='lg' icon={faSignOut} />
        </div>
        {suggestionModal && 
        <SuggestionsModal
        isOpen={suggestionModal}
        onClose={()=>setSuggestionModal(false)}
        getSuggestedUser={null}
        />
        }
        {assistantModal && 
        <AssistantModal
        isOpen={assistantModal}
        onClose={()=>setAssistantModal(false)}
        />
        }
    </div>

  )
}

export default BottomNavBar