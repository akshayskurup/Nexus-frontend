import Modal from 'react-modal';
import React, { useEffect, useState } from 'react';
import { assistantConversation, clearAssistantConversation } from '../../services/api/user/apiMethods';
import { toast } from 'sonner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { setMessage } from '../../utils/reducers/authSlice';
import { useDispatch, useSelector } from 'react-redux';

function AssistantModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const messagesFromStore = useSelector((state) => state.auth.message);
  const [messages, setMessages] = useState(messagesFromStore);
  const [userInput, setUserInput] = useState(''); 
  const [loading, setLoading] = useState(false);

  console.log("Messages",messages)
  const sendMessage = async (text) => {
    const userMessage = { isUser: true, text: `You said: ${text}.` };
    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage];
      dispatch(setMessage(updatedMessages));
      return updatedMessages;
    });
    setUserInput('');

    const data = { prompt: text };
    setLoading(true);

    try {
      const res = await assistantConversation(data);
      if (res.status === 200) {
        const botReply = { isUser: false, text: `replied: ${res.data.response}...` };
        setMessages((prev) => {
          const updatedMessages = [...prev, botReply];
          dispatch(setMessage(updatedMessages));
          return updatedMessages;
        });
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleClearConversation = ()=>{
    clearAssistantConversation().then((res:any)=>{
      if(res.status===200){
        setMessages(()=>{
          const updatedMess = []
          dispatch(setMessage([]))
          return updatedMess
        })
      }else{
        toast.error(res.data.error)
      }
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 bg-white rounded-lg shadow-lg p-5 flex flex-col"
    >
      <div className="h-28 w-full bg-slate-500 flex flex-col items-center justify-center rounded-lg">
        <img
          className="w-20 h-20 rounded-full"
          src="https://res.cloudinary.com/dsirnl1mh/image/upload/v1714455035/scw23k7gsfbxvoe4g8ch.jpg"
          alt="AI Avatar"
        />
      </div>
      {messages.length === 0 ? (
        'Start new conversation'
      ) : (
        <div className="flex-grow max-h-[45vh] overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
              <p className={`inline-block px-4 py-2 rounded-lg ${message.isUser ? 'bg-indigo-500 text-white' : 'bg-slate-200'}`}>
                {message.text}
              </p>
              {message.isUser}
            </div>
          ))}
          {loading && (
            <div className="mb-4 text-left ml-4">
              <Skeleton height={18} width={250} className="mt-3" />
            </div>
          )}
        </div>
      )}

      <div className="">
        <div className='flex flex-col'>
          <p className='text-red-400 text-sm cursor-pointer hover:underline w-32' onClick={handleClearConversation}>Clear Conversation</p>
          <div className=' bg-slate-200  flex items-center justify-between px-4 py-2  '>
          <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage(userInput);
            }
          }}
          className="w-[90%] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your message..."
        />
        <button
          onClick={() => sendMessage(userInput)}
          className="bg-indigo-500 ml-4 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none"
        >
          Send
        </button>
          </div>
        </div>
        
      </div>
    </Modal>
  );
}

export default AssistantModal;
