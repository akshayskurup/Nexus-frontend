import { useEffect, useState } from "react"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { changeUserStatus, getAllUsers } from "../../services/api/admin/apiMethods"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../utils/reducers/adminAuthSlice";
import { useNavigate } from "react-router-dom";


function AllUsers() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [allUsers,setAllUsers] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(2);
    
    const admin = useSelector((state:any)=>state.adminAuth.admin);


    useEffect(()=>{
        if(!admin){
            navigate('/admin')
        }
        getAllUsers()
        .then((response:any)=>{
            const data = response.data
            if(response.status===200){
                setAllUsers(data.allUsers);
            }else{
                toast.error(data.message);
            }
        })
    },[])

    const handleUserBlock = (userId:string,status:boolean)=>{
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
            }else{
                navigate('/admin/')
            }
            
        } catch (error) {
            toast.error("sdf");
        }
    }

    const handleLogout = ()=>{
        dispatch(adminLogout())
        navigate('/admin')
    }
    
    let currentUsers = []
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    if(allUsers){
         currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);
    }

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    
    <div className="flex ">
    <div className="w-1/5 bg-gray-800 text-white">
    <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Nexus Admin</h2>
        <ul className="space-y-2 h-[70vh]">
            <li>
                <a href="#" className="block hover:bg-gray-700 px-2 py-1 rounded">User Management</a>
            </li>
            <li>
                <a href="#" className="block hover:bg-gray-700 px-2 py-1 rounded">Post Management</a>
            </li>
            
        </ul>
        <div className="mt-auto">
            <a onClick={()=>handleLogout()}  className="block cursor-pointer mb-5 hover:bg-red-700 px-2 py-1 rounded">Logout</a>
            
        </div>
    </div>
</div>

    
    <div className="ml-12">
        
        




<div className="flex flex-col mt-8 w-[50rem] ">
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
                {currentUsers && currentUsers.map((user) => (

                
                    <tr>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                    <img className="h-10 w-10 rounded-full" src={user.profileImage} alt="" />
                                </div>
                                

                                
                                <div className="ml-4">
                                    <div className="text-sm leading-5 font-medium text-gray-900">{user.userName?user.userName:"No name provided"}</div>
                                    <div className="text-sm leading-5 text-gray-500">{user.email}</div>
                                </div>
                            </div>
                        </td>
                        
                        

                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            
                            {user.isBlocked ? (<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-red-800">Block</span>)
                            :(<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>)}
                        </td>


                        <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                            {user.isBlocked ? (
                            <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleUserBlock(user._id, false)}>
                            Unblock</button>
                        ):
                        (
                            <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleUserBlock(user._id, true)}>
                            Block</button>
                        )
                    }
                        </td>
                    </tr>
                       
                    ))}
                </tbody>
                
            </table>
           
        </div>
        

        <Pagination
                    usersPerPage={usersPerPage}
                    totalUsers={allUsers?allUsers.length:1}
                    paginate={paginate}
                />
        
    </div>
</div>
</div>
    </div>
  )
}

export default AllUsers



const Pagination = ({ usersPerPage, totalUsers, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination flex justify-center gap-10">
                {pageNumbers.map((number) => (
                    <li key={number} className="page-item border border-gray-800">
                        <a onClick={() => paginate(number)} href={`#${number}`} className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};