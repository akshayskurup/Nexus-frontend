import { Navigate, Route, Routes } from "react-router-dom"
import AdminLogin from "../pages/adminLogin/AdminLogin";
import AllUsers from "../components/admin/AllUsers";
import { useSelector } from "react-redux";
import AllPosts from "../components/admin/AllPosts";




function AdminRoute() {
    const admin = useSelector((state:any)=>state.adminAuth.admin)
    return(
        <>
        <Routes>
        <Route path='/' element={admin==null?<AdminLogin />:<Navigate to="/admin/all-users" />} />
        <Route path='/all-users' element={admin ? <AllUsers /> : <Navigate to="/admin/" />} />
        <Route path='/all-posts' element={admin ? <AllPosts /> : <Navigate to="/admin/" />} />

        </Routes>
        </>
    )
}

export default AdminRoute;
