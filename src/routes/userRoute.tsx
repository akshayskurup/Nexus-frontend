import { Navigate, Route, Routes } from "react-router-dom"


import Login from "../pages/login/Login"
import Signup from "../pages/signup/Signup";
import ForgetPassword from "../pages/forgetPassword/ForgetPassword";
import ChangePassword from "../pages/changePassword/ChangePassword";
import AccountSetup from "../pages/accountSetup/AccountSetup";
import UserProfile from "../pages/userProfile/UserProfile";
import ProtectedRoutes from "./ProtectedRotues";
import HomePage from "../pages/homePage/HomePage";


function UserRoute() {
    return(
        <>
        <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/account-setup" element={<AccountSetup /> } />
        <Route path="/my-profile" element={<ProtectedRoutes><UserProfile /></ProtectedRoutes>} />
        <Route path="/home" element={<ProtectedRoutes><HomePage /></ProtectedRoutes>} />

        </Routes>
        </>
    )
}

export default UserRoute;
