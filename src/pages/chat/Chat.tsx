import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../components/NavBar";
import TopNavBar from "../../components/responsiveNavBars/TopNavBar";
import BottomNavBar from "../../components/responsiveNavBars/BottomNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const user = useSelector((state: any) => state.auth.user);

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
      console.log("DATAss ", data);
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
    console.log("handleActiveee", userObj);
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
        <div className="w-1/2 bg-slate-400  bg-white border border-r-3">
          <p className="font-semibold text-xl text-center mt-5">Messages</p>
          <button onClick={getConversation}>Messages</button>
          <button className="ml-5" onClick={handleAllFriendsMessage}>
            Friends
          </button>
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
              // <>

              // <div className='flex items-center mt-5' onClick={()=>handleActiveChat(mutualUser)}>
              //   <img src={mutualUser.profileImage} alt="" className='w-10 h-10 rounded-full' />
              //   <div className='ml-24 '>
              //     <p>{mutualUser.userName}</p>
              //     <p>newMessage</p>
              //   </div>
              //   <div className='w-3 h-3 bg-blue-800 rounded-full ml-auto mr-10'></div>
              // </div>
              // <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-black" />
              // </>
            ))}
        </div>
        <div className="w-[90%] bg-[#F5F5F5] flex flex-col">
          {currentChat !== null && (
            <>
              <div>
                <div className="flex items-center mt-5 ml-10">
                  <img
                    src={profile.profileImage}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="ml-24">{profile.userName}</p>
                  <div className="flex ml-auto mr-24 gap-14">
                    <FontAwesomeIcon icon={faPhone} />
                    <FontAwesomeIcon icon={faVideo} />
                  </div>
                </div>
                <hr className="h-px my-3 bg-black border-0 " />
                <div
                  className="flex flex-col gap-4"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
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
              <div className="flex items-center justify-between ml-10 border border-slate-400 mt-auto bg-[#EAEAEA] h-8 w-[17rem] md:w-[90%] rounded-full px-2">
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
        </div>
      </div>
    </>
  );
}

export default Chat;
