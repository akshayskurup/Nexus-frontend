import { useEffect, useState } from "react"
import AdminSidebar from "./AdminSidebar"
import { changePostStatus, getAllPosts } from "../../services/api/admin/apiMethods"
import { toast } from "sonner"
import { Pagination } from "flowbite-react";


function AllPosts() {
    const [allPost, setAllPost] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount , setTotalCount] =useState(0);

    useEffect(()=>{
        getAllPosts(currentPage)
        .then((response:any)=>{
            const data = response.data
            if(response.status===200){
                console.log("data",data);
                setAllPost(data.allPosts);
                const totalPostCount = Math.ceil(data.totalReportedPost/5)
                setTotalCount(totalPostCount)
            }else{
                toast.error(data.message);
            }
        })
    },[currentPage])

    const handlePostBlock = (postId,status)=>{
        changePostStatus({ postId, status },currentPage)
        .then((response: any) => {
            const data = response.data;
            console.log("dataaa",data);
            
            if (response.status === 200) {
               setAllPost(data.post);
            } else {
                toast.error(data.message);
            
        }})
    }
    const onPageChange = (page: number) => setCurrentPage(page);
  return (
    <>
    <AdminSidebar />
    <div className="mt-20 md:mt-0 md:ml-80">
<div className="flex flex-col mt-8 md:w-[50rem] ">
    <div className="-my-2 py-2 overflow-x-auto sm:-mx-5 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Post</th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Content</th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                    </tr>
                </thead>

                <tbody className="bg-white">
               
                {allPost && allPost.map((post) => ( 

                
                    <tr>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                    <img className="h-10 w-10 rounded-full" src={post.postId.imageUrl} alt="img" />
                                </div>
                                

                                
                                <div className="ml-4">
                                    {post.reason.map((reasons)=>(
                                    <div className="text-sm leading-5 font-medium text-gray-900">{reasons}</div>
                                    ))}
                                    <div className="text-sm leading-5 text-gray-500">{post.userId.userName}</div>
                                </div>
                            </div>
                        </td>
                        
                        
                        <td>
                        <div className="text-sm leading-5 font-medium text-gray-900">{post.postId.description}</div>

                        </td>

                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            
                        {post.postId.isBlocked ? (<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-red-800">Block</span>)
                            :(<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>)}
                        </td>


                        <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                            
                        {post.postId.isBlocked ? (
                            <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handlePostBlock(post.postId._id, false)}>
                            Unblock</button>
                        ):
                        (
                            <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handlePostBlock(post.postId._id, true)}>
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

export default AllPosts