import Modal from 'react-modal';
import { useState } from 'react';
import { assistantConversation, clearAssistantConversation } from '../../services/api/user/apiMethods';
import { toast } from 'sonner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { setMessage } from '../../utils/reducers/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentMedical } from '@fortawesome/free-solid-svg-icons';

function AssistantModal({ isOpen, onClose }:any) {
  const dispatch = useDispatch();
  const messagesFromStore = useSelector((state:any) => state.auth.message);
  const [messages, setMessages] = useState(messagesFromStore);
  const [userInput, setUserInput] = useState(''); 
  const [loading, setLoading] = useState(false);

  console.log("Messages",messages)
  const sendMessage = async (text:any) => {
    const userMessage = { isUser: true, text: `You said: ${text}.` };
    setMessages((prev:any) => {
      const updatedMessages:any = [...prev, userMessage];
      dispatch(setMessage(updatedMessages));
      return updatedMessages;
    });
    setUserInput('');

    const data = { prompt: text };
    setLoading(true);

    try {
      const res:any = await assistantConversation(data);
      if (res.status === 200) {
        const botReply = { isUser: false, text: `replied: ${res.data.response}...` };
        setMessages((prev:any) => {
          const updatedMessages:any = [...prev, botReply];
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
          const updatedMess:any = []
          dispatch(setMessage(updatedMess))//error
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
      <div className="h-16 w-full bg-slate-200 flex items-center rounded-lg">
        <img
          className="w-12 h-12 ml-3 rounded-lg border border-black object-cover"
          src="/images/friends.png"
          alt="AI Avatar"
        />
        <p className='ml-auto mr-auto font-semibold'>Virtual Friend</p>
      </div>
      {messages.length === 0 ? (
        <div className='flex flex-col items-center pt-20 pb-20'>
        <FontAwesomeIcon color='#837D7D' size='6x' icon={faCommentMedical} />
        <p className='font-semibold'>Start new conversation</p>
        </div>
      ) : (
        <div className="flex-grow max-h-[45vh] overflow-y-auto p-4">
          {messages.map((message:any, index:any) => (
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
          {messages.length>0 && 
          <p className='text-red-400 text-sm cursor-pointer hover:underline w-32' onClick={handleClearConversation}>Clear Conversation</p>
          
          }
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
          disabled={userInput.length<=0}
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
