import { Route, Routes } from "react-router-dom"


import Login from "../pages/login/Login"
import Signup from "../pages/signup/Signup";
import ForgetPassword from "../pages/forgetPassword/ForgetPassword";
import ChangePassword from "../pages/changePassword/ChangePassword";
import AccountSetup from "../pages/accountSetup/AccountSetup";
import MyProfile from "../pages/myProfile/MyProfile";
import ProtectedRoutes from "./ProtectedRotues";
import HomePage from "../pages/homePage/HomePage";
import UserProfile from "../pages/userProfile/UserProfile";
import Chat from "../pages/chat/Chat";
import VideoCall from "../components/VideoCall";
import AudioCall from "../components/AudioCall";
import GroupVideoCall from "../components/GroupVideoCall";
import GroupAudioCall from "../components/GroupAudioCall";
import Explore from "../pages/explore/Explore";


function UserRoute() {
    return(
        <>
        <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/account-setup" element={<AccountSetup /> } />
        <Route path="/my-profile" element={<ProtectedRoutes><MyProfile /></ProtectedRoutes>} />
        <Route path="/home" element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />
        <Route path="/chat" element={<ProtectedRoutes><Chat /></ProtectedRoutes>} />
        <Route path="/profile/:userId" element={<ProtectedRoutes><UserProfile /></ProtectedRoutes>} />
        <Route path="/profile/:userId" element={<ProtectedRoutes><UserProfile /></ProtectedRoutes>} />
        <Route path="/explore" element={<ProtectedRoutes><Explore /></ProtectedRoutes>} />
        <Route path="/video-call/:roomId/:userId" element={<VideoCall />} />
        <Route path="/audio-call/:roomId/:userId" element={<AudioCall />} />
        {/* <Route path="/audio-call/:roomId/:userId" element={<AudioCall />} /> */}
        <Route path ="/group-video-call/:roomId/:userId" element={<GroupVideoCall />} />
        <Route path ="/group-audio-call/:roomId/:userId" element={<GroupAudioCall />} />

        </Routes>
        </>
    )
}

export default UserRoute;
