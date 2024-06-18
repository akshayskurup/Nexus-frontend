import { useEffect, useState } from "react"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { changeUserStatus, getAllUsers } from "../../services/api/admin/apiMethods"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Pagination } from "flowbite-react";
import { logoutUser, updateUser } from "../../utils/reducers/authSlice";

function AllUsers() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [allUsers, setAllUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const admin = useSelector((state:any) => state.adminAuth.admin);
    const user = useSelector((state:any) => state.auth.user)

    useEffect(() => {
        if (!admin) {
            navigate('/admin');
        }

        getAllUsers(currentPage)
            .then((response:any) => {
                const data = response.data;
                if (response.status === 200) {
                    setAllUsers(data.allUsers);
                    const totaluserCount = Math.ceil(data.totalUsers/5)
                    setTotalCount(totaluserCount)
                } else {
                    toast.error(data.message);
                }
            })
            .catch((error:any) => {
                toast.error("Failed to fetch users");
            });
    }, [currentPage]);

    const onPageChange = (page: number) => setCurrentPage(page);

    const handleUserBlock = (userId:string, status:boolean) => {
        // ... (rest of the handleUserBlock function remains the same)
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className={`flex-1 flex flex-col overflow-hidden ${isSidebarOpen ? 'lg:ml-[300px]' : 'ml-0'} transition-all duration-300`}>
                <header className="flex items-center justify-between p-4 bg-white border-b lg:hidden">
                    <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold">All Users</h1>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <div className="bg-white shadow-md rounded my-6">
                            <table className="min-w-max w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Name</th>
                                        <th className="py-3 px-6 text-left">Status</th>
                                        <th className="py-3 px-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    {allUsers && allUsers.map((user:any) => (
                                        <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="mr-2">
                                                        <img className="w-6 h-6 rounded-full" src={user.profileImage} alt=""/>
                                                    </div>
                                                    <span className="font-medium">{user.userName || "No name provided"}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                {user.isBlocked ? (
                                                    <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">Blocked</span>
                                                ) : (
                                                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Active</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <button 
                                                    onClick={() => handleUserBlock(user._id, !user.isBlocked)}
                                                    className={`${user.isBlocked ? 'bg-green-500' : 'bg-red-500'} text-white py-1 px-3 rounded-full text-xs`}
                                                >
                                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6">
                            <Pagination
                                layout="table"
                                currentPage={currentPage}
                                totalPages={totalCount}
                                onPageChange={onPageChange}
                                showIcons
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AllUsers;