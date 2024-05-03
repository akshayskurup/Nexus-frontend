import { Navigate, Route, Routes } from "react-router-dom"


import Login from "../pages/login/Login"
import Signup from "../pages/signup/Signup";
import ForgetPassword from "../pages/forgetPassword/ForgetPassword";
import ChangePassword from "../pages/changePassword/ChangePassword";
import AccountSetup from "../pages/accountSetup/AccountSetup";
import MyProfile from "../pages/myProfile/MyProfile";
import ProtectedRoutes from "./ProtectedRotues";
import HomePage from "../pages/homePage/HomePage";
import UserProfile from "../pages/userProfile/UserProfile";


function UserRoute() {
    return(
        <>
        <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/account-setup" element={<AccountSetup /> } />
        <Route path="/my-profile" element={<ProtectedRoutes><MyProfile /></ProtectedRoutes>} />
        <Route path="/home" element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />
        <Route path="/profile/:userId" element={<ProtectedRoutes><UserProfile /></ProtectedRoutes>} />


        </Routes>
        </>
    )
}

export default UserRoute;
