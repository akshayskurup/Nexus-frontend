import React, { useState } from 'react'
import Modal from 'react-modal'
import Posts from '../Posts'
import { getPost } from '../../services/api/user/apiMethods'


function PostView({ isModalOpen, onModalClose, post }) {
  const [currentPost, setCurrentPost] = useState(post);

  const handlePost = (postId) => {
    getPost(postId).then((res) => {
      if (res.status === 200) {
        console.log("me",res.data.post)
        setCurrentPost(res.data.post);
      }
    });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={onModalClose}
      className="absolute mt-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 bg-white rounded-lg shadow-lg"
    >
      <div className="max-h-[85vh] overflow-y-auto">
        <Posts post={currentPost} handlePost={handlePost} explore={true} />
      </div>
    </Modal>
  );
}

export default PostView;