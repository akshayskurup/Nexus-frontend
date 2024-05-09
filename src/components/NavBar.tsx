import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../utils/reducers/authSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faComment, faCompass, faHome, faMagnifyingGlass, faPeopleGroup, faSignOut } from '@fortawesome/free-solid-svg-icons';

function NavBar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state:any)=>state.auth.user);


    const handleLogout = ()=>{
        dispatch(logoutUser());
        localStorage.clear();
        navigate('/login');
    }
  return (
    <div className='bg-white h-12 w-screen flex items-center '>
        <p className="mr-3 ml-5 font-bold text-2xl -mt-2 tracking-wide">Nexus</p>
        <div className="bg-[#EAEAEA] ml-8 h-8 w-72 rounded-full flex items-center md:w-44 md:ml-2 lg:w-72">
          <FontAwesomeIcon className="ml-2 text-[#837D7D]" icon={faMagnifyingGlass} />
          <input
          type="text"
          className="ml-2 bg-transparent border-none focus:outline-none flex-grow"
          placeholder="Search"
          />
    </div>
        <div className='lg:flex lg:gap-24 lg:ml-24 md:gap-10 md:ml-3 md:flex '>
        <FontAwesomeIcon className="text-[#2892FF]" onClick={()=>navigate('/home')} size='lg'  icon={faHome} />
        <FontAwesomeIcon className="text-[#837D7D]" size='lg' icon={faCompass} />
        <FontAwesomeIcon className="text-[#837D7D]" onClick={()=>navigate('/chat')} size='lg' icon={faComment} />
        <FontAwesomeIcon className="text-[#837D7D]" size='lg' icon={faBell} />
        <FontAwesomeIcon className="text-[#837D7D]" size='lg' icon={faPeopleGroup} />
        
        </div>
        
        <div className="flex ml-auto gap-6 mr-6">
        <img className='w-9 h-9 rounded-full md:ml-10' src={user.profileImage} alt="" />
        <p className=' text-sm font-semibold text-[#837D7D] mt-2 '>{user.name}</p>
        <button onClick={handleLogout}>
          <FontAwesomeIcon className="text-red-700 cursor-pointer mt-1" size='lg' icon={faSignOut} />
        </button>
        </div>
    </div>

  )
}

export default NavBar