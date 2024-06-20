import TimeAgo from 'timeago-react'; 

function ReceivedMessage({mess,profile}:any) {
    const maxWidth = `${Math.min(mess.text.length * 15, 280)}px`; // Adjust the multiplier as needed
  const maxHeight = '100px'; // Set a maximum height as needed
  return (
    <div className='ml-4'>
    <div className='flex items-center gap-4 text-black'>
    <img className='w-8 h-8 rounded-full' src={profile.profileImage?profile.profileImage:mess.sender.profileImage} alt="adsf" />
    <div className="bg-slate-200 min-w-20 pr-4 rounded-lg" style={{ maxWidth, maxHeight, wordWrap: 'break-word' }}>
      <p className="ml-4">{mess.text}</p>
    </div>
    </div>
    <p className='text-[0.7rem] mt-[6px] text-black'><TimeAgo datetime={mess.updatedAt}/></p>
    </div> 
  );
}

export default ReceivedMessage