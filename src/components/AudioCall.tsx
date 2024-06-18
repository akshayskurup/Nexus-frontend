import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function AudioCall() {

    const { roomId } = useParams();
  const containerRef = useRef(null)
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const userId = user._id;
  const userName = user.userName;

    const handleLeaveRoom= ()=>{
        console.log("user Left")
    
        navigate('/chat');
      }
      useEffect(()=>{
        if (!containerRef.current) return;
    
    
        const myMeeting = async () => {
          const appId = 504668120;
          const serverSecret = "d42041171ac24b1a95a4064be9e7725f";
          const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appId,
            serverSecret,
            roomId?roomId:"",
            userId,
            userName,
          );
          const zc = ZegoUIKitPrebuilt.create(kitToken)
          zc.joinRoom({ 
            turnOnCameraWhenJoining: false,
              showMyCameraToggleButton: false,
              showAudioVideoSettingsButton: false,
              showScreenSharingButton: false,
              onLeaveRoom: handleLeaveRoom,
              onUserLeave: handleLeaveRoom,
              container: containerRef.current,
              scenario:{
                  mode:ZegoUIKitPrebuilt.OneONoneCall,
      
              },
          })
        };
        myMeeting();
      },[roomId,userId,userName,navigate])
  return (
    <div ref={containerRef} style={{height:'100vh',width:'100vw'}}/>

  )
}

export default AudioCall