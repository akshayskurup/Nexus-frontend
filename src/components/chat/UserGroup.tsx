
function UserGroup({group}:any) {
    
    
  return (
    <>
          {/* onClick={()=>handleActiveChat(user)} */}
          <div className='flex items-center mt-5 ml-9' >
            <img src={group?.profile} alt="" className='w-10 h-10 rounded-full' />
            <div className='ml-24 '>
              <p className='font-semibold text-black'>{group?.name}</p>
            </div>
            {/* <div className='w-3 h-3 bg-blue-800 rounded-full ml-auto mr-10'></div> */}
          </div>
          <hr className="h-px my-3  bg-gray-200 border-0 dark:bg-black" />
          </>
  )
}

export default UserGroup