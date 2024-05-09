import React from 'react';
import TimeAgo from 'timeago-react'; 


function SendedMessage({ mess }) {
  
  const maxWidth = `${Math.min(mess.text.length * 10, 280)}px`; // Adjust the multiplier as needed
    const maxHeight = '100px'; // Set a maximum height as needed
  
    return (
        <>
      <div className="bg-blue-500 min-w-20 pr-4 rounded-lg ml-auto mr-7 md:mr-10" style={{ maxWidth, maxHeight, wordWrap: 'break-word' }}>
        <p className="ml-4">{mess.text}</p>
      </div>
      <p className='ml-auto mr-10 text-[0.7rem] -mt-[8px]'><TimeAgo datetime={mess.updatedAt}/></p>
      </>
    );
}

export default SendedMessage;
