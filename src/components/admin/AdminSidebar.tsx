import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../utils/reducers/adminAuthSlice';

function AdminSidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        dispatch(adminLogout())
        navigate('/admin')
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Toggle button for mobile */}
            <button 
                className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2 rounded-md"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <div className={`sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900 ${isSidebarOpen ? 'left-0' : '-left-full'} lg:w-[300px] lg:block transition-all duration-300 z-40`}>
                <div className="text-gray-100 text-xl">
                    <div className="p-2.5 mt-1 flex items-center">
                        <i className="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600"></i>
                        <h1 className="font-bold text-gray-200 text-[15px] ml-3">Nexus Admin</h1>
                    </div>
                    <div className="my-2 bg-gray-600 h-[1px]"></div>
                </div>
                
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                    onClick={() => {
                        navigate('/admin/all-users')
                        setIsSidebarOpen(false)
                    }}
                >
                    <i className="bi bi-house-door-fill"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">User Management</span>
                </div>
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                    onClick={() => {
                        navigate('/admin/all-posts')
                        setIsSidebarOpen(false)
                    }}
                >
                    <i className="bi bi-bookmark-fill"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Post Management</span>
                </div>
                
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-red-600 text-white"
                    onClick={handleLogout}
                >
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
                </div>
            </div>
        </>
    )
}

export default AdminSidebar