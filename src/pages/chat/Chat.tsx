
import { useEffect, useRef, useState } from "react";
import NavBar from "../../components/NavBar";
import TopNavBar from "../../components/responsiveNavBars/TopNavBar";
import BottomNavBar from "../../components/responsiveNavBars/BottomNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleChevronRight,
  faCommentMedical,
  faInfoCircle,
  faPhone,
  faPlus,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import { BASE_URL } from "../../constants/urls";
import {
  GetUserProfile,
  addConversation,
  addMessage,
  addNewGroupMessage,
  getGroupMessage,
  getLastMessage,
  getUserConnections,
  getUserConversation,
  getUserGroups,
  getUserMessages,
} from "../../services/api/user/apiMethods";
import { useSelector } from "react-redux";
import SendedMessage from "../../components/chat/SendedMessage";
import ReceivedMessage from "../../components/chat/ReceivedMessage";
import { toast } from "sonner";
import Conversations from "../../components/chat/Conversations";
import { useNavigate } from "react-router-dom";
import VideoCallModal from "../../components/Modals/VideoCallModal";
import AudioCallModal from "../../components/Modals/AudioCallModal";
import CreateGroupModal from "../../components/Modals/CreateGroupModal";
import UserGroup from "../../components/chat/UserGroup";
import GroupVideoCallModal from "../../components/Modals/GroupVideoCallModal";
import GroupAudioCallModal from "../../components/Modals/GroupAudioCallModal";
import GroupInfo from "../../components/chat/GroupInfo";


function Chat() {
  const socket = useRef<any>(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [mutualConnections, setMutualConnections] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [groups,setGroups] = useState([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<any>("");
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);
  const [groupArrivalMessage, setGroupArrivalMessage] = useState<any>(null)
  const [videoCallRoomId, setVideoCallRoomId] = useState('')
  const [audioCallRoomId, setAudioCallRoomId] = useState('')
  const [audioCallRequestedUser, setAudioCallRequestedUser] = useState({name:'',profile:''})
  const [callRequestedUser, setCallRequestedUser] = useState({name:'',profile:''})
  const [joinAudioCall, setJoinAudioCall] = useState(false);
  const [joinVideoCall, setJoinVideoCall] = useState(false);
  const [joinGroupVideoCall,setJoinGroupVideoCall] = useState(false);
  const [joinGroupAudioCall,setJoinGroupAudioCall] = useState(false);
  const [createGroupModal,setCreateGroupModal] = useState(false);
  const [groupInfo,setGroupInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('messages');
  
  console.log(onlineUsers,following,followers)
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate()
  const getLastConversationMessage = async (conversation:any) => {
        try {
          const response:any = await getLastMessage(conversation._id);
          const data = response.data;
          if (response.status === 200) {
            return data; // Return the latest message data
          } else {
            toast.error(data.message);
            return null; // Handle potential errors gracefully (optional)
          }
        } catch (error) {
          console.error("Error fetching latest message:", error);
          return null; // Handle potential errors gracefully (optional)
        }
      };
      
      const getConversation = async () => {
        try {
          setActiveTab('messages')
          const response:any = await getUserConversation(user._id);
          const data = response.data;
          if (response.status === 200) {
            const conversationsWithLatestMessage:any = await Promise.all(
              data.map(async (conversation:any) => {
                const latestMessage = await getLastConversationMessage(conversation);
                return { ...conversation, latestMessage }; // Add latest message as a field
              })
            );
            setConversations(conversationsWithLatestMessage);
            console.log("Conversations with latest messages:", conversationsWithLatestMessage);
            setMutualConnections([]);
            setGroups([]);
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.error("Error fetching conversations:", error);
          toast.error("An error occurred while fetching conversations."); // Inform user
        }
      };
      

  
  const getGroupMessageFn = ()=>{
    console.log("isnide getGroupMEsss")
    socket.current.on("getGroupMessages", (data: any) => {
      console.log("isnide getGroupMEsss2222")
      GetUserProfile(data.sender).then((response: any) => {
        console.log("get dataaa",response.data);
        
        setGroupArrivalMessage({
          group: data.groupId,
          sender: response.data.user,
          text: data.text,
          createdAt: Date.now(),
        });
        console.log("DAta from getGroupMessage",arrivalMessage);
      })
    })
  }

  useEffect(() => {
    // Initialize socket connection and attach event listener
    socket.current = io(BASE_URL);
    // socket.current.on("welcome", (message) => {
    //   console.log(message);
    // });
    getConversation();

    socket.current.on("getMessage", (data:any) => {
      const senderId = data.senderId;
      GetUserProfile(senderId).then((response:any)=>{
        console.log("get dataaa",response.data);
        
        setArrivalMessage({
          sender: response.data.user,
          text: data.text,
          createdAt: Date.now(),
        });
        console.log("DAta from getMessage",arrivalMessage);
      })
    });

    getGroupMessageFn()
    // console.log("ArrivalMess", arrivalMessage);
    // // Cleanup function to remove event listener when component unmounts
    // return () => {
    //   if (socket.current) {
    //     socket.current.off("message_received");
    //   }
    // };
  }, []);

  useEffect(() => {
    
    groupArrivalMessage &&
    (currentChat as any)?._id == (groupArrivalMessage as any)?.group &&
      setMessages((prev:any) => [...prev, groupArrivalMessage]);
  }, [groupArrivalMessage, currentChat]);



  // useEffect(() => {
  //   console.log("arrivalMessage",arrivalMessage);
  //   console.log("currentChat.members.includes",currentChat?.members.includes(arrivalMessage?.sender._id));
  //   console.log("currentChatmembersfind",currentChat?.members.find((member: any) => member !== arrivalMessage?.sender._id));
    
  //   (arrivalMessage && currentChat?.members.includes(arrivalMessage?.sender._id)) ||
  //     (currentChat?.members.find(
  //       (member: any) => member !== arrivalMessage?.sender._id
  //     ) &&
  //       setMessages((prev: any) => [...prev, arrivalMessage]));
  //   console.log("SET MESSSS", messages);
  //   console.log("ArrivalMess", arrivalMessage);
  // }, [arrivalMessage,currentChat]);

  
  useEffect(() => {
    if (arrivalMessage && currentChat) {
      // Check if the arrival message sender is already included in the chat members
      const senderInMembers = currentChat.members.some((member: any) => member === arrivalMessage.sender._id);
      
      // If the sender is in the chat members, add the message to the messages state
      if (senderInMembers) {
        setMessages((prevMessages: any) => [...prevMessages, arrivalMessage]);
      }
    }
  }, [arrivalMessage, currentChat]);
  

  useEffect(() => {
      
    if(!currentChat?.isGroup && currentChat?.name){
      
      console.log("groupCurrentChat",currentChat);

    getGroupMessage(currentChat?._id)
    .then((response: any) => {
      const data = response.data;
      console.log("GroupChjat",data)
      if (response.status === 200) {
        setMessages(data);
      } else {
        console.log("data",data)
        toast.error(data.message);
      }
    });
  }else{
    console.log("CurrentChatttt",currentChat);
    getUserMessages(currentChat?._id).then((response: any) => {
      const data = response.data;
      if (response.status === 200) {
        setMessages(data);
      } else {
        toast.error(data.message);
      }
    });
  }
  }, [currentChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users: any) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(()=>{
    socket.current.on("VideoCallResponse",(data:any)=>{
      console.log("Received VideoCallResponse:", data);

      setVideoCallRoomId(data.roomId);
      setCallRequestedUser({name:data.senderName,profile:data.senderProfile})
      setJoinVideoCall(true);
      
    })

    socket.current.on("GroupVideoCallResponse",(data:any)=>{
      console.log("Inside the groupVideocall response")
      setVideoCallRoomId(data.roomId);
      setCallRequestedUser({name:data.groupName,profile:data.profile})
      setJoinGroupVideoCall(true);
    })
  },[socket])

  useEffect(()=>{
    socket.current.on("AudioCallResponse",(data:any)=>{
      console.log("Received AudioCallResponse:", data);

      setAudioCallRoomId(data.roomId);
      setAudioCallRequestedUser({name:data.senderName,profile:data.senderProfile})
      setJoinAudioCall(true);
      
    })

    socket.current.on("groupAudioCallResponse",(data:any)=>{
            console.log("Inside the groupGroupcall response")
            setAudioCallRoomId(data.roomId);
            setCallRequestedUser({name:data.groupName,profile:data.profile})
            setJoinGroupAudioCall(true);
          })
  },[socket])
  // navigate,socket,joinVideoCall,videoCallRoomId
  console.log("JoinVideoCAll",joinVideoCall);

  const handleJoinVidoCallRoom=()=>{
 
    navigate(`/video-call/${videoCallRoomId}/${user._id}`);
   
  }
  const handleJoinGroupVidoCallRoom=()=>{
 
    navigate(`/group-video-call/${videoCallRoomId}/${user._id}`);
   
  }
  const handleJoinAudioCallRoom=()=>{
 
    navigate(`/audio-call/${audioCallRoomId}/${user._id}`);
   
  }
  const handleJoinGroupAudioCallRoom=()=>{
        navigate(`/group-audio-call/${audioCallRoomId}/${user._id}`);
       
      }
    

  const handleAllFriendsMessage = () => {
    setActiveTab("friends")
    getUserConnections(user._id).then((response: any) => {
      const connectionData = response.data.connection;
      console.log("connections", response.data.connection);
      setFollowing(connectionData.following);
      setFollowers(connectionData.followers);
      const { followers, following } = connectionData;

      // Find mutual connections
      const mutual = followers.filter((follower:any) =>
        following.some((followingUser:any) => followingUser._id === follower._id)
      );
      setConversations([]);
      setGroups([])
      setMutualConnections(mutual);

      console.log("Mutual", mutualConnections);
    });
  };
  

  const handleCurrentChat = (data:any)=>{
    console.log("dataa",data)
    setCurrentChat(data)
  }

  const handleActiveChat = (userObj: any) => {
    setProfile(userObj);
    setCurrentChat(userObj);
    console.log("OBJJJJ",userObj)
    if(userObj.name){
      const data = {
        groupId:userObj._id,
        userId:user._id
      }
      socket.current.emit("joinGroup",data)
    }
  };

  const handleMessage = () => {
    if (currentChat === "No conversation") {
      // If there's no active conversation, handle creating a new conversation
      if (profile !== null) {
      addConversation(user._id, profile._id)
        .then((response: any) => {
          const data = response.data;
          if (response.status === 200) {
            console.log("New conversation created:", data);
            handleCurrentChat(data); 
          }
        })
        .catch((error: any) => {
          console.error("Error creating conversation:", error);
        });
      }
    } else if (currentChat && newMessage.trim() !== "" && currentChat?.isGroup===false) {
      console.log("Else if",currentChat)
      // If there's an active conversation, proceed with sending the message
      const receiverId = currentChat.members.find(
        (member:any) => member !== user._id
      );
      socket.current.emit("sendMessage", {
        senderId: user._id,
        receiverId: receiverId,
        text: newMessage,
      });
  
      const message = {
        sender: user._id,
        text: newMessage,
        conversationId: currentChat._id,
      };
  
      addMessage(message)
        .then((response: any) => {
          const data = response.data;
          console.log("Message sent:", data);
          if (response.status === 200) {
            setMessages([...messages, data]);
            setNewMessage("");
          } else {
            toast.error(data.message);
          }
        })
        .catch((error: any) => {
          console.error("Error sending message:", error);
        });
    }else{

      const data = {
        groupId:currentChat._id,
        sender:user._id,
        text:newMessage
      }
      console.log("Else case worked ",data)
      socket.current.emit("sendGroupMessage",data)
      
      addNewGroupMessage(data)
      .then((response: any) => {
        const data = response.data;
        console.log("Message sent:", data);
        if (response.status === 200) {
          setMessages([...messages, data]);
          setNewMessage("");
        } else {
          toast.error(data.message);
        }
      })
    }
  };

  function generateRandomId(length:number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let randomId = '';
    for (let i = 0; i < length; i++) {
      randomId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomId;
  }

  const handleVideoCall = ()=>{
    const roomId = generateRandomId(10);
    const receiverId = profile?._id;
    const data = {
      senderId:user?._id,
      senderName:user.userName,
      senderProfile:user.profileImage,
      receiverId,
      roomId
    }

    socket.current.emit("videoCallRequest",data);
     navigate(`/video-call/${roomId}/${user._id}`);
  }

  const handleGroupVideoCall = ()=>{
    const roomId = generateRandomId(10);
    const groupId = currentChat._id;
    const emitData = {
      roomId,
      groupId,
      groupName:currentChat.name,
      groupProfile:currentChat.profile
    }

    socket.current.emit("GroupVideoCall",emitData)
    navigate(`/group-video-call/${roomId}/${user._id}`);
  }

  const handleAudioCall = ()=>{
    const roomId = generateRandomId(10);
    const receiverId = profile?._id;
    const data = {
      senderId:user?._id,
      senderName:user.userName,
      senderProfile:user.profileImage,
      receiverId,
      roomId
    }
    socket.current.emit("AudioCallRequest",data);
    console.log("Audioooo",data)
     navigate(`/audio-call/${roomId}/${user._id}`);
  }

  const handleGroupAudioCall = ()=>{
        const roomId = generateRandomId(10);
        const groupId = currentChat._id;
        const emitData = {
          roomId,
          groupId,
          groupName:currentChat.name,
          groupProfile:currentChat.profile
        }
        socket.current.emit("GroupAudioCall",emitData)
        navigate(`/group-audio-call/${roomId}/${user._id}`);
      }

  const handleGroups = ()=>{
    setActiveTab('groups')
    getUserGroups(user._id)
    .then((response: any) => {
      const data = response.data;
      console.log("Groups Fetched:", data.groups);
      if (response.status === 200) {
        setGroups(data.groups);
        setMutualConnections([]);
        setConversations([]);
        console.log("consoling group",groups)
      } else {
        toast.error(data.message);
      }
    })
  }
  
  return (
    <>
      <div className="hidden md:block sticky top-0 ">
        <NavBar />
      </div>
      <div className="sticky top-0 md:hidden">
        <TopNavBar />
      </div>
      <div className=" fixed bottom-0 w-full md:hidden">
        <BottomNavBar />
      </div>
      <div className="flex w-screen">
      <div className={`w-full md:w-1/2   bg-white border border-r-3 min-h-[90vh] ${currentChat ? 'hidden' : ''} md:block`}>
          <p className="font-semibold text-xl text-center mt-5">Messages</p>
          <button className="float-right font-semibold text-sm mt-1 mr-3" onClick={()=>setCreateGroupModal(true)}><FontAwesomeIcon size="1x" icon={faPlus} /> Add groups</button>
          <div className="flex gap-20 justify-center mt-10 font-semibold">
          <button
        onClick={getConversation}
        className={`ml-5 ${activeTab === 'messages' ? 'bg-[#2892FF] rounded-lg pl-2 pr-2 text-white' : ''}`}
      >
        Messages
      </button>
      <button
        onClick={handleAllFriendsMessage}
        className={`ml-5 ${activeTab === 'friends' ? 'bg-[#2892FF] rounded-lg pl-2 pr-2 text-white' : ''}`}
      >
        Friends
      </button>
      <button
        onClick={handleGroups}
        className={`ml-5 ${activeTab === 'groups' ? 'bg-[#2892FF] rounded-lg pl-2 pr-2 text-white' : ''}`}
      >
        Groups
      </button>
          </div>
          {conversations &&
            conversations.map((c:any) => (
              <div onClick={() => handleActiveChat(c)} className={`hover:bg-slate-100 cursor-pointer ${currentChat?c._id === currentChat._id ? "bg-slate-100" : "":""}`}>
                <Conversations
                  chatUser={c}
                  currentUser={user}
                  handleActiveChat={handleActiveChat}
                  handleCurrentChat={handleCurrentChat}
                  currentChatProfile={null}
                />
              </div>
            ))}

          {mutualConnections &&
            mutualConnections.map((mutualUser) => (
              <Conversations
                chatUser={mutualUser}
                currentUser={user}
                handleActiveChat={handleActiveChat}
                handleCurrentChat={handleCurrentChat}
                currentChatProfile={null}
              />
            ))}

{groups && groups.map((userGroup:any) => (
  <div key={userGroup.id} onClick={() => handleActiveChat(userGroup)} className={`hover:bg-slate-100 pt-2 cursor-pointer ${currentChat?userGroup._id === currentChat._id ? "bg-slate-100" : "":""}`}>
    <UserGroup
      group={userGroup}
      currentUser={user}
      handleActiveChat={handleActiveChat}
      handleCurrentChat={handleCurrentChat}
    />
  </div>
))}


        </div>
        <div className={`md:w-[90%] ${currentChat ? 'w-full' : ''} pb-10 md:pb-0 bg-[#F5F5F5] flex flex-col`} style={{ height: window.innerWidth < 768 ? '90vh' : 'auto' }}>
      {currentChat !== null && (
        <>
          <div>
            <div className="flex items-center mt-5 ml-10">
              <FontAwesomeIcon className="-ml-8 mr-10 md:hidden" onClick={() => setCurrentChat(null)} icon={faArrowLeft} />
              <img
                src={profile.profileImage ? profile.profileImage : profile.profile}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <p className="ml-2 md:ml-24">{profile.userName ? profile.userName : profile.name}</p>
              <div className="flex ml-auto mr-7 md:mr-24 gap-14">
                <FontAwesomeIcon icon={faPhone} onClick={profile.profileImage ? handleAudioCall : handleGroupAudioCall} />
                <FontAwesomeIcon icon={faVideo} onClick={profile.profileImage ? handleVideoCall : handleGroupVideoCall} />
                {groups.length > 0 && <FontAwesomeIcon icon={faInfoCircle} onClick={() => setGroupInfo(true)} />}
              </div>
            </div>
            <hr className="h-px my-3 bg-black border-0" />
          </div>
          <div className="flex-grow flex flex-col justify-between">
            <div
              className="flex flex-col gap-4 max-h-[75vh] md:max-h-[70vh] pb-2 overflow-y-auto"
              ref={scrollRef}
            >
              {messages.length===0 ? (
                <div className="ml-auto mr-auto mt-20 flex flex-col">
                <FontAwesomeIcon size="10x" icon={faCommentMedical} />
                <p className="font-semibold text-2xl">Start new conversation</p>
                </div>
              ) 
              :
              (
                messages.map((mess:any) =>
                  (mess.sender._id ? mess.sender._id : mess.sender) === user._id ? (
                    <SendedMessage key={mess._id} mess={mess} />
                  ) : (
                    <ReceivedMessage key={mess._id} mess={mess} profile={profile} />
                  )
                )
              )
              }
            </div>
            <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-auto md:w-[64%] p-2 bg-[#EAEAEA] border-t border-slate-400">
              <div className="flex items-center w-full rounded-full px-2 bg-white shadow-md">
                <input
                  type="text"
                  name="description"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-transparent border-none focus:outline-none flex-grow p-2"
                  placeholder="Message..."
                />
                {newMessage.length >= 1 &&
                  <button type="submit" onClick={handleMessage}>
                    <FontAwesomeIcon
                      className="text-[#2892FF]"
                      size="lg"
                      icon={faCircleChevronRight}
                    />
                  </button>
                }
              </div>
            </div>
          </div>
        </>
      )}
          {joinVideoCall && 
          <VideoCallModal 
          show={joinVideoCall}
          onHide={()=>setJoinVideoCall(false)}
          onAccept = {handleJoinVidoCallRoom}
          onReject = {()=>{
            setVideoCallRoomId('')
            setJoinVideoCall(false)
          }}
          caller={callRequestedUser}
          />
          }
          {joinGroupVideoCall && 
          <GroupVideoCallModal
          show={joinGroupVideoCall}
          onHide={() => setJoinGroupVideoCall(false)}
          onAccept={handleJoinGroupVidoCallRoom}
          onReject={ () => {
            setVideoCallRoomId('');
            setJoinGroupVideoCall(false);
            }}
          caller={callRequestedUser}
          />
          }

          {joinAudioCall && 
          <AudioCallModal
          show={joinAudioCall}
          onHide={()=>setJoinAudioCall(false)}
          onAccept = {handleJoinAudioCallRoom}
          onReject = {()=>{
            setAudioCallRoomId('')
            setJoinAudioCall(false)
          }}
          caller={audioCallRequestedUser}
          />
          }
          {joinGroupAudioCall && 
          <GroupAudioCallModal
          show={joinGroupAudioCall}
          onHide={() => setJoinGroupAudioCall(false)}
          onAccept={handleJoinGroupAudioCallRoom}
          onReject={ () => {
            setVideoCallRoomId('');
            setJoinGroupVideoCall(false);
            }}
          caller={callRequestedUser}
          />
          }
          {createGroupModal&&
          <CreateGroupModal 
          show={createGroupModal}
          onHide={()=>setCreateGroupModal(false)}
          />
          }
          {groupInfo && 
          <GroupInfo 
          show={groupInfo}
          onHide={()=>setGroupInfo(false)}
          group={currentChat}
          />
          }
        </div>
      </div>
      
    </>
  )
}

export default Chat;

