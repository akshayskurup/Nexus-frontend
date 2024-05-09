import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../components/NavBar";
import TopNavBar from "../../components/responsiveNavBars/TopNavBar";
import BottomNavBar from "../../components/responsiveNavBars/BottomNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleChevronRight,
  faPhone,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import { BASE_URL } from "../../constants/urls";
import {
  GetUserProfile,
  addConversation,
  addMessage,
  getUserConnections,
  getUserConversation,
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

function Chat() {
  const socket = useRef<any>(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [mutualConnections, setMutualConnections] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);
  const [videoCallRoomId, setVideoCallRoomId] = useState('')
  const [audioCallRoomId, setAudioCallRoomId] = useState('')
  const [audioCallRequestedUser, setAudioCallRequestedUser] = useState({name:'',profile:''})
  const [callRequestedUser, setCallRequestedUser] = useState({name:'',profile:''})
  const [joinAudioCall, setJoinAudioCall] = useState(false);
  const [joinVideoCall, setJoinVideoCall] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate()

  const getConversation = () => {
    getUserConversation(user._id).then((response: any) => {
      const data = response.data;
      console.log("DATA", data);

      if (response.status === 200) {
        setConversations(data);
        console.log("Converas", conversations);
        setMutualConnections([]);
      } else {
        toast.error(data.message);
      }
    });
  };

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
    // console.log("ArrivalMess", arrivalMessage);
    // // Cleanup function to remove event listener when component unmounts
    // return () => {
    //   if (socket.current) {
    //     socket.current.off("message_received");
    //   }
    // };
  }, []);

  useEffect(() => {
    (arrivalMessage && currentChat?.members.includes(arrivalMessage?.sender)) ||
      (currentChat?.members.find(
        (member: any) => member._id !== arrivalMessage?.sender._id
      ) &&
        setMessages((prev: any) => [...prev, arrivalMessage]));
    console.log("SET MESSSS", messages);
    console.log("ArrivalMess", arrivalMessage);
  }, [arrivalMessage]);

  useEffect(() => {
    getUserMessages(currentChat?._id).then((response: any) => {
      const data = response.data;
      if (response.status === 200) {
        setMessages(data);
      } else {
        toast.error(data.message);
      }
    });
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
  },[socket])

  useEffect(()=>{
    socket.current.on("AudioCallResponse",(data:any)=>{
      console.log("Received AudioCallResponse:", data);

      setAudioCallRoomId(data.roomId);
      setAudioCallRequestedUser({name:data.senderName,profile:data.senderProfile})
      setJoinAudioCall(true);
      
    })
  },[socket])
  // navigate,socket,joinVideoCall,videoCallRoomId
  console.log("JoinVideoCAll",joinVideoCall);

  const handleJoinVidoCallRoom=()=>{
 
    navigate(`/video-call/${videoCallRoomId}/${user._id}`);
   
  }
  const handleJoinAudioCallRoom=()=>{
 
    navigate(`/audio-call/${audioCallRoomId}/${user._id}`);
   
  }

  const handleAllFriendsMessage = () => {
    getUserConnections(user._id).then((response: any) => {
      const connectionData = response.data.connection;
      console.log("connections", response.data.connection);
      setFollowing(connectionData.following);
      setFollowers(connectionData.followers);
      const { followers, following } = connectionData;

      // Find mutual connections
      const mutual = followers.filter((follower) =>
        following.some((followingUser) => followingUser._id === follower._id)
      );
      setConversations([]);
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
  };

  const handleMessage = () => {
    if (currentChat === "No conversation") {
      // If there's no active conversation, handle creating a new conversation
      addConversation(user._id, profile._id)
        .then((response: any) => {
          const data = response.data;
          if (response.status === 200) {
            console.log("New conversation created:", data);
            handleCurrentChat(data); // Assuming this function sets the current chat
          }
        })
        .catch((error: any) => {
          console.error("Error creating conversation:", error);
        });
    } else if (currentChat && newMessage.trim() !== "") {
      // If there's an active conversation, proceed with sending the message
      const receiverId = currentChat.members.find(
        (member) => member !== user._id
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
          <div className="flex gap-20 justify-center mt-2">
          <button onClick={getConversation}>Messages</button>
          <button className="ml-5" onClick={handleAllFriendsMessage}>Friends</button>
          </div>
          {conversations &&
            conversations.map((c) => (
              <div onClick={() => handleActiveChat(c)}>
                <Conversations
                  chatUser={c}
                  currentUser={user}
                  handleActiveChat={handleActiveChat}
                  handleCurrentChat={handleCurrentChat}
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
              />
              
              
            ))}
        </div>
        <div className={`md:w-[90%] ${currentChat ? 'w-full' : ''} pb-10 md:pb-0 bg-[#F5F5F5] flex flex-col`} style={{ height: window.innerWidth < 768 ? '10vh' : 'auto' }}>

          {currentChat !== null && (
            <>
              <div>
                <div className="flex items-center mt-5 ml-10">

                  <FontAwesomeIcon className="-ml-8 mr-10  md:hidden" onClick={()=>setCurrentChat(null)} icon={faArrowLeft} />
                  <img
                    src={profile.profileImage}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="ml-2 md:ml-24">{profile.userName}</p>
                  <div className="flex ml-auto mr-7 md:mr-24  gap-14">
                    <FontAwesomeIcon icon={faPhone} onClick={handleAudioCall}/>
                    <FontAwesomeIcon icon={faVideo} onClick={handleVideoCall}/>
                  </div>
                </div>
                <hr className="h-px my-3 bg-black border-0 " />
                <div
                  className="flex flex-col gap-4 max-h-[75vh] md:max-h-[70vh] "
                  style={{  overflowY: "auto" }}
                  ref={scrollRef}
                >
                  {messages &&
                    messages.map((mess) =>
                      (mess.sender._id ? mess.sender._id : mess.sender) ===
                      user._id ? (
                        <SendedMessage mess={mess} />
                      ) : (
                        <ReceivedMessage mess={mess} profile={profile} />
                      )
                    )}
                </div>
             
              </div>
              <div className="flex -mb-8  md:items-center md:justify-between md:ml-10 border md:mt-2 border-slate-400  bg-[#EAEAEA] h-8 w-full md:w-[90%] rounded-full px-2">
                <input
                  type="text"
                  name="description"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-transparent border-none focus:outline-none flex-grow"
                  placeholder="Message..."
                />
                {newMessage.length>=1 && 
                <button type="submit">
                  <FontAwesomeIcon
                    className="text-[#2892FF]"
                    size="lg"
                    icon={faCircleChevronRight}
                    onClick={handleMessage}
                  />
                </button>
                }
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
        </div>
      </div>
      
    </>
  )
}

export default Chat;
