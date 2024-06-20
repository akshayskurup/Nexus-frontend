import React, { useCallback, useState } from "react";
import Modal from "react-modal";
import FriendsModal from "./FriendsModal";
import { toast } from "sonner";
import CropModal from "./CropModal";
import getCroppedImg from "../../helpers/croppedImage";
import { Area } from 'react-easy-crop';
import { createNewGroup } from "../../services/api/user/apiMethods";
import { uploadImageToCloudinary } from "../../helpers/cloudinaryUpload";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import HashLoader from "react-spinners/HashLoader";


function CreateGroupModal({ show, onHide }:any) {
    const user = useSelector((state:any)=>state.auth.user);

    const [friendsModal,setFriendsModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<any>([]);
    const [isHovered, setIsHovered] = useState<any>(false);
    const [image, setImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [preview, setPreview] = useState(true);
    const [crop, setCrop] = useState<Area>({ x: 0, y: 0, width: 1, height: 1 });
    const [groupName,setGroupName] = useState('')
    const [loading ,setLoading] = useState(false)
    



  console.log(isHovered,preview)

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleImageSelect = (e:any) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    if (
        file.type === "image/png" ||
        file.type === "image/jpeg"
      ) {
        setImage(file);
        setShowModal(true);
      } else {
        toast.error(
          "Only PNG and JPEG image files are allowed for the post."
        );
      }
  };


    const handleSaveSelectedUsers = (users:any) => {
        setSelectedUsers(users);
        console.log("This is from create group",selectedUsers)
      };

      const handleCropImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
          if (croppedAreaPixels && image) {
            const croppedImageBase64 = await getCroppedImg(image, croppedAreaPixels);
            setCroppedImage(croppedImageBase64);
            setShowModal(false);
            setPreview(false);
          }
        } catch (error) {
          console.error('Error cropping image:', error);
        }
      };

      const handleCloseModal = () => {
        setShowModal(false);
        setImage(null);
        setCrop({ x: 0, y: 0, width: 1, height: 1 });
        setCroppedAreaPixels(null);
        setPreview(true);
      };

      const onCropComplete = useCallback(
        (croppedArea: Area,croppedAreaPixels: Area) => {
          console.log(croppedArea)
          setCroppedAreaPixels(croppedAreaPixels);
        },
        []
      );

      const onCropChange = (crop: Area, croppedAreaPixels: Area) => {
        setCrop(crop);
        setCroppedAreaPixels(croppedAreaPixels);
      };

      const handleNewGroup = async()=>{
        setLoading(true)
        try {
          const imageUrl = await uploadImageToCloudinary(croppedImage?croppedImage:"");
          setSelectedUsers(selectedUsers.push(user._id))
          const groupData = {
              profile:imageUrl,
              name: groupName,
              users: selectedUsers
          }
          console.log("groupdata",groupData)
          createNewGroup(groupData)
          .then((response:any)=>{
              const data = response.data;
              console.log(data)
              if(response.status===200){
                toast.success(data.message)
                onHide();  
              }else{
                toast.error(data.error);
            }
            })    
          
        } catch (error:any) {
          toast.error(error)
      } finally {
        setLoading(false)
      }
      }
  return (
  <Modal isOpen={show} onRequestClose={onHide}
  className="text-black border-2 border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-3/4 xl:w-1/3 bg-white rounded-lg shadow-lg p-6"
  >
        <h2 className="text-2xl font-bold mb-4 text-center">Create Group</h2>
        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
        <label
      className="bg-slate-200 w-20 h-20 rounded-full ml-auto mr-auto hover:cursor-pointer flex items-center justify-center relative"
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      <FontAwesomeIcon size="3x" icon={faCamera}/>
      {/* {isHovered && <p className="text-white z-10">Edit</p>} */}
      {croppedImage && (
        <img
          className="w-20 h-20 rounded-full absolute top-0 left-0"
          src={croppedImage}
          alt=""
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
        disabled={loading}
      />
    </label>
        <div className="w-44 ml-auto mr-auto ">
        <p className="font-bold">Title</p>
        <input onChange={(e)=>setGroupName(e.target.value)} className="bg-slate-200 rounded-md border border-black" type="text" disabled={loading}/>
        
        <button className='border rounded-lg  pl-2 pr-2 mt-4 ml-6 bg-[#2892FF] text-white font-medium ' onClick={()=>setFriendsModal(true)} disabled={loading}>Add Members</button>

        </div>
        {selectedUsers.length>=1 && croppedImage  && 
        <button className="bg-[#2892FF] pl-3 pr-3 pt-1 pb-1 rounded-full float-right mt-10" onClick={handleNewGroup}
        disabled={loading}>
        {loading ? <HashLoader size={20} className='ml-auto mr-auto' color="#ffffff" /> : "Save"}
        </button>
        }
        {friendsModal && 
        <FriendsModal 
        show={friendsModal}
        onHide={()=>setFriendsModal(false)}
        onSaveSelectedUsers={handleSaveSelectedUsers}
        usersSelected={selectedUsers}
        />
        }

        {showModal && (
        <CropModal
          image={image?URL.createObjectURL(image):""}
          crop={crop}
          setCroppedAreaPixels={setCroppedAreaPixels}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onClose={handleCloseModal}
          onCropImage={handleCropImage}
        />
      )}

  </Modal>
)}

export default CreateGroupModal;
