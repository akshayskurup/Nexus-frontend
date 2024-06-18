import TimeAgo from 'timeago-react';

function SendedMessage({ mess }:any) {
  return (
    <div className="flex flex-col items-end mb-4">
      <div className="max-w-[70%] bg-blue-500 rounded-lg px-4 py-2 text-white">
        <p className="break-words">{mess.text}</p>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        <TimeAgo datetime={mess.updatedAt} />
      </div>
    </div>
  );
}

export default SendedMessage;