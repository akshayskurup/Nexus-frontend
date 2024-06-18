import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";
import { follow, suggestedUser } from '../../services/api/user/apiMethods';

function SuggestionsModal({isOpen,onClose,getSuggestedUser}:any) {
  const navigate = useNavigate();
    const user = useSelector((state:any)=>state.auth.user);
    const [suggestedUsers,setSuggestedUsers] = useState([])
    const [refresh, setRefresh] = useState(false);

    const handleFollow = (userId: string, e: any) => {
      e.stopPropagation();
      follow({ userId: user._id, followingUser: userId }).then((response: any) => {
        if (response.status === 200) {
          console.log("Follow button", response.data);
          setRefresh(!refresh); 
          getSuggestedUser()
        }
      });
    };
  
    useEffect(() => {
      suggestedUser(user._id).then((response: any) => {
        if (response.status === 200) {
          console.log("Data received from suggestion", response.data);
          setSuggestedUsers(response.data.slice(0, 4));
        }
      });
    }, [user._id, refresh]); // Depend on refresh state to trigger re-fetch
  
  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center tracking-wider ">Suggested For You</h2>
            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
    <div className='bg-white w-90 max-h-80 overflow-y-auto  mt-5 rounded-md'>
    {suggestedUsers.length === 0 ? (
  <p className='text-center font-semibold'>No Suggestions</p>
) : (
  suggestedUsers.map((user: any) => (
    <div 
      key={user._id}
      className='flex items-center justify-between ml-3 mt-4 cursor-pointer hover:bg-slate-100 pt-1 pb-1 rounded-md'
      onClick={() => navigate(`/profile/${user._id}`)}
    >
      <img className='w-11 h-11 rounded-full' src={user.profileImage} alt="" />
      <div className='flex flex-col'>
        <p className='font-semibold'>{user.userName}</p>
        <p className='text-sm text-[#837D7D]'>Suggested For You</p>
      </div>
      <p 
        className='mr-1 text-[#4d99db] font-medium tracking-wide cursor-pointer'
        onClick={(e) => {
          e.stopPropagation(); // Prevents triggering the parent onClick
          handleFollow(user._id, e);
        }}
      >
        Follow
      </p>
    </div>
  ))
)}

        
        
      
    </div>
    </Modal>
  )
}

export default SuggestionsModal