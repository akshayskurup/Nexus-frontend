import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { getUserConnections } from '../../services/api/user/apiMethods';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';


function FollowingModal({isModalOpen,onModalClose,userId}) {
    const [following,setFollowing] = useState([]);

    useEffect(()=>{
            getUserConnections(userId)
                .then((response: any) => {
                    const connectionData = response.data.connection;
                    console.log(response.data.connection);
                    setFollowing(connectionData.following);
                    console.log("USerer",connectionData.following);        
                })
    },[])
  return (
    <Modal
    isOpen={isModalOpen}
    onRequestClose={onModalClose}
    className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-4 xl:w-[25rem] bg-white rounded-lg shadow-lg p-6"
    >
        <div className="max-h-[54vh] overflow-y-auto">

<h2 className="text-2xl font-bold mb-4 text-center">Following</h2>
<hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
{following&& following.map((user)=>
    <Link to={`/profile/${user._id}`}>
    <div className='flex items-center gap-24 mb-5 ml-10 cursor-pointer rounded-md mr-5 hover:bg-slate-100'>
        <img src={user.profileImage} alt="" className='w-12 h-12 rounded-full ml-2'/>
        <p>{user.userName} {user.premium?<FontAwesomeIcon icon={faCheckCircle} color='#2892FF' />:""}</p>
    </div>
    </Link>
)}


</div>


    </Modal>
  )
}

export default FollowingModal