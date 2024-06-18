import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { getUserConnections } from '../../services/api/user/apiMethods';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';


function FollowersModal({isModalOpen,onModalClose,userId}:any) {
  const currentUser = useSelector((state:any)=>state.auth.user)
    const [followers,setFollowers] = useState([]);
    const navigate = useNavigate()
    useEffect(()=>{
            getUserConnections(userId)
                .then((response: any) => {
                    const connectionData = response.data.connection;
                    console.log(response.data.connection);
                    setFollowers(connectionData.followers);
                    console.log("USerer",connectionData.followers);        
                })
    },[])
    const handleClick = (user:any)=>{
      if(user._id===currentUser._id){
        navigate('/my-profile') 
      }else{
        navigate(`/profile/${user._id}`)
      }
    }
  return (
    <Modal 
    isOpen={isModalOpen}
    onRequestClose={onModalClose}
    className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-4 xl:w-[25rem] bg-white rounded-lg shadow-lg p-6"
    >
    <div className="max-h-[54vh] overflow-y-auto">

    <h2 className="text-2xl font-bold mb-4 text-center">Followers</h2>
    <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
    {followers&& followers.map((user:any)=>
    <div className='flex items-center gap-24 mb-5 ml-10 cursor-pointer' onClick={()=>handleClick(user)}>
        <img src={user.profileImage} alt="" className='w-12 h-12 rounded-full'/>
        <p>{user.userName} {user.premium?<FontAwesomeIcon icon={faCheckCircle} color='#2892FF' />:""}</p>
    </div>
)}
</div>
    </Modal>
  )
}

export default FollowersModal