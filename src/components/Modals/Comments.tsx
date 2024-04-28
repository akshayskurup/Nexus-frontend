import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { deleteComment, getAllComments } from '../../services/api/user/apiMethods'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function Comments({ isModalOpen, onModalClose, post, onDeleteComment  }) {
    const [allComments,setAllComments] = useState([])


    useEffect(()=>{
        getAllComments(post._id)
        .then((response:any)=>{
            const data = response.data;
            if(response.status===200){
                setAllComments(data.comment);
                
            }
        })
    },[])

    const handleDelete = (commentId:string)=>{
      deleteComment(commentId)
      .then((response:any)=>{
        const data = response.data;
        if(response.status===200){
            setAllComments(data.comments);
            onDeleteComment()
        }
    })
    }

    

  return (
    <Modal
        isOpen={isModalOpen}
        onRequestClose={onModalClose}
        className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Comments</h2>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
      {allComments && allComments.map((comment)=>(
        <div className='flex my-2 items-center'>
        <img className='w-9 h-9 rounded-full' src={comment.userId.profileImage} alt="" />
        <p className='ml-3 font-semibold'>{comment.userId.userName}</p>
        <p className='ml-5 max-w-80'>{comment.comment}</p>
        <p className='text-xs ml-auto'>{comment.elapsed}</p>
        <FontAwesomeIcon className="ml-8" onClick={()=>handleDelete(comment._id)} icon={faTrash} />
        </div>
      ))}

      </Modal> 

  )
}

export default Comments