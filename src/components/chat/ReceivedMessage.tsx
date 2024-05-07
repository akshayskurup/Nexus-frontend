import React from 'react';
import TimeAgo from 'timeago-react'; 

function ReceivedMessage({mess,profile}) {
    const maxWidth = `${Math.min(mess.text.length * 15, 280)}px`; // Adjust the multiplier as needed
  const maxHeight = '100px'; // Set a maximum height as needed
console.log("PRo",profile)
  return (
    <>
    <div className='flex items-center gap-4'>
    <img className='w-8 h-8 rounded-full' src={profile.profileImage} alt="adsf" />
    <div className="bg-slate-200 min-w-20 pr-4 rounded-lg" style={{ maxWidth, maxHeight, wordWrap: 'break-word' }}>
      <p className="ml-4">{mess.text}</p>
    </div>
    </div>
    <p className='text-[0.7rem] -mt-[8px]'><TimeAgo datetime={mess.updatedAt}/></p>
    </> 
  );
}

export default ReceivedMessage