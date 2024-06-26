import { useEffect, useState } from "react"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { changeUserStatus, getAllUsers } from "../../services/api/admin/apiMethods"
import { toast } from "sonner"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Pagination } from "flowbite-react";

function AllUsers() {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount , setTotalCount] =useState(0);
    
    const admin = useSelector((state:any)=>state.adminAuth.admin);
    const user = useSelector((state:any)=>state.auth.user)
    useEffect(() => {
        if (!admin) {
            navigate('/admin');
        }

        getAllUsers(currentPage)
            .then((response:any) => {
                const data = response.data;
                if (response.status === 200) {
                    console.log("dataa",data);
                    
                    setAllUsers(data.allUsers);
                    const totaluserCount = Math.ceil(data.totalUsers/5)
                    setTotalCount(totaluserCount)
                } else {
                    toast.error(data.message);
                }
            })
            .catch((error:any) => {
                toast.error("Failed to fetch users");
                console.log("Error",error)
            });
    }, [currentPage]);

    const onPageChange = (page: number) => setCurrentPage(page);

    const handleUserBlock = (userId:string, status:boolean) => {
        try {
            if (admin) {
                confirmAlert({
                    title: 'Confirm',
                    message: `Are you sure you want to ${status ? 'block' : 'unblock'} this user?`,
                    buttons: [
                        {
                            label: 'Yes',
                            onClick: () => {
                                changeUserStatus({ userId, status })
                                    .then((response: any) => {
                                        const data = response.data;
                                        if (response.status === 200) {
                                            toast.success(data.message);
                                            setAllUsers((prevUsers: any) =>
                                                prevUsers.map((user: any) =>
                                                    user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
                                                )
                                            );
                                            if(user._id===userId){
                                                console.log("if works",allUsers);
                                                // dispatch(logoutUser())
                                            }
                                        } else {
                                            toast.error(data.message);
                                        }
                                    });
                            }
                        },
                        {
                            label: 'No',
                            onClick: () => { }
                        }
                    ]
                });
            } else {
                navigate('/admin/');
            }
        } catch (error) {
            toast.error("Failed to block/unblock user");
        }
    }

    return (
        <>
            <AdminSidebar />
            <div className="md:ml-80 mt-20 md:mt-0">
                <div className="flex flex-col mt-8 md:w-[50rem] ">
                    <div className="-my-2 py-2 overflow-x-auto sm:-mx-5 sm:px-6 lg:-mx-8 lg:px-8">
                        <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {allUsers && allUsers.map((user:any) => (
                                        <tr key={user._id}>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full" src={user.profileImage} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm leading-5 font-medium text-gray-900">{user.userName ? user.userName : "No name provided"}</div>
                                                        <div className="text-sm leading-5 text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                {user.isBlocked ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-red-800">Block</span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                                                {user.isBlocked ? (
                                                    <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleUserBlock(user._id, false)}>Unblock</button>
                                                ) : (
                                                    <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleUserBlock(user._id, true)}>Block</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    
                                </tbody>
                            </table>
                            
                        </div>
                        <Pagination
          layout="table"
          currentPage={currentPage}
          totalPages={totalCount} 
          onPageChange={onPageChange}
          showIcons
        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllUsers;