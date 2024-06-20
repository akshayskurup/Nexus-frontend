import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { GetUserProfile } from '../../services/api/user/apiMethods';
import { toast } from 'sonner';

function GroupInfo({ show, onHide, group }:any) {
    const [users, setUsers] = useState<any>([]);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            const processedUserIds = new Set(); // Set to store processed user IDs
            const fetchedUsers = [];

            for (const userId of group.members) {
                // Check if the user ID has already been processed
                if (!processedUserIds.has(userId)) {
                    processedUserIds.add(userId); // Add the user ID to the processed set

                    try {
                        const response:any = await GetUserProfile(userId);
                        const data = response.data;

                        if (response.status === 200) {
                            fetchedUsers.push(data.user);
                        } else {
                            toast.error(data.message);
                        }
                    } catch (error) {
                        console.error("Error fetching user profile:", error);
                        toast.error("Error fetching user profile");
                    }
                }
            }

            setUsers(fetchedUsers);
        };

        if (show) {
            fetchGroupMembers();
        }
    }, [show, group.members]);

    const handleOnHide = () => {
        setUsers([]);
        onHide();
    };

    return (
        <>
            {show && (
                <Modal 
                    isOpen={show}
                    onRequestClose={handleOnHide}
                    className="border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 bg-white rounded-lg shadow-lg p-6"
                >
                    <div className='text-black'>
                        <h2 className="text-2xl font-bold mb-4 text-center">Group Info</h2>
                        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
                        <div className='flex justify-between'>
                            <div className='w-[50%]'>
                                <img className='w-20 h-20 rounded-full ml-auto mr-auto mt-5' src={group.profile} alt="" />
                                <div className='flex justify-center mt-5'>
                                    <p>Group Name : </p>
                                    <p>{group.name}</p>
                                </div>
                                <p className='mt-5'>Created At: {new Date(group.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className='border-l  border-black p-4 w-[50%]'>
                                <p className='text-center mb-5'>Group Members</p>
                                <div className='max-h-[10rem] overflow-y-auto'>
                                {users && 
                                
                                    users.map((user:any) => (
                                        <div className='flex items-center gap-10 mb-2 ml-5 '>
                                        <img className='w-10 h-10 rounded-full' src={user.profileImage} alt="" />
                                        <p key={user._id}>{user.name}</p>
                                        </div>
                                    ))
                                    
                                }
                                </div>
                               
                            </div>
                        </div>
                          
                    </div>
                </Modal>
            )}
        </>
    );
}

export default GroupInfo;
