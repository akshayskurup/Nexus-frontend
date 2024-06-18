import { faCheckCircle, faCircleChevronRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  { useEffect, useState } from 'react'
import Modal from "react-modal";
import { searchUserProfile } from '../../services/api/user/apiMethods';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SearchUserModal({isOpen,onClose,searchUser}:any) {
    const [users,setUsers] = useState([]);
    const [searchUsers,setSearchUsers] = useState('');
    const navigate = useNavigate()
    const User = useSelector((state:any)=>state.auth.user);

    const fetchUser = (search:string)=>{
        searchUserProfile(search)
        .then((response:any)=>{
            const data = response.data;
            if(response.status===200){
                setUsers(data.users);
            }else{
                toast.error(data.message)
            }
        })
    }
    useEffect(()=>{
        fetchUser(searchUser)
    },[])
  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
    >
        <div className="bg-[#EAEAEA] ml-8 h-8 w-72 rounded-full flex items-center md:w-44 md:ml-2 lg:-ml-0 lg:w-full">
          <FontAwesomeIcon className="ml-2 text-[#837D7D]" icon={faMagnifyingGlass} />
          <input
          type="text"
          className="ml-2 bg-transparent border-none focus:outline-none flex-grow"
          placeholder="Search"
          onChange={(e)=>setSearchUsers(e.target.value)}
          />
          {searchUser.length>0 && 
          <button className='mr-1' type="submit" onClick={()=>fetchUser(searchUsers)}>
              <FontAwesomeIcon
                className="ml-7 text-[#2892FF]"
                size="xl"
                icon={faCircleChevronRight}
              />
            </button>
          }
    </div>
    <div className=' mt-5 max-h-[20rem] overflow-y-auto'>
        {users.length>0 ?
        users.map((user:any)=>(
            (<div className='flex items-center gap-36 mt-5 hover:bg-slate-200 rounded-lg pt-1 pb-1 cursor-pointer' 
            onClick={()=>{User._id===user._id?navigate('/my-profile'):navigate(`/profile/${user._id}`)}}>
            <img className='rounded-full w-11 h-11 ml-2' src={user.profileImage} alt="" />
            <p>{user.userName} {user.premium?<FontAwesomeIcon icon={faCheckCircle} color='#2892FF' />:""}</p>
        </div>)
        ))
    :
    <p>No users</p>
    }
          
        
        
        </div>
    </Modal>
  )
}

export default SearchUserModal