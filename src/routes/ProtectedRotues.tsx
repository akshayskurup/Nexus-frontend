import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoutes({ children }: any) {
    const user = useSelector((state:any) => state.auth.user);
    // console.log("This is from protex",user.isBlocked)
    if (!user||user.isBlocked) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoutes;
