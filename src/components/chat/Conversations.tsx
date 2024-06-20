import{ useEffect, useState } from 'react'
import { GetUserProfile, findTwoUserConversation } from '../../services/api/user/apiMethods'
import { toast } from 'sonner'

function Conversations({chatUser,currentUser,handleActiveChat,handleCurrentChat}:any) {
    const [user,setUser] = useState<any>(null)

    useEffect(()=>{
        console.log("HEllloooooo",chatUser);
        
        if(chatUser.members && !chatUser.isGroup){
        const friendId = chatUser.members.find((id:any)=> id!==currentUser._id)
        console.log("Frienddd",friendId);
        
        GetUserProfile(friendId)
        .then((response:any)=>{
            const data = response.data;
            if(response.status===200){
                setUser(data.user)
            }else{
                toast.error(data.message)
            }
        })
        }else{
            setUser(chatUser)
        }
    },[chatUser,currentUser])

    // const handleClick = ()=>{
    //     handleActiveChat(user);
    //     currentChatProfile(data.user)
    // }

    const handleChat = (chat:any)=>{
      console.log("Handle chat workeddddd",chat)
      findTwoUserConversation(currentUser._id,chat?._id)
      .then((response:any)=>{
        const data = response.data;
        if(response.status===200 && data!=="No conversation"){
          console.log("RES 200",data)
          handleActiveChat(user)
          handleCurrentChat(data)
        }else{
          handleActiveChat(user)
          handleCurrentChat(data)
        }
      })
    }

  return (
    <>
          {/* onClick={()=>handleActiveChat(user)} */}
          <div className='flex items-center mt-5 ml-9 pt-3' onClick={()=>handleChat(user)}>
            <img src={user?.profileImage} alt="" className='w-12 h-12 rounded-full' />
            <div className='ml-24 '>
              <p className='font-semibold text-black'>{user?.userName}</p>
              <p className='text-sm text-black'>{chatUser.latestMessage?chatUser.latestMessage.text:"Start a new conversation"}</p>
            </div>
            {/* <div className='w-3 h-3 bg-blue-800 rounded-full ml-auto mr-10'></div> */}
          </div>
          <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-black" />
          </>
  )
}

export default Conversations