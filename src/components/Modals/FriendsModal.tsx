import { useEffect, useState } from "react";
import Modal from "react-modal";
import { getUserConnections } from "../../services/api/user/apiMethods";
import { useSelector } from "react-redux";

function FriendsModal({ show, onHide, onSaveSelectedUsers, usersSelected }:any) {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [mutualConnections, setMutualConnections] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(usersSelected || []);

  const user = useSelector((state: any) => state.auth.user);

  console.log(followers,following)
  useEffect(() => {
    getUserConnections(user._id).then((response: any) => {
      const connectionData = response.data.connection;
      console.log("connections", response.data.connection);
      setFollowing(connectionData.following);
      setFollowers(connectionData.followers);
      const { followers, following } = connectionData;

      // Find mutual connections
      const mutual = followers.filter((follower: any) =>
        following.some(
          (followingUser: any) => followingUser._id === follower._id
        )
      );

      setMutualConnections(mutual);
    });
  }, [user._id]);

  const handleCheckboxChange = (userId: string) => {
    setSelectedUsers((prevSelectedUsers:any) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id:any) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleSave = () => {
    console.log("Selected Users:", selectedUsers);
    onSaveSelectedUsers(selectedUsers);
    onHide();
  };

  return (
    <Modal
      isOpen={show}
      onRequestClose={onHide}
      className=" border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-3/4 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Friends</h2>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
      <div
        className={`max-h-60 ${
          mutualConnections.length > 5 ? "overflow-y-scroll" : ""
        }`}
      >
        {mutualConnections &&
          mutualConnections.map((user: any) => (
            <div
              className="flex items-center justify-between mb-1"
              key={user.userId}
            >
              <img
                className="w-10 h-10 rounded-full"
                src={user.profileImage}
                alt=""
              />
              <p>{user.userName}</p>
              <input
                className="w-5 h-5"
                onChange={() => handleCheckboxChange(user._id)}
                checked={selectedUsers.includes(user._id)}
                type="checkbox"
              />
            </div>
          ))}
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <button
          className="bg-purple-500 pl-3 pr-3 pt-1 pb-1 mt-2 -mb-5 float-right rounded-md"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

export default FriendsModal;
