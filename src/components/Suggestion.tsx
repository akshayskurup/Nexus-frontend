import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { follow, suggestedUser } from '../services/api/user/apiMethods';
import SuggestionsModal from './Modals/SuggestionsModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function Suggestion({handleSuggestedFollow,followUnfollowState}:any) {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [suggestionModal,setSuggestionModal] = useState(false);


  const handleFollow = (userId: string, e: any) => {
    e.stopPropagation();
    follow({ userId: user._id, followingUser: userId }).then((response: any) => {
      if (response.status === 200) {
        console.log("Follow button", response.data);
        setRefresh(!refresh); // Trigger re-fetching of suggested users
        handleSuggestedFollow()
      }
    });
  };

  const getSuggestedUser = ()=>{
    suggestedUser(user._id).then((response: any) => {
      if (response.status === 200) {
        console.log("Data received from suggestion", response.data);
        setSuggestedUsers(response.data.slice(0, 4));
      }
    });
  }

  useEffect(() => {
    getSuggestedUser();
    console.log("CAlled the useEffect",followUnfollowState)
  }, [user._id, refresh,followUnfollowState]);

  return (
    <div className='bg-white w-80 h-80 ml-4 mt-5 rounded-md'>
      <div className='flex justify-between pt-3'>
        <p className='font-bold ml-3 tracking-wider'>Suggested For You</p>
        <p className='text-[#837D7D] text-sm mr-1 cursor-pointer' onClick={()=>setSuggestionModal(true)}>See all</p>
      </div>
      {suggestedUsers.map((user: any) => (
        <div
          key={user._id}
          className='flex items-center justify-between ml-3 mt-4 cursor-pointer hover:bg-slate-100 pt-1 pb-1 rounded-md'
          onClick={() => navigate(`/profile/${user._id}`)}
        >
          <img className='w-11 h-11 rounded-full' src={user.profileImage} alt="" />
          <div className='flex flex-col'>
            <p className='font-semibold'>{user.userName} {user.premium?<FontAwesomeIcon icon={faCheckCircle} color='#2892FF' />:""}</p>
            <p className='text-sm text-[#837D7D]'>Suggested For You</p>
          </div>
          <p
            className='mr-1 text-[#4d99db] font-medium tracking-wide cursor-pointer'
            onClick={(e) => handleFollow(user._id, e)}
          >
            Follow
          </p>
        </div>
      ))}
      {suggestionModal && 
        <SuggestionsModal
        isOpen={suggestionModal}
        onClose={()=>setSuggestionModal(false)}
        getSuggestedUser = {getSuggestedUser}
        />
        }
    </div>
  );
}

export default Suggestion;
