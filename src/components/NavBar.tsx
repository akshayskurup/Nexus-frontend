import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { logoutUser } from '../utils/reducers/authSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCircleChevronRight, faComment, faCompass, faHome, faMagnifyingGlass, faPeopleGroup, faRobot, faSignOut } from '@fortawesome/free-solid-svg-icons';
import SearchUserModal from './Modals/SearchUserModal'
import SuggestionsModal from './Modals/SuggestionsModal'
import AssistantModal from './Modals/AssistantModal'

function NavBar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation();
    const [searchUser,setSearchUser] = useState('')
    const [searchUserModal,setSearchUserModal] = useState(false);
    const [suggestionModal,setSuggestionModal] = useState(false);
    const [assistantModal,setAssistantModal] = useState(false)
    const user = useSelector((state:any)=>state.auth.user);


    const handleLogout = ()=>{
        dispatch(logoutUser());
        localStorage.clear();
        navigate('/login');
    }
    const handleSearch = ()=>{
      setSearchUserModal(true)
    }
    // const handleSuggestion = ()=>{
    //   setSuggestionModal(true)

    // }
  return (
    <div className='bg-white h-12 w-screen flex items-center '>
        <p className="mr-3 ml-5 font-bold text-2xl -mt-2 tracking-wide">Nexus</p>
        <div className="bg-[#EAEAEA] ml-8 h-8 w-72 rounded-full flex items-center md:w-44 md:ml-2 lg:w-72">
          <FontAwesomeIcon className="ml-2 text-[#837D7D]" icon={faMagnifyingGlass} />
          <input
          type="text"
          className="ml-2 bg-transparent border-none focus:outline-none flex-grow"
          placeholder="Search"
          onChange={(e)=>setSearchUser(e.target.value)}
          />
          {searchUser.length>0 && 
          <button className='mr-1' type="submit" onClick={handleSearch}>
              <FontAwesomeIcon
                className="ml-7 text-[#2892FF]"
                size="xl"
                icon={faCircleChevronRight}
              />
            </button>
          }
    </div>
        <div className='lg:flex lg:gap-24 lg:ml-24 md:gap-10 md:ml-3 md:flex '>
        <FontAwesomeIcon className={`text-[${location.pathname === '/home' ? '#2892FF' : '#837D7D'}] cursor-pointer`}
        onClick={()=>navigate('/home')} size='lg'  icon={faHome} />
        <FontAwesomeIcon className={`text-[${location.pathname === '/explore' ? '#2892FF' : '#837D7D'}] cursor-pointer`}
        onClick={()=>navigate('/explore')} size='lg' icon={faCompass} />
        <FontAwesomeIcon className={`text-[${location.pathname === '/chat' ? '#2892FF' : '#837D7D'}] cursor-pointer`}
        onClick={()=>navigate('/chat')} size='lg' icon={faComment} />
        {/* <FontAwesomeIcon className="text-[#837D7D] cursor-pointer" size='lg' icon={faBell} /> */}
        <FontAwesomeIcon className='text-[#837D7D] cursor-pointer' icon={faRobot} size='lg' 
        onClick={()=>setAssistantModal(true)} 
        />
        <FontAwesomeIcon className="text-[#837D7D] cursor-pointer"
        onClick={()=>setSuggestionModal(true)}
        size='lg' icon={faPeopleGroup} />
        
        </div>
        
        <div className="flex ml-auto gap-6 mr-6">
        <img className='w-9 h-9 rounded-full md:ml-10' src={user.profileImage} alt="" />
        <p className=' text-sm font-semibold text-[#837D7D] mt-2 '>{user.name}</p>
        <button onClick={handleLogout}>
          <FontAwesomeIcon className="text-red-700 cursor-pointer mt-1" size='lg' icon={faSignOut} />
        </button>
        </div>

        {searchUserModal && 
        <SearchUserModal
        isOpen={searchUser}
        onClose={()=>setSearchUserModal(false)}
        searchUser={searchUser}
        />
        }
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

export default NavBar