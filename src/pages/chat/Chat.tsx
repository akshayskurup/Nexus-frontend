import React from 'react'
import NavBar from '../../components/NavBar'
import TopNavBar from '../../components/responsiveNavBars/TopNavBar'
import BottomNavBar from '../../components/responsiveNavBars/BottomNavBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons'

function Chat() {
  return (
    <>
     <div className='hidden md:block sticky top-0 '>
        <NavBar />
      </div>
      <div className='sticky top-0 md:hidden'>
        <TopNavBar />
      </div>
      <div className=' fixed bottom-0 w-full md:hidden'>
        <BottomNavBar />
      </div>
    <div className='flex w-screen'>
        <div className='w-1/2 bg-slate-400 h-screen bg-white border border-r-3 border-red-400'>
            <p className='font-semibold text-xl text-center mt-5'>Messages</p>
            <div className='flex items-center mt-5'>
                <img src="sadf" alt="" className='w-10 h-10 rounded-full'  />
                <div className='ml-24 '>
                    <p>Hello</p>
                    <p>newMessage</p>
                </div>
                <div className='w-3 h-3 bg-blue-800 rounded-full ml-auto mr-10'></div>
            </div>
            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-black" />

        </div>
        <div className='w-[90%] bg-[#F5F5F5] h-screen'>
        <div className='flex items-center mt-5 ml-10'>
                <img src="sadf" alt="" className='w-10 h-10 rounded-full'  />
                
                    <p className='ml-24'>Hello</p>
                    
               <div className=' flex ml-auto mr-24 gap-14'>
                <FontAwesomeIcon icon={faPhone} />
                <FontAwesomeIcon icon={faVideo} />

               </div>
            </div>
            <hr className="h-px my-3 bg-black border-0 " />

        </div>

    </div>
    </>
  )
}

export default Chat