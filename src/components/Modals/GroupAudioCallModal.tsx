import React from 'react'
import Modal from 'react-modal'


function GroupAudioCallModal({show,onHide,onAccept,onReject,caller}) {
  return (
    <>
    {show && (
        <Modal 
        isOpen={show}
        onRequestClose={onHide}
        className="fixed inset-0 flex  items-start justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 mt-14 rounded-lg shadow-lg">
            <div className="flex flex-col gap-4 items-center justify-center mb-4">
            <span className="ml-4 text-lg font-semibold">
                Incoming Group Audio call from 
              </span>
              <img
                src={caller.profile}
                alt={caller.name}
                className="w-12 h-12 rounded-full"
              />
              <span className="ml-4 text-lg font-semibold">
                {caller.name}
              </span>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onReject}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                <div className='flex gap-3 justify-center items-center'>
                  
                  Reject
                </div>
              </button>
              <button
                onClick={onAccept}
                className="bg-green-500  text-white px-4 py-2 rounded hover:bg-green-600 animate-shiver"
              >
                <div className='flex gap-3 justify-center items-center'>
                
                  Accept
                </div>
              </button>
            </div>
          </div>
          </Modal>
      )}
    </>
  )
}

export default GroupAudioCallModal